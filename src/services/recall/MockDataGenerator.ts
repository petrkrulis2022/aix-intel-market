
import { RecallResourceData } from './RecallConfig';

export class MockDataGenerator {
  /**
   * Generate mock chain of thought logs
   */
  public static generateChainOfThoughtLogs(): string[] {
    return [
      'Starting analysis of market data...',
      'Processing data points: 1542 entries',
      'Identified key trends in sectors: Technology (+2.3%), Finance (-1.1%), Healthcare (+0.7%)',
      'Market velocity indicators show increased trading volume in tech securities',
      'Sentiment analysis complete: 65% positive, 20% neutral, 15% negative',
      'Correlating sentiment with price movement...',
      'Correlation coefficient: 0.72',
      'Forecasting 3-day market direction based on combined factors'
    ];
  }

  /**
   * Generate mock resource usage data
   */
  public static generateResourceUsageData(): RecallResourceData {
    return {
      task_id: "task_" + Math.random().toString(36).substring(2, 10),
      agent_id: "agent_" + Math.random().toString(36).substring(2, 10),
      start_time: new Date(Date.now() - 3600000).toISOString(),
      end_time: new Date().toISOString(),
      duration_seconds: 3600,
      resources: {
        cpu: {
          average_percent: 45.2,
          samples: [
            [new Date(Date.now() - 3600000).toISOString(), 42.5],
            [new Date(Date.now() - 3500000).toISOString(), 47.8],
            [new Date(Date.now() - 3400000).toISOString(), 45.3]
          ]
        },
        gpu: {
          average_percent: 78.6,
          samples: [
            [new Date(Date.now() - 3600000).toISOString(), 75.2],
            [new Date(Date.now() - 3500000).toISOString(), 80.1],
            [new Date(Date.now() - 3400000).toISOString(), 80.5]
          ]
        },
        memory: {
          average_bytes: 4294967296, // 4GB
          samples: [
            [new Date(Date.now() - 3600000).toISOString(), 4294967296],
            [new Date(Date.now() - 3500000).toISOString(), 4294967296],
            [new Date(Date.now() - 3400000).toISOString(), 4294967296]
          ]
        }
      }
    };
  }
}
