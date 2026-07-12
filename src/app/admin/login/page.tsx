'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, BookOpen } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if already logged in on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.authenticated) {
          router.push('/admin');
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username || !password) {
      setError('Please fill in both fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in. Check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-primary text-white rounded-2xl shadow-inner">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-charcoal tracking-tight">
              Admin Portal Login
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Core Engineers Hub Database Control Panel
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} id="admin-login-form">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl flex items-start space-x-2.5 text-xs">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label htmlFor="login-username" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
                <input
                  type="text"
                  id="login-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm bg-gray-50/30"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm bg-gray-50/30"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-bold text-sm shadow transition-colors cursor-pointer"
              id="admin-login-submit"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Logging In...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
