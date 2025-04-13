
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, FileCog } from "lucide-react";

interface RecallNetworkCardProps {
  onShowRecallConfig: () => void;
  onOpenRecallPortal: () => void;
  onShowChainOfThought: () => void;
}

const RecallNetworkCard: React.FC<RecallNetworkCardProps> = ({
  onShowRecallConfig,
  onOpenRecallPortal,
  onShowChainOfThought,
}) => {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="w-5 h-5 mr-2 text-primary" />
          Recall Network
        </CardTitle>
        <CardDescription>
          Access and manage your Recall Network integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Configure Recall Network</h3>
          <p className="text-sm text-muted-foreground">
            Set up your connection to the Recall Network to access chain of thought logs and validate resource usage.
          </p>
          <Button 
            variant="outline" 
            onClick={onShowRecallConfig}
            className="mt-2"
          >
            Configure Recall
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Access Recall Portal</h3>
          <p className="text-sm text-muted-foreground">
            Visit the Recall Portal to manage your buckets and view detailed chain of thought logs.
          </p>
          <Button 
            onClick={onOpenRecallPortal}
            className="mt-2 bg-gradient-to-r from-primary to-secondary"
          >
            Open Recall Portal
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">View Chain of Thought</h3>
          <p className="text-sm text-muted-foreground">
            Explore chain of thought logs from agents and analyze resource usage.
          </p>
          <Button 
            onClick={onShowChainOfThought}
            variant="default"
            className="mt-2"
          >
            <FileCog className="w-4 h-4 mr-2" />
            View Chain of Thought
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecallNetworkCard;
