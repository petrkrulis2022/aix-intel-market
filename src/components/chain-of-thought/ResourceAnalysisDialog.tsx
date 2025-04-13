
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ResourceAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceData: any;
  aixValuation: any;
}

const ResourceAnalysisDialog: React.FC<ResourceAnalysisDialogProps> = ({
  open,
  onOpenChange,
  resourceData,
  aixValuation,
}) => {
  if (!resourceData) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Resource Usage Analysis</DialogTitle>
          <DialogDescription>
            Analysis of computational resources used for this task
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
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
              <p className="font-medium">
                {(resourceData.resources.memory?.average_bytes / 1024 / 1024 / 1024).toFixed(1)} GB
              </p>
            </div>
          </div>
          
          {aixValuation && (
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
          )}
          
          <div className="flex justify-end">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Use These Values
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceAnalysisDialog;
