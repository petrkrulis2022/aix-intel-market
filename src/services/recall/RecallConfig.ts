
// RecallConfig.ts - Configuration type definitions for Recall network

export interface RecallConfig {
  privateKey: string;
  bucketAlias: string;
  cotLogPrefix: string;
}

export interface RecallResourceUsage {
  cpu: {
    average_percent: number;
    samples?: Array<[string, number]>;
  };
  gpu: {
    average_percent: number;
    samples?: Array<[string, number]>;
  };
  memory?: {
    average_bytes: number;
    samples?: Array<[string, number]>;
  };
}

export interface RecallResourceData {
  task_id: string;
  agent_id: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  resources: RecallResourceUsage;
}

export interface AIXComponentScores {
  hardware_score: number;
  time_score: number;
  performance_score: number;
  energy_score: number;
}

export interface AIXValuation {
  aix_value: number;
  components: AIXComponentScores;
  weights_used: Record<string, number>;
  transaction_type: string;
}
