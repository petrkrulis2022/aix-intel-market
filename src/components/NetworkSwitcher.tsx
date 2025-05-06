
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Network } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { Badge } from "./ui/badge";

interface NetworkSwitcherProps {
  className?: string;
}

const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({ className }) => {
  const { isFlareNetwork, switchToFlareNetwork } = useWallet();

  const handleSwitchNetwork = async (networkType: 'flare' | 'recall') => {
    if (networkType === 'flare') {
      await switchToFlareNetwork();
    } else {
      // For demo purposes, we'll just show an alert for Recall network
      // In a real implementation, this would connect to the Recall testnet
      alert("Switching to Recall Testnet is not fully implemented yet!");
    }
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-primary/30 flex items-center gap-2"
          >
            <Network className="h-4 w-4" />
            <span>Networks</span>
            {isFlareNetwork ? (
              <Badge variant="default" className="ml-1 bg-green-600 h-5">Flare</Badge>
            ) : (
              <Badge variant="outline" className="ml-1 h-5">Select</Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            className={`flex items-center justify-between ${isFlareNetwork ? 'bg-muted/50' : ''}`} 
            onClick={() => handleSwitchNetwork('flare')}
          >
            <span>Flare Coston2</span>
            {isFlareNetwork && <Badge className="bg-green-600 ml-2">Active</Badge>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSwitchNetwork('recall')}>
            <span>Recall Testnet</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NetworkSwitcher;
