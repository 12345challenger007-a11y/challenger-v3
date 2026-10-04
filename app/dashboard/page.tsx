import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6 bg-white rounded shadow">
        <h3>Please login</h3>
      </div>
    );
  }

  // fetch profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('auth_uid', user.id).single();

  // recent attempts, streak, xp
  const { data: attempts } = await supabase.from('test_attempts').select('*').eq('profile_id', profile?.id).order('created_at', { ascending: false }).limit(5);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold">Welcome back, {profile?.full_name ?? profile?.username}</h2>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="p-3 bg-indigo-50 rounded">
            <div className="text-sm">XP</div>
            <div className="text-lg font-bold">{profile?.xp ?? 0}</div>
          </div>
          <div className="p-3 bg-indigo-50 rounded">
            <div className="text-sm">Level</div>
            <div className="text-lg font-bold">{profile?.level ?? 1}</div>
          </div>
          <div className="p-3 bg-indigo-50 rounded">
            <div className="text-sm">Streak</div>
            <div className="text-lg font-bold">{profile?.streak ?? 0}d</div>
          </div>
          <div className="p-3 bg-indigo-50 rounded col-span-2 md:col-span-3">
            <div className="text-sm">Continue Learning</div>
            <div className="text-lg font-bold">Mathematics — Chapter 3</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Recent tests</h3>
          <ul className="mt-3 space-y-2">
            {attempts?.map((a: any) => (
              <li key={a.id} className="p-2 border rounded">
                <div className="flex justify-between">
                  <div className="text-sm">{a.test_id}</div>
                  <div className="text-sm font-semibold">{a.score}</div>
                </div>
              </li>
            ))}
            {!attempts?.length && <div className="text-sm text-slate-500 mt-2">No recent tests</div>}
          </ul>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Challenge of the Day</h3>
          <p className="text-sm text-slate-600 mt-2">10 Questions • 5 Minutes</p>
          <div className="mt-4">
            <a href="/challenges" className="px-3 py-2 bg-indigo-600 text-white rounded">Start</a>
          </div>
        </div>
      </div>
    </div>
  );
}
