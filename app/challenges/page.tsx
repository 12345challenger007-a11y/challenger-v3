import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function ChallengesPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: challenges } = await supabase.from('challenges').select('*').order('starts_at', { ascending: true }).limit(50);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Challenges</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {challenges?.map((c: any) => (
          <div key={c.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{c.title}</h3>
            <div className="text-sm text-slate-500">{c.kind} • Starts: {new Date(c.starts_at).toLocaleString()}</div>
            <p className="mt-2 text-sm">Reward XP: {c.reward_xp}</p>
            <div className="mt-3">
              <a href={`/challenges/${c.id}`} className="px-3 py-1 bg-indigo-600 text-white rounded">Join</a>
            </div>
          </div>
        ))}
        {!challenges?.length && <div className="p-4 bg-white rounded">No challenges scheduled yet.</div>}
      </div>
    </div>
  );
}
