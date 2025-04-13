
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import RecallService from "@/services/RecallService";
import ChainOfThoughtViewer from "@/components/ChainOfThoughtViewer";
import RecallConfigForm from "@/components/RecallConfigForm";

// Import refactored components
import ValidatorHeader from "./validator/ValidatorHeader";
import ValidatorTabs from "./validator/ValidatorTabs";
import RecallPortalInfoDialog from "./validator/RecallPortalInfoDialog";

const ValidatorDashboard = () => {
  const [showRecallConfig, setShowRecallConfig] = useState(false);
  const [showChainOfThought, setShowChainOfThought] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [resourceData, setResourceData] = useState<any>(null);
  const [aixValuation, setAixValuation] = useState<any>(null);
  const [showRecallPortalInfo, setShowRecallPortalInfo] = useState(false);

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
    
    // Validate task using the resource data
    toast({
      title: "Task Validated",
      description: `Task has been validated with ${aixValuation?.aix_value.toFixed(2)} AIX tokens.`,
    });
  };

  const openRecallPortal = () => {
    window.open("https://portal.recall.network/buckets", "_blank");
    setShowRecallPortalInfo(true);
  };

  const handleResourceDataCalculated = (data: any, aix: any) => {
    setResourceData(data);
    setAixValuation(aix);
  };

  return (
    <div className="p-6">
      <ValidatorHeader onShowRecallConfig={() => setShowRecallConfig(true)} />
      
      <ValidatorTabs
        resourceData={resourceData}
        aixValuation={aixValuation}
        onViewChainOfThought={handleViewChainOfThought}
        onValidateTask={handleValidateTask}
        onShowRecallConfig={() => setShowRecallConfig(true)}
        onOpenRecallPortal={openRecallPortal}
        onShowChainOfThought={() => setShowChainOfThought(true)}
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

      {/* Recall Portal Info Dialog */}
      <RecallPortalInfoDialog 
        open={showRecallPortalInfo} 
        onOpenChange={setShowRecallPortalInfo}
      />
    </div>
  );
};

export default ValidatorDashboard;
