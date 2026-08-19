export type CategoryType = 'Coding' | 'Marketing' | 'Creative' | 'Business' | 'Reasoning' | 'Data' | 'Academic';

export type ModelType = 
  | 'Gemini 3.7 Flash'
  | 'Gemini 3.1 Pro'
  | 'GPT-4o'
  | 'GPT-4'
  | 'Claude 3.5 Sonnet'
  | 'Claude 3 Opus'
  | 'DeepSeek-V3';

export type OptimizationGoal = 'Cost & Speed' | 'Max Quality' | 'Balanced' | 'Reasoning' | 'Coding';

export interface PromptLog {
  id: string;
  originalPrompt: string;
  optimizedPrompt: string;
  score: number; // 0.0 to 10.0
  category: CategoryType;
  model: ModelType;
  timestamp: string;
  createdAt: number;
  originalTokens: number;
  optimizedTokens: number;
  isFavorite: boolean;
  scoreBreakdown?: {
    clarity: number;
    specificity: number;
    context: number;
    efficiency: number;
    robustness: number;
  };
  techniquesApplied?: string[];
  rationale?: string;
  systemPrompt?: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  recommendedModel: ModelType;
  prompt: string;
  variables: string[];
  score: number;
  isCustom?: boolean;
  isFavorite?: boolean;
  tags: string[];
}

export interface PromptDraft {
  id: string;
  title: string;
  content: string;
  category: CategoryType;
  targetModel: ModelType;
  goal: OptimizationGoal;
  lastModified: number;
}

export interface AppSettings {
  apiKeys: {
    openai: string;
    anthropic: string;
    google: string;
    deepseek: string;
  };
  optimizationGoal: 'Cost & Speed' | 'Max Quality';
  autoFallback: boolean;
  defaultModel: ModelType;
  temperature: number;
  maxTokens: number;
  thinkingLevel: 'HIGH' | 'LOW' | 'MINIMAL';
  darkMode: boolean;
  advancedRouting: {
    enableCostCapping: boolean;
    maxCostPerQuery: number;
    enableLatencyOptimization: boolean;
  };
}

export interface OptimizePromptRequest {
  prompt: string;
  category?: CategoryType;
  targetModel?: ModelType;
  goal?: OptimizationGoal;
  customInstructions?: string;
}

export interface OptimizePromptResponse {
  optimizedPrompt: string;
  score: number;
  originalTokens: number;
  optimizedTokens: number;
  techniquesApplied: string[];
  rationale: string;
  category: CategoryType;
  model: ModelType;
  scoreBreakdown: {
    clarity: number;
    specificity: number;
    context: number;
    efficiency: number;
    robustness: number;
  };
}

export interface RunPromptRequest {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  model?: ModelType;
}

export interface RunPromptResponse {
  output: string;
  tokensUsed: number;
  latencyMs: number;
  model: string;
}
