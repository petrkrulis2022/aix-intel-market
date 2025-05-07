
import { toast } from "@/components/ui/use-toast";

// Define types for Prime Intellect API responses
export interface PrimeIntellectModel {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: {
    input: number;
    output: number;
    training?: number;
    unit: string;
  };
}

export interface PrimeIntellectPricing {
  gpuHourlyRate: number;  // USD per hour
  cpuHourlyRate: number;  // USD per hour
  memoryRate: number;     // USD per GB-hour
  storageRate: number;    // USD per GB-month
}

/**
 * Service for interacting with Prime Intellect API
 */
class PrimeIntellectService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.primeintellect.ai/v1';
  
  /**
   * Set the API key for Prime Intellect
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
  
  /**
   * Check if the API key is configured
   */
  public isConfigured(): boolean {
    return !!this.apiKey;
  }
  
  /**
   * Get the pricing information from Prime Intellect
   * Note: This is currently mocked as we don't have actual API access
   */
  public async getPricing(): Promise<PrimeIntellectPricing> {
    if (!this.apiKey) {
      throw new Error('Prime Intellect API key is not configured');
    }
    
    try {
      // In a real implementation, this would be an API call:
      // const response = await fetch(`${this.baseUrl}/pricing`, {
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`API error: ${response.status}`);
      // }
      // 
      // return await response.json();
      
      // For now, mock the response with realistic pricing
      // We'd replace this with actual API calls when we have access
      return {
        gpuHourlyRate: 2.50,   // $2.50 per GPU hour
        cpuHourlyRate: 0.075,  // $0.075 per CPU hour
        memoryRate: 0.015,     // $0.015 per GB-hour
        storageRate: 0.05      // $0.05 per GB-month
      };
    } catch (error) {
      console.error('Error fetching Prime Intellect pricing:', error);
      toast({
        title: "Error fetching pricing data",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      
      // Return default pricing in case of error
      return {
        gpuHourlyRate: 2.50,
        cpuHourlyRate: 0.075,
        memoryRate: 0.015,
        storageRate: 0.05
      };
    }
  }
  
  /**
   * Get available models from Prime Intellect
   */
  public async getModels(): Promise<PrimeIntellectModel[]> {
    if (!this.apiKey) {
      throw new Error('Prime Intellect API key is not configured');
    }
    
    try {
      // In a real implementation, this would be:
      // const response = await fetch(`${this.baseUrl}/models`, {
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`API error: ${response.status}`);
      // }
      // 
      // return await response.json();
      
      // For now, return mock data
      return [
        {
          id: "pi-large",
          name: "PI Large",
          category: "LLM",
          description: "General purpose large language model",
          pricing: {
            input: 0.00005,
            output: 0.0002,
            unit: "token"
          }
        },
        {
          id: "pi-vision",
          name: "PI Vision",
          category: "Multimodal",
          description: "Vision and language model",
          pricing: {
            input: 0.0001,
            output: 0.0004,
            unit: "token"
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching Prime Intellect models:', error);
      return [];
    }
  }
  
  /**
   * Calculate cost estimate based on resource usage
   */
  public calculateCost(
    resourceData: any, 
    pricing: PrimeIntellectPricing
  ): { 
    total: number; 
    breakdown: { 
      cpu: number; 
      gpu: number; 
      memory?: number; 
    } 
  } {
    // Handle both legacy and new benchmark formats
    const isLegacyFormat = !!resourceData.resources;
    const isNewFormat = !!resourceData.benchmarks;
    
    let cpuUsage = 0;
    let gpuUsage = 0;
    let memoryUsage = 0;
    let durationHours = 0;
    
    if (isLegacyFormat && resourceData.resources) {
      cpuUsage = resourceData.resources.cpu.average_percent / 100; // Convert to 0-1 scale
      gpuUsage = resourceData.resources.gpu.average_percent / 100; // Convert to 0-1 scale
      memoryUsage = resourceData.resources.memory?.average_bytes 
        ? resourceData.resources.memory.average_bytes / (1024 * 1024 * 1024) // Convert bytes to GB
        : 0;
      durationHours = (resourceData.duration_seconds || 0) / 3600; // Convert seconds to hours
    } 
    else if (isNewFormat && resourceData.benchmarks) {
      cpuUsage = resourceData.benchmarks.compute.cpu.estimatedLoadFactor; // Already 0-1 scale
      gpuUsage = resourceData.benchmarks.compute.gpu.estimatedLoadFactor; // Already 0-1 scale
      durationHours = resourceData.benchmarks.time.totalSeconds / 3600; // Convert seconds to hours
    }
    
    // Calculate costs
    const cpuCost = cpuUsage * pricing.cpuHourlyRate * durationHours;
    const gpuCost = gpuUsage * pricing.gpuHourlyRate * durationHours;
    const memoryCost = memoryUsage * pricing.memoryRate * durationHours;
    
    const totalCost = cpuCost + gpuCost + (isLegacyFormat ? memoryCost : 0);
    
    return {
      total: totalCost,
      breakdown: {
        cpu: cpuCost,
        gpu: gpuCost,
        ...(isLegacyFormat ? { memory: memoryCost } : {})
      }
    };
  }
}

// Export a singleton instance
export default new PrimeIntellectService();
