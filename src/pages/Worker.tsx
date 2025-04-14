
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import WorkerDashboard from "@/components/dashboards/WorkerDashboard";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import AgentConfigDialog from "@/components/worker/AgentConfigDialog";
import { toast } from "@/components/ui/use-toast";

const Worker = () => {
  const { account } = useWallet();
  const navigate = useNavigate();
  const [showAgentConfig, setShowAgentConfig] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Redirect if no wallet
  useEffect(() => {
    if (!account) {
      navigate("/");
    }
  }, [account, navigate]);

  // Check if agent is configured
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem("agent_config");
      const hasValidConfig = savedConfig && 
        JSON.parse(savedConfig).baseUrl && 
        JSON.parse(savedConfig).baseUrl !== "https://api.yourdomain.com";
      
      setIsConfigured(hasValidConfig);
      
      if (!hasValidConfig) {
        toast({
          title: "Agent Configuration Required",
          description: "Please configure your agent backend to enable communication.",
        });
      }
    } catch (error) {
      setIsConfigured(false);
    }
  }, [showAgentConfig]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {account && (
          <>
            <div className="container mx-auto p-4 flex justify-between items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Change Role
              </Button>
              
              <Button 
                variant={isConfigured ? "outline" : "default"}
                onClick={() => setShowAgentConfig(true)}
                className={`mb-4 ${!isConfigured ? "bg-primary animate-pulse" : "border-primary/30"}`}
                aria-label="Configure Agent"
              >
                <Settings className="h-4 w-4 mr-2" /> Configure Agent
              </Button>
            </div>
            <WorkerDashboard />
            <AgentConfigDialog 
              open={showAgentConfig} 
              onOpenChange={setShowAgentConfig} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Worker;
