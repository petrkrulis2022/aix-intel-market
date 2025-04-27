
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

interface RecallPortalInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecallPortalInfoDialog: React.FC<RecallPortalInfoDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { account } = useWallet();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Recall Portal Instructions</DialogTitle>
          <DialogDescription>
            How to access chain of thought logs in the Recall Portal
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {account && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Connected wallet:</span> {account}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your wallet is automatically connected to the Recall Portal
              </p>
            </div>
          )}
          
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Sign in to the Recall Portal with the same wallet address</li>
            <li>Navigate to the Buckets section</li>
            <li>Select the bucket containing your agent's chain of thought logs</li>
            <li>Look for files with the prefix "cot/" to find chain of thought logs</li>
            <li>Download or view the logs to analyze resource usage</li>
            <li>Return to this dashboard to calculate AIX values based on the analysis</li>
          </ol>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button 
            onClick={() => window.open("https://portal.recall.network/buckets", "_blank")}
            className="flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Recall Portal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecallPortalInfoDialog;
