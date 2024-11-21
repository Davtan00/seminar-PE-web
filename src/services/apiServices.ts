import { GenerationConfig, GenerationResponse } from '../types/types';

const API_BASE_URL = 'http://localhost:8000';
//UNUSED
export const generateData = async (
  config: GenerationConfig, 
  apiKey: string
): Promise<GenerationResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(config)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate data');
  }

  return response.json();
};

export const exportConfiguration = (config: GenerationConfig): string => {
  return JSON.stringify(config, null, 2);
};