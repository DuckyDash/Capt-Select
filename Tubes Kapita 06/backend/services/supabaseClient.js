import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase Warning] SUPABASE_URL atau SUPABASE_KEY tidak ditemukan di environment. Database tidak akan terhubung.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
