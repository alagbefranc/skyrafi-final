// Cross-bundler environment reader that supports Vite (VITE_*) and CRA (REACT_APP_*)
export const getEnv = (key: string): string | undefined => {
  // Debug logging
  console.log(`getEnv called with key: ${key}`);
  
  // Safe process.env access - process.env is replaced at build time in CRA
  const env = (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>;
  
  console.log('Available process.env keys:', Object.keys(env).filter(k => k.includes('SUPABASE')));
  try {
    // Use a more defensive approach to access import.meta
    let fromImport: string | undefined
    let fromProcess: string | undefined
    
    // Try import.meta.env if available
    if (typeof window !== 'undefined' && 'import' in window) {
      try {
        fromImport = (import.meta as any)?.env?.[key]
      } catch {
        // ignore import.meta access errors
      }
    }
    
    // Try process.env
    if (typeof process !== 'undefined' && process.env) {
      fromProcess = process.env[key]
    }
    
    if (fromImport !== undefined && fromImport !== null) return fromImport as string
    if (fromProcess !== undefined && fromProcess !== null) return fromProcess as string
    
    // Try alternative prefixes
    if (key.startsWith('VITE_')) {
      const alt = 'REACT_APP_' + key.slice(5)
      const altVal = fromProcess || undefined
      return altVal as string | undefined
    }
    if (key.startsWith('REACT_APP_')) {
      const alt = 'VITE_' + key.slice('REACT_APP_'.length)
      const altVal = fromProcess || undefined
      return altVal as string | undefined
    }
    return undefined
  } catch {
    // Fallback for environments where neither is available
    return undefined
  }
};
