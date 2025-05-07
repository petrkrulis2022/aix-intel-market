
import jsonApiVerificationService from "./JsonApiVerificationService";
import jsonAbiVerificationService from "./JsonAbiVerificationService";
import walletService from "./WalletService";

/**
 * Main facade service for Flare verification functionality
 */
class FlareVerificationService {
  /**
   * Validates provider pricing using Flare JSON API
   */
  public async validateProviderPricing(providerId: string) {
    return jsonApiVerificationService.validateProviderPricing(providerId);
  }
  
  /**
   * Handle verification with JsonAbi contract
   */
  public async validateWithJsonAbi(selectedProvider: string) {
    return jsonAbiVerificationService.validateWithJsonAbi(selectedProvider);
  }
  
  /**
   * Creates a mock transaction for testing the MetaMask signing process
   */
  public async createMockTransaction() {
    return walletService.createMockTransaction();
  }
  
  /**
   * Open blockchain explorer for the transaction
   */
  public openFlareExplorer() {
    jsonApiVerificationService.openFlareExplorer();
  }
}

const flareVerificationService = new FlareVerificationService();
export default flareVerificationService;
