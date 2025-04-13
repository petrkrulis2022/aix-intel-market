
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Brain, Calculator } from "lucide-react";

interface LogsViewerProps {
  cotLogs: string[];
  selectedBucket: string;
  isLoading: boolean;
  fetchChainOfThought: () => Promise<void>;
  analyzeResourceUsage: () => Promise<void>;
}

const LogsViewer: React.FC<LogsViewerProps> = ({
  cotLogs,
  selectedBucket,
  isLoading,
  fetchChainOfThought,
  analyzeResourceUsage,
}) => {
  if (cotLogs.length === 0) {
    return (
      <div className="flex justify-center mt-4">
        <Button onClick={fetchChainOfThought} disabled={isLoading || !selectedBucket}>
          <Brain className="w-4 h-4 mr-2" />
          View Chain of Thought
        </Button>
      </div>
    );
  }

  return (
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
  );
};

export default LogsViewer;
