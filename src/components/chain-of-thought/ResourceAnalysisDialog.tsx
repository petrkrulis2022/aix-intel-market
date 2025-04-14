
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, Memory, Clock } from "lucide-react";

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
  
  // Convert timestamp samples to chart data format if available
  const prepareSampleData = (samples?: Array<[string, number]>) => {
    if (!samples || samples.length === 0) return [];
    
    return samples.map(([timestamp, value]) => ({
      time: new Date(timestamp).toLocaleTimeString(),
      value: value
    }));
  };

  const cpuData = resourceData.resources.cpu.samples ? prepareSampleData(resourceData.resources.cpu.samples) : [];
  const gpuData = resourceData.resources.gpu.samples ? prepareSampleData(resourceData.resources.gpu.samples) : [];
  const memoryData = resourceData.resources.memory?.samples ? 
    prepareSampleData(resourceData.resources.memory.samples.map(([time, bytes]) => [time, bytes / (1024 * 1024 * 1024)])) : [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Resource Usage Analysis</DialogTitle>
          <DialogDescription>
            Analysis of computational resources used for this task
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">CPU Usage:</p>
              <div className="flex items-center">
                <Cpu className="h-4 w-4 mr-1 text-blue-500" />
                <p className="font-medium">{resourceData.resources.cpu.average_percent}%</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">GPU Usage:</p>
              <p className="font-medium">{resourceData.resources.gpu.average_percent}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Duration:</p>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-amber-500" />
                <p className="font-medium">{(resourceData.duration_seconds / 60).toFixed(1)} minutes</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Memory Usage:</p>
              <div className="flex items-center">
                <Memory className="h-4 w-4 mr-1 text-purple-500" />
                <p className="font-medium">
                  {(resourceData.resources.memory?.average_bytes / 1024 / 1024 / 1024).toFixed(1)} GB
                </p>
              </div>
            </div>
          </div>
          
          {/* Usage Charts */}
          {cpuData.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">CPU Usage Over Time</h4>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cpuData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{fontSize: 10}} />
                    <YAxis domain={[0, 100]} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" name="CPU %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {gpuData.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">GPU Usage Over Time</h4>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gpuData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{fontSize: 10}} />
                    <YAxis domain={[0, 100]} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#22c55e" name="GPU %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {memoryData.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Memory Usage Over Time</h4>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={memoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{fontSize: 10}} />
                    <YAxis tick={{fontSize: 10}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#a855f7" name="Memory (GB)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
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
