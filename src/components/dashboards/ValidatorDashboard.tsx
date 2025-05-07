
import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import RecallService from "@/services/RecallService";
import ChainOfThoughtViewer from "@/components/ChainOfThoughtViewer";
import RecallConfigForm from "@/components/RecallConfigForm";
import MarketplaceSubmissionDialog from "@/components/validator/MarketplaceSubmissionDialog";
import MarketplaceService from "@/services/MarketplaceService";
import { useWallet } from "@/contexts/WalletContext";
import FileStorageService from "@/services/recall/FileStorageService";

// Import refactored components
import ValidatorHeader from "./validator/ValidatorHeader";
import ValidatorTabs from "./validator/ValidatorTabs";
import RecallPortalInfoDialog from "./validator/RecallPortalInfoDialog";

interface TaskInfo {
  id: string;
  title: string;
  fileName: string;
}

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
  const [convertedTasks, setConvertedTasks] = useState<TaskInfo[]>([]);
  const { account } = useWallet();

  // Load listed tasks and converted tasks on mount
  useEffect(() => {
    const fetchListedTasks = async () => {
      try {
        const tasks = await MarketplaceService.getListedTasks();
        setListedTasks(tasks.map(task => task.id));
      } catch (error) {
        console.error("Error fetching listed tasks:", error);
      }
    };
    
    const fetchConvertedTasks = async () => {
      try {
        const files = await FileStorageService.getFiles("json");
        const taskInfos: TaskInfo[] = [];
        
        for (const fileName of files) {
          const content = await FileStorageService.getFileContent(fileName, "json");
          if (content) {
            try {
              const jsonData = JSON.parse(content);
              if (jsonData.length > 0) {
                // Use taskName from the data, or parse it from filename if available
                let taskTitle = "";
                
                if (jsonData[0].taskName) {
                  taskTitle = jsonData[0].taskName;
                } else {
                  // Try to extract task name from filename (if in format taskname_filename.json)
                  const filenameMatch = fileName.match(/^([^_]+)_/);
                  if (filenameMatch && filenameMatch[1]) {
                    taskTitle = filenameMatch[1].replace(/_/g, ' ');
                  } else {
                    taskTitle = fileName.replace('.json', '');
                  }
                }
                
                taskInfos.push({
                  id: fileName,
                  title: taskTitle,
                  fileName: fileName
                });
              }
            } catch (error) {
              console.error(`Error parsing JSON file ${fileName}:`, error);
            }
          }
        }
        
        setConvertedTasks(taskInfos);
      } catch (error) {
        console.error("Error fetching converted tasks:", error);
      }
    };
    
    fetchListedTasks();
    fetchConvertedTasks();
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

  const handleViewConvertedTask = async (fileName: string) => {
    try {
      setIsLoading(true);
      const content = await FileStorageService.getFileContent(fileName, "json");
      
      if (content) {
        const jsonData = JSON.parse(content);
        if (jsonData.length > 0 && jsonData[0].benchmarks) {
          // Set the resource data from the first entry's benchmarks
          setResourceData({
            cpu: jsonData[0].benchmarks.compute?.cpu?.estimatedLoadFactor || 0.5,
            gpu: jsonData[0].benchmarks.compute?.gpu?.estimatedLoadFactor || 0.3,
            time: jsonData[0].benchmarks.time?.totalSeconds || 30,
            complexity: jsonData[0].benchmarks.reasoning?.complexityScore || 1
          });
          
          // Calculate AIX valuation from the benchmarks
          setAixValuation({
            total: (
              (jsonData[0].benchmarks.compute?.cpu?.estimatedLoadFactor || 0.5) * 10 +
              (jsonData[0].benchmarks.compute?.gpu?.estimatedLoadFactor || 0.3) * 15 +
              (jsonData[0].benchmarks.reasoning?.complexityScore || 1) * 5
            ).toFixed(2)
          });
          
          // Set the task ID and open the marketplace submission dialog
          setSelectedTaskId(fileName);
          setShowMarketplaceSubmission(true);
        } else {
          toast({
            title: "Invalid Task Data",
            description: "The selected file doesn't contain valid benchmark data",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error Loading Task",
        description: "Failed to load the selected task data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
    if (!account) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet before accessing the Recall Portal.",
        variant: "destructive",
      });
      return;
    }

    // Open Recall Portal in a new tab with the connected wallet address as a parameter
    window.open(`https://portal.recall.network/buckets?wallet=${account}`, "_blank");
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
        convertedTasks={convertedTasks}
        onViewConvertedTask={handleViewConvertedTask}
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
