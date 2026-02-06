import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeleteRequest {
  authUserIds: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    const { authUserIds }: DeleteRequest = await req.json();
    
    if (!authUserIds || authUserIds.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No user IDs provided'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const results = [];
    
    for (const authUserId of authUserIds) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(authUserId);
        
        if (error) {
          results.push({ authUserId, success: false, error: error.message });
        } else {
          results.push({ authUserId, success: true });
        }
      } catch (err) {
        results.push({ 
          authUserId, 
          success: false, 
          error: err instanceof Error ? err.message : 'Unknown error' 
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      results
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
