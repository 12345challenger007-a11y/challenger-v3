import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { supabaseAdmin } from '../../../lib/supabase/server';

const schema = z.object({
  profile_id: z.string().uuid(),
  test_id: z.string().uuid(),
  answers: z.array(
    z.object({
      question_id: z.string().uuid(),
      selected_option_id: z.string().nullable(),
      time_spent_seconds: z.number().optional().default(0)
    })
  ),
  time_taken_seconds: z.number().optional().default(0)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const { profile_id, test_id, answers, time_taken_seconds } = parsed.data;

    // fetch correct answers
    const questionIds = answers.map((a) => a.question_id);
    const { data: options } = await supabaseAdmin
      .from('question_options')
      .select('id,question_id,is_correct')
      .in('question_id', questionIds);

    const optionMap = new Map(options?.map((o: any) => [o.id, o]) ?? []);

    let correct = 0;
    let incorrect = 0;
    const answerRows: any[] = [];

    for (const a of answers) {
      const sel = a.selected_option_id;
      const isCorrect = sel ? optionMap.get(sel)?.is_correct === true : false;
      if (isCorrect) correct++;
      else incorrect++;
      answerRows.push({
        question_id: a.question_id,
        selected_option: sel,
        correct: isCorrect,
        time_spent_seconds: a.time_spent_seconds ?? 0
      });
      // Save to mistakes if wrong
      if (!isCorrect) {
        // upsert mistake
        await supabaseAdmin.rpc('upsert_mistake', { p_profile_id: profile_id, p_question_uuid: a.question_id });
      }
    }

    const score = Math.round((correct / Math.max(1, correct + incorrect)) * 100);

    const { data: attempt } = await supabaseAdmin
      .from('test_attempts')
      .insert([
        {
          test_id,
          profile_id,
          ended_at: new Date().toISOString(),
          score,
          correct,
          incorrect,
          time_taken_seconds
        }
      ])
      .select()
      .single();

    // insert answers
    const toInsert = answerRows.map((r) => ({ attempt_id: attempt.id, ...r }));
    await supabaseAdmin.from('test_answers').insert(toInsert);

    // award XP based on score
    const xpAward = Math.round(score / 10) + correct;
    await supabaseAdmin.from('xp_transactions').insert([{ profile_id, amount: xpAward, reason: 'test_attempt' }]);
    await supabaseAdmin.rpc('increment_profile_xp', { p_profile_id: profile_id, p_xp: xpAward });

    return res.status(200).json({ attempt, score, correct, incorrect });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: 'server error' });
  }
}
