
import React from "react";
import JsonlConverterTool from "@/components/recall/JsonlConverterTool";

const Converter = () => {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chain of Thought Converter</h1>
          <p className="text-muted-foreground">
            Convert Recall Network JSONL logs to JSON format with resource usage estimates
          </p>
        </div>
        
        <JsonlConverterTool />
        
        <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
          <h2 className="text-lg font-medium mb-2">About this tool</h2>
          <p className="text-sm text-muted-foreground mb-2">
            This tool allows you to convert Chain of Thought logs from Recall Network's JSONL format to 
            JSON format with added resource usage estimates. The estimates are calculated based on:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Token count (words in the log)</li>
            <li>Complexity indicators (LLM operations, mathematical calculations)</li>
            <li>Estimated execution time</li>
          </ul>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> These estimates are approximate and meant to demonstrate the AIX valuation concept. 
              In a production environment, more sophisticated metrics would be used for precise resource measurement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
