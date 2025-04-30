
/**
 * Connection management for the Filecoin Recall AIX Agent
 * Handles testing connectivity to the agent backend
 */
import AgentConfig from './AgentConfig';

export class AgentConnection {
  /**
   * Test connectivity to the backend server
   * @param timeoutMs Timeout in milliseconds
   * @returns Promise resolving to true if connection is successful, false otherwise
   */
  public async testConnection(timeoutMs: number = 5000): Promise<boolean> {
    if (!AgentConfig.isConfigured()) {
      return false;
    }

    try {
      const baseUrl = AgentConfig.getBaseUrl();
      console.log(`Testing connection to ${baseUrl}/health`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(`${baseUrl}/health`, {
        method: "GET",
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log("Health check response OK");
        return true;
      }
      
      console.warn("Health check response not OK:", response.status);
      return false;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }
}

export default new AgentConnection();
