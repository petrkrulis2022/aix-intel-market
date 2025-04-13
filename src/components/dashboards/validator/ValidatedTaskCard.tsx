
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileCheck, Shield, Calculator } from "lucide-react";

interface ValidatedTaskCardProps {
  title: string;
  agent: string;
  submittedDate: string;
  validatedDate: string;
  resources: string;
  claimedValue: string;
  verifiedValue: string;
}

const ValidatedTaskCard: React.FC<ValidatedTaskCardProps> = ({
  title,
  agent,
  submittedDate,
  validatedDate,
  resources,
  claimedValue,
  verifiedValue,
}) => {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Agent: {agent}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">
            Validated
          </Badge>
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
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Listed
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidatedTaskCard;
