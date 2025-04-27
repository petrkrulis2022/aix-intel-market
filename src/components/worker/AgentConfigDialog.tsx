
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Server, Loader2, RotateCw } from "lucide-react";
import AgentService from "@/services/AgentService";

interface AgentConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AgentConfigDialog: React.FC<AgentConfigDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [baseUrl, setBaseUrl] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"untested" | "success" | "failed">("untested");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Load saved configuration on open
  useEffect(() => {
    if (open) {
      try {
        setBaseUrl(AgentService.getBaseUrl());
        setConnectionStatus("untested");
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to get agent config:", error);
      }
    }
  }, [open]);

  const testConnection = async (url: string) => {
    setTestingConnection(true);
    setConnectionStatus("untested");
    setErrorMessage("");
    
    try {
      // Configure temporarily without saving
      AgentService.configure({ baseUrl: url });
      
      // Try to connect
      await fetch(`${url}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      setConnectionStatus("success");
      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionStatus("failed");
      
      if (error.name === "AbortError") {
        setErrorMessage("Connection timed out. Server might be down or unreachable.");
      } else if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        setErrorMessage("Network error. Check if the URL is correct and the server is running.");
      } else {
        setErrorMessage(error.message || "Unknown error");
      }
      
      return false;
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!baseUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter the agent backend URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Test the connection first
      const isConnected = await testConnection(baseUrl);
      
      if (isConnected) {
        // Save to localStorage (already configured in the test)
        localStorage.setItem("agent_config", JSON.stringify({ baseUrl }));
        
        toast({
          title: "Configuration Saved",
          description: "Agent backend configuration has been saved successfully.",
        });
        
        onOpenChange(false);
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to the backend. Configuration was not saved.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Configuration Error",
        description: "Failed to save agent configuration: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
    }
  };

  const handleResetConnection = async () => {
    const defaultUrl = "https://5604-89-103-65-193.ngrok-free.app";
    setBaseUrl(defaultUrl);
    
    try {
      const isConnected = await testConnection(defaultUrl);
      
      if (isConnected) {
        // Reset configuration to default
        AgentService.configure({ baseUrl: defaultUrl });
        
        toast({
          title: "Connection Reset",
          description: "Agent backend connection has been reset to the default URL.",
        });
      } else {
        toast({
          title: "Reset Failed",
          description: "Could not connect to the default backend URL.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Reset Error",
        description: "Failed to reset agent configuration: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Agent Backend</DialogTitle>
          <DialogDescription>
            Connect to your Filecoin Recall AIX Agent backend
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="baseUrl" className="flex items-center">
              <Server className="w-4 h-4 mr-2 text-primary" />
              Backend API URL
            </Label>
            <Input
              id="baseUrl"
              placeholder="https://api.yourdomain.com"
              value={baseUrl}
              onChange={(e) => {
                setBaseUrl(e.target.value);
                setConnectionStatus("untested");
              }}
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL of your Filecoin Recall AIX Agent backend.
              {baseUrl.startsWith("https://api.yourdomain.com") && (
                <span className="block mt-1 text-amber-500">
                  ⚠️ This is a placeholder URL. You need to replace it with your actual backend URL.
                </span>
              )}
            </p>
          </div>
          
          {/* Show test feedback */}
          {connectionStatus === "success" && (
            <Alert className="bg-green-500/10 border-green-500 text-green-600">
              <AlertDescription className="flex items-center">
                ✓ Successfully connected to backend
              </AlertDescription>
            </Alert>
          )}
          
          {connectionStatus === "failed" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Connection failed: {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => testConnection(baseUrl)}
                disabled={testingConnection || !baseUrl.trim() || baseUrl === "https://api.yourdomain.com"}
              >
                {testingConnection ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
              
              <Button
                variant="secondary"
                onClick={handleResetConnection}
                disabled={testingConnection}
                className="flex items-center"
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Reset Connection
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Testing ensures your backend is reachable
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSaveConfig}
            disabled={testingConnection || !baseUrl.trim()}
          >
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentConfigDialog;
