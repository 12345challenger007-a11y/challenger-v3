'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';

export default function DoubtsPage() {
  const [doubts, setDoubts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.from('doubts').select('id,title,body,created_at,profile_id').order('created_at', { ascending: false }).limit(50);
      if (!mounted) return;
      setDoubts(data ?? []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Community Doubts</h1>
      <DoubtForm onPosted={() => { /* refresh */ (async ()=>{ const { data } = await supabase.from('doubts').select('*').order('created_at', { ascending: false }).limit(50); setDoubts(data ?? []); })(); }} />
      {loading ? <div className="p-4 bg-white rounded shadow">Loading...</div> : (
        <div className="space-y-3">
          {doubts.map(d => (
            <div key={d.id} className="p-3 bg-white rounded shadow">
              <div className="text-sm text-slate-500">{new Date(d.created_at).toLocaleString()}</div>
              <h3 className="font-semibold">{d.title}</h3>
              <p className="text-sm mt-2">{d.body}</p>
            </div>
          ))}
          {!doubts.length && <div className="p-3 bg-white rounded">No doubts yet — be the first to ask!</div>}
        </div>
      )}
    </div>
  );
}

function DoubtForm({ onPosted }: { onPosted?: () => void }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.data?.user?.id;
    if (!uid) return alert('Login required');

    const resp = await fetch('/api/doubts/create', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-uid': uid }, body: JSON.stringify({ title, body }) });
    const json = await resp.json();
    setLoading(false);
    if (!resp.ok) return alert(json.error || 'Failed to post');
    setTitle(''); setBody('');
    onPosted?.();
  };

  return (
    <form onSubmit={post} className="p-3 bg-white rounded shadow">
      <div className="mb-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title" className="w-full border p-2 rounded" />
      </div>
      <div className="mb-2">
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe your doubt" className="w-full border p-2 rounded" rows={4} />
      </div>
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? 'Posting...' : 'Post Doubt'}</button>
      </div>
    </form>
  );
}
