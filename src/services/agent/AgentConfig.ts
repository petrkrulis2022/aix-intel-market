
/**
 * Configuration management for the Filecoin Recall AIX Agent
 * Handles storing and retrieving configuration from localStorage
 */
export class AgentConfig {
  private baseUrl: string = "https://54c4-89-103-65-193.ngrok-free.app"; // Updated ngrok URL
  private isLocalDevelopment: boolean = false;

  constructor() {
    this.isLocalDevelopment = process.env.NODE_ENV === "development";
    this.loadSavedConfiguration();
  }

  /**
   * Load the saved configuration from localStorage
   */
  private loadSavedConfiguration(): void {
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
    } else {
      // Save the default configuration
      this.saveConfig();
    }
  }

  /**
   * Configure the agent service with custom settings
   */
  public configure(config: { baseUrl: string }): void {
    if (!config.baseUrl || config.baseUrl.trim() === "") {
      throw new Error("Backend API URL cannot be empty");
    }
    
    // Ensure URL doesn't end with a slash
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
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
   * Check if the agent service is properly configured
   */
  public isConfigured(): boolean {
    return this.baseUrl !== "" && this.baseUrl !== undefined && this.baseUrl !== "https://your-backend-url.com";
  }

  /**
   * Get the current API URL
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Clear configuration and reset to defaults
   */
  public clearConfig(): void {
    localStorage.removeItem("agent_config");
    this.baseUrl = "https://54c4-89-103-65-193.ngrok-free.app";
  }

  /**
   * Reset connection to use the default URL
   */
  public resetConnection(): void {
    this.baseUrl = "https://54c4-89-103-65-193.ngrok-free.app";
    this.saveConfig();
  }
}

export default new AgentConfig();
