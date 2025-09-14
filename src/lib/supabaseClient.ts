import { createClient } from '@supabase/supabase-js'

// Direct configuration - Netlify env injection not working with CRA build
const SUPABASE_URL = 'https://wbxmcxqryiggwzzklcdc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieG1jeHFyeWlnZ3d6emtsY2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4Mjk3NTQsImV4cCI6MjA3MzQwNTc1NH0.kplVnhg45HyiR7IKFGOjbUKLHOvw_0KuGwMZV_gFQVQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
