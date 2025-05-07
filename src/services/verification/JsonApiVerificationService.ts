
import flareJsonApiService from "@/services/FlareJsonApiService";
import { toast } from "@/components/ui/use-toast";

/**
 * Service for validating provider pricing using JSON API
 */
class JsonApiVerificationService {
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
   * Open blockchain explorer for the transaction
   */
  public openFlareExplorer(): void {
    window.open("https://coston2-explorer.flare.network/address/0xfC3E77Ef092Fe649F3Dbc22A11aB8a986d3a2F2F", "_blank");
  }
}

const jsonApiVerificationService = new JsonApiVerificationService();
export default jsonApiVerificationService;
