
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, ShoppingCart, BarChart4, Wallet } from "lucide-react";
import MarketplaceTaskList from "@/components/marketplace/MarketplaceTaskList";
import AixCalculator from "@/components/AixCalculator";

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState("marketplace");
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buyer Dashboard</h1>
          <p className="text-muted-foreground">
            Browse and purchase AIX computation tasks from the marketplace
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <Card className="bg-green-600 text-white shadow-lg border-none">
              <CardContent className="p-2 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <div>
                  <p className="text-xs opacity-90">AIX Balance</p>
                  <p className="text-lg font-semibold">1,250.00</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center gap-2">
            <Card className="bg-blue-600 text-white shadow-lg border-none">
              <CardContent className="p-2 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <div>
                  <p className="text-xs opacity-90">Purchases</p>
                  <p className="text-lg font-semibold">12</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Marketplace</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4" />
              <span>AIX Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="purchased" className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4" />
              <span>My Purchases</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="marketplace">
          <MarketplaceTaskList />
        </TabsContent>
        
        <TabsContent value="calculator">
          <AixCalculator />
        </TabsContent>
        
        <TabsContent value="purchased">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>
                View all your purchased tasks and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No Purchases Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  You haven't purchased any tasks yet. Head over to the marketplace to browse available tasks.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuyerDashboard;
