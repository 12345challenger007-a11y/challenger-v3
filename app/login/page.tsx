'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={signIn} className="space-y-4">
        <label className="block">
          <span className="text-sm">Email</span>
          <input className="mt-1 w-full border rounded p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input type="password" className="mt-1 w-full border rounded p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <div className="flex items-center justify-between">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
          <a href="/signup" className="text-sm text-indigo-600">Create account</a>
        </div>
      </form>
    </div>
  );
}
