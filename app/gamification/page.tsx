import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function GamificationPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return (<div className="p-4 bg-white rounded">Please login</div>);

  const { data: profile } = await supabase.from('profiles').select('id,username,xp,level,streak,reputation').eq('auth_uid', user.id).single();
  const { data: leaderboard } = await supabase.from('profiles').select('id,username,xp,level').order('xp', { ascending: false }).limit(10);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Gamification</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h4 className="font-semibold">You</h4>
          <div className="mt-2">XP: {profile?.xp ?? 0}</div>
          <div>Level: {profile?.level ?? 1}</div>
          <div>Streak: {profile?.streak ?? 0}</div>
        </div>
        <div className="p-4 bg-white rounded shadow col-span-2">
          <h4 className="font-semibold">Leaderboard</h4>
          <ul className="mt-3">
            {leaderboard?.map((p: any, idx: number) => (
              <li key={p.id} className="flex justify-between p-2 border-b">{idx+1}. {p.username}<span>{p.xp} XP</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
