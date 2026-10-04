import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import Avatar from './Avatar';
import ToggleDarkMode from './ToggleDarkMode';

export default function Header() {
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.data?.user?.id;
      if (!uid) return;
      const { data } = await supabase.from('profiles').select('username,avatar_url').eq('auth_uid', uid).single();
      if (!mounted) return;
      setProfile(data);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-indigo-600 dark:text-indigo-300">CHALLENGER</Link>
        <nav className="flex items-center gap-4">
          <Link href="/learn" className="text-sm text-slate-600 dark:text-slate-200">Learn</Link>
          <Link href="/practice" className="text-sm text-slate-600 dark:text-slate-200">Practice</Link>
          <Link href="/doubts" className="text-sm text-slate-600 dark:text-slate-200">Community</Link>
          <Link href="/challenges" className="text-sm text-slate-600 dark:text-slate-200">Challenges</Link>
          <ToggleDarkMode />
          {profile ? (
            <Link href="/profile" className="flex items-center gap-2">
              <Avatar src={profile.avatar_url} alt={profile.username} />
              <span className="hidden sm:inline text-sm text-slate-700 dark:text-slate-200">{profile.username}</span>
            </Link>
          ) : (
            <Link href="/login" className="text-sm text-indigo-600">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
