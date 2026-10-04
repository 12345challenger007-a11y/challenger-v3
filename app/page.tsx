import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">CHALLENGER</h1>
          <p className="mt-4 text-xl text-slate-600">Learn • Practice • Challenge • Achieve</p>
          <div className="mt-6 flex gap-3">
            <Link href="/signup" className="px-5 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
              Get Started
            </Link>
            <Link href="/login" className="px-5 py-3 border rounded-lg">
              Login
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white">
            <h3 className="text-lg font-semibold">Challenge of the Day</h3>
            <p className="mt-2">10 Questions • 5 Minutes • Beat Your Best Score</p>
            <div className="mt-4">
              <Link href="/challenges" className="inline-block bg-white/20 px-4 py-2 rounded-full">
                Start Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        <div className="p-5 rounded-lg bg-white shadow">
          <h4 className="font-semibold">AI Doubt Solver</h4>
          <p className="text-sm text-slate-500 mt-2">Ask questions or upload images — AI helps you understand step-by-step.</p>
        </div>
        <div className="p-5 rounded-lg bg-white shadow">
          <h4 className="font-semibold">Daily Challenges</h4>
          <p className="text-sm text-slate-500 mt-2">Compete on timed tests and climb the leaderboard.</p>
        </div>
        <div className="p-5 rounded-lg bg-white shadow">
          <h4 className="font-semibold">Community</h4>
          <p className="text-sm text-slate-500 mt-2">Post doubts, get replies, and earn reputation.</p>
        </div>
      </section>
    </div>
  );
}
