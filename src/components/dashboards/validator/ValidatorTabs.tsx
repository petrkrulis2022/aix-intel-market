
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingTaskCard from "./PendingTaskCard";
import ValidatedTaskCard from "./ValidatedTaskCard";
import RecallNetworkCard from "./RecallNetworkCard";
import ResourceAnalysisCard from "./ResourceAnalysisCard";

interface ValidatorTabsProps {
  resourceData: any;
  aixValuation: any;
  onViewChainOfThought: (taskId: string) => void;
  onValidateTask: (taskId: string) => void;
  onShowRecallConfig: () => void;
  onOpenRecallPortal: () => void;
  onShowChainOfThought: () => void;
}

const ValidatorTabs: React.FC<ValidatorTabsProps> = ({
  resourceData,
  aixValuation,
  onViewChainOfThought,
  onValidateTask,
  onShowRecallConfig,
  onOpenRecallPortal,
  onShowChainOfThought,
}) => {
  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList>
        <TabsTrigger value="pending">Pending Validation</TabsTrigger>
        <TabsTrigger value="validated">Validated Tasks</TabsTrigger>
        <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        <TabsTrigger value="recall">Recall Network</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <PendingTaskCard
            taskId="task1"
            title="Market Analysis Task"
            agent="0x8F3...4e21"
            submissionTime="2025-04-11 09:23:15"
            cpuResources="34.2 core-hours"
            gpuResources="2.8 GPU-hours"
            executionTime="1.4 hours"
            aixValue="18.34 AIX"
            onViewChainOfThought={onViewChainOfThought}
            onValidateTask={onValidateTask}
          />
          
          <PendingTaskCard
            taskId="task2"
            title="Token Price Prediction"
            agent="0x7A1...9F53"
            submissionTime="2025-04-11 08:15:42"
            cpuResources="52.6 core-hours"
            gpuResources="4.1 GPU-hours"
            executionTime="2.3 hours"
            aixValue="25.67 AIX"
            onViewChainOfThought={onViewChainOfThought}
            onValidateTask={onValidateTask}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="validated">
        <div className="mt-6">
          <ValidatedTaskCard
            title="Sentiment Analysis"
            agent="0x3B2...7F12"
            submittedDate="2025-04-10"
            validatedDate="2025-04-11"
            resources="29.4 core-hours"
            claimedValue="15.21 AIX"
            verifiedValue="14.85 AIX"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="marketplace">
        <div className="p-8 text-center">
          <h3 className="text-xl font-medium mb-2">Marketplace management</h3>
          <p className="text-muted-foreground">View and manage your listings on the marketplace</p>
        </div>
      </TabsContent>

      <TabsContent value="recall">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecallNetworkCard
            onShowRecallConfig={onShowRecallConfig}
            onOpenRecallPortal={onOpenRecallPortal}
            onShowChainOfThought={onShowChainOfThought}
          />

          {resourceData && aixValuation && (
            <ResourceAnalysisCard
              resourceData={resourceData}
              aixValuation={aixValuation}
            />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ValidatorTabs;
