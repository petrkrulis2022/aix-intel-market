
/**
 * Utility functions for calculating AIX value components
 */

export const calculateHardwareScore = (data: any): number => {
  const cpuFactor = data.benchmarks.compute.cpu.estimatedLoadFactor;
  const gpuFactor = data.benchmarks.compute.gpu.estimatedLoadFactor;
  return (cpuFactor * 5) + (gpuFactor * 15);
};

export const calculateTimeScore = (data: any): number => {
  const seconds = data.benchmarks.time.totalSeconds;
  return Math.max(1, Math.min(10, 10 - (seconds / 10)));
};

export const calculatePerformanceScore = (data: any): number => {
  return data.benchmarks.reasoning.complexityScore * 4;
};

export const calculateEnergyScore = (data: any): number => {
  return data.benchmarks.energy.consumptionFactor * 8;
};

export const calculateAIXValue = (data: any): number => {
  return (
    calculateHardwareScore(data) +
    calculateTimeScore(data) +
    calculatePerformanceScore(data) +
    calculateEnergyScore(data)
  );
};
