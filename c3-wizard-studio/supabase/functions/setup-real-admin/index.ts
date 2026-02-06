import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function decryptLegacyPassword(encryptedBase64: string): Promise<string> {
  try {
    const LEGACY_KEY = Deno.env.get("LEGACY_ENCRYPTION_KEY");
    const LEGACY_SALT = Deno.env.get("LEGACY_ENCRYPTION_SALT");
    if (!LEGACY_KEY || !LEGACY_SALT) {
      throw new Error(
        "Missing legacy encryption secrets (LEGACY_ENCRYPTION_KEY / LEGACY_ENCRYPTION_SALT)"
      );
    }

    // Legacy is AES-256-CBC with PBKDF2-derived key+IV (1000 iterations, SHA-1)
    // Typical .NET pattern: key = GetBytes(32), iv = GetBytes(16)
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(LEGACY_KEY),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: encoder.encode(LEGACY_SALT),
        iterations: 1000,
        hash: "SHA-1",
      },
      keyMaterial,
      48 * 8 // 32 bytes key + 16 bytes IV
    );

    const derivedBytes = new Uint8Array(derivedBits);
    const keyBytes = derivedBytes.slice(0, 32);
    const iv = derivedBytes.slice(32, 48);

    const key = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );

    const ciphertext = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      key,
      ciphertext
    );
    
    // Legacy plaintext is UTF-16LE (.NET Encoding.Unicode)
    const decoder = new TextDecoder("utf-16le");
    return decoder.decode(decrypted).replace(/[\x00]+$/, "");
  } catch (error: unknown) {
    console.error("Decryption failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to decrypt password: ${message}`);
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const requestedPassword = typeof body.password === "string" ? body.password : null;
    const resetPassword = body.reset_password !== false; // default true
    const deleteTestUsers = body.delete_test_users === true; // default false (safer)

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const results: { action: string; status: string; details?: string }[] = [];

    // Optional: Delete test users from auth + app table (only when explicitly requested)
    const testEmails = ["admin@c3wizard.kn", "employer@c3wizard.kn", "self@c3wizard.kn"];
    if (deleteTestUsers) {
      const { data: usersPage, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (listErr) {
        results.push({ action: "List users", status: "error", details: listErr.message });
      }
      const users = usersPage?.users ?? [];

      for (const email of testEmails) {
        const testUser = users.find((u) => u.email === email);
        if (testUser) {
          const { error } = await supabaseAdmin.auth.admin.deleteUser(testUser.id);
          if (error) {
            results.push({ action: `Delete auth ${email}`, status: "error", details: error.message });
          } else {
            results.push({ action: `Delete auth ${email}`, status: "deleted" });
          }
        } else {
          results.push({ action: `Delete auth ${email}`, status: "not found" });
        }
      }
    }

    // Step 2: Create real admin user
    const realAdminEmail = "c3@sknssb.com";
    const legacyPasswordHash = "cVjGepZHGM32oZJ24O9HUVVO7NPtVDs5zNX58kxmUGY=";
    
    // Check if real admin already exists
    const { data: existingUsers, error: existingUsersErr } =
      await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (existingUsersErr) {
      results.push({
        action: "List users",
        status: "error",
        details: existingUsersErr.message,
      });
    }
    const existingAdmin = existingUsers?.users?.find((u) => u.email === realAdminEmail);
    
    let adminUserId: string;
    
    // Determine password to set
    let plainPassword: string;
    if (requestedPassword) {
      plainPassword = requestedPassword;
      results.push({ action: "Use requested password", status: "ok" });
    } else {
      plainPassword = await decryptLegacyPassword(legacyPasswordHash);
      results.push({ action: "Decrypt legacy password", status: "success" });
    }

    if (existingAdmin) {
      adminUserId = existingAdmin.id;
      results.push({
        action: `Admin auth user ${realAdminEmail}`,
        status: "exists",
        details: adminUserId,
      });

      if (resetPassword) {
        const { error: pwErr } = await supabaseAdmin.auth.admin.updateUserById(adminUserId, {
          password: plainPassword,
        });
        if (pwErr) {
          results.push({ action: "Reset admin password", status: "error", details: pwErr.message });
        } else {
          results.push({ action: "Reset admin password", status: "updated" });
        }
      }
    } else {
      // Create the auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: realAdminEmail,
        password: plainPassword,
        email_confirm: true,
        user_metadata: {
          username: "admin",
          full_name: "Admin SSB",
        },
      });

      if (authError) {
        results.push({ action: `Create ${realAdminEmail}`, status: "error", details: authError.message });
        throw authError;
      }

      adminUserId = authData.user.id;
      results.push({ action: `Create ${realAdminEmail}`, status: "created", details: adminUserId });
    }

    // Step 3: Update c3_users to link to the real admin auth user
    const { error: updateError } = await supabaseAdmin
      .from("c3_users")
      .update({
        auth_user_id: adminUserId,
        email: realAdminEmail,
        company_id: null, // Admin should not have company_id
        updated_at: new Date().toISOString(),
      })
      .eq("legacy_id", 2);

    if (updateError) {
      results.push({ action: "Link c3_users", status: "error", details: updateError.message });
    } else {
      results.push({ action: "Link c3_users legacy_id=2", status: "updated" });
    }

    if (deleteTestUsers) {
      // Step 4: Clean up c3_users records that point to deleted test auth users
      const { error: cleanupError } = await supabaseAdmin
        .from("c3_users")
        .delete()
        .in("email", testEmails)
        .neq("legacy_id", 2); // Don't delete the real admin record

      if (cleanupError) {
        results.push({ action: "Cleanup test c3_users", status: "error", details: cleanupError.message });
      } else {
        results.push({ action: "Cleanup test c3_users", status: "done" });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Real admin setup complete",
        results,
        loginCredentials: {
          email: realAdminEmail,
          note: requestedPassword
            ? "Password was reset to the requested value"
            : "Password was reset to the decrypted legacy password",
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error) {
    console.error("Setup error:", error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
