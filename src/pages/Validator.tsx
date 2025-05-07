
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ValidatorDashboard from "@/components/dashboards/ValidatorDashboard";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database } from "lucide-react";
import RecallService from "@/services/RecallService";
import { toast } from "@/components/ui/use-toast";
import RecallConfigForm from "@/components/RecallConfigForm";

const Validator = () => {
  const { account, userRole, setUserRole } = useWallet();
  const navigate = useNavigate();
  const [showRecallSetup, setShowRecallSetup] = useState(false);
  const [isPageBusy, setIsPageBusy] = useState(false);
  const [lastUserInteraction, setLastUserInteraction] = useState(Date.now());

  // Redirect if no wallet or wrong role
  React.useEffect(() => {
    if (!account) {
      navigate("/");
    }
  }, [account, navigate]);

  // Record user interactions to detect unresponsive page
  const recordInteraction = useCallback(() => {
    setLastUserInteraction(Date.now());
  }, []);

  // Check Recall configuration on component mount
  useEffect(() => {
    const isRecallConfigured = RecallService.isConfigured();
    if (!isRecallConfigured) {
      setShowRecallSetup(true);
      toast({
        title: "Recall Configuration Required",
        description: "Please configure your Recall Network connection to validate tasks.",
      });
    }

    // Add interaction listeners
    window.addEventListener('mousemove', recordInteraction);
    window.addEventListener('click', recordInteraction);
    window.addEventListener('keydown', recordInteraction);

    return () => {
      window.removeEventListener('mousemove', recordInteraction);
      window.removeEventListener('click', recordInteraction);
      window.removeEventListener('keydown', recordInteraction);
    };
  }, [recordInteraction]);
  
  // Add event listener to detect unresponsive page
  useEffect(() => {
    let checkInterval: number;
    
    if (isPageBusy) {
      let lastResponseTime = Date.now();
      
      const checkPageResponse = () => {
        const now = Date.now();
        const timeSinceLastResponse = now - lastResponseTime;
        const timeSinceUserInteraction = now - lastUserInteraction;
        
        if (timeSinceLastResponse > 5000 && timeSinceUserInteraction < 2000) {
          console.warn("Page may be unresponsive");
          // Show a warning toast if needed
          toast({
            title: "Page is busy",
            description: "The application is processing a heavy task, please wait...",
            duration: 3000,
          });
        }
        
        lastResponseTime = now;
      };
      
      // Check every 2 seconds if page is responsive
      checkInterval = window.setInterval(checkPageResponse, 2000);
    }
    
    return () => {
      if (checkInterval) {
        window.clearInterval(checkInterval);
      }
    };
  }, [isPageBusy, lastUserInteraction]);

  const handleSetupComplete = () => {
    setShowRecallSetup(false);
    toast({
      title: "Setup Complete",
      description: "Recall Network connection configured successfully.",
    });
  };
  
  const handleChangeRole = () => {
    // Clear the user role and navigate to the homepage
    setUserRole(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {account && (
          <>
            <div className="container mx-auto p-4">
              <Button 
                variant="ghost" 
                onClick={handleChangeRole}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Change Role
              </Button>
            </div>
            
            {showRecallSetup ? (
              <div className="container mx-auto px-4 py-6">
                <div className="max-w-lg mx-auto">
                  <div className="flex items-center justify-center mb-6">
                    <Database className="h-16 w-16 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-6">Configure Recall Network</h2>
                  <p className="text-muted-foreground text-center mb-8">
                    As an AIX validator, you need to connect to the Recall Network to access chain of thought logs 
                    and validate resource usage for AIX token calculations.
                  </p>
                  <RecallConfigForm onConfigSaved={handleSetupComplete} />
                  <div className="mt-6 text-center">
                    <Button 
                      variant="link" 
                      onClick={() => setShowRecallSetup(false)}
                    >
                      Skip for now (You can configure later)
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <ValidatorDashboard setPageBusy={setIsPageBusy} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Validator;
