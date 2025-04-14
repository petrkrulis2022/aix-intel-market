
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
   * Get Chain of Thought log files from a bucket
   */
  public async getChainOfThoughtLogFiles(bucketName: string): Promise<string[]> {
    if (!this.isConfigured()) {
      throw new Error('Recall service not configured');
    }
    
    return this.client.getChainOfThoughtLogFiles(bucketName);
  }

  /**
   * Get Chain of Thought logs from a specific file (mock implementation)
   */
  public async getChainOfThoughtLogContent(bucketName: string, fileName: string): Promise<string[]> {
    if (!this.isConfigured()) {
      throw new Error('Recall service not configured');
    }
    
    // In a real implementation, this would fetch the actual log content
    return MockDataGenerator.generateChainOfThoughtLogs();
  }

  /**
   * Upload Chain of Thought logs to a bucket
   */
  public async uploadChainOfThoughtLogs(logs: any[], bucketName?: string): Promise<boolean> {
    if (!this.isConfigured()) {
      throw new Error('Recall service not configured');
    }
    
    return this.client.uploadLogs(logs, bucketName);
  }

  /**
   * Analyze resource usage from a specific log file
   */
  public async analyzeResourceUsage(bucketName: string, fileName?: string): Promise<RecallResourceData> {
    if (!this.isConfigured()) {
      throw new Error('Recall service not configured');
    }
    
    // For real implementation, we would:
    // 1. Fetch the log content from the specified file
    // 2. Parse the logs to extract resource usage metrics
    // 3. Return the structured resource data
    
    // For now, we'll use the mock implementation
    if (fileName) {
      // If a specific file is provided, fetch its content and analyze
      const logs = await this.getChainOfThoughtLogContent(bucketName, fileName);
      
      try {
        // Extract resource metrics from the logs
        const resourceMetrics = await this.client.analyzeResourceUsageFromLogs(logs);
        
        // Convert to RecallResourceData format
        return {
          task_id: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
          agent_id: `agent_${bucketName.substring(0, 8)}`,
          start_time: new Date(Date.now() - resourceMetrics.duration_seconds * 1000).toISOString(),
          end_time: new Date().toISOString(),
          duration_seconds: resourceMetrics.duration_seconds,
          resources: {
            cpu: {
              average_percent: resourceMetrics.cpu.average_percent,
              samples: resourceMetrics.cpu.samples.map(([time, value]) => [new Date(time).toISOString(), value])
            },
            gpu: {
              average_percent: resourceMetrics.gpu.average_percent,
              samples: resourceMetrics.gpu.samples.map(([time, value]) => [new Date(time).toISOString(), value])
            },
            memory: {
              average_bytes: Math.round(resourceMetrics.memory.average_gb * 1024 * 1024 * 1024),
              samples: resourceMetrics.memory.samples.map(([time, value]) => [new Date(time).toISOString(), value * 1024 * 1024 * 1024])
            }
          }
        };
      } catch (error) {
        console.error("Error analyzing logs:", error);
        // Fall back to mock data if analysis fails
        return MockDataGenerator.generateResourceUsageData();
      }
    } else {
      // If no specific file is provided, use mock data
      return MockDataGenerator.generateResourceUsageData();
    }
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
