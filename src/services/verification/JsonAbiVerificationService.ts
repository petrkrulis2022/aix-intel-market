
import flareJsonApiService from "@/services/FlareJsonApiService";
import flareService, { ethers } from "@/services/FlareService";
import { toast } from "@/components/ui/use-toast";

/**
 * Service for JsonAbi contract verification
 */
class JsonAbiVerificationService {
  /**
   * Handle verification with JsonAbi contract
   */
  public async validateWithJsonAbi(selectedProvider: string): Promise<boolean> {
    if (!selectedProvider) {
      toast({
        title: "Provider Required",
        description: "Please select a provider to validate.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if connected to Flare network
    const isFlareNetwork = await flareService.isFlareNetwork();
    
    if (!isFlareNetwork) {
      toast({
        title: "Network Switch Required",
        description: "Please switch to Flare Network to validate with JsonAbi",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const mockProofData = {
        merkleProof: ["0x0000000000000000000000000000000000000000000000000000000000000000"],
        data: {
          attestationType: ethers.hexlify(ethers.toUtf8Bytes("PRICING")),
          sourceId: ethers.hexlify(ethers.toUtf8Bytes(selectedProvider || "")),
          votingRound: 1,
          lowestUsedTimestamp: Math.floor(Date.now() / 1000),
          requestBody: {
            url: "https://api.primeintellect.ai/v1/pricing",
            postprocessJq: ".",
            abi_signature: "getPricing()",
          },
          responseBody: {
            abi_encoded_data: "0x0000",
          },
        },
      };
      
      console.log("Validating provider with JsonAbi contract...");
      
      // Force MetaMask to prompt for wallet connection if needed
      const provider = await flareService.getProvider();
      if (!provider) {
        throw new Error("MetaMask provider not available");
      }
      
      const accounts = await provider.listAccounts();
      if (accounts.length === 0) {
        await provider.send("eth_requestAccounts", []);
      }
      
      // Get latest signer to ensure MetaMask is initialized
      const signer = await flareService.getSigner();
      if (!signer) {
        throw new Error("Signer not available. Please connect your wallet.");
      }
      
      const contract = await flareJsonApiService.initJsonAbiContract();
      if (!contract) {
        throw new Error("Failed to initialize JsonAbi contract");
      }
      
      // Try to estimate gas, but use a fallback if it fails
      let gasLimit;
      try {
        const gasEstimate = await contract.getFunction("addChainOfThought").estimateGas(mockProofData);
        gasLimit = gasEstimate * 12n / 10n; // Add 20% buffer for safety
        console.log("Gas estimate:", gasEstimate.toString());
      } catch (gasError) {
        console.warn("Gas estimation failed, using fallback value:", gasError);
        gasLimit = 3000000n; // Fallback gas limit if estimation fails
      }
      
      console.log("Sending transaction with gas limit:", gasLimit.toString());
      
      // Make sure we're connected to the wallet before sending transaction
      await signer.getAddress();
      
      // Force a UI update to MetaMask by explicitly calling signMessage before transaction
      // This helps ensure MetaMask is properly initialized and responsive
      try {
        await signer.signMessage("Verifying provider pricing with Flare Network");
        console.log("Message signed successfully, proceeding with transaction");
      } catch (signError) {
        console.warn("User declined message signing:", signError);
        throw new Error("Transaction cancelled: wallet confirmation required");
      }
      
      // Send the actual transaction
      const tx = await contract.getFunction("addChainOfThought")(mockProofData, { gasLimit });
      
      console.log("Transaction sent:", tx.hash);
      
      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${tx.hash}`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error in JsonAbi validation:", error);
      toast({
        title: "Validation Error",
        description: error.message || "An error occurred during validation",
        variant: "destructive",
      });
      return false;
    }
  }
}

const jsonAbiVerificationService = new JsonAbiVerificationService();
export default jsonAbiVerificationService;
