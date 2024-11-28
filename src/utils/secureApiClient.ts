import axios from 'axios';
import { encryptApiKey } from './encryption';
import pako from 'pako';

const secureApiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

const PDF_STORAGE_KEY = 'analysis_pdf_urls';
const activePolls = new Map(); // Track active polling tasks
const activeRequests = new Map(); // Track active primary requests

const storePdfUrl = (requestId: string, url: string) => {
  const stored = JSON.parse(localStorage.getItem(PDF_STORAGE_KEY) || '{}');
  stored[requestId] = url;
  localStorage.setItem(PDF_STORAGE_KEY, JSON.stringify(stored));
};

export const getPdfUrl = (requestId: string) => {
  const stored = JSON.parse(localStorage.getItem(PDF_STORAGE_KEY) || '{}');
  return stored[requestId];
};

export const isRequestInProgress = (requestId: string): boolean => {
  return activeRequests.has(requestId);
};

// Add compression utility function
const compressData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    // Convert string to Uint8Array before deflating
    const uint8Array = new TextEncoder().encode(jsonString);
    const compressed = pako.deflate(uint8Array);
    // Convert Uint8Array to regular array before using apply
    return btoa(String.fromCharCode.apply(null, Array.from(compressed)));
  } catch (error) {
    console.error('Compression failed:', error);
    return JSON.stringify(data);
  }
};

// Add decompression utility function
export const decompressData = (compressed: string): any => {
  try {
    // Convert base64 to Uint8Array
    const binaryString = atob(compressed);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    // Decompress and convert back to string
    const decompressed = pako.inflate(uint8Array);
    const textDecoder = new TextDecoder();
    return JSON.parse(textDecoder.decode(decompressed));
  } catch (error) {
    console.error('Decompression failed:', error);
    return JSON.parse(compressed);
  }
};

export const makeSecureRequest = async (apiKey: string, config: any) => {
  const startTime = Date.now();
  const encryptedKey = encryptApiKey(apiKey);
  const strictParam = config.strictMode ? '?strict=true' : '?strict=false';
  
  const tempRequestId = Date.now().toString();
  activeRequests.set(tempRequestId, true);
  
  try {
    const response = await secureApiClient.post(`/generate-advanced${strictParam}`, {
      encryptedKey,
      config
    });

    const duration = Date.now() - startTime;
    console.log('Duration calculated:', duration);

    // Compress the response data immediately
    const compressedData = {
      ...response.data,
      generated_data: compressData(response.data.generated_data),
      duration: duration
    };
    
    // Start polling with a slight delay to prevent immediate browser load
    if (response.data?.request_id) {
      setTimeout(() => {
        startPolling(response.data.request_id);
      }, 1000);
    }
    
    return { data: compressedData };
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  } finally {
    activeRequests.delete(tempRequestId);
  }
};

const startPolling = (requestId: string) => {
  // Cancel any existing polling for this requestId
  stopPolling(requestId);
  
  const controller = new AbortController();
  activePolls.set(requestId, controller);
  
  pollStatus(requestId, controller.signal);
};

export const stopPolling = (requestId: string) => {
  const controller = activePolls.get(requestId);
  if (controller) {
    controller.abort();
    activePolls.delete(requestId);
  }
};
// Exponential backoff but with proper safeguards
const pollStatus = async (requestId: string, signal: AbortSignal) => {
  let attempts = 0;
  const maxAttempts = 30;
  const baseDelay = 2000;
  let timeoutId: NodeJS.Timeout;

  const poll = async () => {
    if (signal.aborted || attempts >= maxAttempts) {
      activePolls.delete(requestId);
      return;
    }

    try {
      const response = await secureApiClient.get(`/analysis/status/${requestId}`);
      
      if (response.data.status === 'ready') {
        const pdfUrl = `${secureApiClient.defaults.baseURL}/analysis/download/${requestId}`;
        storePdfUrl(requestId, pdfUrl);
        
        // Use requestAnimationFrame for smoother UI updates
        requestAnimationFrame(() => {
          window.dispatchEvent(new CustomEvent('pdfReady', { detail: requestId }));
        });
        
        activePolls.delete(requestId);
        return;
      }
      
      if (response.data.status === 'error') {
        activePolls.delete(requestId);
        return;
      }

      attempts++;
      const delay = Math.min(baseDelay * Math.pow(1.5, attempts), 10000);
      timeoutId = setTimeout(poll, delay);
    } catch (error) {
      if (!signal.aborted) {
        console.error('Polling failed:', error);
        activePolls.delete(requestId);
      }
    }
  };

  signal.addEventListener('abort', () => {
    clearTimeout(timeoutId);
  });

  poll();
};