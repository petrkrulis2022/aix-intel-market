
import FileStorageService from "./FileStorageService";

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
        
        // Get enhanced resource estimates for the entry
        const resourceEstimates = this.estimateResourceUsage(
          // The log content could be in different fields depending on the format
          entry.log || entry.content || entry.message || JSON.stringify(entry)
        );
        
        // Add detailed benchmarks to the entry
        return {
          ...entry,
          benchmarks: resourceEstimates.estimatedMetrics
        };
      } catch (error) {
        console.error('Error processing JSONL line:', error);
        return null;
      }
    }).filter(entry => entry !== null); // Remove any null entries from failed parsing
    
    return jsonEntries;
  }
  
  /**
   * Estimate CPU/GPU usage, time, energy, and reasoning complexity based on chain of thought log content.
   * This remains a heuristic model. For actual values, direct monitoring tools are required.
   * @param logContent - The log content to analyze
   * @returns Estimated benchmark metrics
   */
  private static estimateResourceUsage(logContent: string): {
      estimatedMetrics: {
          reasoning: {
              stepCount: number;
              complexityScore: number;
          };
          compute: {
              cpu: { units: string; estimatedLoadFactor: number; };
              gpu: { units: string; estimatedLoadFactor: number; };
          };
          time: {
              totalSeconds: number;
          };
          energy: {
              estimatedUnits: string;
              consumptionFactor: number;
          };
      };
  } {
      const tokenCount = logContent.split(/\s+/).length;

      // Keywords for different operation types
      const llmKeywords = /LLM|GPT|model|inference|embedding|generate|translate|summarize|completion/gi;
      const mathKeywords = /calculate|compute|algorithm|matrix|tensor|solve|equation|math/gi;
      const dataKeywords = /data|process|parse|load|save|query|filter|sort|analyze|retrieve|extract/gi;
      const planningKeywords = /plan|step|sequence|decide|reason|think|strategize|reflect|evaluate/gi;
      const toolUseKeywords = /tool_use|api_call|external_function|invoke_tool|action/gi;

      // Count occurrences
      const llmCount = (logContent.match(llmKeywords) || []).length;
      const mathCount = (logContent.match(mathKeywords) || []).length;
      const dataCount = (logContent.match(dataKeywords) || []).length;
      const planningCount = (logContent.match(planningKeywords) || []).length;
      const toolCount = (logContent.match(toolUseKeywords) || []).length;

      // Estimate step count (simple proxy, assumes newlines or specific markers might denote steps)
      let stepCount = (logContent.match(/\nStep \d+:|\n- /gi) || []).length;
      if (stepCount === 0 && planningCount > 0) stepCount = planningCount; 
      if (stepCount === 0 && tokenCount > 50) stepCount = Math.max(1, Math.floor(tokenCount / 200));
      stepCount = Math.max(1, stepCount); // Ensure at least one step

      const baseComplexity = tokenCount / 200; 

      const reasoningComplexityScore = baseComplexity + (planningCount * 0.5) + (mathCount * 0.3) + (llmCount * 0.2);
      
      let cpuLoadFactor = (tokenCount / 2000) + 
                          (dataCount * 0.15) +    
                          (planningCount * 0.1) + 
                          (mathCount * 0.05);     
      cpuLoadFactor = Math.min(1, Math.max(0.05, cpuLoadFactor));

      let gpuLoadFactor = (llmCount * 0.25) +     
                          (mathCount * 0.1);      
      gpuLoadFactor = (llmCount > 0 || (mathCount > 2 && tokenCount > 500)) ? Math.min(1, Math.max(0.1, gpuLoadFactor)) : Math.min(1, Math.max(0.01, gpuLoadFactor));

      let totalSeconds = (tokenCount * 0.015) +   
                         (llmCount * 0.8) +      
                         (mathCount * 0.4) +
                         (dataCount * 0.25) +
                         (planningCount * 0.15) +
                         (toolCount * 0.6);      
      totalSeconds = Math.max(0.05, totalSeconds);

      let energyConsumptionFactor = ((cpuLoadFactor * 0.4) + (gpuLoadFactor * 0.6)) * (totalSeconds / 30); 
      energyConsumptionFactor = Math.min(1, Math.max(0.01, energyConsumptionFactor));

      return {
          estimatedMetrics: {
              reasoning: {
                  stepCount: stepCount,
                  complexityScore: parseFloat(reasoningComplexityScore.toFixed(3)),
              },
              compute: {
                  cpu: {
                      units: "Normalized Load Factor (0-1)",
                      estimatedLoadFactor: parseFloat(cpuLoadFactor.toFixed(3)),
                  },
                  gpu: {
                      units: "Normalized Load Factor (0-1)",
                      estimatedLoadFactor: parseFloat(gpuLoadFactor.toFixed(3)),
                  },
              },
              time: {
                  totalSeconds: parseFloat(totalSeconds.toFixed(3)),
              },
              energy: {
                  estimatedUnits: "Normalized Consumption Factor (0-1)",
                  consumptionFactor: parseFloat(energyConsumptionFactor.toFixed(3)),
              }
          }
      };
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

  /**
   * Convert a JSONL file by filename to JSON and save it
   * @param filename - The JSONL filename to convert
   * @returns The converted JSON data
   */
  public static async convertFileByName(filename: string): Promise<any[]> {
    try {
      // Get JSONL content from Supabase
      const jsonlContent = await FileStorageService.getFileContent(filename, "jsonl");
      
      if (!jsonlContent) {
        throw new Error(`File ${filename} not found in storage`);
      }
      
      // Convert to JSON
      const jsonData = this.convertJsonlToJson(jsonlContent);
      
      // Save the JSON file
      const jsonFilename = filename.replace('.jsonl', '.json');
      await FileStorageService.saveFile(
        jsonFilename, 
        JSON.stringify(jsonData, null, 2), 
        "json"
      );
      
      return jsonData;
    } catch (error) {
      console.error('Error converting JSONL file by name:', error);
      throw error;
    }
  }
}

export default JsonlConverter;
