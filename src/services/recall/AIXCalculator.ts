
import { RecallResourceData, AIXValuation } from './RecallConfig';

export class AIXCalculator {
  /**
   * Calculate AIX value based on resource usage data
   */
  public static calculateAIXValue(resourceData: RecallResourceData, transactionType: string = "AI↔AI"): AIXValuation {
    // Calculate component scores
    const h_score = this.calculateHardwareScore(resourceData);
    const t_score = this.calculateTimeScore(resourceData);
    const p_score = 0.8; // Default performance score
    const e_score = this.calculateEnergyScore(resourceData);
    
    // Determine weights based on transaction type
    let weights: Record<string, number>;
    
    if (transactionType === "AI↔AI") {
      weights = {
        "hardware": 0.40,
        "time": 0.15,
        "performance": 0.30,
        "energy": 0.15
      };
    } else if (transactionType === "AI→Human") {
      weights = {
        "hardware": 0.30,
        "time": 0.30,
        "performance": 0.25,
        "energy": 0.15
      };
    } else if (transactionType === "Human→AI") {
      weights = {
        "hardware": 0.25,
        "time": 0.25,
        "performance": 0.25,
        "energy": 0.25
      };
    } else if (transactionType === "Human↔Human") {
      weights = {
        "hardware": 0.20,
        "time": 0.30,
        "performance": 0.20,
        "energy": 0.30
      };
    } else {
      weights = {
        "hardware": 0.35,
        "time": 0.25,
        "performance": 0.25,
        "energy": 0.15
      };
    }
    
    // Calculate final AIX value
    const aix_value = (
      (h_score * weights["hardware"]) +
      (t_score * weights["time"]) +
      (p_score * weights["performance"]) +
      (e_score * weights["energy"])
    ) * 100;
    
    return {
      aix_value,
      components: {
        hardware_score: h_score,
        time_score: t_score,
        performance_score: p_score,
        energy_score: e_score
      },
      weights_used: weights,
      transaction_type: transactionType
    };
  }

  private static calculateHardwareScore(resourceData: RecallResourceData): number {
    const cpu_weight = 0.5;
    const gpu_weight = 0.4;
    const memory_weight = 0.1;
    
    const avg_cpu = resourceData.resources.cpu.average_percent / 100.0;
    const avg_gpu = resourceData.resources.gpu.average_percent / 100.0;
    
    // Normalize memory (simplified)
    const avg_memory = 0.5; // Placeholder value since we don't have system total
    
    return (avg_cpu * cpu_weight) + (avg_gpu * gpu_weight) + (avg_memory * memory_weight);
  }

  private static calculateTimeScore(resourceData: RecallResourceData, baseline_time: number = 3600): number {
    const duration = resourceData.duration_seconds;
    const t_score = baseline_time / Math.max(duration, 1);
    
    // Normalize to 0-1 range
    return Math.min(Math.max(t_score, 0), 1);
  }

  private static calculateEnergyScore(resourceData: RecallResourceData): number {
    const cpu_energy_factor = 0.7;
    const gpu_energy_factor = 0.3;
    
    const cpu_efficiency = 1 - (resourceData.resources.cpu.average_percent / 100.0);
    const gpu_efficiency = 1 - (resourceData.resources.gpu.average_percent / 100.0);
    
    return (cpu_efficiency * cpu_energy_factor) + (gpu_efficiency * gpu_energy_factor);
  }
}
