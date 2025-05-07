import flareService, { ethers } from './FlareService';
import { toast } from '@/components/ui/use-toast';

// JSON API Contract ABI from explorer
const JSON_API_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_url",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_httpMethod",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_path",
        "type": "string"
      }
    ],
    "name": "requestJson",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_requestId",
        "type": "uint256"
      }
    ],
    "name": "getStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_requestId",
        "type": "uint256"
      }
    ],
    "name": "getResult",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// JsonAbi contract ABI
const JSON_ABI_CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "thoughtId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "userId", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "agentId", "type": "string"}
    ],
    "name": "ChainOfThoughtAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {"internalType": "bytes32[]", "name": "merkleProof", "type": "bytes32[]"},
          {
            "components": [
              {"internalType": "bytes32", "name": "attestationType", "type": "bytes32"},
              {"internalType": "bytes32", "name": "sourceId", "type": "bytes32"},
              {"internalType": "uint64", "name": "votingRound", "type": "uint64"},
              {"internalType": "uint64", "name": "lowestUsedTimestamp", "type": "uint64"},
              {
                "components": [
                  {"internalType": "string", "name": "url", "type": "string"},
                  {"internalType": "string", "name": "postprocessJq", "type": "string"},
                  {"internalType": "string", "name": "abi_signature", "type": "string"}
                ],
                "internalType": "struct IJsonApi.RequestBody",
                "name": "requestBody",
                "type": "tuple"
              },
              {
                "components": [
                  {"internalType": "bytes", "name": "abi_encoded_data", "type": "bytes"}
                ],
                "internalType": "struct IJsonApi.ResponseBody",
                "name": "responseBody",
                "type": "tuple"
              }
            ],
            "internalType": "struct IJsonApi.Response",
            "name": "data",
            "type": "tuple"
          }
        ],
        "internalType": "struct IJsonApi.Proof",
        "name": "data",
        "type": "tuple"
      }
    ],
    "name": "addChainOfThought",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "chainOfThoughts",
    "outputs": [
      {"internalType": "string", "name": "userId", "type": "string"},
      {"internalType": "string", "name": "agentId", "type": "string"},
      {"internalType": "string", "name": "userMessage", "type": "string"},
      {"internalType": "string", "name": "log", "type": "string"},
      {"internalType": "uint256", "name": "cpuUsage", "type": "uint256"},
      {"internalType": "uint256", "name": "gpuUsage", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllChainOfThoughts",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "userId", "type": "string"},
          {"internalType": "string", "name": "agentId", "type": "string"},
          {"internalType": "string", "name": "userMessage", "type": "string"},
          {"internalType": "string", "name": "log", "type": "string"},
          {"internalType": "uint256", "name": "cpuUsage", "type": "uint256"},
          {"internalType": "uint256", "name": "gpuUsage", "type": "uint256"}
        ],
        "internalType": "struct ChainOfThought[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "thoughtIds",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Mock implementation for demonstration
const MOCK_RESPONSES = {
  'primeintellect/pricing': {
    gpuHourlyRate: 2.50,
    cpuHourlyRate: 0.075,
    memoryRate: 0.015,
    storageRate: 0.05,
    verified: true,
    timestamp: Date.now()
  }
};

/**
 * Service for interacting with Flare Network JSON API contract
 */
class FlareJsonApiService {
  // JSON API Contract address on Coston2
  private readonly CONTRACT_ADDRESS = "0xfC3E77Ef092Fe649F3Dbc22A11aB8a986d3a2F2F";
  // JsonAbi Contract address on Coston2 - update this to the actual deployed address
  private readonly JSON_ABI_CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  
  private contract: ethers.Contract | null = null;
  private jsonAbiContract: ethers.Contract | null = null;
  
  /**
   * Initialize the JSON API contract
   */
  private async initContract() {
    if (this.contract) return this.contract;
    
    try {
      // Check if connected to Flare network
      const isFlare = await flareService.isFlareNetwork();
      if (!isFlare) {
        // We cannot use flareService.switchToFlareNetwork() because it doesn't exist
        // Instead we need to use WalletContext's method, but we can't directly access it here
        // So we'll inform the user and return null
        toast({
          title: "Wrong Network",
          description: "Please connect to Flare Coston2 network to use JSON API",
          variant: "destructive",
        });
        return null;
      }
      
      // Get signer
      const signer = await flareService.getSigner();
      if (!signer) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to use JSON API",
          variant: "destructive",
        });
        return null;
      }
      
      // Create contract instance
      this.contract = new ethers.Contract(
        this.CONTRACT_ADDRESS,
        JSON_API_CONTRACT_ABI,
        signer
      );
      
      return this.contract;
    } catch (error) {
      console.error("Error initializing JSON API contract:", error);
      toast({
        title: "Contract Error",
        description: "Failed to initialize JSON API contract",
        variant: "destructive",
      });
      return null;
    }
  }
  
  /**
   * Initialize the JsonAbi contract
   */
  private async initJsonAbiContract() {
    if (this.jsonAbiContract) return this.jsonAbiContract;
    
    try {
      // Check if connected to Flare network
      const isFlare = await flareService.isFlareNetwork();
      if (!isFlare) {
        toast({
          title: "Wrong Network",
          description: "Please connect to Flare Coston2 network to use JsonAbi contract",
          variant: "destructive",
        });
        return null;
      }
      
      // Get signer
      const signer = await flareService.getSigner();
      if (!signer) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to use JsonAbi contract",
          variant: "destructive",
        });
        return null;
      }
      
      // Create contract instance
      this.jsonAbiContract = new ethers.Contract(
        this.JSON_ABI_CONTRACT_ADDRESS,
        JSON_ABI_CONTRACT_ABI,
        signer
      );
      
      return this.jsonAbiContract;
    } catch (error) {
      console.error("Error initializing JsonAbi contract:", error);
      toast({
        title: "Contract Error",
        description: "Failed to initialize JsonAbi contract",
        variant: "destructive",
      });
      return null;
    }
  }
  
  /**
   * Request JSON data from a URL
   * @param url The URL to request data from
   * @param method The HTTP method (GET, POST, etc.)
   * @param path The JSON path to extract data from response
   * @returns Request ID for tracking the request
   */
  public async requestJson(
    url: string,
    method: string = "GET",
    path: string = "$"
  ): Promise<number | null> {
    try {
      const contract = await this.initContract();
      if (!contract) return null;
      
      // Make the request
      console.log(`Requesting JSON from ${url} with method ${method} and path ${path}`);
      
      // Show toast notification that transaction is being sent
      toast({
        title: "Sending Transaction",
        description: "Please approve the transaction in your wallet to validate pricing data",
      });
      
      // Make the contract call
      const tx = await contract.requestJson(url, method, path);
      console.log("Transaction sent:", tx.hash);
      
      // Show toast notification that transaction is being processed
      toast({
        title: "Transaction Sent",
        description: "Waiting for blockchain confirmation...",
      });
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      // For demo, return a random request ID
      // In production, you would get this from the transaction events
      const requestId = Math.floor(Math.random() * 1000000);
      
      toast({
        title: "Request Confirmed",
        description: `Your JSON API request has been confirmed (ID: ${requestId})`,
      });
      
      return requestId;
    } catch (error: any) {
      console.error("Error requesting JSON data:", error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to request JSON data from the API",
        variant: "destructive",
      });
      return null;
    }
  }
  
  /**
   * Check if a request is ready
   * @param requestId The request ID to check
   * @returns True if the request is ready, false otherwise
   */
  public async isRequestReady(requestId: number): Promise<boolean> {
    try {
      const contract = await this.initContract();
      if (!contract) return false;
      
      // Check status
      return await contract.getStatus(requestId);
    } catch (error) {
      console.error("Error checking request status:", error);
      return false;
    }
  }
  
  /**
   * Get the result of a request
   * @param requestId The request ID to get the result for
   * @returns The result data as a string
   */
  public async getResult(requestId: number): Promise<string | null> {
    try {
      const contract = await this.initContract();
      if (!contract) return null;
      
      // Get result
      return await contract.getResult(requestId);
    } catch (error) {
      console.error("Error getting request result:", error);
      toast({
        title: "Result Error",
        description: "Failed to get JSON API result",
        variant: "destructive",
      });
      return null;
    }
  }
  
  /**
   * Get all chain of thoughts from the JsonAbi contract
   * @returns Array of chain of thought data or null if error
   */
  public async getAllChainOfThoughts(): Promise<any[] | null> {
    try {
      const contract = await this.initJsonAbiContract();
      if (!contract) return null;
      
      const thoughts = await contract.getAllChainOfThoughts();
      return thoughts;
    } catch (error) {
      console.error("Error getting chain of thoughts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch chain of thoughts from the contract",
        variant: "destructive",
      });
      return null;
    }
  }
  
  /**
   * Get a specific chain of thought by ID
   * @param thoughtId The ID of the chain of thought to get
   * @returns Chain of thought data or null if error
   */
  public async getChainOfThought(thoughtId: number): Promise<any | null> {
    try {
      const contract = await this.initJsonAbiContract();
      if (!contract) return null;
      
      const thought = await contract.chainOfThoughts(thoughtId);
      return thought;
    } catch (error) {
      console.error("Error getting chain of thought:", error);
      toast({
        title: "Error",
        description: `Failed to fetch chain of thought #${thoughtId}`,
        variant: "destructive",
      });
      return null;
    }
  }
  
  /**
   * Add a new chain of thought to the contract
   * @param proofData The proof data required by the contract
   * @returns Transaction receipt or null if error
   */
  public async addChainOfThought(proofData: any): Promise<ethers.TransactionReceipt | null> {
    try {
      const contract = await this.initJsonAbiContract();
      if (!contract) return null;
      
      // Show toast notification that transaction is being sent
      toast({
        title: "Sending Transaction",
        description: "Please approve the transaction in your wallet to record chain of thought data",
      });
      
      // Make the contract call
      const tx = await contract.addChainOfThought(proofData);
      console.log("Transaction sent:", tx.hash);
      
      // Show toast notification that transaction is being processed
      toast({
        title: "Transaction Sent",
        description: "Waiting for blockchain confirmation...",
      });
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      toast({
        title: "Chain of Thought Recorded",
        description: "Your data has been successfully recorded on the blockchain",
      });
      
      return receipt;
    } catch (error: any) {
      console.error("Error adding chain of thought:", error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to record chain of thought data",
        variant: "destructive",
      });
      return null;
    }
  }
  
  /**
   * Validate provider pricing using Flare JSON API
   * For demonstration purposes, this uses mock data but the interface
   * is designed to work with the actual Flare JSON API contract
   */
  public async validateProviderPricing(providerId: string): Promise<{
    isValid: boolean;
    data?: any;
    requestId?: number;
  }> {
    try {
      // For demonstration purposes
      if (providerId === "primeintellect") {
        // In a real implementation, this would use the actual contract
        const requestId = await this.requestJson(
          "https://api.primeintellect.ai/v1/pricing",
          "GET",
          "$.pricing"
        );
        
        if (!requestId) {
          return { isValid: false };
        }
        
        // Simulate a delay to represent blockchain confirmation time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if request is ready (mock - in reality would check the contract)
        const isReady = await this.isRequestReady(requestId);
        if (!isReady) {
          console.log("Request not ready yet, waiting...");
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Get result (mock - in reality would get from contract)
        console.log("Getting result for request", requestId);
        
        // Return mock data
        return {
          isValid: true,
          data: MOCK_RESPONSES['primeintellect/pricing'],
          requestId
        };
      } else {
        // For other providers, return a generic response
        return {
          isValid: false,
          data: { message: "Provider not supported by Flare JSON API" }
        };
      }
    } catch (error) {
      console.error("Error validating provider pricing:", error);
      toast({
        title: "Validation Error",
        description: "Failed to validate provider pricing through Flare",
        variant: "destructive",
      });
      return { isValid: false };
    }
  }
}

// Create a singleton instance
const flareJsonApiService = new FlareJsonApiService();
export default flareJsonApiService;
