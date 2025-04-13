
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Search, ArrowRight, Shield, FileCheck, Calculator, 
  Database, Brain, FileCog } from "lucide-react";
import RecallConfigForm from "@/components/RecallConfigForm";
import ChainOfThoughtViewer from "@/components/ChainOfThoughtViewer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import RecallService from "@/services/RecallService";

const ValidatorDashboard = () => {
  const [showRecallConfig, setShowRecallConfig] = useState(false);
  const [showChainOfThought, setShowChainOfThought] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [resourceData, setResourceData] = useState<any>(null);
  const [aixValuation, setAixValuation] = useState<any>(null);
  const [showRecallPortalInfo, setShowRecallPortalInfo] = useState(false);

  const handleViewChainOfThought = (taskId: string) => {
    setSelectedTaskId(taskId);
    
    // Check if Recall is configured
    if (!RecallService.isConfigured()) {
      setShowRecallConfig(true);
      toast({
        title: "Configuration Required",
        description: "Please configure your Recall Network connection first.",
      });
      return;
    }
    
    setShowChainOfThought(true);
  };

  const handleValidateTask = (taskId: string) => {
    // If no resource data is available, show chain of thought first
    if (!resourceData) {
      handleViewChainOfThought(taskId);
      return;
    }
    
    // Validate task using the resource data
    toast({
      title: "Task Validated",
      description: `Task has been validated with ${aixValuation?.aix_value.toFixed(2)} AIX tokens.`,
    });
  };

  const openRecallPortal = () => {
    window.open("https://portal.recall.network/buckets", "_blank");
    setShowRecallPortalInfo(true);
  };

  const handleResourceDataCalculated = (data: any, aix: any) => {
    setResourceData(data);
    setAixValuation(aix);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold gradient-text">Agent AIX Dashboard</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowRecallConfig(true)}
            className="border-primary/30"
          >
            <Database className="mr-2 h-4 w-4" /> Recall Config
          </Button>
          <Button className="bg-gradient-to-r from-secondary to-primary">
            <Search className="mr-2 h-4 w-4" /> Find Tasks to Validate
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending Validation</TabsTrigger>
          <TabsTrigger value="validated">Validated Tasks</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="recall">Recall Network</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Market Analysis Task</CardTitle>
                    <CardDescription>Agent: 0x8F3...4e21</CardDescription>
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
                    <span>2025-04-11 09:23:15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">CPU Resources:</span>
                    <span>34.2 core-hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">GPU Resources:</span>
                    <span>2.8 GPU-hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Execution Time:</span>
                    <span>1.4 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Claimed AIX Value:</span>
                    <span className="font-medium text-primary">18.34 AIX</span>
                  </div>
                </div>
                
                <div className="flex mt-6 gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewChainOfThought("task1")}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    View Chain of Thought
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleValidateTask("task1")}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Validate Task
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Token Price Prediction</CardTitle>
                    <CardDescription>Agent: 0x7A1...9F53</CardDescription>
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
                    <span>2025-04-11 08:15:42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">CPU Resources:</span>
                    <span>52.6 core-hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">GPU Resources:</span>
                    <span>4.1 GPU-hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Execution Time:</span>
                    <span>2.3 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Claimed AIX Value:</span>
                    <span className="font-medium text-primary">25.67 AIX</span>
                  </div>
                </div>
                
                <div className="flex mt-6 gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewChainOfThought("task2")}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    View Chain of Thought
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleValidateTask("task2")}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Validate Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="validated">
          <div className="mt-6">
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Sentiment Analysis</CardTitle>
                    <CardDescription>Agent: 0x3B2...7F12</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">
                    Validated
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Submitted:</span>
                        <span>2025-04-10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Validated:</span>
                        <span>2025-04-11</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Resources:</span>
                        <span>29.4 core-hours</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Claimed Value:</span>
                        <span>15.21 AIX</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Verified Value:</span>
                        <span className="font-medium text-primary">14.85 AIX</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span className="flex items-center text-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Listed
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex mt-2 gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileCheck className="h-4 w-4 mr-2" /> View Report
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Shield className="h-4 w-4 mr-2" /> Validation History
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calculator className="h-4 w-4 mr-2" /> AIX Calculation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="marketplace">
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Marketplace management</h3>
            <p className="text-muted-foreground">View and manage your listings on the marketplace</p>
          </div>
        </TabsContent>

        <TabsContent value="recall">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                    onClick={() => setShowRecallConfig(true)}
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
                    onClick={openRecallPortal}
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
                    onClick={() => setShowChainOfThought(true)}
                    variant="default"
                    className="mt-2"
                  >
                    <FileCog className="w-4 h-4 mr-2" />
                    View Chain of Thought
                  </Button>
                </div>
              </CardContent>
            </Card>

            {resourceData && aixValuation && (
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
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recall Configuration Dialog */}
      <Dialog open={showRecallConfig} onOpenChange={setShowRecallConfig}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Recall Network Configuration</DialogTitle>
            <DialogDescription>
              Configure your connection to the Recall Network
            </DialogDescription>
          </DialogHeader>
          <RecallConfigForm onConfigSaved={() => setShowRecallConfig(false)} />
        </DialogContent>
      </Dialog>

      {/* Chain of Thought Viewer Dialog */}
      <Dialog open={showChainOfThought} onOpenChange={setShowChainOfThought}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chain of Thought Viewer</DialogTitle>
            <DialogDescription>
              View and analyze chain of thought logs from Recall Network
            </DialogDescription>
          </DialogHeader>
          <ChainOfThoughtViewer onResourceDataCalculated={handleResourceDataCalculated} />
        </DialogContent>
      </Dialog>

      {/* Recall Portal Info Dialog */}
      <Dialog open={showRecallPortalInfo} onOpenChange={setShowRecallPortalInfo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Recall Portal Instructions</DialogTitle>
            <DialogDescription>
              How to access chain of thought logs in the Recall Portal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Sign in to the Recall Portal with your credentials</li>
              <li>Navigate to the Buckets section</li>
              <li>Select the bucket containing your agent's chain of thought logs</li>
              <li>Look for files with the prefix "cot/" to find chain of thought logs</li>
              <li>Download or view the logs to analyze resource usage</li>
              <li>Return to this dashboard to calculate AIX values based on the analysis</li>
            </ol>
            <div className="pt-4">
              <Button onClick={() => setShowRecallPortalInfo(false)} className="w-full">
                I Understand
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ValidatorDashboard;
