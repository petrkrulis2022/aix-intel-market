import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import WorkerDashboard from "@/components/dashboards/WorkerDashboard";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Server, ShoppingCart } from "lucide-react";
import AgentConfigDialog from "@/components/worker/AgentConfigDialog";
import { toast } from "@/components/ui/use-toast";
import AgentService from "@/services/AgentService";
import MarketplaceService from "@/services/MarketplaceService";
import MarketplaceSubmissionDialog from "@/components/validator/MarketplaceSubmissionDialog";

const Worker = () => {
  const navigate = useNavigate();
  let walletContext;
  try {
    walletContext = useWallet();
  } catch (error) {
    console.error("Wallet context error:", error);
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
  const [showMarketplaceDialog, setShowMarketplaceDialog] = useState(false);
  const [selectedTaskData, setSelectedTaskData] = useState<any>(null);
  const [selectedAIXData, setSelectedAIXData] = useState<any>(null);

  useEffect(() => {
    if (!account) {
      navigate("/");
    }
  }, [account, navigate]);

  useEffect(() => {
    const checkAgentStatus = async () => {
      try {
        const configured = AgentService.isConfigured();
        setIsConfigured(configured);
        
        if (configured) {
          try {
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

  const handleAddToMarketplace = (taskData: any, aixData: any) => {
    if (!taskData || !aixData) {
      toast({
        title: "Missing Data",
        description: "Task resource data and AIX valuation are required.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedTaskData(taskData);
    setSelectedAIXData(aixData);
    setShowMarketplaceDialog(true);
  };

  const handleMarketplaceSubmit = async (title: string, description: string, tags: string[]) => {
    if (!selectedTaskData || !selectedAIXData) {
      toast({
        title: "Missing Information",
        description: "Task data and AIX valuation are required.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const taskId = `worker-task-${Date.now()}`;
      await MarketplaceService.listTask({
        id: taskId,
        title,
        description,
        agent: "Worker Agent",
        resources: selectedTaskData,
        aixValuation: selectedAIXData,
        tags
      });
      
      toast({
        title: "Added to Marketplace",
        description: `"${title}" has been successfully listed on the marketplace.`,
      });
      
      setShowMarketplaceDialog(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Listing Failed",
        description: errorMessage,
        variant: "destructive",
      });
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
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const demoResourceData = {
                      resources: {
                        cpu: { average_percent: 65 },
                        gpu: { average_percent: 80 },
                        memory: { average_bytes: 2 * 1024 * 1024 * 1024 }
                      },
                      duration_seconds: 1800
                    };
                    
                    const demoAixValue = {
                      aix_value: 45.6,
                      components: {
                        hardware_score: 0.68,
                        time_score: 0.85,
                        performance_score: 0.76,
                        energy_score: 0.72
                      }
                    };
                    
                    handleAddToMarketplace(demoResourceData, demoAixValue);
                  }}
                  className="mb-4"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add Task to Marketplace
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
            </div>
            <WorkerDashboard onAddTaskToMarketplace={handleAddToMarketplace} />
            <AgentConfigDialog 
              open={showAgentConfig} 
              onOpenChange={setShowAgentConfig} 
            />

            <MarketplaceSubmissionDialog
              open={showMarketplaceDialog}
              onOpenChange={setShowMarketplaceDialog}
              resourceData={selectedTaskData}
              aixValuation={selectedAIXData}
              onSubmit={handleMarketplaceSubmit}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Worker;
