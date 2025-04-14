
/**
 * Connection management for the Filecoin Recall AIX Agent
 * Handles testing and maintaining connection to the backend
 */
import AgentConfig from './AgentConfig';

export class AgentConnection {
  /**
   * Test if the backend server is reachable
   * @param timeoutMs Maximum time to wait for response in milliseconds
   * @returns Promise that resolves to true if connection successful
   */
  public async testConnection(timeoutMs: number = 5000): Promise<boolean> {
    try {
      const baseUrl = AgentConfig.getBaseUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(`${baseUrl}/api/health`, {
        method: "GET",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Connection timeout. Server might be down or unreachable.");
      }
      throw new Error(`Server connection failed: ${error.message}`);
    }
  }

  /**
   * Handle error responses from the API
   */
  public async handleErrorResponse(response: Response): Promise<Error> {
    const errorText = await response.text();
    return new Error(`Error ${response.status}: ${errorText || response.statusText}`);
  }
}

export default new AgentConnection();
