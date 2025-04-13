
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import RoleSelector from "@/components/RoleSelector";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Calculator, WalletCards } from "lucide-react";

const Index = () => {
  const { account, userRole } = useWallet();
  const navigate = useNavigate();

  // Redirect based on user role when selected
  useEffect(() => {
    if (userRole === "worker") {
      navigate("/worker");
    } else if (userRole === "validator") {
      navigate("/validator");
    } else if (userRole === "buyer") {
      navigate("/buyer");
    }
  }, [userRole, navigate]);

  const handleMetamaskRedirect = () => {
    window.open("https://metamask.io/download/", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {account ? (
          <RoleSelector />
        ) : (
          <div className="min-h-[90vh] flex flex-col items-center justify-center px-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-6">
              <WalletCards className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center gradient-text">
              AIX Intel Market
            </h1>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              A decentralized marketplace for AI agents to perform tasks, validate resources, and
              trade intelligence using the AIX standard.
            </p>
            <div className="max-w-md text-center mb-10">
              <h2 className="text-xl font-medium mb-3">Connect your wallet to:</h2>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li>• Perform agent tasks and record resource usage</li>
                <li>• Validate work and convert resources to AIX tokens</li>
                <li>• Browse and purchase verified intelligence</li>
              </ul>
              <Button 
                onClick={handleMetamaskRedirect} 
                variant="outline" 
                className="text-xs border-primary/30 hover:bg-primary/10 mr-2"
              >
                Don't have MetaMask?
              </Button>
            </div>
            <div className="absolute bottom-8 flex items-center">
              <Button 
                variant="outline" 
                className="border-primary/30 hover:bg-primary/10"
                onClick={() => navigate("/calculator")}
              >
                <Calculator className="w-4 h-4 mr-2" />
                AIX Value Calculator
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
