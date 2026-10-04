'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('');
  const [subjects, setSubjects] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.data?.user?.id;
    if (!uid) return alert('Login required');

    const payload = { auth_uid: uid, username, full_name: fullName, class: className, subjects: subjects.split(',').map(s=>s.trim()).filter(Boolean) };
    const resp = await fetch('/api/auth/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const json = await resp.json();
    if (!resp.ok) return alert(json.error || 'Failed');
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Set up your student profile</h2>
      <form onSubmit={submit} className="space-y-3">
        <input placeholder="Username" className="w-full border p-2 rounded" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Full name" className="w-full border p-2 rounded" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <input placeholder="Class (e.g. 12th)" className="w-full border p-2 rounded" value={className} onChange={(e) => setClassName(e.target.value)} />
        <input placeholder="Subjects (comma separated)" className="w-full border p-2 rounded" value={subjects} onChange={(e) => setSubjects(e.target.value)} />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
