import axios from 'axios';
import { encryptApiKey } from './encryption';

const secureApiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const makeSecureRequest = async (apiKey: string, config: any) => {
  const encryptedKey = encryptApiKey(apiKey);
  const strictParam = config.strictMode ? '?strict=true' : '?strict=false';
  
  try {
    const response = await secureApiClient.post(`/generate-advanced${strictParam}`, {
      encryptedKey,
      config
    });
    return response;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};