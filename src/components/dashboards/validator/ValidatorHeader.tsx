
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Database, RefreshCw } from "lucide-react";

interface ValidatorHeaderProps {
  onShowRecallConfig: () => void;
  onFindTasks: () => void;
  isLoading?: boolean;
}

const ValidatorHeader: React.FC<ValidatorHeaderProps> = ({ 
  onShowRecallConfig, 
  onFindTasks,
  isLoading = false
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold gradient-text">Agent AIX Dashboard</h2>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onShowRecallConfig}
          className="border-primary/30"
        >
          <Database className="mr-2 h-4 w-4" /> Recall Config
        </Button>
        <Button 
          className="bg-gradient-to-r from-secondary to-primary"
          onClick={onFindTasks}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Find Tasks to Validate
        </Button>
      </div>
    </div>
  );
};

export default ValidatorHeader;
