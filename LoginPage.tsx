import React, { useState } from 'react';
import { useAuth, API_BASE_URL } from './AuthContext';
import { Employee, UserRole } from './types';

const LoginPage: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgot_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      const user: Employee = {
        id: data.user.id,
        name: data.user.name,
        role: data.user.role as UserRole,
        avatarUrl: data.user.avatarUrl,
        teamId: data.user.teamId,
      };
      login(data.token, user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setResetSuccess(false);

    try {
        // Implementation for password reset via backend would go here
        // await fetch(`${API_BASE_URL}/auth/forgot-password`, ...)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResetSuccess(true);
    } catch (err) {
        setError("Failed to process request. Please try again later.");
    } finally {
        setIsLoading(false);
    }
  };

  const toggleView = (newView: 'login' | 'forgot_password') => {
      setView(newView);
      setError(null);
      setResetSuccess(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-enter">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg transform -rotate-3">
            N
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">NEO</h1>
        </div>

        {view === 'forgot_password' ? (
            <>
                <h2 className="text-center text-2xl font-bold mb-2 text-slate-800">Reset Password</h2>
                <p className="text-center text-slate-500 mb-8 text-sm px-4">Enter your email and we'll send you instructions to reset your password.</p>
                
                {resetSuccess ? (
                    <div className="text-center">
                        <div className="bg-emerald-50 text-emerald-700 p-5 rounded-xl mb-6 border border-emerald-100 flex flex-col items-center">
                            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            <p className="font-semibold">Check your email</p>
                            <p className="text-sm opacity-90 mt-1">We've sent reset instructions to <strong>{email}</strong>.</p>
                        </div>
                        <button 
                            onClick={() => toggleView('login')}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                        >
                            Return to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label htmlFor="reset-email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Work Email</label>
                            <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                         {error && <p className="text-red-600 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>}
                         <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Processing...' : 'Send Instructions'}
                        </button>
                        <div className="text-center">
                             <button 
                                type="button"
                                onClick={() => toggleView('login')}
                                className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                )}
            </>
        ) : (
            <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                  <p className="text-slate-500 text-sm mt-1">Please enter your details to sign in</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.doe@neo.com"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                        <button 
                            type="button"
                            onClick={() => toggleView('forgot_password')}
                            className="text-xs text-blue-600 hover:text-blue-800 font-bold tracking-tight hover:underline transition-colors"
                        >
                            Forgot?
                        </button>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                </div>
                {error && <p className="text-red-600 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : 'Sign In'}
                </button>
                </form>
            </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;