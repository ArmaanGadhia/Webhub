import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Globe, LayoutDashboard, ShieldCheck, LogIn, UserPlus, 
  Menu, X, Sparkles, ChevronDown, LogOut, Store
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isOwner, isAdmin, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoSelect = async (role) => {
    try {
      await demoLogin(role);
      setDemoMenuOpen(false);
      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'BUSINESS_OWNER') {
        navigate('/dashboard');
      } else {
        navigate('/explore');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Businesses', path: '/explore' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">Web<span className="text-brand-600">Hub</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Platform</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Directory & Website Builder</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/70">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-150 ${
                  isActive(link.path)
                    ? 'bg-white text-brand-600 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* 1-Click Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                title="Quickly test with demo accounts"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Logins</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Instant 1-Click Login
                  </div>
                  <button
                    onClick={() => handleDemoSelect('BUSINESS_OWNER')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-brand-600 rounded-lg flex items-center justify-between"
                  >
                    <span>Business Owner (Rajesh)</span>
                    <Store className="w-3.5 h-3.5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDemoSelect('ADMIN')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg flex items-center justify-between"
                  >
                    <span>Admin Panel</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  </button>
                  <button
                    onClick={() => handleDemoSelect('VISITOR')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg flex items-center justify-between"
                  >
                    <span>Visitor (Aarav)</span>
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Portal</span>
                  </Link>
                ) : isOwner ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white gradient-brand hover:opacity-95 rounded-xl shadow-md shadow-blue-600/20 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                ) : null}

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-800 leading-none">{user.name}</p>
                    <span className="text-[10px] text-slate-400 capitalize">{user.role.toLowerCase().replace('_', ' ')}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white gradient-brand hover:opacity-95 rounded-xl shadow-md shadow-blue-600/20 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Website</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.path) ? 'bg-blue-50 text-brand-600 font-semibold' : 'text-slate-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Auth actions */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-lg">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2.5 bg-purple-600 text-white rounded-xl font-medium"
                  >
                    Go to Admin Portal
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2.5 gradient-brand text-white rounded-xl font-medium"
                  >
                    Go to Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 gradient-brand text-white rounded-xl font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
