import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vfshorvxtjvtvsflelfr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmc2hvcnZ4dGp2dHZzZmxlbGZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NzU2NjMsImV4cCI6MjA2NTQ1MTY2M30.CwRIVFEXEyBQPJAasZpsE0KH6QsSKF6kLHTO19Jxohg' // paste the anon public key here

export const supabase = createClient(supabaseUrl, supabaseKey)
