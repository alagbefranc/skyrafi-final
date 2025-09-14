import { createClient } from '@supabase/supabase-js'
import { getEnv } from './env'

// Use getEnv helper to safely access environment variables in both Vite and CRA
const url = getEnv('REACT_APP_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
const anon = getEnv('REACT_APP_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY');

// Debug logging
console.log('Debug supabaseClient:', {
  'REACT_APP_SUPABASE_URL': getEnv('REACT_APP_SUPABASE_URL'),
  'VITE_SUPABASE_URL': getEnv('VITE_SUPABASE_URL'),
  'REACT_APP_SUPABASE_ANON_KEY': getEnv('REACT_APP_SUPABASE_ANON_KEY') ? '***KEY_FOUND***' : null,
  'VITE_SUPABASE_ANON_KEY': getEnv('VITE_SUPABASE_ANON_KEY') ? '***KEY_FOUND***' : null,
  'final url': url,
  'final anon': anon ? '***KEY_FOUND***' : null
});

if (!url || !anon) {
  // eslint-disable-next-line no-console
  console.warn('Supabase URL or Anon Key is missing. Check your .env.local configuration.')
}

export const supabase = createClient(url ?? '', anon ?? '')
