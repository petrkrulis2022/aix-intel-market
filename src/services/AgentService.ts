
/**
 * Service for communicating with the Filecoin Recall AIX Agent
 */
export class AgentService {
  private static instance: AgentService;
  private baseUrl: string = "https://api.yourdomain.com"; // Replace with your actual API endpoint

  private constructor() {
    // Initialize with environment-specific configuration or from localStorage
    if (process.env.NODE_ENV === "development") {
      // Use local dev server during development
      this.baseUrl = "http://localhost:3000";
    }
    
    // Check if there's a saved configuration in localStorage
    const savedConfig = localStorage.getItem("agent_config");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.baseUrl) {
          this.baseUrl = config.baseUrl;
        }
      } catch (error) {
        console.error("Failed to parse saved agent configuration:", error);
      }
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
    this.baseUrl = config.baseUrl;
    // Save configuration to localStorage
    localStorage.setItem("agent_config", JSON.stringify({ baseUrl: config.baseUrl }));
  }

  /**
   * Send a message to the agent and get a response
   */
  public async sendMessage(message: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error("Agent service is not configured. Please set the API endpoint in Agent Configuration.");
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/agent/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
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
        throw new Error(`Error: ${response.status} ${response.statusText}`);
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
        throw new Error(`Error: ${response.status} ${response.statusText}`);
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
  private isConfigured(): boolean {
    return this.baseUrl !== "https://api.yourdomain.com" && 
           this.baseUrl !== "" && 
           this.baseUrl !== undefined;
  }
}

// Export a default instance
export default AgentService.getInstance();
