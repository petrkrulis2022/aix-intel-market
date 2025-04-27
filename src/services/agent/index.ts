
/**
 * Main export for the Agent Service
 * Provides a unified interface to the agent functionality
 */
import AgentConfig from './AgentConfig';
import AgentConnection from './AgentConnection';
import AgentApiClient from './AgentApiClient';

/**
 * AgentService provides a unified interface to the Filecoin Recall AIX Agent
 * This is a facade that exposes methods from the underlying modules
 */
export class AgentService {
  /**
   * Configure the agent service with custom settings
   */
  public configure(config: { baseUrl: string }): void {
    AgentConfig.configure(config);
  }

  /**
   * Test the connection to the backend
   */
  public async testBackendConnection(timeoutMs: number = 5000): Promise<boolean> {
    return AgentConnection.testConnection(timeoutMs);
  }

  /**
   * Send a message to the agent and get a response
   */
  public async sendMessage(message: string): Promise<string> {
    return AgentApiClient.sendMessage(message);
  }

  /**
   * Create a new task with the agent
   */
  public async createTask(taskDetails: {
    title: string;
    description: string;
    type: string;
  }): Promise<{
    taskId: string;
    status: string;
  }> {
    return AgentApiClient.createTask(taskDetails);
  }

  /**
   * Get available tasks from the agent
   */
  public async getTasks(): Promise<Array<{
    taskId: string;
    title: string;
    status: string;
    createdAt: string;
  }>> {
    return AgentApiClient.getTasks();
  }

  /**
   * Check if the agent service is properly configured
   */
  public isConfigured(): boolean {
    return AgentConfig.isConfigured();
  }

  /**
   * Get the current API URL
   */
  public getBaseUrl(): string {
    return AgentConfig.getBaseUrl();
  }

  /**
   * Reset connection to the default backend URL
   */
  public resetConnection(): void {
    AgentConfig.resetConnection();
  }
}

// Export a singleton instance
const agentService = new AgentService();
export default agentService;
