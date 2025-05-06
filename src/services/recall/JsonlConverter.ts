
/**
 * JsonlConverter - Utility for converting JSONL files to JSON format
 * and estimating resource usage from Chain of Thought logs
 */
export class JsonlConverter {
  /**
   * Convert JSONL content to JSON with resource estimates
   * @param jsonlContent - The JSONL content as a string
   * @returns Structured JSON array with resource estimates
   */
  public static convertJsonlToJson(jsonlContent: string): any[] {
    // Split the content into lines
    const lines = jsonlContent.trim().split('\n');
    
    // Process each line as a separate JSON object
    const jsonEntries = lines.map(line => {
      try {
        // Parse the JSON line
        const entry = JSON.parse(line);
        
        // Estimate resource usage based on the log content
        const { cpuUsage, gpuUsage, timeUsage } = this.estimateResourceUsage(
          // The log content could be in different fields depending on the format
          entry.log || entry.content || entry.message || JSON.stringify(entry)
        );
        
        // Add CPU and GPU usage estimates to the entry
        return {
          ...entry,
          resources: {
            CPU: cpuUsage.toFixed(2),
            GPU: gpuUsage.toFixed(2),
            timeSeconds: timeUsage.toFixed(2)
          }
        };
      } catch (error) {
        console.error('Error processing JSONL line:', error);
        return null;
      }
    }).filter(Boolean); // Remove any null entries from failed parsing
    
    return jsonEntries;
  }
  
  /**
   * Estimate CPU/GPU usage based on chain of thought complexity
   * This is a simple heuristic model - in a real system, you'd use more sophisticated metrics
   * @param logContent - The log content to analyze
   * @returns Estimated CPU and GPU usage
   */
  private static estimateResourceUsage(logContent: string): { 
    cpuUsage: number; 
    gpuUsage: number;
    timeUsage: number;
  } {
    // Count tokens as a simple metric for computational complexity
    const tokenCount = logContent.split(/\s+/).length;
    
    // Count certain keywords that might indicate more intensive operations
    const llmCount = (logContent.match(/LLM|GPT|model|inference|embedding/gi) || []).length;
    const mathCount = (logContent.match(/calculate|compute|algorithm|matrix|tensor/gi) || []).length;
    
    // Calculate complexity factors
    const complexityFactor = 0.5 + (llmCount * 0.1) + (mathCount * 0.2);
    
    // Simple heuristic: longer reasoning chains with more complex operations use more resources
    const cpuUsage = Math.min(100, tokenCount * 0.3 * complexityFactor); // CPU units based on tokens
    const gpuUsage = Math.min(100, tokenCount * 0.2 * complexityFactor + llmCount * 2); // GPU units with emphasis on LLM ops
    const timeUsage = tokenCount * 0.05 + cpuUsage * 0.1; // Estimated time in seconds
    
    return { cpuUsage, gpuUsage, timeUsage };
  }
  
  /**
   * Read JSONL file content from a File object
   * @param file - The File object
   * @returns Promise resolving to the file content
   */
  public static readJSONLFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * Convert a JSONL File object to JSON with resource estimates
   * @param file - The JSONL File object
   * @returns Promise resolving to the parsed JSON with resource estimates
   */
  public static async convertFile(file: File): Promise<any[]> {
    try {
      const jsonlContent = await this.readJSONLFile(file);
      return this.convertJsonlToJson(jsonlContent);
    } catch (error) {
      console.error('Error converting JSONL file:', error);
      throw error;
    }
  }
}

export default JsonlConverter;
