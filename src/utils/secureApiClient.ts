import axios from 'axios';
import { encryptApiKey } from './encryption';

const secureApiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use localStorage to persist PDF URLs across page refreshes, lowest performance impact compared to redux and so on.
const PDF_STORAGE_KEY = 'analysis_pdf_urls';

const storePdfUrl = (requestId: string, url: string) => {
  const stored = JSON.parse(localStorage.getItem(PDF_STORAGE_KEY) || '{}');
  stored[requestId] = url;
  localStorage.setItem(PDF_STORAGE_KEY, JSON.stringify(stored));
};

export const getPdfUrl = (requestId: string) => {
  const stored = JSON.parse(localStorage.getItem(PDF_STORAGE_KEY) || '{}');
  return stored[requestId];
};

export const makeSecureRequest = async (apiKey: string, config: any) => {
  const encryptedKey = encryptApiKey(apiKey);
  const strictParam = config.strictMode ? '?strict=true' : '?strict=false';
  
  try {
    const response = await secureApiClient.post(`/generate-advanced${strictParam}`, {
      encryptedKey,
      config
    });

    // Start polling for PDF generation immediately
    if (response.data?.request_id) {
      pollStatus(response.data.request_id);
    }
    
    // Return the response object, not just the data
    return { data: response.data };
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Optimized polling with exponential backoff
const pollStatus = async (requestId: string) => {
  let attempts = 0;
  const maxAttempts = 30; // 5 minutes maximum polling time, adjust so we dont forget about it during presentation or so
  const baseDelay = 2000; // Start with 2 seconds

  const poll = async () => {
    if (attempts >= maxAttempts) return;

    try {
      const response = await secureApiClient.get(`/analysis/status/${requestId}`);
      
      if (response.data.status === 'ready') {
        const pdfUrl = `${secureApiClient.defaults.baseURL}/analysis/download/${requestId}`;
        storePdfUrl(requestId, pdfUrl);
        // Dispatch a custom event instead of using state management
        window.dispatchEvent(new CustomEvent('pdfReady', { detail: requestId }));
        return;
      }
      
      if (response.data.status === 'error') return;

      // Exponential backoff
      attempts++;
      const delay = Math.min(baseDelay * Math.pow(1.5, attempts), 10000); // Max 10 seconds
      setTimeout(poll, delay);
    } catch (error) {
      console.error('Polling failed:', error);
    }
  };

  poll();
};