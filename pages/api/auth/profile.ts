import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase/server';
import { z } from 'zod';

const createSchema = z.object({
  auth_uid: z.string(),
  username: z.string().min(3),
  full_name: z.string().optional().nullable(),
  class: z.string().optional().nullable(),
  subjects: z.array(z.string()).optional(),
  target_exam: z.string().optional().nullable()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

      const payload = {
        ...parsed.data,
        subjects: parsed.data.subjects ?? []
      };
      const { data, error } = await supabaseAdmin.from('profiles').insert([payload]).select().single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    } else if (req.method === 'GET') {
      const { uid } = req.query;
      if (!uid || typeof uid !== 'string') return res.status(400).json({ error: 'uid required' });
      const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('auth_uid', uid).single();
      if (error) return res.status(404).json({ error: 'Profile not found' });
      return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
