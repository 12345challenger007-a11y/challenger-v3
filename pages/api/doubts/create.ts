import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(5),
  body: z.string().min(10)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

    const uid = req.headers['x-user-uid'] as string | undefined;
    if (!uid) return res.status(401).json({ error: 'Missing user header' });

    // find profile
    const { data: profile } = await supabaseAdmin.from('profiles').select('id').eq('auth_uid', uid).single();
    if (!profile?.id) return res.status(400).json({ error: 'Profile not found' });

    const { data, error } = await supabaseAdmin.from('doubts').insert([{ profile_id: profile.id, title: parsed.data.title, body: parsed.data.body }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
