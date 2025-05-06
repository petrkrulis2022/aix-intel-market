
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type UserRole = "worker" | "validator" | "buyer" | null;

// Network configurations
const FLARE_COSTON2_CONFIG = {
  chainId: "0x72", // 114 in hex
  chainName: "Flare Testnet Coston2",
  nativeCurrency: {
    name: "Flare",
    symbol: "FLR",
    decimals: 18
  },
  rpcUrls: ["https://coston2-api.flare.network/ext/C/rpc"],
  blockExplorerUrls: ["https://coston2.testnet.flare-scan.com/"]
};

const RECALL_TESTNET_CONFIG = {
  chainId: "0x13E31", // 81457 in hex
  chainName: "Recall Testnet",
  nativeCurrency: {
    name: "Recall",
    symbol: "REC",
    decimals: 18
  },
  rpcUrls: ["https://testnet-rpc.recall.network"],
  blockExplorerUrls: ["https://explorer.recall.network"]
};

interface WalletContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isConnecting: boolean;
  switchToFlareNetwork: () => Promise<boolean>;
  switchToRecallNetwork: () => Promise<boolean>;
  isFlareNetwork: boolean;
  isRecallNetwork: boolean;
  currentNetwork: "flare" | "recall" | "unknown";
}

// Create context with a default undefined value
const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isFlareNetwork, setIsFlareNetwork] = useState(false);
  const [isRecallNetwork, setIsRecallNetwork] = useState(false);

  // Current network type
  const currentNetwork = isFlareNetwork ? "flare" : isRecallNetwork ? "recall" : "unknown";

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== "undefined" && window.ethereum !== undefined;
  };

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${shortenAddress(accounts[0])}`,
        });
        
        // Check current network
        await checkNetwork();
      }
    } catch (error: any) {
      console.error("Error connecting to MetaMask:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to your wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setUserRole(null);
    setIsFlareNetwork(false);
    setIsRecallNetwork(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Check which network is connected
  const checkNetwork = async () => {
    if (!isMetaMaskInstalled() || !account) return false;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const flareChainId = FLARE_COSTON2_CONFIG.chainId; // Hex value of 114
      const recallChainId = RECALL_TESTNET_CONFIG.chainId; // Hex value of 81457
      
      const isFlare = chainId === flareChainId;
      const isRecall = chainId === recallChainId;
      
      setIsFlareNetwork(isFlare);
      setIsRecallNetwork(isRecall);
      
      return isFlare || isRecall;
    } catch (error) {
      console.error("Error checking network:", error);
      return false;
    }
  };

  // Switch to Flare Coston2 network
  const switchToFlareNetwork = async () => {
    if (!isMetaMaskInstalled() || !account) return false;
    
    try {
      // Check if already on Flare network
      if (isFlareNetwork) return true;
      
      // Try to switch to the Flare network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: FLARE_COSTON2_CONFIG.chainId }],
        });
        
        // Verify the switch was successful
        const success = await checkNetwork();
        if (success && isFlareNetwork) {
          toast({
            title: "Network Changed",
            description: "Successfully connected to Flare Testnet Coston2",
          });
          return true;
        }
        return false;
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [FLARE_COSTON2_CONFIG],
            });
            
            // Verify the addition and switch was successful
            const success = await checkNetwork();
            if (success && isFlareNetwork) {
              toast({
                title: "Network Added",
                description: "Successfully added and connected to Flare Testnet Coston2",
              });
              return true;
            }
            return false;
          } catch (addError) {
            console.error("Error adding Flare network:", addError);
            toast({
              title: "Network Addition Failed",
              description: "Failed to add Flare Testnet Coston2 to your wallet",
              variant: "destructive",
            });
            return false;
          }
        } else {
          console.error("Error switching to Flare network:", switchError);
          toast({
            title: "Network Switch Failed",
            description: "Failed to switch to Flare Testnet Coston2",
            variant: "destructive",
          });
          return false;
        }
      }
    } catch (error) {
      console.error("Error in switchToFlareNetwork:", error);
      return false;
    }
  };

  // Switch to Recall testnet network
  const switchToRecallNetwork = async () => {
    if (!isMetaMaskInstalled() || !account) return false;
    
    try {
      // Check if already on Recall network
      if (isRecallNetwork) return true;
      
      // Try to switch to the Recall network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: RECALL_TESTNET_CONFIG.chainId }],
        });
        
        // Verify the switch was successful
        const success = await checkNetwork();
        if (success && isRecallNetwork) {
          toast({
            title: "Network Changed",
            description: "Successfully connected to Recall Testnet",
          });
          return true;
        }
        return false;
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [RECALL_TESTNET_CONFIG],
            });
            
            // Verify the addition and switch was successful
            const success = await checkNetwork();
            if (success && isRecallNetwork) {
              toast({
                title: "Network Added",
                description: "Successfully added and connected to Recall Testnet",
              });
              return true;
            }
            return false;
          } catch (addError) {
            console.error("Error adding Recall network:", addError);
            toast({
              title: "Network Addition Failed",
              description: "Failed to add Recall Testnet to your wallet",
              variant: "destructive",
            });
            return false;
          }
        } else {
          console.error("Error switching to Recall network:", switchError);
          toast({
            title: "Network Switch Failed",
            description: "Failed to switch to Recall Testnet",
            variant: "destructive",
          });
          return false;
        }
      }
    } catch (error) {
      console.error("Error in switchToRecallNetwork:", error);
      return false;
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else if (accounts[0] !== account) {
          // User switched accounts
          setAccount(accounts[0]);
          toast({
            title: "Account Changed",
            description: `Switched to ${shortenAddress(accounts[0])}`,
          });
          
          // Check network after account change
          checkNetwork();
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            // Check network when accounts are detected
            checkNetwork();
          }
        })
        .catch((err: Error) => console.error("Error checking accounts:", err));

      return () => {
        if (isMetaMaskInstalled()) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, [account]);

  // Handle chain changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleChainChanged = (chainId: string) => {
        const flareChainId = FLARE_COSTON2_CONFIG.chainId;
        const recallChainId = RECALL_TESTNET_CONFIG.chainId;
        
        const isFlare = chainId === flareChainId;
        const isRecall = chainId === recallChainId;
        
        setIsFlareNetwork(isFlare);
        setIsRecallNetwork(isRecall);
        
        // Reload the page on chain change as recommended by MetaMask
        window.location.reload();
      };

      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (isMetaMaskInstalled()) {
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  // Shorten address for display
  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const updateUserRole = (role: UserRole) => {
    console.log("Setting user role:", role);
    setUserRole(role);
  };

  // Create context value object
  const contextValue: WalletContextType = {
    account,
    connectWallet,
    disconnectWallet,
    userRole,
    setUserRole: updateUserRole,
    isConnecting,
    switchToFlareNetwork,
    switchToRecallNetwork,
    isFlareNetwork,
    isRecallNetwork,
    currentNetwork
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
