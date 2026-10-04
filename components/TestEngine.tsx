'use client';
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase/client';

export default function TestEngine({ test }: { test: any }) {
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(test.duration_seconds ?? 300);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, []);

  const toggleMark = (qid: string) => setMarked(m => ({ ...m, [qid]: !m[qid] }));
  const selectOption = (qid: string, optionId: string) => setAnswers(a => ({ ...a, [qid]: optionId }));

  const submit = async () => {
    // resolve profile id
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.data?.user?.id;
    if (!uid) return alert('Please login');
    const { data: profile } = await supabase.from('profiles').select('id').eq('auth_uid', uid).single();
    if (!profile) return alert('Profile not found — complete onboarding');

    const payload = {
      profile_id: profile.id,
      test_id: test.id,
      answers: test.questions.map((q: any) => ({ question_id: q.id, selected_option_id: answers[q.id] ?? null, time_spent_seconds: 0 })),
      time_taken_seconds: (test.duration_seconds ?? 300) - timeLeft
    };

    const resp = await fetch('/api/tests/attempt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const json = await resp.json();
    if (!resp.ok) return alert(json.error || 'Submission failed');
    // navigate to results (simple)
    alert(`Submitted! Score: ${json.score}`);
    window.location.href = '/dashboard';
  };

  const q = test.questions[current];

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <div>Time left: <span className="font-mono">{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</span></div>
        <div className="flex gap-2">
          <button onClick={() => setCurrent((c) => Math.max(0, c-1))} className="px-3 py-1 border rounded">Prev</button>
          <button onClick={() => setCurrent((c) => Math.min(test.questions.length-1, c+1))} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-slate-500">Question {current+1} / {test.questions.length}</div>
        <div className="mt-2 text-lg">{q.content}</div>
        <div className="mt-3 space-y-2">
          {/* Render options from question_options table isn't loaded — assume q has options */}
          {(q.options ?? q.question_options ?? []).map((o: any) => (
            <label key={o.id} className={`block p-2 border rounded ${answers[q.id] === o.id ? 'bg-indigo-50 border-indigo-200' : ''}`}>
              <input type="radio" name={`opt-${q.id}`} checked={answers[q.id] === o.id} onChange={() => selectOption(q.id, o.id)} className="mr-2" />
              {o.content}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => toggleMark(q.id)} className="px-3 py-1 border rounded">{marked[q.id] ? 'Unmark' : 'Mark for review'}</button>
        </div>
        <div className="flex gap-2">
          <button onClick={submit} className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-6 gap-2">
        {test.questions.map((qq: any, idx: number) => (
          <button key={qq.id} onClick={() => setCurrent(idx)} className={`p-2 rounded ${idx===current ? 'bg-indigo-600 text-white':'bg-slate-100'}`}>{idx+1}</button>
        ))}
      </div>
    </div>
  );
}
