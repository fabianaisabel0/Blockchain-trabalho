import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const rawUrl = env.VITE_SUPABASE_URL;
const rawKey = env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(
  rawUrl && 
  rawUrl !== 'undefined' && 
  rawUrl !== '' &&
  rawUrl.includes('supabase.co') &&
  rawKey && 
  rawKey !== 'undefined' && 
  rawKey !== ''
);

const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawKey : 'placeholder';

if (!isSupabaseConfigured) {
  console.warn('Supabase configuration is missing or invalid. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
