import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Employee, UserRole } from './types'; // Ensure UserRole is imported

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
      const response = await fetch('https://neoback-end.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();
      const user: Employee = {
        id: data.user.id,
        name: data.user.name,
        role: data.user.role as UserRole, // Cast to UserRole enum
        avatarUrl: data.user.avatarUrl,
        teamId: data.user.teamId,
      };
      login(data.token, user);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during login.");
      }
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
        // Simulating a backend call for password reset
        // In a real scenario, this would likely be: 
        // await fetch('https://neoback-end.vercel.app/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResetSuccess(true);
    } catch (err) {
        setError("Failed to process request. Please try again.");
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
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-enter">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            N
          </div>
          <h1 className="text-3xl font-bold text-slate-800">NEO</h1>
        </div>

        {view === 'forgot_password' ? (
            <>
                <h2 className="text-center text-2xl font-bold mb-2 text-slate-800">Reset Password</h2>
                <p className="text-center text-slate-500 mb-6 text-sm">Enter your email to receive reset instructions.</p>
                
                {resetSuccess ? (
                    <div className="text-center">
                        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 border border-green-100">
                            <p className="font-medium">Check your email</p>
                            <p className="text-sm mt-1">If an account exists for <strong>{email}</strong>, we have sent password reset instructions to it.</p>
                        </div>
                        <button 
                            onClick={() => toggleView('login')}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                            <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g., alex.doe@neo.com"
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                         {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                         <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : 'Send Reset Link'}
                        </button>
                        <div className="text-center">
                             <button 
                                type="button"
                                onClick={() => toggleView('login')}
                                className="text-slate-500 hover:text-slate-700 text-sm font-medium hover:underline"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                )}
            </>
        ) : (
            <>
                <h2 className="text-center text-2xl font-bold mb-6 text-slate-800">Login to your account</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                    <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., alex.doe@neo.com"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                        <button 
                            type="button"
                            onClick={() => toggleView('forgot_password')}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading && (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    )}
                    Login
                </button>
                </form>
            </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;