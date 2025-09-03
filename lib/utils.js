import { nanoid } from 'nanoid';

export const generateShortCode = (length = 6) => {
  return nanoid(length);
};

export const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

export const normalizeUrl = (url) => {
  if (!url) return '';
  
  url = url.trim();
  
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
};

export const sanitizeEmail = (email) => {
  return email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
};

export const validateShortCode = (shortCode) => {
  if (!shortCode) return true; // Optional field
  
  // Allow letters, numbers, hyphens, and underscores
  const regex = /^[a-zA-Z0-9_-]+$/;
  return regex.test(shortCode) && shortCode.length >= 3 && shortCode.length <= 20;
};