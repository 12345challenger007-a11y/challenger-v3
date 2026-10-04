import { supabaseAdmin } from '../supabase/server';

// Server-side admin helper: checks environment ADMIN_EMAILS first, then admin_users table
export async function isServerAdminByEmail(email?: string | null) {
  const envList = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (email && envList.includes(email.toLowerCase())) return true;
  return false;
}

export async function isServerAdminByUid(uid?: string | null) {
  if (!uid) return false;
  const { data } = await supabaseAdmin.from('admin_users').select('id').eq('auth_uid', uid).limit(1).maybeSingle();
  return !!data;
}
