
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface ResourceAnalysisCardProps {
  resourceData: {
    resources: {
      cpu: { average_percent: number };
      gpu: { average_percent: number };
      memory?: { average_bytes: number };
    };
    duration_seconds: number;
  };
  aixValuation: {
    aix_value: number;
    components: {
      hardware_score: number;
      time_score: number;
      performance_score: number;
      energy_score: number;
    };
  };
}

const ResourceAnalysisCard: React.FC<ResourceAnalysisCardProps> = ({ resourceData, aixValuation }) => {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-2 text-secondary" />
          Resource Analysis
        </CardTitle>
        <CardDescription>
          Analysis of computational resources and AIX valuation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">CPU Usage:</p>
            <p className="font-medium">{resourceData.resources.cpu.average_percent}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">GPU Usage:</p>
            <p className="font-medium">{resourceData.resources.gpu.average_percent}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Duration:</p>
            <p className="font-medium">{(resourceData.duration_seconds / 60).toFixed(1)} minutes</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Memory Usage:</p>
            <p className="font-medium">{(resourceData.resources.memory?.average_bytes / 1024 / 1024 / 1024).toFixed(1)} GB</p>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <h4 className="text-sm font-medium mb-2">Calculated AIX Value</h4>
          <div className="bg-primary/5 p-3 rounded-md">
            <div className="text-center">
              <span className="text-2xl font-bold text-primary">{aixValuation.aix_value.toFixed(2)}</span>
              <span className="text-sm ml-1">AIX</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="text-xs">
              <span className="text-muted-foreground">Hardware: </span>
              <span>{aixValuation.components.hardware_score.toFixed(2)}</span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Time: </span>
              <span>{aixValuation.components.time_score.toFixed(2)}</span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Performance: </span>
              <span>{aixValuation.components.performance_score.toFixed(2)}</span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Energy: </span>
              <span>{aixValuation.components.energy_score.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceAnalysisCard;
