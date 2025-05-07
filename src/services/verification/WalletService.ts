
import flareService from "@/services/FlareService";
import { ethers } from "@/services/FlareService"; // Import ethers directly from the module
import { toast } from "@/components/ui/use-toast";

/**
 * Service for wallet-related operations
 */
class WalletService {
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
        value: ethers.parseEther("0"), // Using imported ethers directly
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
}

const walletService = new WalletService();
export default walletService;
