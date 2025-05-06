
import React from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { LogOut, Wallet, FileJson } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "./ui/badge";
import NetworkSwitcher from "./NetworkSwitcher";
import { Link } from "react-router-dom";

const Header = () => {
  const { account, connectWallet, disconnectWallet, isConnecting, isFlareNetwork, isRecallNetwork } = useWallet();

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getNetworkBadge = () => {
    if (isFlareNetwork) {
      return (
        <Badge variant="default" className="ml-2 bg-green-600">
          Flare Coston2
        </Badge>
      );
    } else if (isRecallNetwork) {
      return (
        <Badge variant="default" className="ml-2 bg-purple-600">
          Recall Testnet
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="ml-2">
          Wrong Network
        </Badge>
      );
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
          
          {account && getNetworkBadge()}
        </div>

        <div className="flex items-center space-x-3">
          {account && (
            <>
              <NetworkSwitcher />
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-primary/30 flex items-center gap-2"
                      asChild
                    >
                      <Link to="/converter">
                        <FileJson className="h-4 w-4" />
                        <span>JSONL Converter</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Convert Recall JSONL files to JSON with resource estimates</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
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
