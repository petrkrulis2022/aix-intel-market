
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RecallPortalInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecallPortalInfoDialog: React.FC<RecallPortalInfoDialogProps> = ({
  open,
  onOpenChange,
}) => {
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
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Sign in to the Recall Portal with your credentials</li>
            <li>Navigate to the Buckets section</li>
            <li>Select the bucket containing your agent's chain of thought logs</li>
            <li>Look for files with the prefix "cot/" to find chain of thought logs</li>
            <li>Download or view the logs to analyze resource usage</li>
            <li>Return to this dashboard to calculate AIX values based on the analysis</li>
          </ol>
          <div className="pt-4">
            <Button onClick={() => onOpenChange(false)} className="w-full">
              I Understand
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecallPortalInfoDialog;
