
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
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
  
  // Load saved configuration on open
  useEffect(() => {
    if (open) {
      const savedConfig = localStorage.getItem("agent_config");
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          setBaseUrl(config.baseUrl || "");
        } catch (error) {
          console.error("Failed to parse agent config:", error);
        }
      }
    }
  }, [open]);

  const handleSaveConfig = () => {
    if (!baseUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter the agent backend URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save to localStorage
      localStorage.setItem("agent_config", JSON.stringify({ baseUrl }));
      
      // Update the service configuration
      AgentService.configure({ baseUrl });
      
      toast({
        title: "Configuration Saved",
        description: "Agent backend configuration has been saved successfully.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Configuration Error",
        description: "Failed to save agent configuration.",
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
            <Label htmlFor="baseUrl">Backend API URL</Label>
            <Input
              id="baseUrl"
              placeholder="https://api.yourdomain.com"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL of your Filecoin Recall AIX Agent backend.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleSaveConfig}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentConfigDialog;
