
/**
 * Service for interacting with Flare Network smart contracts
 */

import { ethers } from "ethers";

interface FlareNetworkConfig {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

class FlareService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  
  // Flare Coston2 Network configuration
  private readonly FLARE_CONFIG: FlareNetworkConfig = {
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

  constructor() {
    this.initProvider();
  }

  /**
   * Initialize ethers provider for Flare network
   */
  private async initProvider() {
    if (window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        
        // Check if connected to the correct network
        const network = await this.provider.getNetwork();
        const isFlare = network.chainId.toString() === parseInt(this.FLARE_CONFIG.chainId, 16).toString();
        
        if (!isFlare) {
          console.warn("Not connected to Flare Coston2 network");
        } else {
          console.log("Connected to Flare Coston2 network");
          
          // Get signer if connected to Flare
          const accounts = await this.provider.listAccounts();
          if (accounts.length > 0) {
            this.signer = await this.provider.getSigner();
          }
        }
      } catch (error) {
        console.error("Error initializing Flare provider:", error);
      }
    } else {
      console.warn("Ethereum provider not found. Please install MetaMask.");
    }
  }

  /**
   * Get the current ethers provider
   */
  async getProvider() {
    if (!this.provider) {
      await this.initProvider();
    }
    return this.provider;
  }
  
  /**
   * Get the current signer
   */
  async getSigner() {
    if (!this.signer) {
      await this.initProvider();
    }
    return this.signer;
  }

  /**
   * Check if connected to Flare network
   */
  async isFlareNetwork(): Promise<boolean> {
    try {
      if (!this.provider) await this.initProvider();
      if (!this.provider) return false;
      
      const network = await this.provider.getNetwork();
      return network.chainId.toString() === parseInt(this.FLARE_CONFIG.chainId, 16).toString();
    } catch (error) {
      console.error("Error checking Flare network:", error);
      return false;
    }
  }

  /**
   * Get account balance in FLR
   */
  async getBalance(address: string): Promise<string> {
    try {
      if (!this.provider) await this.initProvider();
      if (!this.provider) return "0";
      
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
      return "0";
    }
  }

  /**
   * Interface for interacting with smart contracts on Flare network
   */
  async getContract(address: string, abi: any) {
    try {
      if (!this.provider) await this.initProvider();
      if (!this.provider) throw new Error("Provider not initialized");
      
      if (!this.signer) {
        this.signer = await this.provider.getSigner();
      }
      
      return new ethers.Contract(address, abi, this.signer);
    } catch (error) {
      console.error("Error getting contract:", error);
      throw error;
    }
  }
}

// Create a singleton instance
const flareService = new FlareService();
export default flareService;

// Re-export ethers for convenience
export { ethers };
