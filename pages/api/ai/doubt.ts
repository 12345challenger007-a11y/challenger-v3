import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { callAI } from '../../../lib/ai/server';
import { rateLimit } from '../../../lib/utils/ratelimit';
import { supabaseAdmin } from '../../../lib/supabase/server';

const schema = z.object({
  question: z.string().min(5),
  imageUrl: z.string().url().optional(),
  subject: z.string().optional().nullable(),
  topic: z.string().optional().nullable(),
  mode: z.enum(['explain', 'step', 'hint']).optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

    // Basic rate limiting by IP (dev). In production, use edge rate limiters.
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown') as string;
    const ok = rateLimit(`ai:${ip}`, 12, 1);
    if (!ok) return res.status(429).json({ error: 'Rate limit exceeded' });

    // Call AI
    const aiResp = await callAI(parsed.data);

    // Save AI query (optional) for analytics (server-side)
    // NOTE: requires SUPABASE_SERVICE_ROLE_KEY
    try {
      await supabaseAdmin.from('announcements').insert([
        {
          title: 'ai-log',
          body: JSON.stringify({ q: parsed.data, r: aiResp }),
          starts_at: new Date()
        }
      ]);
    } catch (_) {
      // ignore errors from admin logging — do not block
    }

    return res.status(200).json(aiResp);
  } catch (err: any) {
    console.error('AI error', err);
    if (err.message?.includes('Missing')) {
      return res.status(500).json({ error: 'Server misconfigured: AI API key missing' });
    }
    return res.status(500).json({ error: 'AI service error' });
  }
}
