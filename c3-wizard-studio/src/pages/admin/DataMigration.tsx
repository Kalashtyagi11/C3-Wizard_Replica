import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Upload, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Building,
  Users,
  FileText,
  Settings,
  List,
  ArrowRightLeft,
  Download,
  Copy,
  Play,
  Loader2
} from 'lucide-react';

// Available table mappings for import
const TABLE_OPTIONS = [
  { value: 'MasterCompany', label: 'Companies (MasterCompany)', category: 'Core' },
  { value: 'MasterEmployee', label: 'Employees (MasterEmployee)', category: 'Core' },
  { value: 'SelfEmployee', label: 'Self-Employed (SelfEmployee)', category: 'Core' },
  { value: 'Master_Rate_Setting', label: 'System Rates (Master_Rate_Setting)', category: 'Config' },
  { value: 'Deductions_Tax_Table_Header', label: 'Tax Table Header', category: 'Config' },
  { value: 'Deductions_Tax_Table_Details', label: 'Tax Table Details', category: 'Config' },
  { value: 'WageCategories', label: 'Wage Categories', category: 'Config' },
  { value: 'PROCESS_C3Header', label: 'C3 Headers', category: 'C3 Process' },
  { value: 'Process_Contributions', label: 'Contributions', category: 'C3 Process' },
  { value: 'PROCESS_Self_EmployedC3', label: 'Self-Employed C3', category: 'C3 Process' },
  { value: 'OnlinePayments', label: 'Online Payments', category: 'Payments' },
  { value: 'BankPaymentsMain', label: 'Bank Payments', category: 'Payments' },
  { value: 'ReconciliationPayment_Details', label: 'Reconciliation Details', category: 'Payments' },
  { value: 'SECUsers', label: 'Users (SECUsers)', category: 'Security' },
  { value: 'SECRole', label: 'Roles (SECRole)', category: 'Security' },
  { value: 'SECUserModule', label: 'User Modules', category: 'Security' },
  { value: 'AuditLogs', label: 'Audit Logs', category: 'Logs' },
  { value: 'LoginLog', label: 'Login Logs', category: 'Logs' },
  { value: 'Country', label: 'Countries', category: 'Reference' },
  { value: 'State', label: 'States', category: 'Reference' },
  { value: 'City', label: 'Cities', category: 'Reference' },
];

export default function DataMigration() {
  const [sqlContent, setSqlContent] = useState('');
  const [selectedTable, setSelectedTable] = useState('MasterCompany');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [availableMappings, setAvailableMappings] = useState<string[]>([]);
  
  // SQL Converter state
  const [converterInput, setConverterInput] = useState('');
  const [converterOutput, setConverterOutput] = useState('');
  const [converterStats, setConverterStats] = useState<{ totalStatements: number; tablesFound: string[] } | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  // Batch Executor state
  const [batchSqlContent, setBatchSqlContent] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [executionResults, setExecutionResults] = useState<{
    totalBatches: number;
    completedBatches: number;
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [batchSize, setBatchSize] = useState(50);

  useEffect(() => {
    fetchStats();
    fetchMappings();
  }, []);

  const cleanContent = (content: string): string => {
    // Handle UTF-16 LE encoded content:
    // 1. Remove BOM
    // 2. Remove null bytes (every other byte in UTF-16 LE ASCII)
    // 3. Fix spaced characters like "I N S E R T" -> "INSERT"
    let cleaned = content
      .replace(/^\uFEFF/, '')  // Remove BOM
      .replace(/\x00/g, '')    // Remove null bytes
      .replace(/\uFFFD/g, ''); // Remove replacement chars
    
    // If the content has excessive spaces (UTF-16 artifact), remove them
    // Pattern: single chars separated by single spaces become continuous text
    if (cleaned.includes('I N S E R T') || cleaned.includes('V A L U E S')) {
      // This is UTF-16 with space artifacts - remove alternating spaces
      cleaned = cleaned.replace(/(\w) (?=\w)/g, '$1');
    }
    
    // Normalize whitespace
    cleaned = cleaned.replace(/[\r\n]+/g, '\n').replace(/ +/g, ' ');
    
    return cleaned.trim();
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('import-mssql-data', {
        body: { action: 'get-stats' }
      });
      
      if (error) throw error;
      // Edge function returns: { totalTables, stats }
      setStats(data?.stats ?? null);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchMappings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('import-mssql-data', {
        body: { action: 'list-mappings' }
      });
      
      if (error) throw error;
      // Edge function returns: { totalTables, mappings: Array<{ legacyTable, supabaseTable, fieldCount }> }
      setAvailableMappings((data?.mappings || []).map((m: any) => m.legacyTable));
    } catch (err: any) {
      console.error('Error fetching mappings:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSqlContent(cleanContent(content));
    };
    reader.readAsText(file, 'utf-16le');
  };

  // Local SQL converter function (runs in browser, no memory limits)
  const convertMsSqlToPostgres = (msSql: string): string => {
    let sql = msSql;
    
    // Step 1: Remove BOM and clean encoding artifacts
    sql = sql.replace(/^\uFEFF/, '');
    sql = sql.replace(/\x00/g, '');
    
    // Step 2: Remove SET IDENTITY_INSERT statements
    sql = sql.replace(/SET\s+IDENTITY_INSERT\s+\[?\w+\]?\.\[?\w+\]?\s+(ON|OFF)\s*;?/gi, '');
    
    // Step 3: Remove GO statements
    sql = sql.replace(/^GO\s*$/gim, '');
    
    // Step 4: Convert [dbo].[TableName] to "TableName"
    sql = sql.replace(/\[dbo\]\.\[(\w+)\]/g, '"$1"');
    
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
    
    return sql.trim();
  };

  const extractStats = (sql: string): { totalStatements: number; tablesFound: string[] } => {
    const tablesFound = new Set<string>();
    const tableMatches = sql.matchAll(/INSERT\s+INTO\s+"(\w+)"/gi);
    for (const match of tableMatches) {
      tablesFound.add(match[1]);
    }
    const insertMatches = sql.match(/INSERT\s+INTO/gi);
    return {
      totalStatements: insertMatches ? insertMatches.length : 0,
      tablesFound: Array.from(tablesFound)
    };
  };

  const handleConverterFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsConverting(true);
    setConverterOutput('');
    setConverterStats(null);

    try {
      // Read file as ArrayBuffer to detect encoding
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      let content: string;
      
      // Detect encoding (UTF-16 LE has BOM 0xFF 0xFE)
      if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
        const decoder = new TextDecoder('utf-16le');
        content = decoder.decode(bytes);
      } else if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
        const decoder = new TextDecoder('utf-16be');
        content = decoder.decode(bytes);
      } else {
        const decoder = new TextDecoder('utf-8');
        content = decoder.decode(bytes);
      }

      // Convert locally in browser
      const converted = convertMsSqlToPostgres(content);
      const stats = extractStats(converted);
      
      setConverterOutput(converted);
      setConverterStats(stats);
      toast.success(`Converted ${stats.totalStatements} statements for ${stats.tablesFound.length} tables`);
    } catch (err: any) {
      console.error('Conversion error:', err);
      toast.error(err.message || 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  const convertSqlContent = async () => {
    if (!converterInput.trim()) {
      toast.error('Please paste SQL content first');
      return;
    }

    setIsConverting(true);
    try {
      const converted = convertMsSqlToPostgres(converterInput);
      const stats = extractStats(converted);
      
      setConverterOutput(converted);
      setConverterStats(stats);
      toast.success(`Converted ${stats.totalStatements} statements for ${stats.tablesFound.length} tables`);
    } catch (err: any) {
      console.error('Conversion error:', err);
      toast.error(err.message || 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(converterOutput);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const downloadConvertedSql = () => {
    const blob = new Blob([converterOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_postgresql.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Split SQL into individual statements
  const splitSqlStatements = (sql: string): string[] => {
    // Split by semicolon, but be careful with strings containing semicolons
    const statements: string[] = [];
    let current = '';
    let inString = false;
    
    for (let i = 0; i < sql.length; i++) {
      const char = sql[i];
      
      if (char === "'" && sql[i - 1] !== '\\') {
        inString = !inString;
      }
      
      if (char === ';' && !inString) {
        const trimmed = current.trim();
        if (trimmed.length > 10 && trimmed.toUpperCase().startsWith('INSERT')) {
          statements.push(trimmed + ';');
        }
        current = '';
      } else {
        current += char;
      }
    }
    
    // Handle last statement without semicolon
    const trimmed = current.trim();
    if (trimmed.length > 10 && trimmed.toUpperCase().startsWith('INSERT')) {
      statements.push(trimmed.endsWith(';') ? trimmed : trimmed + ';');
    }
    
    return statements;
  };

  // Execute SQL in batches
  const executeBatchImport = async () => {
    const sqlToExecute = batchSqlContent || converterOutput;
    if (!sqlToExecute.trim()) {
      toast.error('No SQL content to execute. Convert a file first or paste SQL.');
      return;
    }

    setIsExecuting(true);
    setExecutionProgress(0);
    setExecutionResults(null);

    try {
      const statements = splitSqlStatements(sqlToExecute);
      const totalStatements = statements.length;
      
      if (totalStatements === 0) {
        toast.error('No valid INSERT statements found');
        setIsExecuting(false);
        return;
      }

      const totalBatches = Math.ceil(totalStatements / batchSize);
      let successful = 0;
      let failed = 0;
      const allErrors: string[] = [];

      toast.info(`Processing ${totalStatements} statements in ${totalBatches} batches...`);

      for (let i = 0; i < totalBatches; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, totalStatements);
        const batch = statements.slice(start, end);

        try {
          const { data, error } = await supabase.functions.invoke('execute-sql-batch', {
            body: {
              statements: batch,
              batchIndex: i + 1,
              totalBatches
            }
          });

          if (error) {
            failed += batch.length;
            allErrors.push(`Batch ${i + 1}: ${error.message}`);
          } else if (data) {
            successful += data.successful || 0;
            failed += data.failed || 0;
            if (data.errors) {
              allErrors.push(...data.errors.map((e: string) => `Batch ${i + 1}: ${e}`));
            }
          }
        } catch (err: any) {
          failed += batch.length;
          allErrors.push(`Batch ${i + 1}: ${err.message || 'Unknown error'}`);
        }

        const progress = Math.round(((i + 1) / totalBatches) * 100);
        setExecutionProgress(progress);
        setExecutionResults({
          totalBatches,
          completedBatches: i + 1,
          successful,
          failed,
          errors: allErrors.slice(0, 20) // Keep only first 20 errors
        });
      }

      if (failed === 0) {
        toast.success(`Successfully executed ${successful} statements!`);
      } else {
        toast.warning(`Completed: ${successful} successful, ${failed} failed`);
      }

      await fetchStats();
    } catch (err: any) {
      console.error('Batch execution error:', err);
      toast.error(err.message || 'Batch execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleBatchFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      let content: string;
      
      if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
        content = new TextDecoder('utf-16le').decode(bytes);
      } else if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
        content = new TextDecoder('utf-16be').decode(bytes);
      } else {
        content = new TextDecoder('utf-8').decode(bytes);
      }

      // Auto-convert if it looks like MS SQL
      if (content.includes('[dbo]') || content.includes('CAST(') || content.includes('GO')) {
        content = convertMsSqlToPostgres(content);
        toast.info('Auto-converted MS SQL to PostgreSQL syntax');
      }

      setBatchSqlContent(content);
      const stats = extractStats(content);
      toast.success(`Loaded ${stats.totalStatements} statements from file`);
    } catch (err: any) {
      toast.error('Failed to load file');
    }
  };

  const importTable = async (dryRun: boolean = false) => {
    if (!sqlContent.trim()) {
      toast.error('Please paste or upload SQL content first');
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      const { data, error } = await supabase.functions.invoke('import-mssql-data', {
        body: { 
          action: dryRun ? 'parse-only' : 'import-table',
          // The edge function expects `legacyTable` for mapped imports (e.g. MasterCompany -> c3_master_company)
          legacyTable: selectedTable,
          data: sqlContent
        }
      });

      setProgress(100);

      if (error) throw error;

      setResults(data);
      if (dryRun) {
        toast.success(`Parsed ${data.parsed || 0} records (dry run - no data inserted)`);
      } else {
        toast.success(`Imported ${data.inserted || 0} records`);
      }
      await fetchStats();
    } catch (err: any) {
      console.error('Import error:', err);
      toast.error(err.message || 'Import failed');
      setResults({ error: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const getTableLabel = (value: string) => {
    return TABLE_OPTIONS.find(t => t.value === value)?.label || value;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Migration</h1>
            <p className="text-muted-foreground">
              Import data from MS SQL Server backup files
            </p>
          </div>
          <Button variant="outline" onClick={fetchStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Stats
          </Button>
        </div>

        {/* Current Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.c3_master_company ?? '—'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.c3_master_employee ?? '—'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Self-Employed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.c3_self_employee ?? '—'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">C3 Headers</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.c3_process_c3_header ?? '—'}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="converter" className="space-y-4">
          <TabsList>
            <TabsTrigger value="converter">
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              SQL Converter
            </TabsTrigger>
            <TabsTrigger value="execute">
              <Play className="h-4 w-4 mr-2" />
              Execute SQL
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" />
              Import Table
            </TabsTrigger>
            <TabsTrigger value="mappings">
              <List className="h-4 w-4 mr-2" />
              Available Mappings
            </TabsTrigger>
            <TabsTrigger value="guide">
              <Settings className="h-4 w-4 mr-2" />
              Import Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="converter">
            <Card>
              <CardHeader>
                <CardTitle>MS SQL → PostgreSQL Converter</CardTitle>
                <CardDescription>
                  Upload your MS SQL data file and get PostgreSQL-compatible INSERT statements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload MS SQL File (.sql)
                  </label>
                  <input
                    type="file"
                    accept=".sql"
                    onChange={handleConverterFileUpload}
                    disabled={isConverting}
                    className="block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90
                      disabled:opacity-50"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or paste content</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Paste MS SQL INSERT Statements
                  </label>
                  <Textarea
                    placeholder={`INSERT [dbo].[Master_Rate_Setting] ([MRS_ID], [SOC_EE_Rate]) VALUES (1, CAST(0.05 AS Decimal(18,2)))
GO
INSERT [dbo].[Country] ([ConId], [Name]) VALUES (1, N'Sint Maarten')`}
                    value={converterInput}
                    onChange={(e) => setConverterInput(e.target.value)}
                    rows={8}
                    className="font-mono text-xs"
                  />
                </div>

                <Button 
                  onClick={convertSqlContent} 
                  disabled={isConverting || !converterInput.trim()}
                  className="w-full"
                >
                  {isConverting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Convert to PostgreSQL
                    </>
                  )}
                </Button>

                {converterOutput && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Conversion Complete</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadConvertedSql}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {converterStats && (
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {converterStats.totalStatements} statements
                        </Badge>
                        {converterStats.tablesFound.map(table => (
                          <Badge key={table} variant="outline">{table}</Badge>
                        ))}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        PostgreSQL Output (Ready for DBeaver)
                      </label>
                      <Textarea
                        value={converterOutput}
                        readOnly
                        rows={12}
                        className="font-mono text-xs bg-muted"
                      />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm">
                      <p className="font-medium text-blue-800 dark:text-blue-200">Next Steps:</p>
                      <ol className="list-decimal list-inside mt-1 text-blue-700 dark:text-blue-300 space-y-1">
                        <li>Copy or download the converted SQL</li>
                        <li>Open DBeaver and connect to your PostgreSQL database</li>
                        <li>Paste and execute the SQL statements</li>
                      </ol>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="execute">
            <Card>
              <CardHeader>
                <CardTitle>Execute PostgreSQL Statements</CardTitle>
                <CardDescription>
                  Upload your converted PostgreSQL file and execute it directly in the database (avoids DBeaver memory issues)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Upload PostgreSQL File (.sql)
                    </label>
                    <input
                      type="file"
                      accept=".sql"
                      onChange={handleBatchFileUpload}
                      disabled={isExecuting}
                      className="block w-full text-sm text-muted-foreground
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-primary-foreground
                        hover:file:bg-primary/90
                        disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Batch Size (statements per request)
                    </label>
                    <Select value={batchSize.toString()} onValueChange={(v) => setBatchSize(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 statements</SelectItem>
                        <SelectItem value="50">50 statements (recommended)</SelectItem>
                        <SelectItem value="100">100 statements</SelectItem>
                        <SelectItem value="200">200 statements</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {converterOutput && !batchSqlContent && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm">
                    <p className="text-blue-800 dark:text-blue-200">
                      <strong>Tip:</strong> You have converted SQL ready! Click Execute to run it, or upload a different file.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    SQL Content Preview ({batchSqlContent ? extractStats(batchSqlContent).totalStatements : converterOutput ? extractStats(converterOutput).totalStatements : 0} statements)
                  </label>
                  <Textarea
                    placeholder="Upload a file or the converted SQL from the Converter tab will be used..."
                    value={batchSqlContent || converterOutput.substring(0, 5000) + (converterOutput.length > 5000 ? '\n\n... (truncated for display)' : '')}
                    onChange={(e) => setBatchSqlContent(e.target.value)}
                    rows={8}
                    className="font-mono text-xs"
                  />
                </div>

                {isExecuting && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">
                        Executing batch {executionResults?.completedBatches || 0} of {executionResults?.totalBatches || '?'}...
                      </span>
                    </div>
                    <Progress value={executionProgress} />
                    {executionResults && (
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600">✓ {executionResults.successful} successful</span>
                        {executionResults.failed > 0 && (
                          <span className="text-red-600">✗ {executionResults.failed} failed</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <Button 
                  onClick={executeBatchImport} 
                  disabled={isExecuting || (!batchSqlContent.trim() && !converterOutput.trim())}
                  className="w-full"
                  size="lg"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Execute SQL in Database
                    </>
                  )}
                </Button>

                {executionResults && !isExecuting && (
                  <div className="space-y-3 border rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      {executionResults.failed === 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                      <span className="font-medium">Execution Complete</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-muted p-3 rounded">
                        <div className="text-2xl font-bold">{executionResults.totalBatches}</div>
                        <div className="text-xs text-muted-foreground">Batches</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                        <div className="text-2xl font-bold text-green-600">{executionResults.successful}</div>
                        <div className="text-xs text-muted-foreground">Successful</div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-950 p-3 rounded">
                        <div className="text-2xl font-bold text-red-600">{executionResults.failed}</div>
                        <div className="text-xs text-muted-foreground">Failed</div>
                      </div>
                    </div>

                    {executionResults.errors.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-destructive mb-2">Errors (first 20):</p>
                        <ul className="text-xs text-muted-foreground space-y-1 max-h-32 overflow-y-auto bg-muted p-2 rounded">
                          {executionResults.errors.map((err, i) => (
                            <li key={i} className="text-destructive font-mono">{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Import Table Data</CardTitle>
                <CardDescription>
                  Select a table and upload the corresponding SQL file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Table
                    </label>
                    <Select value={selectedTable} onValueChange={setSelectedTable}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a table" />
                      </SelectTrigger>
                      <SelectContent>
                        {TABLE_OPTIONS.map((table) => (
                          <SelectItem key={table.value} value={table.value}>
                            <span className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{table.category}</Badge>
                              {table.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Upload SQL File
                    </label>
                    <input
                      type="file"
                      accept=".sql"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-muted-foreground
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-primary-foreground
                        hover:file:bg-primary/90"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Or paste SQL content directly
                  </label>
                  <Textarea
                    placeholder={`Paste INSERT statements from dbo.${selectedTable}.Table.sql...`}
                    value={sqlContent}
                    onChange={(e) => setSqlContent(e.target.value)}
                    rows={10}
                    className="font-mono text-xs"
                  />
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground">Processing...</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={() => importTable(true)} 
                    disabled={isProcessing || !sqlContent.trim()}
                    variant="outline"
                    className="flex-1"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Parse Only (Dry Run)
                  </Button>
                  <Button 
                    onClick={() => importTable(false)} 
                    disabled={isProcessing || !sqlContent.trim()}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import {getTableLabel(selectedTable)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mappings">
            <Card>
              <CardHeader>
                <CardTitle>Available Table Mappings</CardTitle>
                <CardDescription>
                  These are all the tables that can be imported with field transformations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-3">
                  {availableMappings.map((table) => (
                    <div key={table} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-mono">{table}</span>
                    </div>
                  ))}
                  {availableMappings.length === 0 && (
                    <p className="text-muted-foreground col-span-3">Loading mappings...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide">
            <Card>
              <CardHeader>
                <CardTitle>Import Order Guide</CardTitle>
                <CardDescription>
                  Follow this order to avoid foreign key constraint errors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Phase 1: Reference Data</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Country, State, City</li>
                      <li>MasterEmpType, MasterDeductionCodes, MasterIncCodes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Phase 2: Configuration</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Master_Rate_Setting</li>
                      <li>Deductions_Tax_Table_Header → Deductions_Tax_Table_Details</li>
                      <li>WageCategories</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Phase 3: Core Entities</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>MasterCompany (must be imported before employees)</li>
                      <li>MasterEmployee, SelfEmployee</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Phase 4: Transactions</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>PROCESS_C3Header → Process_Contributions</li>
                      <li>OnlinePayments, BankPaymentsMain</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Phase 5: Security & Logs</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>SECUsers, SECRole, SECUserModule</li>
                      <li>AuditLogs, LoginLog</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Import Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.error ? (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <span>{results.error}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Operation Complete</span>
                  </div>
                  
                  <div className="grid gap-2">
                    {results.table && (
                      <div className="flex justify-between">
                        <span>Target Table:</span>
                        <Badge variant="outline">{results.table}</Badge>
                      </div>
                    )}
                    {results.parsed !== undefined && (
                      <div className="flex justify-between">
                        <span>Records Parsed:</span>
                        <Badge variant="secondary">{results.parsed}</Badge>
                      </div>
                    )}
                    {results.inserted !== undefined && (
                      <div className="flex justify-between">
                        <span>Records Inserted:</span>
                        <Badge variant="default">{results.inserted}</Badge>
                      </div>
                    )}
                    {results.skipped !== undefined && results.skipped > 0 && (
                      <div className="flex justify-between">
                        <span>Records Skipped:</span>
                        <Badge variant="secondary">{results.skipped}</Badge>
                      </div>
                    )}
                    {results.errors?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-destructive mb-2">Errors:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
                          {results.errors.slice(0, 10).map((err: string, i: number) => (
                            <li key={i} className="text-destructive">{err}</li>
                          ))}
                          {results.errors.length > 10 && (
                            <li className="text-muted-foreground">... and {results.errors.length - 10} more errors</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
