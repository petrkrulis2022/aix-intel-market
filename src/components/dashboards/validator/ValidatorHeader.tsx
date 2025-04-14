
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Database, RefreshCw, Info, ShoppingCart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ValidatorHeaderProps {
  onShowRecallConfig: () => void;
  onFindTasks: () => void;
  isLoading?: boolean;
  onAddToMarketplace?: () => void;
}

const ValidatorHeader: React.FC<ValidatorHeaderProps> = ({ 
  onShowRecallConfig, 
  onFindTasks,
  isLoading = false,
  onAddToMarketplace
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-3xl font-bold gradient-text">Agent AIX Dashboard</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-5 w-5 text-muted-foreground hover:text-primary cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>The AIX Validator analyzes agent chain-of-thought logs to determine computational resource usage and calculate appropriate AIX valuations.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onShowRecallConfig}
          className="border-primary/30"
        >
          <Database className="mr-2 h-4 w-4" /> Recall Config
        </Button>
        
        {onAddToMarketplace && (
          <Button 
            variant="outline"
            onClick={onAddToMarketplace}
            className="border-secondary/30 text-secondary hover:text-secondary"
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Marketplace
          </Button>
        )}
        
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
