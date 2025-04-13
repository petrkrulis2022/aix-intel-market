
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCog } from "lucide-react";
import RecallService from "@/services/RecallService";
import { toast } from "@/components/ui/use-toast";

// Import our new components
import BucketSelector from "./chain-of-thought/BucketSelector";
import LogsViewer from "./chain-of-thought/LogsViewer";
import ResourceAnalysisDialog from "./chain-of-thought/ResourceAnalysisDialog";

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
          <BucketSelector
            buckets={buckets}
            selectedBucket={selectedBucket}
            setSelectedBucket={setSelectedBucket}
            fetchBuckets={fetchBuckets}
            isLoading={isLoading}
          />

          <LogsViewer
            cotLogs={cotLogs}
            selectedBucket={selectedBucket}
            isLoading={isLoading}
            fetchChainOfThought={fetchChainOfThought}
            analyzeResourceUsage={analyzeResourceUsage}
          />
        </div>
      </CardContent>

      <ResourceAnalysisDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        resourceData={resourceData}
        aixValuation={aixValuation}
      />
    </Card>
  );
};

export default ChainOfThoughtViewer;
