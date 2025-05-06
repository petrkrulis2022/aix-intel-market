
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
  const { 
    isFlareNetwork, 
    isRecallNetwork, 
    switchToFlareNetwork, 
    switchToRecallNetwork,
    currentNetwork
  } = useWallet();

  const handleSwitchNetwork = async (networkType: 'flare' | 'recall') => {
    if (networkType === 'flare') {
      await switchToFlareNetwork();
    } else {
      await switchToRecallNetwork();
    }
  };

  // Determine the current network badge label
  const getNetworkBadge = () => {
    if (isFlareNetwork) {
      return <Badge variant="default" className="ml-1 bg-green-600 h-5">Flare</Badge>;
    } else if (isRecallNetwork) {
      return <Badge variant="default" className="ml-1 bg-purple-600 h-5">Recall</Badge>;
    } else {
      return <Badge variant="outline" className="ml-1 h-5">Select</Badge>;
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
            {getNetworkBadge()}
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
          <DropdownMenuItem 
            className={`flex items-center justify-between ${isRecallNetwork ? 'bg-muted/50' : ''}`}
            onClick={() => handleSwitchNetwork('recall')}
          >
            <span>Recall Testnet</span>
            {isRecallNetwork && <Badge className="bg-purple-600 ml-2">Active</Badge>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NetworkSwitcher;
