import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Lock, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setToast('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        ...(formData.password ? { password: formData.password } : {}),
      });
      setToast('Account settings updated successfully!');
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8 font-sans text-on-surface">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
          Manage your personal credentials, contact numbers, and login security.
        </p>
      </div>

      {toast && (
        <div className="p-4 rounded-lg bg-tertiary-container/20 border border-tertiary-container text-tertiary text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-tertiary" />
          <span>{toast}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-error-container/20 border border-error-container text-error text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Dark Productivity OS Panel */}
      <form onSubmit={handleSubmit} className="bg-surface-container rounded-lg border border-white/10 shadow-lg space-y-6 p-8">
        
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            Profile Information
          </h3>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Registered Email (Fixed)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2.5 rounded text-sm bg-surface-container-lowest border border-white/10 text-on-surface-variant cursor-not-allowed focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded text-sm bg-surface-container-low border border-white/10 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded text-sm bg-surface-container-low border border-white/10 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            Change Password
          </h3>
          <p className="text-xs text-on-surface-variant">Leave blank to keep your current password.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 chars"
                  className="w-full pl-10 pr-4 py-2.5 rounded text-sm bg-surface-container-low border border-white/10 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-outline"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-4 py-2.5 rounded text-sm bg-surface-container-low border border-white/10 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-outline"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded bg-brand-500 text-white font-semibold text-xs shadow-glow-indigo hover:bg-brand-600 flex items-center gap-1.5 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
