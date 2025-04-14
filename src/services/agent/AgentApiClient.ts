
/**
 * API Client for the Filecoin Recall AIX Agent
 * Handles all communications with the agent backend API
 */
import AgentConfig from './AgentConfig';
import AgentConnection from './AgentConnection';

export class AgentApiClient {
  /**
   * Send a message to the agent and get a response
   */
  public async sendMessage(message: string): Promise<string> {
    if (!AgentConfig.isConfigured()) {
      throw new Error("Agent service is not configured. Please set the API endpoint in Agent Configuration.");
    }

    try {
      // First check if the server is reachable
      await AgentConnection.testConnection();

      const response = await fetch(`${AgentConfig.getBaseUrl()}/api/agent/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw await AgentConnection.handleErrorResponse(response);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error sending message to agent:", error);
      throw error;
    }
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
    if (!AgentConfig.isConfigured()) {
      throw new Error("Agent service is not configured. Please set the API endpoint in Agent Configuration.");
    }

    try {
      // Ensure connection is available
      await AgentConnection.testConnection();
      
      const response = await fetch(`${AgentConfig.getBaseUrl()}/api/agent/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskDetails),
      });

      if (!response.ok) {
        throw await AgentConnection.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
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
    if (!AgentConfig.isConfigured()) {
      throw new Error("Agent service is not configured. Please set the API endpoint in Agent Configuration.");
    }

    try {
      // Ensure connection is available
      await AgentConnection.testConnection();
      
      const response = await fetch(`${AgentConfig.getBaseUrl()}/api/agent/tasks`);

      if (!response.ok) {
        throw await AgentConnection.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }
}

export default new AgentApiClient();
