
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Cpu, DollarSign } from "lucide-react";

import ProviderSelector from "./ProviderSelector";
import ComputeProvidersService, { ComputeProvider } from "@/services/providers/ComputeProvidersService";
import PrimeIntellectService from "@/services/providers/PrimeIntellectService";

interface TaskValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskData: any;
  taskName: string;
  fileName: string;
  onValidationComplete: (data: {
    resourceData: any;
    aixValuation: any;
    providerId: string;
    costBreakdown: any;
  }) => void;
}

const TaskValidationDialog: React.FC<TaskValidationDialogProps> = ({
  open,
  onOpenChange,
  taskData,
  taskName,
  fileName,
  onValidationComplete
}) => {
  const [providers, setProviders] = useState<ComputeProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [costBreakdown, setCostBreakdown] = useState<{
    total: number;
    breakdown: {
      cpu: number;
      gpu: number;
      memory?: number;
    };
  } | null>(null);
  
  // Extract benchmark data from task data
  const benchmarkData = taskData && taskData[0]?.benchmarks ? {
    benchmarks: taskData[0].benchmarks
  } : null;
  
  // Initialize with Prime Intellect API key
  useEffect(() => {
    const initPrimeIntellect = () => {
      // In a real app, we would get this from environment variables or user input
      const apiKey = "pit_55f1b2db2779cf49812d54966ddf515fee78ca2fbce542340e57c4d372bdd9d9";
      PrimeIntellectService.setApiKey(apiKey);
    };
    
    initPrimeIntellect();
  }, []);
  
  // Load providers on mount
  useEffect(() => {
    const loadProviders = async () => {
      setLoading(true);
      try {
        const availableProviders = await ComputeProvidersService.getAllProviders();
        setProviders(availableProviders);
        
        // Default to Prime Intellect if available
        const primeIntellect = availableProviders.find(p => p.id === "primeintellect");
        if (primeIntellect) {
          setSelectedProvider("primeintellect");
        } else {
          setSelectedProvider(availableProviders[0]?.id || null);
        }
      } catch (error) {
        console.error('Error loading compute providers:', error);
        toast({
          title: "Error loading providers",
          description: "Could not load compute providers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (open) {
      loadProviders();
    }
  }, [open]);
  
  // Calculate costs when provider changes
  useEffect(() => {
    const calculateCosts = async () => {
      if (!selectedProvider || !benchmarkData) return;
      
      try {
        const costs = await ComputeProvidersService.calculateCost(selectedProvider, benchmarkData);
        setCostBreakdown(costs);
      } catch (error) {
        console.error('Error calculating costs:', error);
        setCostBreakdown(null);
      }
    };
    
    calculateCosts();
  }, [selectedProvider, benchmarkData]);
  
  const handleSelectProvider = (providerId: string) => {
    setSelectedProvider(providerId);
  };
  
  const handleComplete = () => {
    if (!benchmarkData || !selectedProvider || !costBreakdown) {
      toast({
        title: "Missing Information",
        description: "Please select a provider to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate AIX valuation based on benchmark data
    const aixValuation = {
      aix_value: calculateAIXValue(benchmarkData),
      components: {
        hardware_score: calculateHardwareScore(benchmarkData),
        time_score: calculateTimeScore(benchmarkData),
        performance_score: calculatePerformanceScore(benchmarkData),
        energy_score: calculateEnergyScore(benchmarkData),
      }
    };
    
    onValidationComplete({
      resourceData: benchmarkData,
      aixValuation,
      providerId: selectedProvider,
      costBreakdown
    });
    
    onOpenChange(false);
  };
  
  // Helper functions to calculate AIX value components
  const calculateHardwareScore = (data: any): number => {
    const cpuFactor = data.benchmarks.compute.cpu.estimatedLoadFactor;
    const gpuFactor = data.benchmarks.compute.gpu.estimatedLoadFactor;
    return (cpuFactor * 5) + (gpuFactor * 15);
  };
  
  const calculateTimeScore = (data: any): number => {
    const seconds = data.benchmarks.time.totalSeconds;
    return Math.max(1, Math.min(10, 10 - (seconds / 10)));
  };
  
  const calculatePerformanceScore = (data: any): number => {
    return data.benchmarks.reasoning.complexityScore * 4;
  };
  
  const calculateEnergyScore = (data: any): number => {
    return data.benchmarks.energy.consumptionFactor * 8;
  };
  
  const calculateAIXValue = (data: any): number => {
    return (
      calculateHardwareScore(data) +
      calculateTimeScore(data) +
      calculatePerformanceScore(data) +
      calculateEnergyScore(data)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Validate Task: {taskName}</DialogTitle>
          <DialogDescription>
            Review task benchmarks and select a compute provider to validate this task
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="benchmarks" className="mt-4">
          <TabsList>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="providers">Compute Providers</TabsTrigger>
          </TabsList>
          <TabsContent value="benchmarks">
            {taskData ? (
              <div className="space-y-4 mt-4">
                <h3 className="text-lg font-medium">Resource Benchmarks</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Compute Resources</h4>
                    <div className="bg-muted/40 p-3 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">CPU Usage</span>
                        <span>{(benchmarkData.benchmarks.compute.cpu.estimatedLoadFactor * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">GPU Usage</span>
                        <span>{(benchmarkData.benchmarks.compute.gpu.estimatedLoadFactor * 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Time & Energy</h4>
                    <div className="bg-muted/40 p-3 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span>{benchmarkData.benchmarks.time.totalSeconds.toFixed(2)} seconds</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Energy Consumption</span>
                        <span>{(benchmarkData.benchmarks.energy.consumptionFactor * 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <h4 className="text-sm font-medium">Reasoning Complexity</h4>
                    <div className="bg-muted/40 p-3 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Steps</span>
                        <span>{benchmarkData.benchmarks.reasoning.stepCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Complexity Score</span>
                        <span>{benchmarkData.benchmarks.reasoning.complexityScore.toFixed(3)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <h3 className="text-lg font-medium">Estimated AIX Value</h3>
                  <div className="bg-primary/10 p-4 rounded-md text-center">
                    <span className="text-3xl font-bold text-primary">
                      {calculateAIXValue(benchmarkData).toFixed(2)}
                    </span>
                    <span className="ml-1">AIX</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No benchmark data available for this task.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="providers">
            <div className="space-y-6 mt-4">
              <ProviderSelector
                providers={providers}
                selectedProvider={selectedProvider}
                onSelectProvider={handleSelectProvider}
                loading={loading}
              />
              
              {selectedProvider && costBreakdown && (
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Cost Estimate</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Cost Breakdown</h4>
                      <div className="bg-muted/40 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">CPU Cost</span>
                          <span>${costBreakdown.breakdown.cpu.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">GPU Cost</span>
                          <span>${costBreakdown.breakdown.gpu.toFixed(4)}</span>
                        </div>
                        {costBreakdown.breakdown.memory && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Memory Cost</span>
                            <span>${costBreakdown.breakdown.memory.toFixed(4)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Total Cost</h4>
                      <div className="bg-primary/10 p-3 rounded-md h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="text-2xl font-bold text-primary">{costBreakdown.total.toFixed(4)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">USD</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between items-center pt-4 mt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleComplete} disabled={!selectedProvider || !costBreakdown}>
            <Check className="h-4 w-4 mr-2" />
            Complete Validation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskValidationDialog;
