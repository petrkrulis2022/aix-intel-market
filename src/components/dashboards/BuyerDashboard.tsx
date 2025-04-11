
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpRight, ShieldCheck, Clock, Tag, Star, Cpu, Hourglass } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const BuyerDashboard = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold gradient-text">Agent Buyer Dashboard</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-background border-primary hover:bg-primary/20 transition-all">
            <Clock className="mr-2 h-4 w-4" /> History
          </Button>
          <Button className="bg-gradient-to-r from-secondary to-primary">
            <Search className="mr-2 h-4 w-4" /> Browse Marketplace
          </Button>
        </div>
      </div>

      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="purchased">Purchased Intel</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
        
        <TabsContent value="marketplace">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Task 1 */}
            <Card className="border-border/50 bg-card hover:border-primary/50 transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Market Analysis Report</CardTitle>
                    <CardDescription>ETH price prediction model</CardDescription>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    Verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm text-muted-foreground">Validator Rating:</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Computation:</span>
                    </div>
                    <span className="text-sm">High (43.2 core-hrs)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Hourglass className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Age:</span>
                    </div>
                    <span className="text-sm">2 hours ago</span>
                  </div>
                </div>
                
                <div className="px-3 py-2 bg-muted/50 rounded-md">
                  <span className="text-xs text-muted-foreground">Task includes:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary" className="bg-muted">Price Analysis</Badge>
                    <Badge variant="secondary" className="bg-muted">Chart Patterns</Badge>
                    <Badge variant="secondary" className="bg-muted">Sentiment Data</Badge>
                  </div>
                </div>
              </CardContent>
              <Separator className="mb-3" />
              <CardFooter className="flex justify-between">
                <div className="flex items-baseline">
                  <Tag className="h-4 w-4 mr-1 text-primary" />
                  <span className="text-lg font-semibold text-primary">14.85 AIX</span>
                </div>
                <Button size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-2" /> Purchase
                </Button>
              </CardFooter>
            </Card>
            
            {/* Task 2 */}
            <Card className="border-border/50 bg-card hover:border-primary/50 transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Token Sentiment Analysis</CardTitle>
                    <CardDescription>Social media sentiment tracker</CardDescription>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    Verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm text-muted-foreground">Validator Rating:</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      ))}
                      <Star className="h-3 w-3 text-yellow-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Computation:</span>
                    </div>
                    <span className="text-sm">Medium (21.5 core-hrs)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Hourglass className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Age:</span>
                    </div>
                    <span className="text-sm">5 hours ago</span>
                  </div>
                </div>
                
                <div className="px-3 py-2 bg-muted/50 rounded-md">
                  <span className="text-xs text-muted-foreground">Task includes:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary" className="bg-muted">Twitter Data</Badge>
                    <Badge variant="secondary" className="bg-muted">Reddit Analysis</Badge>
                    <Badge variant="secondary" className="bg-muted">Sentiment Score</Badge>
                  </div>
                </div>
              </CardContent>
              <Separator className="mb-3" />
              <CardFooter className="flex justify-between">
                <div className="flex items-baseline">
                  <Tag className="h-4 w-4 mr-1 text-primary" />
                  <span className="text-lg font-semibold text-primary">8.42 AIX</span>
                </div>
                <Button size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-2" /> Purchase
                </Button>
              </CardFooter>
            </Card>
            
            {/* Task 3 */}
            <Card className="border-border/50 bg-card hover:border-primary/50 transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Arbitrage Opportunity Finder</CardTitle>
                    <CardDescription>Cross-exchange price monitoring</CardDescription>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    Verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm text-muted-foreground">Validator Rating:</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Computation:</span>
                    </div>
                    <span className="text-sm">High (38.7 core-hrs)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Hourglass className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Age:</span>
                    </div>
                    <span className="text-sm">1 day ago</span>
                  </div>
                </div>
                
                <div className="px-3 py-2 bg-muted/50 rounded-md">
                  <span className="text-xs text-muted-foreground">Task includes:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary" className="bg-muted">Exchange Diffs</Badge>
                    <Badge variant="secondary" className="bg-muted">Trading Pairs</Badge>
                    <Badge variant="secondary" className="bg-muted">Alert System</Badge>
                  </div>
                </div>
              </CardContent>
              <Separator className="mb-3" />
              <CardFooter className="flex justify-between">
                <div className="flex items-baseline">
                  <Tag className="h-4 w-4 mr-1 text-primary" />
                  <span className="text-lg font-semibold text-primary">19.34 AIX</span>
                </div>
                <Button size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-2" /> Purchase
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="purchased">
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium mb-2">No purchased intel yet</h3>
            <p className="text-muted-foreground mb-6">Your purchased intel will appear here</p>
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" /> Browse Marketplace
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="recommended">
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Personalized recommendations</h3>
            <p className="text-muted-foreground">Recommendations will appear after you make a purchase</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuyerDashboard;
