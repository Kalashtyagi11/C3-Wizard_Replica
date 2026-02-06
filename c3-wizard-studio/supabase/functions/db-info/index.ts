const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const dbUrl = Deno.env.get('SUPABASE_DB_URL');
    if (!dbUrl) {
      return new Response(
        JSON.stringify({ error: 'Database URL not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the connection string to extract details
    // Format: postgresql://user:password@host:port/database
    const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!match) {
      return new Response(
        JSON.stringify({ error: 'Could not parse database URL', raw: dbUrl }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const [, username, password, host, port, database] = match;

    // Project ID from environment
    const projectId = 'nfvtlyvxfxzbhoqzprkr';

    return new Response(
      JSON.stringify({
        // Direct connection (recommended for migrations)
        direct: {
          host: `db.${projectId}.supabase.co`,
          port: 5432,
          database: 'postgres',
          username: 'postgres',
          password,
          ssl: 'require'
        },
        // Pooler connection (alternative)
        pooler: {
          host: 'aws-1-eu-west-1.pooler.supabase.com',
          port: 6543,
          database: 'postgres',
          username: `postgres.${projectId}`,
          password,
          ssl: 'require'
        },
        connectionString: dbUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
