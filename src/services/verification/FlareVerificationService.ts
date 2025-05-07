
import flareJsonApiService from "@/services/FlareJsonApiService";
import flareService, { ethers } from "@/services/FlareService";
import { toast } from "@/components/ui/use-toast";

class FlareVerificationService {
  /**
   * Validates provider pricing using Flare JSON API
   * This implementation uses a non-blocking approach to prevent UI freezes
   */
  public async validateProviderPricing(providerId: string): Promise<{
    isValid: boolean;
    requestId?: number;
  }> {
    if (!providerId) {
      toast({
        title: "Provider Required",
        description: "Please select a provider to verify prices.",
        variant: "destructive",
      });
      return { isValid: false };
    }
    
    try {
      console.log("Starting price verification with Flare JSON API for", providerId);
      const result = await flareJsonApiService.validateProviderPricing(providerId);
      
      console.log("Verification result:", result);
      
      if (result.isValid) {
        toast({
          title: "Prices Verified",
          description: `${providerId} prices have been verified using Flare's JSON API contract.`,
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "Provider prices could not be verified with Flare JSON API.",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error verifying prices with Flare JSON API:', error);
      toast({
        title: "Verification Error",
        description: "An error occurred during price verification with Flare JSON API.",
        variant: "destructive",
      });
      return { isValid: false };
    }
  }
  
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
  
  /**
   * Creates a mock transaction for testing the MetaMask signing process
   * This doesn't send any real transaction to the blockchain
   */
  public async createMockTransaction(): Promise<boolean> {
    try {
      // Check if connected to Flare network
      const isFlareNetwork = await flareService.isFlareNetwork();
      
      if (!isFlareNetwork) {
        toast({
          title: "Network Switch Required",
          description: "Please switch to Flare Network to test transaction signing",
          variant: "destructive",
        });
        return false;
      }
      
      // Get signer and provider
      const provider = await flareService.getProvider();
      const signer = await flareService.getSigner();
      
      if (!provider || !signer) {
        toast({
          title: "Wallet Connection Required",
          description: "Please connect your wallet to test transaction signing",
          variant: "destructive",
        });
        return false;
      }
      
      // Create a transaction object but don't send it
      // This will just prompt MetaMask for signing
      const tx = {
        to: "0x0000000000000000000000000000000000000000", // Zero address
        value: ethers.parseEther("0"), // 0 FLR
        data: "0x", // Empty data
        gasLimit: 21000, // Minimum gas
      };
      
      // Estimate gas and prompt for signing
      const estimatedGas = await provider.estimateGas(tx);
      console.log("Estimated gas:", estimatedGas);
      
      // Prompt user to sign transaction but don't send it
      // This will open MetaMask
      await signer.signTransaction({
        ...tx,
        gasLimit: estimatedGas,
      });
      
      toast({
        title: "Transaction Signed",
        description: "Mock transaction was successfully signed but not sent",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error in mock transaction signing:", error);
      toast({
        title: "Signing Error",
        description: error.message || "An error occurred during transaction signing",
        variant: "destructive",
      });
      return false;
    }
  }
  
  /**
   * Open blockchain explorer for the transaction
   */
  public openFlareExplorer(): void {
    window.open("https://coston2-explorer.flare.network/address/0xfC3E77Ef092Fe649F3Dbc22A11aB8a986d3a2F2F", "_blank");
  }
}

const flareVerificationService = new FlareVerificationService();
export default flareVerificationService;
