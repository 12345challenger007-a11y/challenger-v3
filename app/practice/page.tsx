import Link from 'next/link';
import { supabase } from '../../lib/supabase/client';

export default async function PracticePage() {
  // Server component: fetch published tests using server-side admin client would be ideal,
  // but use anonymous client for simplicity (reads are public)
  const { data: tests } = await supabase.from('tests').select('id,title,subject_id,chapter_id,duration_seconds,total_questions').eq('published', true).limit(50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Practice</h1>
        <Link href="/practice/random" className="text-indigo-600">Random Test</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {tests?.map((t: any) => (
          <div key={t.id} className="p-4 bg-white rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <div className="text-sm text-slate-500">Questions: {t.total_questions} • {Math.ceil((t.duration_seconds ?? 600)/60)} mins</div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/practice/${t.id}`} className="px-3 py-1 bg-indigo-600 text-white rounded">Start</Link>
              </div>
            </div>
          </div>
        ))}

        {!tests?.length && <div className="p-4 bg-white rounded shadow">No tests published yet.</div>}
      </div>
    </div>
  );
}
