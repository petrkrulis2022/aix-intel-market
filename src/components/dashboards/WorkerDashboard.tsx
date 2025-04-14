
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Brain, Cpu, ShoppingCart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import TaskCreationDialog from "@/components/worker/TaskCreationDialog";
import RecallService from "@/services/RecallService";

interface WorkerDashboardProps {
  onAddTaskToMarketplace?: (taskData: any, aixData: any) => void;
}

const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ onAddTaskToMarketplace }) => {
  const [showTaskCreation, setShowTaskCreation] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  
  // Demo handler for generating random resources and adding to marketplace
  const handleQuickAddToMarketplace = () => {
    if (!onAddTaskToMarketplace) return;
    
    // Generate random resource data for demo purposes
    const taskId = `worker-task-${Date.now()}`;
    
    const taskData = {
      task_id: taskId,
      agent_id: "worker-agent-1",
      start_time: new Date(Date.now() - Math.floor(Math.random() * 3600 + 1800) * 1000).toISOString(),
      end_time: new Date().toISOString(),
      resources: {
        cpu: { average_percent: Math.floor(Math.random() * 60) + 20 },
        gpu: { average_percent: Math.floor(Math.random() * 70) + 20 },
        memory: { average_bytes: (Math.random() * 4 + 2) * 1024 * 1024 * 1024 }
      },
      duration_seconds: Math.floor(Math.random() * 3600) + 1800
    };
    
    // Calculate AIX value
    const aixValuation = RecallService.calculateAIXValue(taskData);
    
    onAddTaskToMarketplace(taskData, aixValuation);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Worker Dashboard</h1>
          <p className="text-muted-foreground">
            Create and manage tasks for AI agents to process
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowTaskCreation(true)}
            className="flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Button>
          
          {onAddTaskToMarketplace && (
            <Button 
              onClick={handleQuickAddToMarketplace}
              className="flex items-center bg-gradient-to-r from-primary to-secondary"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add Task to Marketplace
            </Button>
          )}
        </div>
      </div>
      
      <Tabs 
        defaultValue="tasks" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            <span>Resources</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Your Tasks</CardTitle>
              <CardDescription>
                View and manage your agent tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No Tasks Created Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  Get started by creating a new task for your AI agent to process.
                </p>
                <Button onClick={() => setShowTaskCreation(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
              <CardDescription>
                Monitor your agent's resource usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Cpu className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No Resource Data Available</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Create tasks to see resource utilization data.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <TaskCreationDialog
        open={showTaskCreation}
        onOpenChange={setShowTaskCreation}
      />
    </div>
  );
};

export default WorkerDashboard;
