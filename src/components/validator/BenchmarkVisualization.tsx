
import React from "react";
import { Cpu, FileText } from "lucide-react";

interface BenchmarkVisualizationProps {
  benchmarkData: any | null;
  calculateAIXValue: (data: any) => number;
}

const BenchmarkVisualization: React.FC<BenchmarkVisualizationProps> = ({
  benchmarkData,
  calculateAIXValue
}) => {
  if (!benchmarkData) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No benchmark data available for this task.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-medium">Resource Benchmarks</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Compute Resources</h4>
          <div className="bg-muted/40 p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">CPU Usage</span>
              <span>{(benchmarkData?.benchmarks.compute.cpu.estimatedLoadFactor * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">GPU Usage</span>
              <span>{(benchmarkData?.benchmarks.compute.gpu.estimatedLoadFactor * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Time & Energy</h4>
          <div className="bg-muted/40 p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span>{benchmarkData?.benchmarks.time.totalSeconds.toFixed(2)} seconds</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Energy Consumption</span>
              <span>{(benchmarkData?.benchmarks.energy.consumptionFactor * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
        
        <div className="col-span-2 space-y-2">
          <h4 className="text-sm font-medium">Reasoning Complexity</h4>
          <div className="bg-muted/40 p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Steps</span>
              <span>{benchmarkData?.benchmarks.reasoning.stepCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Complexity Score</span>
              <span>{benchmarkData?.benchmarks.reasoning.complexityScore.toFixed(3)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 space-y-2">
        <h3 className="text-lg font-medium">Estimated AIX Value</h3>
        <div className="bg-primary/10 p-4 rounded-md text-center">
          <span className="text-3xl font-bold text-primary">
            {calculateAIXValue(benchmarkData).toFixed(2)}
          </span>
          <span className="ml-1">AIX</span>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkVisualization;
