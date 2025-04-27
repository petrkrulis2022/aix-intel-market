
/**
 * API Client for the Filecoin Recall AIX Agent
 * Handles all communications with the agent backend API
 */
import AgentConfig from './AgentConfig';
import AgentConnection from './AgentConnection';

export class AgentApiClient {
  /**
   * Handle error responses from the API
   * @private
   */
  private async handleErrorResponse(response: Response): Promise<Error> {
    try {
      // Try to parse as JSON first
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorJson = await response.json();
        return new Error(`Error ${response.status}: ${errorJson.message || errorJson.error || JSON.stringify(errorJson)}`);
      } else {
        // Fall back to text
        const errorText = await response.text();
        return new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
    } catch (e) {
      // If we can't parse the response at all
      return new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Send a message to the agent and get a response
   */
  public async sendMessage(message: string): Promise<string> {
    if (!AgentConfig.isConfigured()) {
      throw new Error("Agent service is not configured. Please set the API endpoint in Agent Configuration.");
    }

    try {
      const baseUrl = AgentConfig.getBaseUrl();
      
      // Log the request for debugging
      console.log(`Sending message to ${baseUrl}/api/agent/message`);
      
      const response = await fetch(`${baseUrl}/api/agent/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
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
      const baseUrl = AgentConfig.getBaseUrl();
      
      // Log the request for debugging
      console.log(`Creating task at ${baseUrl}/api/agent/task with:`, taskDetails);
      
      const response = await fetch(`${baseUrl}/api/agent/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(taskDetails),
      });

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
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
      const baseUrl = AgentConfig.getBaseUrl();
      
      // Log the request for debugging
      console.log(`Fetching tasks from ${baseUrl}/api/agent/tasks`);
      
      const response = await fetch(`${baseUrl}/api/agent/tasks`, {
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }
}

export default new AgentApiClient();
