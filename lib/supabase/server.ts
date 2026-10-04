import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in server env');
}

export const supabaseAdmin = createClient(url, serviceKey);
