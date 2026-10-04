'use client';
import { useEffect, useState } from 'react';

export default function ToggleDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const initial = stored ? stored === 'dark' : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(initial);
    document.documentElement.classList.toggle('dark', initial);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button aria-label="Toggle theme" onClick={toggle} className="p-2 rounded bg-slate-100 dark:bg-slate-700">
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
