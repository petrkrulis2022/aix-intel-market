
import React from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { LogOut, Wallet, Network } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "./ui/badge";

const Header = () => {
  const { account, connectWallet, disconnectWallet, isConnecting, switchToFlareNetwork, isFlareNetwork } = useWallet();

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleSwitchNetwork = async () => {
    if (account) {
      await switchToFlareNetwork();
    } else {
      await connectWallet();
    }
  };

  return (
    <header className="border-b border-border/40 backdrop-blur-sm bg-background/90 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <h1 className="text-xl font-bold gradient-text">AIX Intel Market</h1>
          
          {account && (
            <Badge 
              variant={isFlareNetwork ? "default" : "outline"}
              className={`ml-2 ${isFlareNetwork ? "bg-green-600" : ""}`}
            >
              {isFlareNetwork ? "Flare Coston2" : "Wrong Network"}
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!isFlareNetwork && account && (
            <Button 
              onClick={handleSwitchNetwork} 
              variant="outline" 
              size="sm"
              className="mr-2 border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
            >
              <Network className="w-4 h-4 mr-2" />
              Switch to Flare
            </Button>
          )}
          
          {!account ? (
            <Button 
              onClick={connectWallet} 
              variant="default" 
              className="relative overflow-hidden group"
              disabled={isConnecting}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-secondary to-primary opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center">
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </div>
            </Button>
          ) : (
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="px-3 py-1 rounded-full bg-muted text-sm cursor-pointer hover:bg-muted/70 transition-colors">
                      {shortenAddress(account)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{account}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                onClick={disconnectWallet} 
                variant="ghost" 
                size="icon"
                className="hover:bg-destructive/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
