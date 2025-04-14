
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import AgentService from "@/services/AgentService";

interface TaskCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: (taskId: string) => void;
}

const TaskCreationDialog: React.FC<TaskCreationDialogProps> = ({
  open,
  onOpenChange,
  onTaskCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("analysis");
  const [isCreating, setIsCreating] = useState(false);
  const [showConfigAlert, setShowConfigAlert] = useState(false);
  
  // For agent chat
  const [chatMessages, setChatMessages] = useState<Array<{role: "user" | "agent", content: string}>>([
    { role: "agent", content: "Hello! I'm Eliza, your AI assistant. How can I help you with your task today?" }
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Check agent configuration on dialog open
  React.useEffect(() => {
    if (open) {
      try {
        const savedConfig = localStorage.getItem("agent_config");
        const isConfigured = savedConfig && 
          JSON.parse(savedConfig).baseUrl && 
          JSON.parse(savedConfig).baseUrl !== "https://api.yourdomain.com";
        
        setShowConfigAlert(!isConfigured);
      } catch (error) {
        setShowConfigAlert(true);
      }
    }
  }, [open]);

  const handleCreateTask = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your task.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const task = await AgentService.createTask({
        title,
        description,
        type: taskType,
      });
      
      toast({
        title: "Task Created",
        description: `Your task "${title}" has been created successfully.`,
      });
      
      if (onTaskCreated) {
        onTaskCreated(task.taskId);
      }
      
      // Reset form and close dialog
      setTitle("");
      setDescription("");
      setTaskType("analysis");
      setChatMessages([
        { role: "agent", content: "Hello! I'm Eliza, your AI assistant. How can I help you with your task today?" }
      ]);
      onOpenChange(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Task Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    const userMessage = messageInput.trim();
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setMessageInput("");
    setIsSending(true);
    
    try {
      const response = await AgentService.sendMessage(userMessage);
      setChatMessages(prev => [...prev, { role: "agent", content: response }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Message Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Add error as an agent message for better UX
      setChatMessages(prev => [...prev, { 
        role: "agent", 
        content: "Sorry, I couldn't process your message. " + errorMessage 
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleConfigureAgent = () => {
    onOpenChange(false);
    // Wait for dialog to close before opening config
    setTimeout(() => {
      document.querySelector('[aria-label="Configure Agent"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Work with Eliza to define and create a new task
          </DialogDescription>
        </DialogHeader>
        
        {showConfigAlert && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Agent backend is not configured. 
              <Button 
                variant="link" 
                className="px-2 py-0 h-auto text-destructive underline" 
                onClick={handleConfigureAgent}
              >
                Configure now
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow overflow-hidden">
          {/* Task details form */}
          <div className="space-y-4 border-r pr-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Task Type</Label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analysis">Data Analysis</SelectItem>
                  <SelectItem value="prediction">Market Prediction</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="custom">Custom Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Task Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you need the agent to do"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-32"
              />
            </div>
          </div>
          
          {/* Agent chat */}
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/30 rounded-md mb-4">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-secondary text-secondary-foreground opacity-70">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ask Eliza about your task..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={showConfigAlert}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isSending || !messageInput.trim() || showConfigAlert}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateTask} disabled={isCreating || showConfigAlert}>
            {isCreating ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreationDialog;
