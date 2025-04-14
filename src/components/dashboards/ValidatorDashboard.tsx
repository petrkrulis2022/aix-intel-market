
import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import RecallService from "@/services/RecallService";
import ChainOfThoughtViewer from "@/components/ChainOfThoughtViewer";
import RecallConfigForm from "@/components/RecallConfigForm";
import MarketplaceSubmissionDialog from "@/components/validator/MarketplaceSubmissionDialog";
import MarketplaceService from "@/services/MarketplaceService";

// Import refactored components
import ValidatorHeader from "./validator/ValidatorHeader";
import ValidatorTabs from "./validator/ValidatorTabs";
import RecallPortalInfoDialog from "./validator/RecallPortalInfoDialog";

const ValidatorDashboard = () => {
  const [showRecallConfig, setShowRecallConfig] = useState(false);
  const [showChainOfThought, setShowChainOfThought] = useState(false);
  const [showMarketplaceSubmission, setShowMarketplaceSubmission] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [resourceData, setResourceData] = useState<any>(null);
  const [aixValuation, setAixValuation] = useState<any>(null);
  const [showRecallPortalInfo, setShowRecallPortalInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [discoveredTasks, setDiscoveredTasks] = useState<string[]>([]);
  const [listedTasks, setListedTasks] = useState<string[]>([]);

  // Load listed tasks on mount
  useEffect(() => {
    const fetchListedTasks = async () => {
      try {
        const tasks = await MarketplaceService.getListedTasks();
        setListedTasks(tasks.map(task => task.id));
      } catch (error) {
        console.error("Error fetching listed tasks:", error);
      }
    };
    
    fetchListedTasks();
  }, []);

  const handleViewChainOfThought = (taskId: string) => {
    setSelectedTaskId(taskId);
    
    // Check if Recall is configured
    if (!RecallService.isConfigured()) {
      setShowRecallConfig(true);
      toast({
        title: "Configuration Required",
        description: "Please configure your Recall Network connection first.",
      });
      return;
    }
    
    setShowChainOfThought(true);
  };

  const handleValidateTask = (taskId: string) => {
    // If no resource data is available, show chain of thought first
    if (!resourceData) {
      handleViewChainOfThought(taskId);
      return;
    }
    
    // Open marketplace submission dialog
    setSelectedTaskId(taskId);
    setShowMarketplaceSubmission(true);
  };

  const handleSubmitToMarketplace = async (title: string, description: string, tags: string[]) => {
    if (!selectedTaskId || !resourceData || !aixValuation) {
      toast({
        title: "Missing Information",
        description: "Task data, resource data, and AIX valuation are required.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await MarketplaceService.listTask({
        id: selectedTaskId,
        title,
        description,
        agent: "Validator Agent",
        resources: resourceData,
        aixValuation,
        tags
      });
      
      // Update listed tasks
      setListedTasks(prev => [...prev, selectedTaskId]);
      
      toast({
        title: "Task Listed",
        description: `The task "${title}" has been successfully listed on the marketplace.`,
      });
      
      setShowMarketplaceSubmission(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Listing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleFindTasks = async () => {
    // Check if Recall is configured
    if (!RecallService.isConfigured()) {
      setShowRecallConfig(true);
      toast({
        title: "Configuration Required",
        description: "Please configure your Recall Network connection first.",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Get available buckets
      const buckets = await RecallService.getBuckets();
      if (buckets.length === 0) {
        toast({
          title: "No Buckets Found",
          description: "No buckets found in your Recall Network account.",
        });
        setIsLoading(false);
        return;
      }
      
      // Set discovered task IDs (using bucket names as task IDs for demo)
      setDiscoveredTasks(buckets);
      
      toast({
        title: "Tasks Found",
        description: `Found ${buckets.length} tasks to validate.`,
      });
    } catch (error) {
      toast({
        title: "Error Finding Tasks",
        description: "An error occurred while searching for tasks to validate.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openRecallPortal = () => {
    window.open("https://portal.recall.network/buckets", "_blank");
    setShowRecallPortalInfo(true);
  };

  const handleResourceDataCalculated = (data: any, aix: any) => {
    setResourceData(data);
    setAixValuation(aix);
  };

  const isTaskListed = (taskId: string) => {
    return listedTasks.includes(taskId);
  };

  return (
    <div className="p-6">
      <ValidatorHeader 
        onShowRecallConfig={() => setShowRecallConfig(true)} 
        onFindTasks={handleFindTasks}
        isLoading={isLoading}
      />
      
      <ValidatorTabs
        resourceData={resourceData}
        aixValuation={aixValuation}
        onViewChainOfThought={handleViewChainOfThought}
        onValidateTask={handleValidateTask}
        onShowRecallConfig={() => setShowRecallConfig(true)}
        onOpenRecallPortal={openRecallPortal}
        onShowChainOfThought={() => setShowChainOfThought(true)}
        discoveredTasks={discoveredTasks}
        isTaskListed={isTaskListed}
      />

      {/* Recall Configuration Dialog */}
      <Dialog open={showRecallConfig} onOpenChange={setShowRecallConfig}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Recall Network Configuration</DialogTitle>
            <DialogDescription>
              Configure your connection to the Recall Network
            </DialogDescription>
          </DialogHeader>
          <RecallConfigForm onConfigSaved={() => setShowRecallConfig(false)} />
        </DialogContent>
      </Dialog>

      {/* Chain of Thought Viewer Dialog */}
      <Dialog open={showChainOfThought} onOpenChange={setShowChainOfThought}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chain of Thought Viewer</DialogTitle>
            <DialogDescription>
              View and analyze chain of thought logs from Recall Network
            </DialogDescription>
          </DialogHeader>
          <ChainOfThoughtViewer onResourceDataCalculated={handleResourceDataCalculated} />
        </DialogContent>
      </Dialog>

      {/* Marketplace Submission Dialog */}
      <MarketplaceSubmissionDialog
        open={showMarketplaceSubmission}
        onOpenChange={setShowMarketplaceSubmission}
        resourceData={resourceData}
        aixValuation={aixValuation}
        onSubmit={handleSubmitToMarketplace}
      />

      {/* Recall Portal Info Dialog */}
      <RecallPortalInfoDialog 
        open={showRecallPortalInfo} 
        onOpenChange={setShowRecallPortalInfo}
      />
    </div>
  );
};

export default ValidatorDashboard;
