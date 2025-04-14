
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Brain, Calculator, Folder, FileJson } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LogsViewerProps {
  cotLogs: string[];
  logFiles: string[];
  selectedBucket: string;
  selectedLogFile: string;
  setSelectedLogFile: (file: string) => void;
  isLoading: boolean;
  fetchLogFiles: () => Promise<void>;
  fetchChainOfThought: () => Promise<void>;
  analyzeResourceUsage: () => Promise<void>;
}

const LogsViewer: React.FC<LogsViewerProps> = ({
  cotLogs,
  logFiles,
  selectedBucket,
  selectedLogFile,
  setSelectedLogFile,
  isLoading,
  fetchLogFiles,
  fetchChainOfThought,
  analyzeResourceUsage,
}) => {
  // Show log files if no specific file is selected yet
  if (!selectedLogFile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Chain of Thought Log Files</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchLogFiles} 
            disabled={isLoading || !selectedBucket}
          >
            <Folder className="w-4 h-4 mr-2" />
            Refresh Files
          </Button>
        </div>
        
        {logFiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {isLoading ? 
              "Loading log files..." : 
              "No log files found in this bucket. Select a bucket and click Refresh Files."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Log File</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logFiles.map((file, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileJson className="h-4 w-4 mr-2 text-blue-500" />
                      {file}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedLogFile(file)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  }

  // Show log content if a file is selected
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium flex items-center">
          <FileJson className="h-4 w-4 mr-2 text-blue-500" />
          {selectedLogFile}
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedLogFile("")}
        >
          Back to Files
        </Button>
      </div>
      
      <ScrollArea className="h-64 rounded-md border p-4">
        <div className="space-y-2">
          {cotLogs.length === 0 ? (
            <div className="flex justify-center py-8">
              <Button onClick={fetchChainOfThought} disabled={isLoading}>
                <Brain className="w-4 h-4 mr-2" />
                Load Log Content
              </Button>
            </div>
          ) : (
            cotLogs.map((log, index) => (
              <div key={index} className="py-1 border-b border-border/30 last:border-0">
                <p className="text-sm">{log}</p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      {cotLogs.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button onClick={analyzeResourceUsage} disabled={isLoading}>
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Resource Usage
          </Button>
        </div>
      )}
    </div>
  );
};

export default LogsViewer;
