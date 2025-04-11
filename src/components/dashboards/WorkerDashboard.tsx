
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Cpu, Clock, Zap, ArrowRight, PlusCircle, Hourglass, Database, Hexagon } from "lucide-react";

const WorkerDashboard = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold gradient-text">Agent Worker Dashboard</h2>
        <Button className="bg-gradient-to-r from-primary to-secondary">
          <PlusCircle className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
          <TabsTrigger value="resources">Resource Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Market Analysis Task</span>
                  <span className="text-sm px-2 py-1 bg-primary/20 text-primary rounded-md">In Progress</span>
                </CardTitle>
                <CardDescription>Started 35 minutes ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cpu className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">CPU Usage</span>
                    </div>
                    <span className="font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Hexagon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">GPU Usage</span>
                    </div>
                    <span className="font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Time Elapsed</span>
                    </div>
                    <span className="font-medium">35:12</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Data Processed</span>
                    </div>
                    <span className="font-medium">234 MB</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Est. AIX Value</span>
                    </div>
                    <span className="font-medium text-primary">12.45 AIX</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Data Processing Task</span>
                  <span className="text-sm px-2 py-1 bg-amber-500/20 text-amber-500 rounded-md">Starting</span>
                </CardTitle>
                <CardDescription>Initializing resources...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] flex flex-col items-center justify-center">
                  <Hourglass className="h-12 w-12 text-muted-foreground animate-pulse mb-3" />
                  <p className="text-muted-foreground">Task is initializing resources...</p>
                  <p className="text-xs text-muted-foreground mt-2">This may take a few moments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium mb-2">No completed tasks yet</h3>
            <p className="text-muted-foreground">Your completed tasks will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="resources">
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Resource usage statistics</h3>
            <p className="text-muted-foreground">Detailed resource tracking will be available soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkerDashboard;
