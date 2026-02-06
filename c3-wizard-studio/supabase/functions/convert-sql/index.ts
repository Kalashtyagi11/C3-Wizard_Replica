const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversionResult {
  success: boolean;
  convertedSql?: string;
  stats?: {
    totalStatements: number;
    tablesFound: string[];
  };
  error?: string;
}

function convertMsSqlToPostgres(msSql: string): ConversionResult {
  try {
    let sql = msSql;
    const tablesFound = new Set<string>();
    
    // Step 1: Remove BOM and clean encoding artifacts
    sql = sql.replace(/^\uFEFF/, '');
    sql = sql.replace(/\x00/g, '');
    
    // Step 2: Remove SET IDENTITY_INSERT statements
    sql = sql.replace(/SET\s+IDENTITY_INSERT\s+\[?\w+\]?\.\[?\w+\]?\s+(ON|OFF)\s*;?/gi, '');
    
    // Step 3: Remove GO statements
    sql = sql.replace(/^GO\s*$/gim, '');
    
    // Step 4: Convert [dbo].[TableName] to "TableName"
    sql = sql.replace(/\[dbo\]\.\[(\w+)\]/g, (_, tableName) => {
      tablesFound.add(tableName);
      return `"${tableName}"`;
    });
    
    // Step 5: Convert remaining [identifier] to "identifier"
    sql = sql.replace(/\[(\w+)\]/g, '"$1"');
    
    // Step 6: Convert N'string' to 'string' (Unicode string literals)
    sql = sql.replace(/N'([^']*(?:''[^']*)*)'/g, "'$1'");
    
    // Step 7: Convert CAST(value AS Decimal(p,s)) to just the value
    sql = sql.replace(/CAST\s*\(\s*([0-9.-]+)\s+AS\s+Decimal\s*\(\s*\d+\s*,\s*\d+\s*\)\s*\)/gi, '$1');
    
    // Step 8: Convert CAST(value AS Numeric(p,s)) to just the value
    sql = sql.replace(/CAST\s*\(\s*([0-9.-]+)\s+AS\s+Numeric\s*\(\s*\d+\s*,\s*\d+\s*\)\s*\)/gi, '$1');
    
    // Step 9: Convert CAST('date' AS DateTime) to 'date'::timestamp
    sql = sql.replace(/CAST\s*\(\s*'([^']+)'\s+AS\s+DateTime\s*\)/gi, "'$1'::timestamp");
    
    // Step 10: Convert CAST('date' AS Date) to 'date'::date
    sql = sql.replace(/CAST\s*\(\s*'([^']+)'\s+AS\s+Date\s*\)/gi, "'$1'::date");
    
    // Step 11: Convert bit values - CAST(1 AS Bit) or CAST(0 AS Bit) to TRUE/FALSE
    sql = sql.replace(/CAST\s*\(\s*1\s+AS\s+Bit\s*\)/gi, 'TRUE');
    sql = sql.replace(/CAST\s*\(\s*0\s+AS\s+Bit\s*\)/gi, 'FALSE');
    
    // Step 12: Add "INSERT INTO" if just "INSERT"
    sql = sql.replace(/INSERT\s+"(\w+)"/gi, 'INSERT INTO "$1"');
    
    // Step 13: Clean up multiple blank lines
    sql = sql.replace(/\n{3,}/g, '\n\n');
    
    // Step 14: Ensure statements end with semicolons
    sql = sql.replace(/\)\s*\n(?=INSERT|$)/gi, ');\n');
    
    // Count INSERT statements
    const insertMatches = sql.match(/INSERT\s+INTO/gi);
    const totalStatements = insertMatches ? insertMatches.length : 0;
    
    return {
      success: true,
      convertedSql: sql.trim(),
      stats: {
        totalStatements,
        tablesFound: Array.from(tablesFound)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown conversion error'
    };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let sqlContent: string;

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await req.formData();
      const file = formData.get('file');
      
      if (!file || !(file instanceof File)) {
        return new Response(
          JSON.stringify({ error: 'No file provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Read file content
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Detect encoding (UTF-16 LE has BOM 0xFF 0xFE)
      if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
        // UTF-16 LE
        const decoder = new TextDecoder('utf-16le');
        sqlContent = decoder.decode(bytes);
      } else if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
        // UTF-16 BE
        const decoder = new TextDecoder('utf-16be');
        sqlContent = decoder.decode(bytes);
      } else {
        // Assume UTF-8
        const decoder = new TextDecoder('utf-8');
        sqlContent = decoder.decode(bytes);
      }
    } else {
      // Handle JSON body with raw SQL
      const body = await req.json();
      sqlContent = body.sql;
      
      if (!sqlContent) {
        return new Response(
          JSON.stringify({ error: 'No SQL content provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Convert the SQL
    const result = convertMsSqlToPostgres(sqlContent);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        convertedSql: result.convertedSql,
        stats: result.stats,
        message: `Converted ${result.stats?.totalStatements} INSERT statements for ${result.stats?.tablesFound.length} tables`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Conversion error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
