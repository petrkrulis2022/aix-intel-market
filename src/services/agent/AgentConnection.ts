
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
      
      console.log(`Testing connection to ${baseUrl}/api/health`);
      
      // Try the health endpoint first
      try {
        const response = await fetch(`${baseUrl}/api/health`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors',
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log("Health check response OK");
          return true;
        }
      } catch (error) {
        console.warn("Health check failed, trying alternative endpoint:", error);
      }
      
      // If health endpoint fails, try the root endpoint
      return this.testAlternativeEndpoint(baseUrl, timeoutMs);
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return this.testAlternativeEndpoint(AgentConfig.getBaseUrl(), timeoutMs);
    }
  }
  
  /**
   * Test an alternative endpoint if the main health check fails
   * Some ngrok tunnels might respond with HTML on the health endpoint
   */
  private async testAlternativeEndpoint(baseUrl: string, timeoutMs: number): Promise<boolean> {
    try {
      console.log(`Testing alternative endpoint at ${baseUrl}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      // Try the root endpoint
      const response = await fetch(baseUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      
      // For ngrok tunnels, even getting a response might indicate it's working
      if (response.status !== 0) {
        console.log("Root endpoint connection verified");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Alternative endpoint test failed:', error);
      return false;
    }
  }
}

export default new AgentConnection();
