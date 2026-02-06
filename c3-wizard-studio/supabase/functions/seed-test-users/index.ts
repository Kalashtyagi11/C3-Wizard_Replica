import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestUser {
  email: string;
  password: string;
  userType: 'admin' | 'employer' | 'self_employed';
  roleId: number; // Maps to c3_roles.id
  username: string;
  companyId?: number;
  selfEmployedId?: number;
}

// Role IDs from c3_roles table:
// 13 = Administrative (admin)
// 15 = Company (employer)
// 17 = Self Employed
const TEST_USERS: TestUser[] = [
  {
    email: "admin@c3wizard.kn",
    password: "Admin123!",
    userType: "admin",
    roleId: 13, // Administrative role
    username: "System Admin",
  },
  {
    email: "employer@c3wizard.kn",
    password: "Employer123!",
    userType: "employer",
    roleId: 15, // Company role
    username: "Test Employer",
    companyId: 642, // Existing company from migration
  },
  {
    email: "self@c3wizard.kn",
    password: "Self123!",
    userType: "self_employed",
    roleId: 17, // Self Employed role
    username: "Test Self Employed",
  },
];

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const results: { email: string; status: string; error?: string }[] = [];

    // Create each test user
    for (const user of TEST_USERS) {
      try {
        // Check if user already exists in auth
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === user.email);

        let authUserId: string;

        if (existingUser) {
          authUserId = existingUser.id;
          console.log(`Auth user ${user.email} already exists with ID: ${authUserId}`);
        } else {
          // Create the auth user
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
            user_metadata: {
              username: user.username,
            },
          });

          if (authError) {
            results.push({ email: user.email, status: "error", error: authError.message });
            continue;
          }

          authUserId = authData.user.id;
          console.log(`Created auth user ${user.email} with ID: ${authUserId}`);
        }

        // Check if c3_users record exists for this email
        const { data: existingC3User } = await supabaseAdmin
          .from("c3_users")
          .select("id, auth_user_id")
          .eq("email", user.email)
          .single();

        if (existingC3User) {
          // Update existing c3_users record to link auth_user_id and set correct role
          const { error: updateError } = await supabaseAdmin
            .from("c3_users")
            .update({
              auth_user_id: authUserId,
              role_id: user.roleId,
              user_type: user.userType,
              is_verified: true,
              is_email_verified: true,
            })
            .eq("id", existingC3User.id);

          if (updateError) {
            console.error(`Error updating c3_users for ${user.email}:`, updateError);
            results.push({ email: user.email, status: "error", error: updateError.message });
            continue;
          }

          results.push({ email: user.email, status: "updated" });
        } else {
          // Insert new c3_users record
          const { error: insertError } = await supabaseAdmin
            .from("c3_users")
            .insert({
              auth_user_id: authUserId,
              email: user.email,
              username: user.username,
              password_hash: "managed-by-supabase-auth",
              role_id: user.roleId,
              user_type: user.userType,
              company_id: user.companyId || null,
              self_employed_id: user.selfEmployedId || null,
              is_verified: true,
              is_email_verified: true,
              is_deleted: false,
              is_locked: false,
              failed_login_attempts: 0,
            });

          if (insertError) {
            console.error(`Error inserting c3_users for ${user.email}:`, insertError);
            results.push({ email: user.email, status: "error", error: insertError.message });
            continue;
          }

          results.push({ email: user.email, status: "created" });
        }

      } catch (err) {
        console.error(`Error processing ${user.email}:`, err);
        results.push({ email: user.email, status: "error", error: String(err) });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Test users seeded successfully",
        results,
        credentials: TEST_USERS.map(u => ({
          email: u.email,
          password: u.password,
          role: u.userType,
        })),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error) {
    console.error("Seeder error:", error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
