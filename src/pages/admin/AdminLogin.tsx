import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import * as CONSTANTS from '../../lib/constants';
import skyrafiLogo from '../../assets/skyrafi-logo.png';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

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
          // Use Supabase SDK to invoke the function, which handles auth/headers automatically
          const { data: funcData, error: funcError } = await supabase.functions.invoke('admin-check');

          if (funcError) throw funcError;

          if (funcData?.is_admin) {
            navigate('/admin');
            return;
          }
          setMessage('This account is not authorized for admin. Please sign out and use an admin email.');
        } catch (e: any) {
          console.error('Admin check error:', e);
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
        // Use Supabase SDK to invoke the function
        const { data: funcData, error: funcError } = await supabase.functions.invoke('admin-check');

        if (funcError) {
          console.error('Admin check function error:', funcError);
          setMessage('Failed to verify admin privileges.');
          return;
        }

        if (funcData?.is_admin) {
          navigate('/admin');
          return;
        } else {
          setMessage('This account is not authorized for admin.');
          return;
        }
      } else {
        setMessage('Login failed. Please try again.');
      }
    } catch (e: any) {
      console.error('Login error:', e);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md relative z-10 border border-gray-100">

        <div className="flex justify-center mb-8">
          <img src={skyrafiLogo} alt="Skyrafi Logo" className="h-10 w-auto" />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2 font-chillax">Welcome Back</h1>
        <p className="text-sm text-center text-gray-500 mb-8">Sign in to access the admin dashboard</p>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium">{message}</p>
              <button onClick={handleSignOut} className="text-xs text-red-600 underline mt-1 hover:text-red-800">Sign out current session</button>
            </div>
          </div>
        )}

        <form onSubmit={signIn} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skyrafi.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-brand-blue text-white py-3.5 rounded-xl font-bold hover:bg-sky-600 transition-all duration-200 shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Restricted Access • Authorized Personnel Only</p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
