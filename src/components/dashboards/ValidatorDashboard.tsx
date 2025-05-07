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
import TaskValidationDialog from "@/components/validator/TaskValidationDialog";

// Import refactored components
import ValidatorHeader from "./validator/ValidatorHeader";
import ValidatorTabs from "./validator/ValidatorTabs";
import RecallPortalInfoDialog from "./validator/RecallPortalInfoDialog";

interface TaskInfo {
  id: string;
  title: string;
  fileName: string;
}

// Update the interface to include setPageBusy
interface ValidatorDashboardProps {
  setPageBusy: React.Dispatch<React.SetStateAction<boolean>>;
}

const ValidatorDashboard: React.FC<ValidatorDashboardProps> = ({ setPageBusy }) => {
  const [showRecallConfig, setShowRecallConfig] = useState(false);
  const [showChainOfThought, setShowChainOfThought] = useState(false);
  const [showMarketplaceSubmission, setShowMarketplaceSubmission] = useState(false);
  const [showTaskValidation, setShowTaskValidation] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskData, setSelectedTaskData] = useState<any>(null);
  const [selectedTaskName, setSelectedTaskName] = useState<string>("");
  const [resourceData, setResourceData] = useState<any>(null);
  const [aixValuation, setAixValuation] = useState<any>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [costBreakdown, setCostBreakdown] = useState<any>(null);
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
        // Fix: Using listFiles instead of getFiles
        const files = await FileStorageService.listFiles("json");
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
        
        // Find the task info to get the title
        const taskInfo = convertedTasks.find(task => task.fileName === fileName);
        const taskName = taskInfo ? taskInfo.title : fileName;
        
        // Set the task data and show the validation dialog
        setSelectedTaskId(fileName);
        setSelectedTaskName(taskName);
        setSelectedTaskData(jsonData);
        setShowTaskValidation(true);
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
        tags,
        // Add provider and cost information if available
        provider: selectedProviderId || undefined,
        costBreakdown: costBreakdown || undefined
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
  
  const handleValidationComplete = (data: any) => {
    // Update resource data, AIX valuation, and provider selection
    setResourceData(data.resourceData);
    setAixValuation(data.aixValuation);
    setSelectedProviderId(data.providerId);
    setCostBreakdown(data.costBreakdown);
    
    // Open the marketplace submission dialog
    setShowMarketplaceSubmission(true);
  };

  const isTaskListed = (taskId: string) => {
    return listedTasks.includes(taskId);
  };

  // Set page busy state when loading or performing heavy operations
  useEffect(() => {
    setPageBusy(isLoading);
  }, [isLoading, setPageBusy]);

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

      {/* Task Validation Dialog */}
      <TaskValidationDialog
        open={showTaskValidation}
        onOpenChange={setShowTaskValidation}
        taskData={selectedTaskData}
        taskName={selectedTaskName}
        fileName={selectedTaskId || ""}
        onValidationComplete={handleValidationComplete}
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
