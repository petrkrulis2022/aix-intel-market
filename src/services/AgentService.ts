
/**
 * Service for communicating with the Filecoin Recall AIX Agent
 * This file is maintained for backward compatibility
 * New code should import from 'src/services/agent' instead
 */
import agentService from './agent';

/**
 * @deprecated Use the modular implementation from 'src/services/agent' instead
 */
export class AgentService {
  private static instance: AgentService;
  private constructor() {}

  public static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  public configure(config: { baseUrl: string }): void {
    agentService.configure(config);
  }

  public async testBackendConnection(timeoutMs: number = 5000): Promise<boolean> {
    return agentService.testBackendConnection(timeoutMs);
  }

  public async sendMessage(message: string): Promise<string> {
    return agentService.sendMessage(message);
  }

  public async createTask(taskDetails: {
    title: string;
    description: string;
    type: string;
  }): Promise<{
    taskId: string;
    status: string;
  }> {
    return agentService.createTask(taskDetails);
  }

  public async getTasks(): Promise<Array<{
    taskId: string;
    title: string;
    status: string;
    createdAt: string;
  }>> {
    return agentService.getTasks();
  }

  public isConfigured(): boolean {
    return agentService.isConfigured();
  }

  public getBaseUrl(): string {
    return agentService.getBaseUrl();
  }
  
  public resetConnection(): void {
    agentService.resetConnection();
  }
}

// Export a default instance for backward compatibility
export default AgentService.getInstance();
