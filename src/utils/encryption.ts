import { AES, enc } from 'crypto-js';

const getEncryptionKey = (): string => {
  const key = process.env.REACT_APP_ENCRYPTION_KEY;
  if (!key && process.env.NODE_ENV === 'production') {
    throw new Error('Encryption key must be set in production');
  }
  return key || 'fallback-key-for-dev';
};

const ENCRYPTION_KEY = getEncryptionKey();

export const encryptApiKey = (apiKey: string): string => {
  return AES.encrypt(apiKey, ENCRYPTION_KEY).toString();
};

export const decryptApiKey = (encryptedKey: string): string => {
  const bytes = AES.decrypt(encryptedKey, ENCRYPTION_KEY);
  return bytes.toString(enc.Utf8);
}; 