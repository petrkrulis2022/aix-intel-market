
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import WorkerDashboard from "@/components/dashboards/WorkerDashboard";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Server } from "lucide-react";
import AgentConfigDialog from "@/components/worker/AgentConfigDialog";
import { toast } from "@/components/ui/use-toast";
import AgentService from "@/services/AgentService";

const Worker = () => {
  const navigate = useNavigate();
  // Handle null case when context isn't available yet
  let walletContext;
  try {
    walletContext = useWallet();
  } catch (error) {
    console.error("Wallet context error:", error);
    // Return early with a loading state or redirecting state
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading wallet context...</p>
      </div>
    );
  }
  
  const { account } = walletContext;
  const [showAgentConfig, setShowAgentConfig] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Redirect if no wallet
  useEffect(() => {
    if (!account) {
      navigate("/");
    }
  }, [account, navigate]);

  // Check if agent is configured and backend is online
  useEffect(() => {
    const checkAgentStatus = async () => {
      try {
        const configured = AgentService.isConfigured();
        setIsConfigured(configured);
        
        if (configured) {
          try {
            // Don't await this, let it check in the background
            testBackendConnection();
          } catch (error) {
            console.error("Failed to test backend connection:", error);
            setIsBackendOnline(false);
          }
        } else {
          setIsBackendOnline(false);
          toast({
            title: "Agent Configuration Required",
            description: "Please configure your agent backend to enable communication.",
          });
        }
      } catch (error) {
        setIsConfigured(false);
        setIsBackendOnline(false);
      }
    };
    
    checkAgentStatus();
  }, [showAgentConfig]);
  
  const testBackendConnection = async () => {
    try {
      await fetch(`${AgentService.getBaseUrl()}/api/health`, {
        method: "GET",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      setIsBackendOnline(true);
    } catch (error) {
      console.error("Backend connection test failed:", error);
      setIsBackendOnline(false);
      
      if (!showAgentConfig) {
        toast({
          title: "Backend Connection Failed",
          description: "Cannot connect to the agent backend. Check your configuration.",
          variant: "destructive",
        });
      }
    }
  };

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
                variant={isConfigured && isBackendOnline ? "outline" : "default"}
                onClick={() => setShowAgentConfig(true)}
                className={`mb-4 ${
                  !isConfigured || !isBackendOnline 
                    ? "bg-primary animate-pulse" 
                    : "border-primary/30"
                }`}
                aria-label="Configure Agent"
              >
                <Server className={`h-4 w-4 mr-2 ${isBackendOnline ? "text-green-500" : ""}`} />
                {isConfigured 
                  ? isBackendOnline 
                    ? "Agent Configured" 
                    : "Agent Offline" 
                  : "Configure Agent"
                }
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
