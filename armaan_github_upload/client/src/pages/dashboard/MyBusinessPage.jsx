import React, { useState, useEffect } from 'react';
import { 
  Store, Save, MapPin, Phone, Mail, Clock, 
  ExternalLink, CheckCircle2, AlertCircle, Image as ImageIcon 
} from 'lucide-react';
import { api } from '../../services/api';

export default function MyBusinessPage() {
  const [business, setBusiness] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const [formData, setFormData] = useState({
    businessName: '',
    categoryId: '',
    description: '',
    logo: '',
    coverImage: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    openingHours: '',
    socialLinks: { instagram: '', facebook: '', linkedin: '', twitter: '' },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [bizRes, catRes] = await Promise.all([
          api.getMyBusiness(),
          api.getCategories(),
        ]);
        setCategories(catRes.categories || []);

        if (bizRes.business) {
          setBusiness(bizRes.business);
          let parsedSocial = { instagram: '', facebook: '', linkedin: '', twitter: '' };
          if (bizRes.business.socialLinks) {
            try {
              parsedSocial = { ...parsedSocial, ...JSON.parse(bizRes.business.socialLinks) };
            } catch (e) {}
          }

          setFormData({
            businessName: bizRes.business.businessName || '',
            categoryId: String(bizRes.business.categoryId || ''),
            description: bizRes.business.description || '',
            logo: bizRes.business.logo || '',
            coverImage: bizRes.business.coverImage || '',
            phone: bizRes.business.phone || '',
            email: bizRes.business.email || '',
            website: bizRes.business.website || '',
            address: bizRes.business.address || '',
            city: bizRes.business.city || '',
            state: bizRes.business.state || 'Karnataka',
            pincode: bizRes.business.pincode || '',
            openingHours: bizRes.business.openingHours || '',
            socialLinks: parsedSocial,
          });
        } else if (catRes.categories?.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: String(catRes.categories[0].id) }));
        }
      } catch (err) {
        console.error('Failed to load business profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast('');

    try {
      if (business) {
        const res = await api.updateBusiness(business.id, formData);
        setBusiness(res.business);
        setToast('Business profile updated successfully!');
      } else {
        const res = await api.createBusiness(formData);
        setBusiness(res.business);
        setToast('Business profile registered successfully!');
      }
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save business profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading business profile...</div>;
  }

  const selectedCategory = categories.find((c) => String(c.id) === String(formData.categoryId));

  return (
    <div className="space-y-8 max-w-6xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Business Profile & Information
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep your business details, contacts, and imagery accurate for directory visitors.
          </p>
        </div>

        {business && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto ${
            business.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            <span>Status: {business.status}</span>
          </span>
        )}
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Inputs (2 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Primary Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Belagavi Tech Solutions"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Category *</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white text-slate-800"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your products, services, and specialties..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              ></textarea>
            </div>
          </div>

          {/* Media Links */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Imagery & Branding
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Logo Image URL</label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://example.com/logo.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Location & Contact Info */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Contact & Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98450..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Public Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@business.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Shop No. 4, Main Market Road"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Belagavi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Karnataka"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="590006"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Opening Hours</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="Mon - Sat: 9:00 AM - 8:30 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 rounded-xl gradient-brand text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:opacity-95 flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

        {/* Live Directory Preview Card (1 Col) */}
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Directory Preview
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
            <div className="relative h-40 bg-slate-100">
              <img
                src={formData.coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-sm">
                {selectedCategory?.name || 'Category'}
              </span>
            </div>

            <div className="p-5 space-y-3">
              <h4 className="font-bold text-lg text-slate-900">
                {formData.businessName || 'Your Business Name'}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                {formData.description || 'Your business description will be displayed here in the directory.'}
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formData.city ? `${formData.city}, ${formData.state}` : 'City, State'}</span>
                </div>
                {formData.openingHours && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formData.openingHours}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-brand-800 space-y-1">
            <p className="font-bold">Need a dedicated website?</p>
            <p>Go to the Website Builder tab to design your interactive website and publish it with one click.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
