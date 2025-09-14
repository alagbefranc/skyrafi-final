import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import * as CONSTANTS from '../../lib/constants';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        try {
          // Only allow redirect to /admin if this session belongs to an allowlisted admin
          const checkUrl = CONSTANTS.SUPABASE_ADMIN_CHECK_URL;
          const anonKey = CONSTANTS.SUPABASE_ANON_KEY;
          const token = data.session.access_token;
          if (checkUrl && anonKey && token) {
            const res = await fetch(checkUrl, {
              headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
            });
            const json = await res.json();
            if (res.ok && json?.is_admin) {
              navigate('/admin');
              return;
            }
            setMessage('This account is not authorized for admin. Please sign out and use an admin email.');
          }
        } catch (e: any) {
          setMessage(e?.message || 'Failed to verify admin status');
        }
      }
    };
    checkSession();
  }, [navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage(null);
      // Verify email is in admins allowlist before attempting password login
      const { data: admins, error: adminErr } = await supabase
        .from('admins')
        .select('email')
        .eq('email', email)
        .limit(1);
      if (adminErr) throw adminErr;
      if (!admins || admins.length === 0) {
        setMessage('This email is not authorized for admin access.');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) {
        // Double-check admin status to avoid redirect loops
        const checkUrl = CONSTANTS.SUPABASE_ADMIN_CHECK_URL;
        const anonKey = CONSTANTS.SUPABASE_ANON_KEY;
        const token = data.session.access_token;
        console.log('Admin check debug:', { checkUrl, anonKey: anonKey ? 'present' : 'missing', token: token ? 'present' : 'missing' });
        if (!checkUrl) {
          console.error('Missing admin check URL');
          setMessage('Missing admin check URL');
          return;
        }
        if (checkUrl && anonKey && token) {
          const res = await fetch(checkUrl, { headers: { Authorization: `Bearer ${token}`, apikey: anonKey } });
          const json = await res.json();
          if (res.ok && json?.is_admin) {
            navigate('/admin');
            return;
          } else {
            setMessage('This account is not authorized for admin.');
            return;
          }
        }
      } else {
        setMessage('Login failed. Please try again.');
      }
    } catch (e: any) {
      setMessage(e?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <p className="text-sm text-gray-600 mb-4">Sign in with your admin email and password. Sign-ups are disabled.</p>
        <form onSubmit={signIn} className="space-y-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@yourcompany.com" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue-500 focus:ring-2 focus:ring-sky-blue-200 outline-none transition" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-blue-500 focus:ring-2 focus:ring-sky-blue-200 outline-none transition" />
          <button disabled={loading} className="w-full bg-sky-blue-600 text-white py-3 rounded-full font-semibold hover:bg-sky-blue-700 transition disabled:opacity-50">{loading ? 'Signing in…' : 'Sign In'}</button>
        </form>
        {message && (
          <div className="mt-3 space-y-2">
            <p className="text-sm">{message}</p>
            <button onClick={handleSignOut} className="text-sm text-sky-blue-700 underline">Sign out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
