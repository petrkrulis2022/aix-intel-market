
import { RecallConfig } from './RecallConfig';

/**
 * Client for interacting with Recall Network API
 */
export class RecallClient {
  private config: RecallConfig | null = null;

  constructor() {
    // Load config from localStorage if available
    const storedConfig = localStorage.getItem('recall_config');
    if (storedConfig) {
      try {
        this.config = JSON.parse(storedConfig);
      } catch (error) {
        console.error('Failed to parse Recall config from localStorage:', error);
      }
    }
  }

  /**
   * Configure the Recall client
   */
  public configure(config: RecallConfig): void {
    this.config = config;
    localStorage.setItem('recall_config', JSON.stringify(config));
  }

  /**
   * Check if the client is configured
   */
  public isConfigured(): boolean {
    return this.config !== null;
  }

  /**
   * Clear the configuration
   */
  public clearConfig(): void {
    this.config = null;
    localStorage.removeItem('recall_config');
  }

  /**
   * Get available buckets from Recall Network (mock implementation)
   */
  public async getBuckets(): Promise<string[]> {
    if (!this.isConfigured()) {
      throw new Error('Recall client not configured');
    }
    
    // In a real implementation, this would call the Recall API
    return ['bucket1', 'bucket2', 'bucket3', this.config?.bucketAlias || ''];
  }
}
