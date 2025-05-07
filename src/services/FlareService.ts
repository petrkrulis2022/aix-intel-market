
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

  /**
   * Deploy a contract to the Flare Coston2 testnet
   * @param contractABI The ABI of the contract
   * @param contractBytecode The bytecode of the contract
   * @param constructorArgs The constructor arguments for the contract
   * @returns The deployed contract instance and transaction receipt
   */
  async deployContract(
    contractABI: any,
    contractBytecode: string,
    constructorArgs: any[] = []
  ): Promise<{
    contract: any; // Changed from ethers.Contract to any to fix TypeScript error
    receipt: ethers.TransactionReceipt;
    address: string;
  }> {
    try {
      if (!this.provider) await this.initProvider();
      if (!this.provider) throw new Error("Provider not initialized");
      
      if (!this.signer) {
        this.signer = await this.provider.getSigner();
      }
      
      // Check if we're on the Flare network
      const isFlare = await this.isFlareNetwork();
      if (!isFlare) {
        throw new Error("Please connect to Flare Coston2 network before deploying contracts");
      }
      
      // Create contract factory
      const factory = new ethers.ContractFactory(
        contractABI,
        contractBytecode,
        this.signer
      );
      
      // Deploy with constructor arguments if any
      const contract = constructorArgs.length > 0
        ? await factory.deploy(...constructorArgs)
        : await factory.deploy();
      
      // Wait for deployment to complete
      const receipt = await contract.deploymentTransaction()?.wait();
      if (!receipt) {
        throw new Error("Failed to get deployment transaction receipt");
      }
      
      const address = await contract.getAddress();
      
      console.log("Contract deployed at:", address);
      return { 
        contract, 
        receipt, 
        address 
      };
    } catch (error) {
      console.error("Error deploying contract:", error);
      throw error;
    }
  }
  
  /**
   * Deploy a contract from JSON artifact (Truffle/Hardhat format)
   * @param artifact The contract artifact with ABI and bytecode
   * @param constructorArgs The constructor arguments for the contract
   * @returns The deployed contract instance and transaction receipt
   */
  async deployContractFromArtifact(
    artifact: { abi: any; bytecode: string },
    constructorArgs: any[] = []
  ): Promise<{
    contract: any; // Changed from ethers.Contract to any to fix TypeScript error
    receipt: ethers.TransactionReceipt;
    address: string;
  }> {
    return this.deployContract(
      artifact.abi,
      artifact.bytecode,
      constructorArgs
    );
  }

  /**
   * Estimate gas for contract deployment
   * @param contractABI The ABI of the contract
   * @param contractBytecode The bytecode of the contract
   * @param constructorArgs The constructor arguments for the contract
   * @returns Estimated gas as a BigInt
   */
  async estimateDeploymentGas(
    contractABI: any,
    contractBytecode: string,
    constructorArgs: any[] = []
  ): Promise<bigint> {
    try {
      if (!this.provider) await this.initProvider();
      if (!this.provider) throw new Error("Provider not initialized");
      
      if (!this.signer) {
        this.signer = await this.provider.getSigner();
      }

      // Create contract factory
      const factory = new ethers.ContractFactory(
        contractABI,
        contractBytecode,
        this.signer
      );
      
      // Estimate gas
      const deploymentData = constructorArgs.length > 0
        ? factory.interface.encodeDeploy(constructorArgs)
        : factory.interface.encodeDeploy([]);
      
      const estimatedGas = await this.provider.estimateGas({
        data: contractBytecode + deploymentData.slice(2)
      });
      
      return estimatedGas;
    } catch (error) {
      console.error("Error estimating deployment gas:", error);
      throw error;
    }
  }
}

// Create a singleton instance
const flareService = new FlareService();
export default flareService;

// Re-export ethers for convenience
export { ethers };
