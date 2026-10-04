import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (!user || !adminEmails.includes((user.email || '').toLowerCase())) {
    return (<div className="p-6 bg-white rounded">Unauthorized — admin only</div>);
  }

  // fetch stats
  const { data: profiles } = await supabase.from('profiles').select('id,username,xp,level').order('xp', { ascending: false }).limit(20);
  const { data: counts } = await supabase.rpc('get_counts', {}); // optional rpc — may not exist

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h4 className="font-semibold">Top Students</h4>
          <ul className="mt-3 space-y-2">
            {profiles?.map(p => (
              <li key={p.id} className="flex justify-between"><span>{p.username}</span><span>{p.xp} XP</span></li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h4 className="font-semibold">Quick Actions</h4>
          <div className="mt-3 space-y-2">
            <button className="px-3 py-1 bg-red-50 text-red-600 rounded">Suspend user</button>
            <button className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded">Create announcement</button>
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h4 className="font-semibold">System</h4>
          <div className="text-sm text-slate-500 mt-2">Tasks, jobs and analytics will appear here.</div>
        </div>
      </div>
    </div>
  );
}
