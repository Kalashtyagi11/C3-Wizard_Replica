import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Read encryption secrets from environment
const ENCRYPTION_KEY = Deno.env.get("LEGACY_ENCRYPTION_KEY");
const SALT_BASE64 = Deno.env.get("LEGACY_ENCRYPTION_SALT");

/**
 * Decrypts a legacy AES-256-CBC encrypted password.
 */
async function decryptLegacyPassword(cipherText: string): Promise<string> {
  if (!ENCRYPTION_KEY || !SALT_BASE64) {
    throw new Error("Missing encryption secrets");
  }

  try {
    // The salt should be ASCII bytes of "Ivan Medvedev" 
    let salt: Uint8Array;
    
    const isBase64 = /^[A-Za-z0-9+/]+=*$/.test(SALT_BASE64) && SALT_BASE64.length % 4 === 0;
    
    if (isBase64) {
      try {
        salt = Uint8Array.from(atob(SALT_BASE64), (c) => c.charCodeAt(0));
      } catch {
        salt = new TextEncoder().encode(SALT_BASE64);
      }
    } else {
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ENCRYPTION_KEY || !SALT_BASE64) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing encryption secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { user_id, email } = body;

    if (!user_id && !email) {
      return new Response(
        JSON.stringify({ success: false, error: "Provide user_id or email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Fetch user by ID or email
    let query = supabase
      .from("c3_users")
      .select("id, email, username, password_hash, role_id, company_id");
    
    if (user_id) {
      query = query.eq("id", user_id);
    } else {
      query = query.ilike("email", email);
    }

    const { data: users, error: fetchError } = await query.limit(1);

    if (fetchError || !users || users.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const user = users[0];

    if (!user.password_hash) {
      return new Response(
        JSON.stringify({ success: false, error: "No password hash for this user" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decrypt the password
    const plainPassword = await decryptLegacyPassword(user.password_hash);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role_id: user.role_id,
          company_id: user.company_id,
        },
        decrypted_password: plainPassword,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
