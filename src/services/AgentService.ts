
/**
 * Service for communicating with the Filecoin Recall AIX Agent
 */
export class AgentService {
  private static instance: AgentService;
  private baseUrl: string = "https://api.yourdomain.com"; // Default placeholder
  private isLocalDevelopment: boolean = false;

  private constructor() {
    // Initialize with environment-specific configuration
    this.isLocalDevelopment = process.env.NODE_ENV === "development";
    
    // Check if there's a saved configuration in localStorage
    const savedConfig = localStorage.getItem("agent_config");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.baseUrl && config.baseUrl.trim() !== "") {
          this.baseUrl = config.baseUrl;
        }
      } catch (error) {
        console.error("Failed to parse saved agent configuration:", error);
      }
    } else if (this.isLocalDevelopment) {
      // Use local dev server during development if no config exists
      this.baseUrl = "http://localhost:3000";
      this.saveConfig();
    }
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  /**
   * Configure the agent service with custom settings
   */
  public configure(config: { baseUrl: string }): void {
    if (!config.baseUrl || config.baseUrl.trim() === "") {
      throw new Error("Backend API URL cannot be empty");
    }
    
    this.baseUrl = config.baseUrl;
    this.saveConfig();
  }

  /**
   * Save the current configuration to localStorage
   */
  private saveConfig(): void {
    localStorage.setItem("agent_config", JSON.stringify({ 
      baseUrl: this.baseUrl 
    }));
  }

  /**
   * Send a message to the agent and get a response
   */
  public async sendMessage(message: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error("Agent service is not configured. Please set the API endpoint in Agent Configuration.");
    }

    try {
      // First check if the server is reachable with a simple ping
      await this.pingServer();

      const response = await fetch(`${this.baseUrl}/api/agent/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error sending message to agent:", error);
      throw error;
    }
  }

  /**
   * Check if the server is reachable
   */
  private async pingServer(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: "GET",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Connection timeout. Server might be down or unreachable.");
      }
      throw new Error(`Server connection failed: ${error.message}`);
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
    if (!this.isConfigured()) {
      throw new Error("Agent service is not configured. Please set the API endpoint in Agent Configuration.");
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/agent/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskDetails),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
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
    if (!this.isConfigured()) {
      throw new Error("Agent service is not configured. Please set the API endpoint in Agent Configuration.");
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/agent/tasks`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  /**
   * Check if the agent service is properly configured
   */
  public isConfigured(): boolean {
    return this.baseUrl !== "https://api.yourdomain.com" && 
           this.baseUrl !== "" && 
           this.baseUrl !== undefined;
  }

  /**
   * Get the current API URL
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Export a default instance
export default AgentService.getInstance();
