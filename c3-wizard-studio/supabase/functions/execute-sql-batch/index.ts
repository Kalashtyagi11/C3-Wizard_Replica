import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { statements, batchIndex, totalBatches } = await req.json()

    if (!statements || !Array.isArray(statements)) {
      return new Response(
        JSON.stringify({ error: 'statements array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role for direct DB access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    })

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
      batchIndex,
      totalBatches
    }

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      
      if (!statement || statement.length < 10) continue

      try {
        // Use rpc to execute raw SQL
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
        
        if (error) {
          results.failed++
          if (results.errors.length < 5) {
            results.errors.push(`Statement ${i + 1}: ${error.message.substring(0, 100)}`)
          }
        } else {
          results.successful++
        }
      } catch (err: unknown) {
        results.failed++
        if (results.errors.length < 5) {
          const errorMsg = err instanceof Error ? err.message : 'Unknown error'
          results.errors.push(`Statement ${i + 1}: ${errorMsg.substring(0, 100)}`)
        }
      }
    }

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    console.error('Batch execution error:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
