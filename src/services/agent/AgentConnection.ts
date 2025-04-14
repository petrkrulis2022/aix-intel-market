
import AgentConfig from './AgentConfig';

export class AgentConnection {
  /**
   * Test if the backend server is reachable
   * @param timeoutMs Maximum time to wait for response in milliseconds
   * @returns Promise that resolves to boolean indicating connection status
   */
  public async testConnection(timeoutMs: number = 5000): Promise<boolean> {
    try {
      const baseUrl = AgentConfig.getBaseUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(`${baseUrl}/api/health`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      return response.ok;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }
}

export default new AgentConnection();
