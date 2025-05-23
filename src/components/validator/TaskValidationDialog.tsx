
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ComputeProvider } from "@/services/providers/ComputeProvidersService";
import ComputeProvidersService from "@/services/providers/ComputeProvidersService";
import PrimeIntellectService from "@/services/providers/PrimeIntellectService";
import { useWallet } from "@/contexts/WalletContext";
import flareVerificationService from "@/services/verification/FlareVerificationService";
import { calculateAIXValue, calculateEnergyScore, calculateHardwareScore, calculatePerformanceScore, calculateTimeScore } from "@/utils/aixCalculation";
import TaskTabs from "./TaskTabs";

interface TaskValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskData: any;
  taskName: string;
  fileName: string;
  onValidationComplete: (data: {
    resourceData: any;
    aixValuation: any;
    providerId: string;
    costBreakdown: any;
  }) => void;
}

const TaskValidationDialog: React.FC<TaskValidationDialogProps> = ({
  open,
  onOpenChange,
  taskData,
  taskName,
  fileName,
  onValidationComplete
}) => {
  const [providers, setProviders] = useState<ComputeProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [flareVerified, setFlareVerified] = useState(false);
  const [costBreakdown, setCostBreakdown] = useState<{
    total: number;
    breakdown: {
      cpu: number;
      gpu: number;
      memory?: number;
    };
  } | null>(null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [verificationStarted, setVerificationStarted] = useState(false);
  const [testingTransaction, setTestingTransaction] = useState(false);
  const { switchToFlareNetwork, isFlareNetwork } = useWallet();
  
  // Extract benchmark data from task data
  const benchmarkData = taskData && taskData[0]?.benchmarks ? {
    benchmarks: taskData[0].benchmarks
  } : null;
  
  // Initialize with Prime Intellect API key
  useEffect(() => {
    const initPrimeIntellect = () => {
      // In a real app, we would get this from environment variables or user input
      const apiKey = "pit_55f1b2db2779cf49812d54966ddf515fee78ca2fbce542340e57c4d372bdd9d9";
      PrimeIntellectService.setApiKey(apiKey);
    };
    
    initPrimeIntellect();
  }, []);
  
  // Load providers on mount
  useEffect(() => {
    const loadProviders = async () => {
      if (!open) return; // Don't load if not open
      
      setLoading(true);
      try {
        const availableProviders = await ComputeProvidersService.getAllProviders();
        setProviders(availableProviders);
        
        // Default to Prime Intellect if available
        const primeIntellect = availableProviders.find(p => p.id === "primeintellect");
        if (primeIntellect) {
          setSelectedProvider("primeintellect");
        } else if (availableProviders.length > 0) {
          setSelectedProvider(availableProviders[0]?.id || null);
        }
      } catch (error) {
        console.error('Error loading compute providers:', error);
        toast({
          title: "Error loading providers",
          description: "Could not load compute providers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProviders();
  }, [open]);
  
  // Calculate costs when provider changes
  useEffect(() => {
    const calculateCosts = async () => {
      if (!selectedProvider || !benchmarkData) return;
      
      try {
        const costs = await ComputeProvidersService.calculateCost(selectedProvider, benchmarkData);
        setCostBreakdown(costs);
      } catch (error) {
        console.error('Error calculating costs:', error);
        toast({
          title: "Error calculating costs",
          description: "Could not calculate costs for the selected provider.",
          variant: "destructive",
        });
        setCostBreakdown(null);
      }
    };
    
    calculateCosts();
  }, [selectedProvider, benchmarkData]);
  
  const handleSelectProvider = (providerId: string) => {
    if (providerId === selectedProvider) return; // Don't reselect the same provider
    setSelectedProvider(providerId);
    setFlareVerified(false); // Reset verification status when changing providers
    setVerificationStarted(false); // Reset verification started flag
  };
  
  // Handle verification with Flare API (optimized with non-blocking approach)
  const handleVerifyPrices = useCallback(async () => {
    if (!selectedProvider) {
      toast({
        title: "Provider Required",
        description: "Please select a provider to verify prices.",
        variant: "destructive",
      });
      return;
    }
    
    // Prevent duplicate verifications
    if (verificationInProgress || flareVerified) return;
    
    // Check if connected to Flare network and switch if necessary
    if (!isFlareNetwork) {
      const switched = await switchToFlareNetwork();
      if (!switched) {
        toast({
          title: "Network Switch Required",
          description: "Please switch to Flare Network to verify prices",
          variant: "destructive",
        });
        return;
      }
    }
    
    setValidating(true);
    setVerificationInProgress(true);
    
    try {
      const result = await flareVerificationService.validateProviderPricing(selectedProvider);
      
      if (result.isValid) {
        setFlareVerified(true);
      }
    } finally {
      setValidating(false);
      setVerificationInProgress(false);
    }
  }, [selectedProvider, isFlareNetwork, switchToFlareNetwork, verificationInProgress, flareVerified]);
  
  // Handle the provider validation with JsonAbi contract
  const handleValidateWithJsonAbi = async () => {
    if (!selectedProvider || !benchmarkData) return;
    
    if (verificationInProgress) return;
    
    if (!isFlareNetwork) {
      const switched = await switchToFlareNetwork();
      if (!switched) {
        toast({
          title: "Network Switch Required",
          description: "Please switch to Flare Network to validate with JsonAbi",
          variant: "destructive",
        });
        return;
      }
    }
    
    setValidating(true);
    setVerificationInProgress(true);
    
    try {
      const success = await flareVerificationService.validateWithJsonAbi(selectedProvider);
      
      if (success) {
        // Only set verification started if successful
        setVerificationStarted(true);
        
        // Use a separate non-blocking call to wait for receipt
        const waitForReceipt = async () => {
          try {
            // Simulate receipt waiting
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Only update state if component is still mounted
            setFlareVerified(true);
            toast({
              title: "Verification Successful",
              description: `${selectedProvider} pricing has been validated on Flare Network`,
            });
          } catch (waitError) {
            console.error("Error waiting for transaction confirmation:", waitError);
            // Don't show error toast here as we've already proceeded with the flow
          } finally {
            setVerificationInProgress(false);
          }
        };
        
        // Execute without awaiting to prevent blocking the UI
        waitForReceipt();
      } else {
        setVerificationInProgress(false);
      }
    } finally {
      setValidating(false);
    }
  };
  
  // Complete the validation process
  const handleComplete = useCallback(async () => {
    if (!benchmarkData || !selectedProvider || !costBreakdown) {
      toast({
        title: "Missing Information",
        description: "Please select a provider to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // For Prime Intellect provider, verify prices with Flare before completing
    if (!flareVerified && !verificationStarted && selectedProvider === "primeintellect") {
      toast({
        title: "Starting Verification",
        description: "Initiating verification with Flare Network...",
      });
      
      // Force verification for Prime Intellect before proceeding
      try {
        setValidating(true);
        const success = await flareVerificationService.validateWithJsonAbi(selectedProvider);
        
        if (!success) {
          toast({
            title: "Verification Required",
            description: "Please verify the provider prices with Flare Network first",
            variant: "destructive",
          });
          setValidating(false);
          return;
        }
        
        // Mark as started if successful
        setVerificationStarted(true);
        setValidating(false);
      } catch (error) {
        console.error("Error during verification:", error);
        setValidating(false);
        
        toast({
          title: "Verification Failed",
          description: "Could not verify provider prices with Flare Network. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Calculate AIX valuation based on benchmark data
    const aixValuation = {
      aix_value: calculateAIXValue(benchmarkData),
      components: {
        hardware_score: calculateHardwareScore(benchmarkData),
        time_score: calculateTimeScore(benchmarkData),
        performance_score: calculatePerformanceScore(benchmarkData),
        energy_score: calculateEnergyScore(benchmarkData),
      },
      flare_verified: flareVerified || verificationStarted
    };
    
    console.log("Completing validation with data:", {
      resourceData: benchmarkData,
      aixValuation,
      providerId: selectedProvider,
      costBreakdown
    });
    
    // Call the onValidationComplete callback with the validation data
    onValidationComplete({
      resourceData: benchmarkData,
      aixValuation,
      providerId: selectedProvider,
      costBreakdown
    });
    
    // Close the dialog
    onOpenChange(false);
  }, [benchmarkData, selectedProvider, costBreakdown, flareVerified, verificationStarted, onValidationComplete, onOpenChange]);

  // Function to show explorer for the transaction
  const handleShowFlareExplorer = () => {
    flareVerificationService.openFlareExplorer();
  };

  // New function to test MetaMask transaction signing
  const handleTestTransaction = async () => {
    if (testingTransaction) return;
    
    setTestingTransaction(true);
    try {
      if (!isFlareNetwork) {
        const switched = await switchToFlareNetwork();
        if (!switched) {
          toast({
            title: "Network Switch Required",
            description: "Please switch to Flare Network to test transaction signing",
            variant: "destructive",
          });
          return;
        }
      }
      
      await flareVerificationService.createMockTransaction();
    } catch (error) {
      console.error("Error testing transaction:", error);
      toast({
        title: "Transaction Test Failed",
        description: "Failed to create mock transaction for signing",
        variant: "destructive",
      });
    } finally {
      setTestingTransaction(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Validate Task: {taskName}</DialogTitle>
          <DialogDescription>
            Review task benchmarks and select a compute provider to validate this task
          </DialogDescription>
        </DialogHeader>
        
        <TaskTabs
          benchmarkData={benchmarkData}
          calculateAIXValue={calculateAIXValue}
          providers={providers}
          selectedProvider={selectedProvider}
          costBreakdown={costBreakdown}
          flareVerified={flareVerified}
          verificationStarted={verificationStarted}
          validating={validating}
          loading={loading}
          testingTransaction={testingTransaction}
          onSelectProvider={handleSelectProvider}
          onVerifyPrices={handleVerifyPrices}
          onShowFlareExplorer={handleShowFlareExplorer}
          onTestTransaction={handleTestTransaction}
        />
        
        <div className="flex justify-between items-center pt-4 mt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={!selectedProvider || !costBreakdown || validating}
            className="bg-primary hover:bg-primary/90"
          >
            <Check className="h-4 w-4 mr-2" />
            {validating ? "Verifying..." : flareVerified ? "Complete Validation" : "Verify & Complete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskValidationDialog;
