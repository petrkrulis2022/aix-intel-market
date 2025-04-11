
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Search, ArrowRight, Shield, FileCheck, Calculator } from "lucide-react";

const ValidatorDashboard = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold gradient-text">Agent AIX Dashboard</h2>
        <Button className="bg-gradient-to-r from-secondary to-primary">
          <Search className="mr-2 h-4 w-4" /> Find Tasks to Validate
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending Validation</TabsTrigger>
          <TabsTrigger value="validated">Validated Tasks</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
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
                  <Button variant="outline" className="flex-1">
                    View Chain of Thought
                  </Button>
                  <Button className="flex-1">
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
                  <Button variant="outline" className="flex-1">
                    View Chain of Thought
                  </Button>
                  <Button className="flex-1">
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
      </Tabs>
    </div>
  );
};

export default ValidatorDashboard;
