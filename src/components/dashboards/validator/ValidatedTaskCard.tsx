
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileCheck, Shield, Calculator, ShoppingCart, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import FlareVerificationBadge from "@/components/validator/FlareVerificationBadge";

interface ValidatedTaskCardProps {
  title: string;
  agent: string;
  submittedDate: string;
  validatedDate: string;
  resources: string;
  claimedValue: string;
  verifiedValue: string;
  onAddToMarketplace?: () => void;
  isListed?: boolean;
  isFlareVerified?: boolean;
  providerId?: string;
}

const ValidatedTaskCard: React.FC<ValidatedTaskCardProps> = ({
  title,
  agent,
  submittedDate,
  validatedDate,
  resources,
  claimedValue,
  verifiedValue,
  onAddToMarketplace,
  isListed = false,
  isFlareVerified = false,
  providerId
}) => {
  const handleAddToMarketplace = () => {
    if (onAddToMarketplace) {
      onAddToMarketplace();
    } else {
      toast({
        title: "Added to Marketplace",
        description: `Task "${title}" has been listed on the marketplace with ${verifiedValue} AIX value.`,
      });
    }
  };
  
  const handleOpenFlareExplorer = () => {
    window.open("https://coston2-explorer.flare.network/address/0xfC3E77Ef092Fe649F3Dbc22A11aB8a986d3a2F2F", "_blank");
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Agent: {agent}</CardDescription>
          </div>
          <div className="flex gap-2 items-center">
            {isFlareVerified && (
              <FlareVerificationBadge 
                isVerified={isFlareVerified} 
                providerId={providerId} 
                size="sm" 
                onClick={handleOpenFlareExplorer}
              />
            )}
            <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">
              Validated
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Submitted:</span>
                <span>{submittedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Validated:</span>
                <span>{validatedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Resources:</span>
                <span>{resources}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Claimed Value:</span>
                <span>{claimedValue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Verified Value:</span>
                <span className="font-medium text-primary">{verifiedValue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="flex items-center text-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> {isListed ? "Listed on Marketplace" : "Ready"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex mt-2 gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <FileCheck className="h-4 w-4 mr-2" /> View Report
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Shield className="h-4 w-4 mr-2" /> Validation History
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Calculator className="h-4 w-4 mr-2" /> AIX Calculation
            </Button>
          </div>
          
          {!isListed && (
            <Button 
              variant="default" 
              size="sm" 
              className="w-full mt-2 bg-gradient-to-r from-primary to-secondary"
              onClick={handleAddToMarketplace}
            >
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Marketplace
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidatedTaskCard;
