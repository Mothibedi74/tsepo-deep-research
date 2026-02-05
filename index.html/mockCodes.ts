// Mock database of 500 unique AppSumo redemption codes
// Format: SUMO-XXXX (e.g., SUMO-1001 to SUMO-1500)
export const APPSUMO_CODES = new Set(
  Array.from({ length: 500 }, (_, i) => `SUMO-${1001 + i}`)
);

export const isValidCode = (code: string): boolean => {
  return APPSUMO_CODES.has(code.trim().toUpperCase());
};

/**
 * Mock API call to verify Gumroad/Lemon Squeezy license keys
 * In a real app, this would fetch from your backend or provider API
 */
export const verifyLicenseAPI = async (key: string): Promise<boolean> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const normalizedKey = key.trim().toUpperCase();

  // Rule: Any key starting with 'DEEP-' followed by 4 or more chars is "valid" for this demo
  const isSumo = isValidCode(normalizedKey);
  const isGumroad = normalizedKey.startsWith('DEEP-') && key.length > 8;
  
  return isSumo || isGumroad;
};