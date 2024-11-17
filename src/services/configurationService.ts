import { GenerationConfig, GenerationResponse } from '../types/types';

export const exportConfiguration = (config: GenerationConfig): string => {
  return JSON.stringify(config, null, 2);
};
// TODO: Add flag for dev/prod and then fetch from the correct endpoint
export const generateData = async (
  config: GenerationConfig, 
  apiKey: string
): Promise<GenerationResponse> => {
  const response = await fetch('/api/generate', {
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

const getCsrfToken = (): string | null => {
  const element = document.querySelector('meta[name="csrf-token"]');
  return element ? element.getAttribute('content') : null;
};