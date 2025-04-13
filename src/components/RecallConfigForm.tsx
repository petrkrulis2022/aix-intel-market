
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import RecallService from "@/services/RecallService";
import { Key, Database, FileText } from "lucide-react";

interface RecallConfigFormProps {
  onConfigSaved?: () => void;
}

const RecallConfigForm: React.FC<RecallConfigFormProps> = ({ onConfigSaved }) => {
  const [privateKey, setPrivateKey] = useState("");
  const [bucketAlias, setBucketAlias] = useState("");
  const [cotLogPrefix, setCotLogPrefix] = useState("cot/");
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if Recall is already configured
    const configured = RecallService.isConfigured();
    setIsConfigured(configured);
    
    // Try to load config from localStorage
    const storedConfig = localStorage.getItem('recall_config');
    if (storedConfig) {
      try {
        const config = JSON.parse(storedConfig);
        setBucketAlias(config.bucketAlias || "");
        setCotLogPrefix(config.cotLogPrefix || "cot/");
        // Don't set the private key for security reasons
      } catch (error) {
        console.error('Failed to parse Recall config:', error);
      }
    }
  }, []);

  const handleSaveConfig = () => {
    if (!privateKey && !isConfigured) {
      toast({
        title: "Private Key Required",
        description: "Please enter your Recall Network private key.",
        variant: "destructive",
      });
      return;
    }

    try {
      RecallService.configure({
        privateKey: privateKey || "existing-key", // Keep existing key if not provided
        bucketAlias,
        cotLogPrefix,
      });

      toast({
        title: "Configuration Saved",
        description: "Recall Network configuration has been saved successfully.",
      });

      setIsConfigured(true);
      setPrivateKey(""); // Clear private key for security
      
      if (onConfigSaved) {
        onConfigSaved();
      }
    } catch (error) {
      toast({
        title: "Configuration Error",
        description: "Failed to save Recall Network configuration.",
        variant: "destructive",
      });
    }
  };

  const handleClearConfig = () => {
    RecallService.clearConfig();
    setIsConfigured(false);
    setPrivateKey("");
    setBucketAlias("");
    setCotLogPrefix("cot/");
    
    toast({
      title: "Configuration Cleared",
      description: "Recall Network configuration has been cleared.",
    });
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle>Recall Network Configuration</CardTitle>
        <CardDescription>
          Configure your connection to the Recall Network for AIX validation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="privateKey" className="flex items-center">
            <Key className="w-4 h-4 mr-2 text-primary" />
            Private Key {isConfigured && <span className="ml-2 text-green-500 text-xs">(Configured)</span>}
          </Label>
          <Input
            id="privateKey"
            type="password"
            placeholder={isConfigured ? "••••••••••••••••••••••••••" : "Enter your Recall Network private key"}
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Your private key is stored securely in your browser's local storage.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bucketAlias" className="flex items-center">
            <Database className="w-4 h-4 mr-2 text-secondary" />
            Bucket Alias
          </Label>
          <Input
            id="bucketAlias"
            placeholder="your-default-bucket"
            value={bucketAlias}
            onChange={(e) => setBucketAlias(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cotLogPrefix" className="flex items-center">
            <FileText className="w-4 h-4 mr-2 text-green-500" />
            Chain of Thought Log Prefix
          </Label>
          <Input
            id="cotLogPrefix"
            placeholder="cot/"
            value={cotLogPrefix}
            onChange={(e) => setCotLogPrefix(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isConfigured && (
          <Button variant="outline" onClick={handleClearConfig}>
            Clear Configuration
          </Button>
        )}
        <Button onClick={handleSaveConfig}>
          {isConfigured ? "Update Configuration" : "Save Configuration"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecallConfigForm;
