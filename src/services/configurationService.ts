import { GenerationConfig, GenerationResponse } from '../types/types';

export const exportConfiguration = (config: GenerationConfig): string => {
  return JSON.stringify(config, null, 2);
};
// TODO: Add flag for dev/prod and then fetch from the correct endpoint
export const generateData = async (
  config: GenerationConfig, 
  apiKey: string
): Promise<GenerationResponse> => {
  try {
    const response = await fetch('http://localhost:8000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(config),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to generate data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating data:', error);
    throw error;
  }
};

const getCsrfToken = (): string | null => {
  const element = document.querySelector('meta[name="csrf-token"]');
  return element ? element.getAttribute('content') : null;
};