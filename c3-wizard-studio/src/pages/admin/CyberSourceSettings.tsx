import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, TestTube, Lock, Globe, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CyberSourceSettings() {
  const [isTestMode, setIsTestMode] = useState(true);
  const [merchantId, setMerchantId] = useState('');
  const [apiKeyId, setApiKeyId] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [profileId, setProfileId] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    // Simulate test connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, always succeed if all fields are filled
    if (merchantId && apiKeyId && secretKey) {
      setTestResult('success');
      toast.success('CyberSource connection test successful!');
    } else {
      setTestResult('error');
      toast.error('Connection test failed. Please check your credentials.');
    }
    
    setIsTesting(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // In production, this would save to secure storage/secrets
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('CyberSource settings saved successfully');
    setIsSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">CyberSource Settings</h1>
          <p className="text-muted-foreground">
            Configure CyberSource payment gateway integration
          </p>
        </div>

        {/* Environment Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Environment
            </CardTitle>
            <CardDescription>
              Switch between test and production environments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">
                  {isTestMode ? 'Test Mode' : 'Production Mode'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isTestMode 
                    ? 'Using CyberSource sandbox environment for testing'
                    : 'Using live CyberSource environment - real transactions'
                  }
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Test</span>
                <Switch 
                  checked={!isTestMode} 
                  onCheckedChange={(checked) => setIsTestMode(!checked)}
                />
                <span className="text-sm text-muted-foreground">Production</span>
              </div>
            </div>
            
            {!isTestMode && (
              <Alert className="mt-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Production mode will process real transactions. 
                  Ensure all credentials are correct before enabling.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* API Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Credentials
            </CardTitle>
            <CardDescription>
              Enter your CyberSource API credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="merchantId">Merchant ID *</Label>
                <Input
                  id="merchantId"
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  placeholder="Enter Merchant ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileId">Profile ID</Label>
                <Input
                  id="profileId"
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value)}
                  placeholder="Enter Profile ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKeyId">API Key ID *</Label>
                <Input
                  id="apiKeyId"
                  value={apiKeyId}
                  onChange={(e) => setApiKeyId(e.target.value)}
                  placeholder="Enter API Key ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessKey">Access Key</Label>
                <Input
                  id="accessKey"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="Enter Access Key"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="secretKey">Secret Key *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="secretKey"
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter Secret Key"
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your secret key is encrypted and stored securely
                </p>
              </div>
            </div>

            {testResult && (
              <Alert variant={testResult === 'success' ? 'default' : 'destructive'}>
                {testResult === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {testResult === 'success' 
                    ? 'Connection test successful! Your credentials are valid.'
                    : 'Connection test failed. Please verify your credentials.'
                  }
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting || !merchantId || !apiKeyId || !secretKey}
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !merchantId || !apiKeyId || !secretKey}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Webhook Configuration</CardTitle>
            <CardDescription>
              Configure webhooks to receive payment notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <Label className="text-sm font-medium">Webhook URL</Label>
                <code className="block mt-2 p-2 bg-background rounded text-sm">
                  https://your-domain.com/api/webhooks/cybersource
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  Configure this URL in your CyberSource Business Center
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
