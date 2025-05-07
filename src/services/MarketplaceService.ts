import { AIXValuation } from './recall/RecallConfig';

export interface MarketplaceTask {
  id: string;
  title: string;
  description: string;
  agent: string;
  submittedDate: string;
  validatedDate: string;
  verifiedAixValue: number;
  resources: {
    cpu: number;
    gpu: number;
    memory: string;
    duration: string;
  };
  status: 'listed' | 'sold' | 'expired';
  tags: string[];
  provider?: string; // Add provider as optional
  costBreakdown?: any; // Add cost breakdown as optional
}

export class MarketplaceService {
  private static instance: MarketplaceService;
  private listingsCache: MarketplaceTask[] = [];
  
  // Private constructor for singleton pattern
  private constructor() {
    // Initialize with some sample listings for demo purposes
    this.listingsCache = [
      {
        id: 'task-001',
        title: 'Market Analysis Report',
        description: 'Deep analysis of market trends in renewable energy sector',
        agent: 'Agent Alpha',
        submittedDate: '2025-04-10',
        validatedDate: '2025-04-12',
        verifiedAixValue: 34.5,
        resources: {
          cpu: 45,
          gpu: 78,
          memory: '3.2 GB',
          duration: '1.5 hours'
        },
        status: 'listed',
        tags: ['market-analysis', 'renewable-energy', 'research']
      },
      {
        id: 'task-002',
        title: 'Predictive Model - Stock Market',
        description: 'ML model to predict stock market movements based on historical data',
        agent: 'Market Predictor',
        submittedDate: '2025-04-08',
        validatedDate: '2025-04-11',
        verifiedAixValue: 67.8,
        resources: {
          cpu: 60,
          gpu: 92,
          memory: '5.7 GB',
          duration: '3.2 hours'
        },
        status: 'listed',
        tags: ['predictive-model', 'finance', 'ML']
      }
    ];
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): MarketplaceService {
    if (!MarketplaceService.instance) {
      MarketplaceService.instance = new MarketplaceService();
    }
    return MarketplaceService.instance;
  }

  /**
   * List a task on the marketplace
   */
  public async listTask(
    taskDetails: {
      id: string;
      title: string;
      description: string;
      agent: string;
      resources: any;
      aixValuation: AIXValuation;
      tags?: string[];
      provider?: string; // Add provider as optional
      costBreakdown?: any; // Add cost breakdown as optional
    }
  ): Promise<MarketplaceTask> {
    // In a real implementation, this would make an API call to a backend
    const now = new Date();
    const submittedDate = now.toISOString().split('T')[0];
    const validatedDate = now.toISOString().split('T')[0];
    
    const newListing: MarketplaceTask = {
      id: taskDetails.id || `task-${Date.now().toString(36)}`,
      title: taskDetails.title,
      description: taskDetails.description,
      agent: taskDetails.agent,
      submittedDate,
      validatedDate,
      verifiedAixValue: taskDetails.aixValuation.aix_value,
      resources: {
        cpu: taskDetails.resources.resources.cpu.average_percent,
        gpu: taskDetails.resources.resources.gpu.average_percent,
        memory: `${(taskDetails.resources.resources.memory?.average_bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`,
        duration: `${(taskDetails.resources.duration_seconds / 60).toFixed(1)} minutes`
      },
      status: 'listed',
      tags: taskDetails.tags || [],
      provider: taskDetails.provider, // Include provider if provided
      costBreakdown: taskDetails.costBreakdown // Include cost breakdown if provided
    };
    
    // Add to local cache
    this.listingsCache.push(newListing);
    
    // In a real implementation, we would make an API call here
    // await fetch(...) 
    
    return newListing;
  }

  /**
   * Get all listed tasks from the marketplace
   */
  public async getListedTasks(): Promise<MarketplaceTask[]> {
    // In a real implementation, this would fetch from an API
    return this.listingsCache.filter(task => task.status === 'listed');
  }

  /**
   * Buy a task from the marketplace
   */
  public async buyTask(taskId: string): Promise<boolean> {
    // Find the task
    const taskIndex = this.listingsCache.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${taskId} not found`);
    }
    
    // Update task status
    this.listingsCache[taskIndex].status = 'sold';
    
    // In a real implementation, this would make an API call
    return true;
  }
}

export default MarketplaceService.getInstance();
