
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import WorkerDashboard from "@/components/dashboards/WorkerDashboard";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import AgentConfigDialog from "@/components/worker/AgentConfigDialog";

const Worker = () => {
  const { account } = useWallet();
  const navigate = useNavigate();
  const [showAgentConfig, setShowAgentConfig] = useState(false);

  // Redirect if no wallet
  React.useEffect(() => {
    if (!account) {
      navigate("/");
    }
  }, [account, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {account && (
          <>
            <div className="container mx-auto p-4 flex justify-between items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Change Role
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowAgentConfig(true)}
                className="mb-4"
              >
                <Settings className="h-4 w-4 mr-2" /> Configure Agent
              </Button>
            </div>
            <WorkerDashboard />
            <AgentConfigDialog open={showAgentConfig} onOpenChange={setShowAgentConfig} />
          </>
        )}
      </div>
    </div>
  );
};

export default Worker;
