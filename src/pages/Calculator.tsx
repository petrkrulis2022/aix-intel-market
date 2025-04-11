
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AixCalculator from "@/components/AixCalculator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator as CalcIcon } from "lucide-react";

const Calculator = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto p-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button>
          
          <div className="my-4">
            <div className="flex items-center gap-2 mb-6">
              <CalcIcon className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold gradient-text">AIX Value Standard</h1>
            </div>
            <p className="text-muted-foreground max-w-3xl mb-6">
              The AIX standard formula quantifies computational resources used by agents into a stable token value. 
              Adjust the parameters below to see how different resource metrics affect the calculated AIX value.
            </p>
            
            <AixCalculator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
