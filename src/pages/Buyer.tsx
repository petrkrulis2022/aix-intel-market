
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BuyerDashboard from "@/components/dashboards/BuyerDashboard";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Buyer = () => {
  const { account, setUserRole } = useWallet();
  const navigate = useNavigate();

  // Redirect if no wallet or wrong role
  React.useEffect(() => {
    if (!account) {
      navigate("/");
    }
  }, [account, navigate]);
  
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
            <BuyerDashboard />
          </>
        )}
      </div>
    </div>
  );
};

export default Buyer;
