
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield } from "lucide-react";

interface PendingTaskCardProps {
  taskId: string;
  title: string;
  agent: string;
  submissionTime: string;
  cpuResources: string;
  gpuResources: string;
  executionTime: string;
  aixValue: string;
  onViewChainOfThought: (taskId: string) => void;
  onValidateTask: (taskId: string) => void;
}

const PendingTaskCard: React.FC<PendingTaskCardProps> = ({
  taskId,
  title,
  agent,
  submissionTime,
  cpuResources,
  gpuResources,
  executionTime,
  aixValue,
  onViewChainOfThought,
  onValidateTask,
}) => {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Agent: {agent}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/30">
            Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Submission Time:</span>
            <span>{submissionTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">CPU Resources:</span>
            <span>{cpuResources}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">GPU Resources:</span>
            <span>{gpuResources}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Execution Time:</span>
            <span>{executionTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Claimed AIX Value:</span>
            <span className="font-medium text-primary">{aixValue}</span>
          </div>
        </div>
        
        <div className="flex mt-6 gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewChainOfThought(taskId)}
          >
            <Brain className="h-4 w-4 mr-2" />
            View Chain of Thought
          </Button>
          <Button 
            className="flex-1"
            onClick={() => onValidateTask(taskId)}
          >
            <Shield className="h-4 w-4 mr-2" />
            Validate Task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingTaskCard;
