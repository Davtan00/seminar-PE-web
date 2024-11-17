import { GenerationConfig, GeneratedDataItem, GenerationResponse } from '../types/types';

export const generateSentiments = async (config: GenerationConfig): Promise<GenerationResponse> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error('Failed to generate sentiments');
  }

  return response.json();
};