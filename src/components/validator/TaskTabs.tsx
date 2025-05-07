
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BenchmarkVisualization from "./BenchmarkVisualization";
import ProviderSelector from "./ProviderSelector";
import CostEstimation from "./CostEstimation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComputeProvider } from "@/services/providers/ComputeProvidersService";

interface TaskTabsProps {
  benchmarkData: any;
  calculateAIXValue: (data: any) => number;
  providers: ComputeProvider[];
  selectedProvider: string | null;
  costBreakdown: any;
  flareVerified: boolean;
  verificationStarted: boolean;
  validating: boolean;
  loading: boolean;
  testingTransaction: boolean;
  onSelectProvider: (providerId: string) => void;
  onVerifyPrices: () => void;
  onShowFlareExplorer: () => void;
  onTestTransaction: () => void;
}

const TaskTabs: React.FC<TaskTabsProps> = ({
  benchmarkData,
  calculateAIXValue,
  providers,
  selectedProvider,
  costBreakdown,
  flareVerified,
  verificationStarted,
  validating,
  loading,
  testingTransaction,
  onSelectProvider,
  onVerifyPrices,
  onShowFlareExplorer,
  onTestTransaction
}) => {
  return (
    <Tabs defaultValue="benchmarks" className="mt-4">
      <TabsList>
        <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
        <TabsTrigger value="providers">Compute Providers</TabsTrigger>
        <TabsTrigger value="test">Test Wallet</TabsTrigger>
      </TabsList>
      
      <TabsContent value="benchmarks">
        <BenchmarkVisualization 
          benchmarkData={benchmarkData} 
          calculateAIXValue={calculateAIXValue} 
        />
      </TabsContent>
      
      <TabsContent value="providers">
        <div className="space-y-6 mt-4">
          <ProviderSelector
            providers={providers}
            selectedProvider={selectedProvider}
            onSelectProvider={onSelectProvider}
            loading={loading}
          />
          
          {selectedProvider && costBreakdown && (
            <CostEstimation
              costBreakdown={costBreakdown}
              selectedProvider={selectedProvider}
              flareVerified={flareVerified}
              verificationStarted={verificationStarted}
              validating={validating}
              onVerifyPrices={onVerifyPrices}
              onShowFlareExplorer={onShowFlareExplorer}
            />
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="test">
        <div className="space-y-6 mt-4 p-4 border rounded-lg bg-muted/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Wallet Connection Testing</h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            If your page becomes unresponsive during validation, you can test your MetaMask connection 
            here without performing any real transactions. This will prompt MetaMask to sign a mock 
            transaction (0 FLR) without sending it to the blockchain.
          </p>
          
          <Button
            onClick={onTestTransaction}
            disabled={testingTransaction}
            variant="outline"
            className="w-full"
          >
            {testingTransaction ? "Testing..." : "Test MetaMask Signing"}
          </Button>
          
          <div className="text-xs text-muted-foreground mt-2">
            Note: This will only prompt for signing and will not send any actual transactions.
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TaskTabs;
