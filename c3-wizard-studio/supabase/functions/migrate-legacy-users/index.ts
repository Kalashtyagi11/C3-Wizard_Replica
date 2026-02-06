import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Migrate Legacy Users Edge Function
 * 
 * Decrypts AES-256-CBC encrypted passwords from legacy MS SQL users
 * and creates Supabase Auth accounts so they can login with existing credentials.
 * 
 * Encryption parameters read from environment secrets (NEVER hardcoded):
 * - LEGACY_ENCRYPTION_KEY: AES-256 key
 * - LEGACY_ENCRYPTION_SALT: PBKDF2 salt (Base64 encoded)
 */

// Read encryption secrets from environment
const ENCRYPTION_KEY = Deno.env.get("LEGACY_ENCRYPTION_KEY");
const SALT_BASE64 = Deno.env.get("LEGACY_ENCRYPTION_SALT");

/**
 * Decrypts a legacy AES-256-CBC encrypted password.
 * 
 * Algorithm (matches .NET Rfc2898DeriveBytes + AesCryptoServiceProvider):
 * - PBKDF2 with 1000 iterations, SHA-1 hash
 * - Derives 48 bytes: 32 for AES key + 16 for IV
 * - AES-256-CBC mode
 * - Text encoded as UTF-16LE (Encoding.Unicode in .NET)
 */
async function decryptLegacyPassword(cipherText: string): Promise<string> {
  if (!ENCRYPTION_KEY || !SALT_BASE64) {
    throw new Error("Missing encryption secrets");
  }

  try {
    // The salt should be ASCII bytes of "Ivan Medvedev" 
    // Try both: as raw ASCII string first, then as Base64
    let salt: Uint8Array;
    
    // Check if it looks like Base64 (contains only Base64 chars and ends with = or has proper length)
    const isBase64 = /^[A-Za-z0-9+/]+=*$/.test(SALT_BASE64) && SALT_BASE64.length % 4 === 0;
    
    if (isBase64) {
      try {
        salt = Uint8Array.from(atob(SALT_BASE64), (c) => c.charCodeAt(0));
      } catch {
        salt = new TextEncoder().encode(SALT_BASE64);
      }
    } else {
      // Treat as raw ASCII string
      salt = new TextEncoder().encode(SALT_BASE64);
    }

    // Import key material for PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(ENCRYPTION_KEY),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    // Derive 384 bits (48 bytes): 32 for AES key + 16 for IV
    const derived = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt.buffer as ArrayBuffer,
        iterations: 1000,
        hash: "SHA-1",
      },
      keyMaterial,
      384
    );

    const derivedBytes = new Uint8Array(derived);
    const key = new Uint8Array(derivedBytes.buffer, 0, 32);
    const iv = new Uint8Array(derivedBytes.buffer, 32, 16);

    // Import the AES key
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );

    // Decode the cipher text from Base64
    const cipherBytes = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      cryptoKey,
      cipherBytes
    );

    // Decode as UTF-16LE (Encoding.Unicode in .NET)
    const result = new TextDecoder("utf-16le").decode(decrypted);
    
    // Remove potential null padding
    return result.replace(/\0+$/, '');
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Decryption failed: ${msg}`);
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify secrets are configured
    if (!ENCRYPTION_KEY || !SALT_BASE64) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing encryption secrets. Configure LEGACY_ENCRYPTION_KEY and LEGACY_ENCRYPTION_SALT.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const batchSize = body.batch_size || 50;
    const dryRun = body.dry_run || false;

    // Create Supabase admin client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    if (!serviceRoleKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "SUPABASE_SERVICE_ROLE_KEY not configured",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Fetch unique emails that need migration (one record per email)
    // This prevents duplicate creation attempts
    const { data: uniqueEmails, error: emailFetchError } = await supabase
      .rpc("get_unique_unmigrated_emails", { p_limit: batchSize });

    // Fallback: if RPC doesn't exist, use regular query with distinct emails
    let users: Array<{
      id: number;
      email: string;
      username: string | null;
      password_hash: string | null;
      role_id: number | null;
      company_id: number | null;
    }> = [];

    if (emailFetchError || !uniqueEmails) {
      // Fallback: fetch first record per email
      const { data: rawUsers, error: fetchError } = await supabase
        .from("c3_users")
        .select("id, email, username, password_hash, role_id, company_id, is_deleted")
        .is("auth_user_id", null)
        .not("password_hash", "is", null)
        .not("email", "is", null)
        .eq("is_deleted", false)
        .order("id", { ascending: true })
        .limit(batchSize * 3); // Fetch more to account for duplicates

      if (fetchError) {
        throw new Error(`Failed to fetch users: ${fetchError.message}`);
      }

      // Deduplicate by email (keep first record)
      const seenEmails = new Set<string>();
      for (const user of (rawUsers || [])) {
        const emailLower = user.email.toLowerCase();
        if (!seenEmails.has(emailLower)) {
          seenEmails.add(emailLower);
          users.push(user);
          if (users.length >= batchSize) break;
        }
      }
    } else {
      users = uniqueEmails;
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No users to migrate",
          migrated: 0,
          failed: 0,
          remaining: 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = {
      migrated: 0,
      failed: 0,
      skipped: 0,
      errors: [] as { email: string; error: string }[],
    };

    for (const user of users) {
      try {
        // Skip if no password hash
        if (!user.password_hash) {
          results.skipped++;
          continue;
        }

        // Decrypt the legacy password
        let plainPassword: string;
        try {
          plainPassword = await decryptLegacyPassword(user.password_hash);
        } catch (decryptError: unknown) {
          const errorMessage = decryptError instanceof Error ? decryptError.message : String(decryptError);
          results.failed++;
          results.errors.push({
            email: user.email,
            error: `Decryption failed: ${errorMessage}`,
          });

          // Log failure
          await supabase.from("c3_migration_logs").insert({
            c3_user_id: user.id,
            email: user.email,
            status: "failed",
            error_message: `Decryption failed: ${errorMessage}`,
          });

          continue;
        }

        if (dryRun) {
          // Just verify decryption works
          results.migrated++;
          continue;
        }

        // Check if email already exists in auth.users
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const emailExists = existingUsers?.users?.some(
          (u) => u.email?.toLowerCase() === user.email.toLowerCase()
        );

        if (emailExists) {
          // Link existing auth user to ALL c3_users with this email
          const existingUser = existingUsers?.users?.find(
            (u) => u.email?.toLowerCase() === user.email.toLowerCase()
          );

          if (existingUser) {
            // Link ALL duplicate c3_users records with this email
            await supabase
              .from("c3_users")
              .update({ auth_user_id: existingUser.id })
              .ilike("email", user.email)
              .is("auth_user_id", null);

            await supabase.from("c3_migration_logs").insert({
              c3_user_id: user.id,
              email: user.email,
              status: "success",
              auth_user_id: existingUser.id,
              error_message: "Linked all duplicates to existing auth user",
            });

            results.migrated++;
          }
          continue;
        }

        // Create new Supabase Auth user with the decrypted password
        const { data: authUser, error: createError } =
          await supabase.auth.admin.createUser({
            email: user.email,
            password: plainPassword,
            email_confirm: true, // Auto-confirm since these are existing users
            user_metadata: {
              legacy_user_id: user.id,
              username: user.username,
            },
          });

        if (createError) {
          // If user already exists, try to find and link them
          if (createError.message.includes("already been registered")) {
            // Fetch the existing auth user by email
            const { data: authUsersData } = await supabase.auth.admin.listUsers();
            const existingAuthUser = authUsersData?.users?.find(
              (u) => u.email?.toLowerCase() === user.email.toLowerCase()
            );

            if (existingAuthUser) {
              // Link ALL duplicate c3_users records with this email
              await supabase
                .from("c3_users")
                .update({ auth_user_id: existingAuthUser.id })
                .ilike("email", user.email)
                .is("auth_user_id", null);

              await supabase.from("c3_migration_logs").insert({
                c3_user_id: user.id,
                email: user.email,
                status: "success",
                auth_user_id: existingAuthUser.id,
                error_message: "Linked duplicates to pre-existing auth user",
              });

              results.migrated++;
              continue;
            }
          }

          results.failed++;
          results.errors.push({
            email: user.email,
            error: createError.message,
          });

          await supabase.from("c3_migration_logs").insert({
            c3_user_id: user.id,
            email: user.email,
            status: "failed",
            error_message: createError.message,
          });

          continue;
        }

        // Link ALL c3_users records with this email to the new auth user
        const { error: updateError } = await supabase
          .from("c3_users")
          .update({ auth_user_id: authUser.user.id })
          .ilike("email", user.email)
          .is("auth_user_id", null);

        if (updateError) {
          console.error(`Failed to link duplicates for ${user.email}: ${updateError.message}`);
        }

        // Log success for the primary record
        await supabase.from("c3_migration_logs").insert({
          c3_user_id: user.id,
          email: user.email,
          status: "success",
          auth_user_id: authUser.user.id,
        });

        results.migrated++;
      } catch (userError: unknown) {
        const errorMessage = userError instanceof Error ? userError.message : String(userError);
        results.failed++;
        results.errors.push({
          email: user.email,
          error: errorMessage,
        });
      }
    }

    // Count remaining users
    const { count: remaining } = await supabase
      .from("c3_users")
      .select("id", { count: "exact", head: true })
      .is("auth_user_id", null)
      .not("password_hash", "is", null)
      .not("email", "is", null)
      .eq("is_deleted", false);

    return new Response(
      JSON.stringify({
        success: true,
        message: dryRun ? "Dry run completed" : "Migration batch completed",
        migrated: results.migrated,
        failed: results.failed,
        skipped: results.skipped,
        remaining: remaining || 0,
        errors: results.errors.slice(0, 10), // Return first 10 errors
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Migration error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
