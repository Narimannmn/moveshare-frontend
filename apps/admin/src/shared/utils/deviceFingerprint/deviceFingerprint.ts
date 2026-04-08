/**
 * Generate a device fingerprint based on browser and device characteristics
 * This creates a semi-unique identifier for the device without using cookies
 */
export const generateDeviceFingerprint = (): string => {
  // Check if we already have a fingerprint in sessionStorage
  const existingFingerprint = sessionStorage.getItem("device-fingerprint");
  if (existingFingerprint) {
    return existingFingerprint;
  }

  // Collect browser characteristics
  const navigator = window.navigator;
  const screen = window.screen;

  const characteristics = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ];

  // Create a simple hash from characteristics
  const fingerprintString = characteristics.join("|");
  const fingerprint = simpleHash(fingerprintString);

  // Store in sessionStorage for consistency during the session
  sessionStorage.setItem("device-fingerprint", fingerprint);

  return fingerprint;
};

/**
 * Simple hash function to convert string to hash
 */
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

/**
 * Get the current device fingerprint
 */
export const getDeviceFingerprint = (): string => {
  return generateDeviceFingerprint();
};
