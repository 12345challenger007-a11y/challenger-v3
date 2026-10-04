'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';

export default function ChallengeAttempt({ params }: { params: { id: string } }) {
  const { id } = params;
  const [challenge, setChallenge] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.from('challenges').select('*').eq('id', id).single();
      if (!mounted) return;
      setChallenge(data);
    })();
    return () => { mounted = false; };
  }, [id]);

  if (!challenge) return <div className="p-4 bg-white rounded">Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold">{challenge.title}</h2>
      <p className="text-sm text-slate-500">{challenge.kind} • Reward: {challenge.reward_xp} XP</p>
      <div className="mt-4">
        <a href="/practice" className="px-3 py-2 bg-indigo-600 text-white rounded">Start Challenge (uses Practice engine)</a>
      </div>
    </div>
  );
}
