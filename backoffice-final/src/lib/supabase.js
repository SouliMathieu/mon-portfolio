// src/lib/supabase.js
// ⚠️  Remplace les valeurs ci-dessous par tes vraies clés Supabase
// Dashboard Supabase → Settings → API

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || 'https://VOTRE_PROJET.supabase.co'
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || 'VOTRE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
})
