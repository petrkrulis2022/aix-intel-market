
import React from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Shield, ExternalLink } from "lucide-react";
import FlareVerificationBadge from "./FlareVerificationBadge";

interface CostEstimationProps {
  costBreakdown: {
    total: number;
    breakdown: {
      cpu: number;
      gpu: number;
      memory?: number;
    };
  } | null;
  selectedProvider: string | null;
  flareVerified: boolean;
  verificationStarted: boolean;
  validating: boolean;
  onVerifyPrices: () => void;
  onShowFlareExplorer: () => void;
}

const CostEstimation: React.FC<CostEstimationProps> = ({
  costBreakdown,
  selectedProvider,
  flareVerified,
  verificationStarted,
  validating,
  onVerifyPrices,
  onShowFlareExplorer
}) => {
  if (!selectedProvider || !costBreakdown) {
    return null;
  }

  return (
    <div className="space-y-2 pt-4 border-t">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Cost Estimate</h3>
        
        {selectedProvider === "primeintellect" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onVerifyPrices}
            disabled={validating || flareVerified}
            className="flex items-center gap-1"
          >
            <Shield className="h-4 w-4" />
            {flareVerified ? "Verified" : validating ? "Verifying..." : "Verify with Flare"}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Cost Breakdown</h4>
          <div className="bg-muted/40 p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">CPU Cost</span>
              <span>${costBreakdown.breakdown.cpu.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">GPU Cost</span>
              <span>${costBreakdown.breakdown.gpu.toFixed(4)}</span>
            </div>
            {costBreakdown.breakdown.memory && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Memory Cost</span>
                <span>${costBreakdown.breakdown.memory.toFixed(4)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Total Cost</h4>
          <div className="bg-primary/10 p-3 rounded-md h-full flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold text-primary">{costBreakdown.total.toFixed(4)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">USD</p>
            </div>
          </div>
        </div>
        
        {(flareVerified || verificationStarted) && selectedProvider === "primeintellect" && (
          <div className="col-span-2 mt-2">
            <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-md flex items-center gap-2 text-green-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm">
                {verificationStarted && !flareVerified 
                  ? "Verification in progress on Flare Network..." 
                  : "Pricing verified by Flare Network JSON API contract"
                }
              </span>
              <Button 
                variant="link" 
                size="sm" 
                onClick={onShowFlareExplorer} 
                className="ml-auto p-0 text-green-600 underline"
              >
                View on explorer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostEstimation;
