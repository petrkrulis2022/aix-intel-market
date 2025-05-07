
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingTaskCard from "./PendingTaskCard";
import ValidatedTaskCard from "./ValidatedTaskCard";
import RecallNetworkCard from "./RecallNetworkCard";
import ResourceAnalysisCard from "./ResourceAnalysisCard";
import { FileJson } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TaskInfo {
  id: string;
  title: string;
  fileName: string;
}

interface ValidatorTabsProps {
  resourceData: any;
  aixValuation: any;
  onViewChainOfThought: (taskId: string) => void;
  onValidateTask: (taskId: string) => void;
  onShowRecallConfig: () => void;
  onOpenRecallPortal: () => void;
  onShowChainOfThought: () => void;
  discoveredTasks?: string[];
  convertedTasks?: TaskInfo[];
  onViewConvertedTask?: (fileName: string) => void;
  isTaskListed?: (taskId: string) => boolean;
}

const ValidatorTabs: React.FC<ValidatorTabsProps> = ({
  resourceData,
  aixValuation,
  onViewChainOfThought,
  onValidateTask,
  onShowRecallConfig,
  onOpenRecallPortal,
  onShowChainOfThought,
  discoveredTasks = [],
  convertedTasks = [],
  onViewConvertedTask = () => {},
  isTaskListed = () => false,
}) => {
  // Sample tasks for demo purposes
  const staticTasks = [
    {
      taskId: "task1",
      title: "Market Analysis Task",
      agent: "0x8F3...4e21",
      submissionTime: "2025-04-11 09:23:15",
      cpuResources: "34.2 core-hours",
      gpuResources: "2.8 GPU-hours",
      executionTime: "1.4 hours",
      aixValue: "18.34 AIX"
    },
    {
      taskId: "task2",
      title: "Token Price Prediction",
      agent: "0x7A1...9F53",
      submissionTime: "2025-04-11 08:15:42",
      cpuResources: "52.6 core-hours",
      gpuResources: "4.1 GPU-hours",
      executionTime: "2.3 hours",
      aixValue: "25.67 AIX"
    }
  ];

  // Generate tasks from discovered buckets
  const generateTaskFromBucketName = (bucketName: string, index: number) => {
    // Format the bucket name to make it more readable as a task title
    const formattedName = bucketName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      taskId: bucketName,
      title: formattedName,
      agent: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      submissionTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      cpuResources: `${(Math.random() * 50 + 10).toFixed(1)} core-hours`,
      gpuResources: `${(Math.random() * 5 + 1).toFixed(1)} GPU-hours`,
      executionTime: `${(Math.random() * 3 + 0.5).toFixed(1)} hours`,
      aixValue: `${(Math.random() * 30 + 5).toFixed(2)} AIX`
    };
  };

  // Combine static tasks with discovered tasks
  const allTasks = [
    ...staticTasks,
    ...discoveredTasks.map((bucket, index) => generateTaskFromBucketName(bucket, index))
  ];

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList>
        <TabsTrigger value="pending">Pending Validation</TabsTrigger>
        <TabsTrigger value="validated">Validated Tasks</TabsTrigger>
        <TabsTrigger value="converted">Converted Tasks</TabsTrigger>
        <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        <TabsTrigger value="recall">Recall Network</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {allTasks.length > 0 ? (
            allTasks.map((task) => (
              <PendingTaskCard
                key={task.taskId}
                taskId={task.taskId}
                title={task.title}
                agent={task.agent}
                submissionTime={task.submissionTime}
                cpuResources={task.cpuResources}
                gpuResources={task.gpuResources}
                executionTime={task.executionTime}
                aixValue={task.aixValue}
                onViewChainOfThought={onViewChainOfThought}
                onValidateTask={onValidateTask}
              />
            ))
          ) : (
            <div className="col-span-2 py-12 text-center">
              <p className="text-muted-foreground mb-4">No pending tasks found. Click "Find Tasks to Validate" to discover available tasks.</p>
            </div>
          )}
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
            isListed={isTaskListed("task3")}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="converted">
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Converted JSONL Tasks</h3>
          <p className="text-sm text-muted-foreground mb-4">
            These are Chain of Thought logs that have been converted with the Converter Tool.
            You can validate these tasks to list them on the marketplace.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {convertedTasks.length > 0 ? (
              convertedTasks.map((task) => (
                <Card key={task.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <FileJson className="h-4 w-4 mr-2 text-primary" />
                      {task.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground truncate">
                      {task.fileName}
                    </p>
                    <div className="mt-6 pt-2">
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => onViewConvertedTask(task.id)}
                        className="w-full"
                      >
                        Validate Task
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-10 text-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">
                  No converted tasks found. Use the Converter tool to generate tasks from JSONL logs.
                </p>
              </div>
            )}
          </div>
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
