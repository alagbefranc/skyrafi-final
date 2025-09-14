// CRA-compatible environment reader that supports both VITE_* and REACT_APP_* prefixes
export const getEnv = (key: string): string | undefined => {
  // Debug logging
  console.log(`getEnv called with key: ${key}`);
  
  // Safe process.env access - process.env is replaced at build time in CRA
  const env = (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>;
  
  // Debug: Log ALL environment variables to see what's available
  console.log('ALL environment variables:', env);
  console.log('Available SUPABASE keys:', Object.keys(env).filter(k => k.includes('SUPABASE')));
  
  // Direct lookup first
  const direct = env[key];
  console.log(`Direct lookup for ${key}:`, direct);
  if (direct !== undefined && direct !== null) return direct;
  
  // Try alternative prefixes for cross-compatibility
  if (key.startsWith('VITE_')) {
    const reactKey = 'REACT_APP_' + key.slice(5);
    const reactVal = env[reactKey];
    console.log(`Alternative lookup ${key} -> ${reactKey}:`, reactVal);
    if (reactVal !== undefined && reactVal !== null) return reactVal;
  }
  
  if (key.startsWith('REACT_APP_')) {
    const viteKey = 'VITE_' + key.slice('REACT_APP_'.length);
    const viteVal = env[viteKey];
    console.log(`Alternative lookup ${key} -> ${viteKey}:`, viteVal);
    if (viteVal !== undefined && viteVal !== null) return viteVal;
  }
  
  console.log(`No value found for ${key}`);
  return undefined;
};
