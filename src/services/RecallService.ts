
import { RecallConfig, RecallResourceData, AIXValuation } from './recall/RecallConfig';
import { AIXCalculator } from './recall/AIXCalculator';
import { MockDataGenerator } from './recall/MockDataGenerator';
import { RecallClient } from './recall/RecallClient';

/**
 * RecallService - Singleton for Recall network integration
 */
export class RecallService {
  private static instance: RecallService;
  private client: RecallClient;

  // Private constructor for singleton pattern
  private constructor() {
    this.client = new RecallClient();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): RecallService {
    if (!RecallService.instance) {
      RecallService.instance = new RecallService();
    }
    return RecallService.instance;
  }

  /**
   * Configure the Recall service
   */
  public configure(config: RecallConfig): void {
    this.client.configure(config);
  }

  /**
   * Check if Recall service is configured
   */
  public isConfigured(): boolean {
    return this.client.isConfigured();
  }

  /**
   * Get available buckets
   */
  public async getBuckets(): Promise<string[]> {
    return this.client.getBuckets();
  }

  /**
   * Get Chain of Thought logs from a bucket (mock implementation)
   */
  public async getChainOfThoughtLogs(bucketAlias: string): Promise<string[]> {
    if (!this.isConfigured()) {
      throw new Error('Recall service not configured');
    }
    
    return MockDataGenerator.generateChainOfThoughtLogs();
  }

  /**
   * Analyze resource usage from COT logs (mock implementation)
   */
  public async analyzeResourceUsage(bucketAlias: string): Promise<RecallResourceData> {
    if (!this.isConfigured()) {
      throw new Error('Recall service not configured');
    }
    
    return MockDataGenerator.generateResourceUsageData();
  }

  /**
   * Calculate AIX value based on resource usage data
   */
  public calculateAIXValue(resourceData: RecallResourceData, transactionType: string = "AI↔AI"): AIXValuation {
    return AIXCalculator.calculateAIXValue(resourceData, transactionType);
  }

  /**
   * Clear Recall configuration
   */
  public clearConfig(): void {
    this.client.clearConfig();
  }
}

// Export a default instance
export default RecallService.getInstance();
