
import React from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { LogOut, Wallet } from "lucide-react";

const Header = () => {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="border-b border-border/40 backdrop-blur-sm bg-background/90 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <h1 className="text-xl font-bold gradient-text">AIX Intel Market</h1>
        </div>

        <div>
          {!account ? (
            <Button 
              onClick={connectWallet} 
              variant="outline" 
              className="border-primary hover:bg-primary/20 transition-all"
              disabled={isConnecting}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full bg-muted text-sm">
                {shortenAddress(account)}
              </span>
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
