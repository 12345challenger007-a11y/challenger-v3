import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-indigo-600">CHALLENGER</Link>
        <nav className="flex items-center gap-4">
          <Link href="/learn" className="text-sm text-slate-600">Learn</Link>
          <Link href="/practice" className="text-sm text-slate-600">Practice</Link>
          <Link href="/doubts" className="text-sm text-slate-600">Community</Link>
          <Link href="/login" className="text-sm text-indigo-600">Login</Link>
        </nav>
      </div>
    </header>
  );
}
