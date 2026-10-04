'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import TestEngine from '../../components/TestEngine';

export default function TestPageClient({ params }: { params: { testId: string } }) {
  const { testId } = params;
  const [test, setTest] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.from('tests').select('*').eq('id', testId).single();
      const { data: tqs } = await supabase.from('test_questions').select('id,question_id,order_no,question:questions(*)').eq('test_id', testId).order('order_no', { ascending: true });
      if (!mounted) return;
      setTest({ ...data, questions: tqs?.map((q: any) => q.question) ?? [] });
    })();
    return () => { mounted = false; };
  }, [testId]);

  if (!test) return <div className="p-4 bg-white rounded shadow">Loading test...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{test.title}</h2>
      <TestEngine test={test} />
    </div>
  );
}
