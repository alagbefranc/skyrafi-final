// Cross-bundler environment reader that supports Vite (VITE_*) and CRA (REACT_APP_*)
export const getEnv = (key: string): string | undefined => {
  // Debug logging
  console.log(`getEnv called with key: ${key}`);
  
  // Safe process.env access - process.env is replaced at build time in CRA
  const env = (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>;
  
  console.log('Available process.env keys:', Object.keys(env).filter(k => k.includes('SUPABASE')));
  
  // Try the requested key first from process.env
  const fromProcess = env[key];
  console.log(`fromProcess[${key}]:`, fromProcess ? '***FOUND***' : 'NOT_FOUND');
  if (fromProcess !== undefined && fromProcess !== null) return fromProcess as string;
  
  // For Vite compatibility (development only) - try import.meta.env
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env) {
      const fromImport = (import.meta as any).env[key];
      console.log(`fromImport[${key}]:`, fromImport ? '***FOUND***' : 'NOT_FOUND');
      if (fromImport !== undefined && fromImport !== null) return fromImport as string;
    }
  } catch (e) {
    console.log('import.meta error:', e);
  }
  
  // Try fallback prefixes
  if (key.startsWith('VITE_')) {
    const alt = 'REACT_APP_' + key.slice(5);
    const altVal = env[alt];
    console.log(`fallback[${alt}]:`, altVal ? '***FOUND***' : 'NOT_FOUND');
    if (altVal !== undefined && altVal !== null) return altVal;
  }
  if (key.startsWith('REACT_APP_')) {
    const alt = 'VITE_' + key.slice('REACT_APP_'.length);
    try {
      if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.[alt]) {
        const altVal = (import.meta as any).env[alt];
        console.log(`vite_fallback[${alt}]:`, altVal ? '***FOUND***' : 'NOT_FOUND');
        return altVal;
      }
    } catch (e) {
      console.log('vite fallback error:', e);
    }
  }
  
  console.log(`getEnv returning undefined for ${key}`);
  return undefined;
};
