
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCog, ShoppingCart } from "lucide-react";
import RecallService from "@/services/RecallService";
import { toast } from "@/components/ui/use-toast";
import MarketplaceService from "@/services/MarketplaceService";

// Import our components
import BucketSelector from "./chain-of-thought/BucketSelector";
import LogsViewer from "./chain-of-thought/LogsViewer";
import ResourceAnalysisDialog from "./chain-of-thought/ResourceAnalysisDialog";
import MarketplaceSubmissionDialog from "./validator/MarketplaceSubmissionDialog";

interface ChainOfThoughtViewerProps {
  onResourceDataCalculated?: (resourceData: any, aixValuation: any) => void;
}

const ChainOfThoughtViewer: React.FC<ChainOfThoughtViewerProps> = ({ onResourceDataCalculated }) => {
  const [buckets, setBuckets] = useState<string[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [logFiles, setLogFiles] = useState<string[]>([]);
  const [selectedLogFile, setSelectedLogFile] = useState<string>("");
  const [cotLogs, setCotLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resourceData, setResourceData] = useState<any>(null);
  const [aixValuation, setAixValuation] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showMarketplaceDialog, setShowMarketplaceDialog] = useState(false);

  const fetchBuckets = async () => {
    setIsLoading(true);
    try {
      const bucketList = await RecallService.getBuckets();
      setBuckets(bucketList);
      
      // Only set selected bucket if we have valid buckets and no bucket is currently selected
      if (bucketList.length > 0 && !selectedBucket) {
        setSelectedBucket(bucketList[0]);
      }
    } catch (error) {
      console.error("Error fetching buckets:", error);
      toast({
        title: "Error Fetching Buckets",
        description: "Failed to retrieve buckets from Recall Network.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogFiles = async () => {
    if (!selectedBucket) {
      toast({
        title: "No Bucket Selected",
        description: "Please select a bucket to view log files.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const files = await RecallService.getChainOfThoughtLogFiles(selectedBucket);
      setLogFiles(files);
      
      // Clear any previously selected log file
      setSelectedLogFile("");
      setCotLogs([]);
    } catch (error) {
      toast({
        title: "Error Fetching Log Files",
        description: "Failed to retrieve log files from the selected bucket.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChainOfThought = async () => {
    if (!selectedBucket || !selectedLogFile) {
      toast({
        title: "No Log File Selected",
        description: "Please select a log file to view its content.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const logs = await RecallService.getChainOfThoughtLogContent(selectedBucket, selectedLogFile);
      setCotLogs(logs);
    } catch (error) {
      toast({
        title: "Error Fetching Log Content",
        description: "Failed to retrieve chain of thought log content.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeResourceUsage = async () => {
    if (!selectedBucket || !selectedLogFile) {
      toast({
        title: "No Log File Selected",
        description: "Please select a log file to analyze resource usage.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await RecallService.analyzeResourceUsage(selectedBucket, selectedLogFile);
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

  // When changing buckets, reset selected log file
  const handleBucketChange = (bucket: string) => {
    setSelectedBucket(bucket);
    setSelectedLogFile("");
    setCotLogs([]);
  };

  const handleAddToMarketplace = () => {
    if (!resourceData || !aixValuation) {
      toast({
        title: "Resource Analysis Required",
        description: "Please analyze resources first before adding to marketplace.",
        variant: "destructive",
      });
      return;
    }
    
    setShowMarketplaceDialog(true);
  };

  const handleMarketplaceSubmit = async (title: string, description: string, tags: string[]) => {
    if (!selectedBucket || !resourceData || !aixValuation) {
      toast({
        title: "Missing Information",
        description: "Task data, resource data, and AIX valuation are required.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await MarketplaceService.listTask({
        id: `${selectedBucket}-${selectedLogFile}`,
        title,
        description,
        agent: "AIX Agent",
        resources: resourceData,
        aixValuation,
        tags
      });
      
      toast({
        title: "Added to Marketplace",
        description: `"${title}" has been successfully listed on the marketplace.`,
      });
      
      setShowMarketplaceDialog(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Listing Failed",
        description: errorMessage,
        variant: "destructive",
      });
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
          <BucketSelector
            buckets={buckets}
            selectedBucket={selectedBucket}
            setSelectedBucket={handleBucketChange}
            fetchBuckets={fetchBuckets}
            isLoading={isLoading}
          />

          <LogsViewer
            cotLogs={cotLogs}
            logFiles={logFiles}
            selectedBucket={selectedBucket}
            selectedLogFile={selectedLogFile}
            setSelectedLogFile={setSelectedLogFile}
            isLoading={isLoading}
            fetchLogFiles={fetchLogFiles}
            fetchChainOfThought={fetchChainOfThought}
            analyzeResourceUsage={analyzeResourceUsage}
          />

          {/* Add to Marketplace button */}
          {resourceData && aixValuation && (
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleAddToMarketplace}
                className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Marketplace
              </button>
            </div>
          )}
        </div>
      </CardContent>

      <ResourceAnalysisDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        resourceData={resourceData}
        aixValuation={aixValuation}
      />

      {/* Marketplace Submission Dialog */}
      <MarketplaceSubmissionDialog
        open={showMarketplaceDialog}
        onOpenChange={setShowMarketplaceDialog}
        resourceData={resourceData}
        aixValuation={aixValuation}
        onSubmit={handleMarketplaceSubmit}
      />
    </Card>
  );
};

export default ChainOfThoughtViewer;
