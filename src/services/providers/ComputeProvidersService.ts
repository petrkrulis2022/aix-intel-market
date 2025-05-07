
import PrimeIntellectService, { PrimeIntellectPricing } from './PrimeIntellectService';

export interface ComputeProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  pricing: {
    gpuHourlyRate: number;
    cpuHourlyRate: number;
    memoryRate: number; // Required to match PrimeIntellectPricing
    storageRate?: number;
  };
  realTime: boolean; // Whether pricing is fetched in real-time
}

/**
 * Service for managing compute providers
 */
class ComputeProvidersService {
  // Mock providers with realistic pricing
  private mockProviders: ComputeProvider[] = [
    {
      id: "bittensor",
      name: "Bittensor",
      logo: "https://bittensor.com/favicon.ico",
      description: "Decentralized machine learning network",
      website: "https://bittensor.com/",
      pricing: {
        gpuHourlyRate: 2.75,
        cpuHourlyRate: 0.08,
        memoryRate: 0.018
      },
      realTime: false
    },
    {
      id: "render",
      name: "Render Network",
      logo: "https://rendernetwork.com/favicon.ico",
      description: "Distributed GPU rendering network",
      website: "https://rendernetwork.com/pricing",
      pricing: {
        gpuHourlyRate: 1.95,
        cpuHourlyRate: 0.065,
        memoryRate: 0.0125
      },
      realTime: false
    },
    {
      id: "superintelligence",
      name: "Superintelligence",
      logo: "https://superintelligence.io/favicon.ico",
      description: "High-performance AI compute",
      website: "https://superintelligence.io/products/asi-compute/",
      pricing: {
        gpuHourlyRate: 3.10,
        cpuHourlyRate: 0.09,
        memoryRate: 0.02
      },
      realTime: false
    },
    {
      id: "aws",
      name: "AWS",
      logo: "https://aws.amazon.com/favicon.ico",
      description: "Amazon Web Services GPU instances",
      website: "https://docs.aws.amazon.com/dlami/latest/devguide/gpu.html",
      pricing: {
        gpuHourlyRate: 1.85,
        cpuHourlyRate: 0.085,
        memoryRate: 0.015,
        storageRate: 0.08
      },
      realTime: false
    },
    {
      id: "primeintellect",
      name: "Prime Intellect",
      logo: "https://www.primeintellect.ai/favicon.ico",
      description: "AI-optimized compute platform with real-time pricing",
      website: "https://www.primeintellect.ai/",
      pricing: {
        gpuHourlyRate: 2.50, // Default, will be updated with real API data
        cpuHourlyRate: 0.075, // Default, will be updated with real API data
        memoryRate: 0.015
      },
      realTime: true
    }
  ];
  
  /**
   * Get all available compute providers
   */
  public async getAllProviders(): Promise<ComputeProvider[]> {
    // If Prime Intellect is configured, update its pricing from the API
    if (PrimeIntellectService.isConfigured()) {
      try {
        const realPricing = await PrimeIntellectService.getPricing();
        
        // Update the Prime Intellect provider with real pricing
        this.mockProviders = this.mockProviders.map(provider => 
          provider.id === "primeintellect" 
            ? { 
                ...provider, 
                pricing: {
                  gpuHourlyRate: realPricing.gpuHourlyRate,
                  cpuHourlyRate: realPricing.cpuHourlyRate,
                  memoryRate: realPricing.memoryRate,
                  storageRate: realPricing.storageRate
                }
              } 
            : provider
        );
      } catch (error) {
        console.error("Error updating Prime Intellect pricing:", error);
      }
    }
    
    return this.mockProviders;
  }
  
  /**
   * Get a specific provider by ID
   */
  public async getProvider(providerId: string): Promise<ComputeProvider | undefined> {
    const providers = await this.getAllProviders();
    return providers.find(provider => provider.id === providerId);
  }
  
  /**
   * Calculate cost for a given provider and resource usage
   */
  public async calculateCost(providerId: string, resourceData: any): Promise<{ 
    total: number; 
    breakdown: { 
      cpu: number; 
      gpu: number; 
      memory?: number; 
    } 
  }> {
    const provider = await this.getProvider(providerId);
    
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }
    
    // Special handling for Prime Intellect using its service
    if (providerId === "primeintellect" && PrimeIntellectService.isConfigured()) {
      // Fix: Create a proper PrimeIntellectPricing object with required properties
      const pricing: PrimeIntellectPricing = {
        gpuHourlyRate: provider.pricing.gpuHourlyRate,
        cpuHourlyRate: provider.pricing.cpuHourlyRate,
        memoryRate: provider.pricing.memoryRate
      };
      
      // Add optional property if it exists
      if (provider.pricing.storageRate !== undefined) {
        pricing.storageRate = provider.pricing.storageRate;
      }
      
      return PrimeIntellectService.calculateCost(resourceData, pricing);
    }
    
    // For other providers, calculate using the common logic
    return this.calculateGenericCost(provider.pricing, resourceData);
  }
  
  /**
   * Generic cost calculation logic for all providers
   */
  private calculateGenericCost(
    pricing: ComputeProvider['pricing'], 
    resourceData: any
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
    const memoryCost = memoryUsage * (pricing.memoryRate || 0) * durationHours;
    
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
export default new ComputeProvidersService();
