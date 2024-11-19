import axios from 'axios';
import { encryptApiKey } from './encryption';
import { HmacSHA256 } from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';

const secureApiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': process.env.REACT_APP_VERSION,
  }
});

export const makeSecureRequest = async (apiKey: string, config: any) => {
  const encryptedKey = encryptApiKey(apiKey);
  const timestamp = Date.now();
  const requestSignature = generateRequestSignature(timestamp, config);
  
  return secureApiClient.post('/generate', {
    encryptedKey,
    config,
    timestamp,
    signature: requestSignature
  });
};

const getSigningSecret = (): string => {
  const secret = process.env.REACT_APP_SIGNING_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('Signing secret must be set in production');
  }
  return secret || 'fallback-signing-key-for-dev';
};

const SIGNING_SECRET = getSigningSecret();

const generateRequestSignature = (timestamp: number, payload: any): string => {
  // Create the string to sign
  const stringToSign = `${timestamp}.${JSON.stringify(payload)}`;
  // Generate HMAC signature
  const signature = HmacSHA256(stringToSign, SIGNING_SECRET);
  // Convert to Base64
  return Base64.stringify(signature);
}; 