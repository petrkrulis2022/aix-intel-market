
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Brain, Cpu, ShoppingCart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import TaskCreationDialog from "@/components/worker/TaskCreationDialog";
import RecallService from "@/services/RecallService";

interface WorkerDashboardProps {
  onAddTaskToMarketplace?: (taskData: any, aixData: any) => void;
}

const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ onAddTaskToMarketplace }) => {
  const [showTaskCreation, setShowTaskCreation] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState<Array<{taskId: string, title: string, status: string}>>([]);
  const [loading, setLoading] = useState(false);
  
  const handleQuickAddToMarketplace = () => {
    if (!onAddTaskToMarketplace) return;
    
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
    
    const aixValuation = RecallService.calculateAIXValue(taskData);
    
    onAddTaskToMarketplace(taskData, aixValuation);
  };
  
  const handleTaskCreated = (taskId: string) => {
    // Refresh the task list after a new task is created
    fetchTasks();
    
    toast({
      title: "Task Created",
      description: `Task ID: ${taskId} was created successfully.`,
    });
  };
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const AgentService = (await import('@/services/AgentService')).default;
      
      if (AgentService.isConfigured()) {
        try {
          const taskList = await AgentService.getTasks();
          setTasks(taskList || []);
        } catch (error) {
          console.error("Failed to fetch tasks:", error);
          // Silent fail, we don't want to show error toasts on initial load
        }
      }
    } catch (error) {
      console.error("Error loading agent service:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load tasks when the dashboard mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Worker Dashboard</h1>
          <p className="text-muted-foreground">
            Ask your AI agent to perform tasks and analyze resources
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => setShowTaskCreation(true)}
            className="flex items-center"
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Ask Agent
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
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map(task => (
                    <div 
                      key={task.taskId} 
                      className="p-4 border rounded-md flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">Task ID: {task.taskId}</p>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        task.status === "completed" ? "bg-green-100 text-green-800" : 
                        task.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No Tasks Created Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-4">
                    Start a conversation with your AI agent to create and process tasks.
                  </p>
                  <Button onClick={() => setShowTaskCreation(true)}>
                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                    Ask Agent to Perform Action
                  </Button>
                </div>
              )}
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
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default WorkerDashboard;
