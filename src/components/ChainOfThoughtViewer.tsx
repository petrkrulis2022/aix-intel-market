
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileCog, Brain, Database, Calculator } from "lucide-react";
import RecallService from "@/services/RecallService";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ChainOfThoughtViewerProps {
  onResourceDataCalculated?: (resourceData: any, aixValuation: any) => void;
}

const ChainOfThoughtViewer: React.FC<ChainOfThoughtViewerProps> = ({ onResourceDataCalculated }) => {
  const [buckets, setBuckets] = useState<string[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [cotLogs, setCotLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resourceData, setResourceData] = useState<any>(null);
  const [aixValuation, setAixValuation] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);

  const fetchBuckets = async () => {
    setIsLoading(true);
    try {
      const bucketList = await RecallService.getBuckets();
      setBuckets(bucketList);
      if (bucketList.length > 0) {
        setSelectedBucket(bucketList[0]);
      }
    } catch (error) {
      toast({
        title: "Error Fetching Buckets",
        description: "Failed to retrieve buckets from Recall Network.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChainOfThought = async () => {
    if (!selectedBucket) {
      toast({
        title: "No Bucket Selected",
        description: "Please select a bucket to view chain of thought logs.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const logs = await RecallService.getChainOfThoughtLogs(selectedBucket);
      setCotLogs(logs);
    } catch (error) {
      toast({
        title: "Error Fetching Logs",
        description: "Failed to retrieve chain of thought logs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeResourceUsage = async () => {
    if (!selectedBucket) {
      toast({
        title: "No Bucket Selected",
        description: "Please select a bucket to analyze resource usage.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await RecallService.analyzeResourceUsage(selectedBucket);
      setResourceData(data);
      
      // Calculate AIX value
      const aix = RecallService.calculateAIXValue(data);
      setAixValuation(aix);
      
      setShowDialog(true);
      
      if (onResourceDataCalculated) {
        onResourceDataCalculated(data, aix);
      }
    } catch (error) {
      toast({
        title: "Error Analyzing Resources",
        description: "Failed to analyze resource usage from logs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileCog className="w-5 h-5 mr-2 text-primary" />
          Chain of Thought Viewer
        </CardTitle>
        <CardDescription>
          View chain of thought logs from Recall Network buckets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Select Bucket</label>
              <Select value={selectedBucket} onValueChange={setSelectedBucket}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a bucket" />
                </SelectTrigger>
                <SelectContent>
                  {buckets.map((bucket) => (
                    <SelectItem key={bucket} value={bucket}>
                      {bucket}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={fetchBuckets} disabled={isLoading}>
              <Database className="w-4 h-4 mr-2" />
              Refresh Buckets
            </Button>
            <Button onClick={fetchChainOfThought} disabled={isLoading || !selectedBucket}>
              <Brain className="w-4 h-4 mr-2" />
              View Chain of Thought
            </Button>
          </div>

          {cotLogs.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Chain of Thought Logs</h3>
              <ScrollArea className="h-64 rounded-md border p-4">
                <div className="space-y-2">
                  {cotLogs.map((log, index) => (
                    <div key={index} className="py-1 border-b border-border/30 last:border-0">
                      <p className="text-sm">{log}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 flex justify-end">
                <Button onClick={analyzeResourceUsage} disabled={isLoading}>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Resource Usage
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Resource Usage Analysis</DialogTitle>
            <DialogDescription>
              Analysis of computational resources used for this task
            </DialogDescription>
          </DialogHeader>
          
          {resourceData && (
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
                  <p className="font-medium">{(resourceData.resources.memory?.average_bytes / 1024 / 1024 / 1024).toFixed(1)} GB</p>
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
                  onClick={() => setShowDialog(false)}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  Use These Values
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ChainOfThoughtViewer;
