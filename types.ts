export interface GeneratedPrompt {
  originalInput: string;
  vfxPrompt: string;
}

export interface GenerationState {
  status: 'idle' | 'generating' | 'completed' | 'error';
  error?: string;
  prompt?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  input: string;
  prompt: string;
}