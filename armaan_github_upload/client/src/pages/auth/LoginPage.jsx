import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Globe, Lock, Mail, ArrowRight, Sparkles, Store, ShieldCheck, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'BUSINESS_OWNER') {
        navigate('/dashboard');
      } else {
        navigate(from === '/' ? '/explore' : from);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      const user = await demoLogin(role);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'BUSINESS_OWNER') {
        navigate('/dashboard');
      } else {
        navigate('/explore');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full">
        
        {/* Logo Card Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">Web<span className="text-brand-600">Hub</span></span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in to manage your business website, inquiries, and analytics</p>
        </div>

        {/* 1-Click Evaluator Demo Card */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-amber-900 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Instant Demo Access</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('BUSINESS_OWNER')}
              className="px-2.5 py-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors flex flex-col items-center gap-1 shadow-xs"
            >
              <Store className="w-4 h-4 text-blue-600" />
              <span>Owner</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN')}
              className="px-2.5 py-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors flex flex-col items-center gap-1 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('VISITOR')}
              className="px-2.5 py-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors flex flex-col items-center gap-1 shadow-xs"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Visitor</span>
            </button>
          </div>
        </div>

        {/* Main Login Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
          {error && (
            <div className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh@techsolutions.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => alert('For demonstration purposes, demo passwords are: owner123 (Business Owner), admin123 (Admin), or visitor123.')}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs font-medium text-slate-600">
                Remember me on this browser
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-brand text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to WebHub'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don’t have an account yet?{' '}
              <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
                Register Business
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
