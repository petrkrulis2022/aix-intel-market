
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Search, Tag, ShoppingCart, Cpu, Clock } from "lucide-react";
import MarketplaceService, { MarketplaceTask } from "@/services/MarketplaceService";
import { toast } from "@/components/ui/use-toast";

const MarketplaceTaskList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<MarketplaceTask[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const listedTasks = await MarketplaceService.getListedTasks();
        setTasks(listedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast({
          title: "Error Loading Marketplace",
          description: "Could not load marketplace listings. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  const handleBuyTask = async (taskId: string, taskTitle: string) => {
    try {
      await MarketplaceService.buyTask(taskId);
      
      // Update local state to reflect the purchase
      setTasks(tasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Task Purchased",
        description: `You have successfully purchased "${taskTitle}".`,
      });
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error completing your purchase. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery === "" || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesTab = activeTab === "all" || 
      (activeTab === "high-value" && task.verifiedAixValue > 50) ||
      (activeTab === "low-value" && task.verifiedAixValue <= 50);
      
    return matchesSearch && matchesTab;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="high-value">High Value (50+)</TabsTrigger>
            <TabsTrigger value="low-value">Low Value (&lt;50)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/50 bg-card opacity-50 animate-pulse">
              <CardHeader className="h-24"></CardHeader>
              <CardContent className="h-32"></CardContent>
              <CardFooter></CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="border-border/50 bg-card overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{task.title}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      By {task.agent}
                    </CardDescription>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30 whitespace-nowrap">
                    {task.verifiedAixValue.toFixed(1)} AIX
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-2 flex-grow">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {task.description || "No description provided."}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-blue-500" />
                    <span>CPU: {task.resources.cpu}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-500" />
                    <span>Duration: {task.resources.duration}</span>
                  </div>
                </div>
                
                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {task.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs py-0">
                        {tag}
                      </Badge>
                    ))}
                    {task.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs py-0">
                        +{task.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2 pb-3">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                  onClick={() => handleBuyTask(task.id, task.title)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Buy for {task.verifiedAixValue.toFixed(1)} AIX
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No Tasks Found</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {searchQuery ? "No tasks match your search criteria. Try different keywords or clear your search." : "There are no tasks currently available in the marketplace."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketplaceTaskList;
