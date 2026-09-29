import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Layers, Plus, ExternalLink, Palette, Globe, 
  Trash2, Eye, EyeOff, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { api } from '../../services/api';

export default function MyWebsitesPage() {
  const [websites, setWebsites] = useState([]);
  const [business, setBusiness] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSiteData, setNewSiteData] = useState({ name: '', slug: '', templateId: 'restaurant' });
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const [webRes, bizRes, tmplRes] = await Promise.all([
          api.getWebsites(),
          api.getMyBusiness(),
          api.getTemplates(),
        ]);
        setWebsites(webRes.websites || []);
        setBusiness(bizRes.business || null);
        setTemplates(tmplRes.templates || []);
      } catch (err) {
        console.error('Failed to load websites', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!business) {
      alert('Please configure your Business Profile first before creating a website.');
      navigate('/dashboard/business');
      return;
    }

    setCreating(true);
    try {
      const selectedTmpl = templates.find((t) => t.id === newSiteData.templateId);
      const res = await api.createWebsite({
        businessId: business.id,
        name: newSiteData.name || `${business.businessName} Website`,
        slug: newSiteData.slug || business.slug,
        template: newSiteData.templateId,
        contentJson: selectedTmpl ? selectedTmpl.data : null,
      });

      setWebsites([res.website, ...websites]);
      setModalOpen(false);
      setToast('Website created! Redirecting to Builder...');
      setTimeout(() => {
        navigate(`/dashboard/builder?id=${res.website.id}`);
      }, 1000);
    } catch (err) {
      alert(err.message || 'Failed to create website.');
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePublish = async (site) => {
    try {
      if (site.status === 'PUBLISHED') {
        const res = await api.unpublishWebsite(site.id);
        setWebsites(websites.map((w) => (w.id === site.id ? res.website : w)));
        setToast('Website unpublished and returned to draft.');
      } else {
        const res = await api.publishWebsite(site.id);
        setWebsites(websites.map((w) => (w.id === site.id ? res.website : w)));
        setToast(`Website published successfully! Accessible at /site/${res.website.slug}`);
      }
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to toggle publication status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this website? This action cannot be undone.')) return;
    try {
      await api.deleteWebsite(id);
      setWebsites(websites.filter((w) => w.id !== id));
      setToast('Website deleted successfully.');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete website.');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Websites
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build, publish, and manage your responsive business websites.
          </p>
        </div>

        <button
          onClick={() => {
            if (!business) {
              alert('Please complete your Business Profile first.');
              navigate('/dashboard/business');
              return;
            }
            setModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:opacity-95 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Website</span>
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Websites Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-48 bg-white rounded-2xl border border-slate-200"></div>
          <div className="h-48 bg-white rounded-2xl border border-slate-200"></div>
        </div>
      ) : websites.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No websites created yet</h3>
          <p className="text-xs text-slate-500">
            Launch your first website using our 5 pre-built templates or build from scratch with the visual drag-and-drop editor.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md"
          >
            Create Your First Website
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {websites.map((site) => {
            const isPublished = site.status === 'PUBLISHED';

            return (
              <div
                key={site.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Template: {site.template}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                        isPublished
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{site.status}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{site.name}</h3>

                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-500 font-mono">
                    <span>Public Slug:</span>
                    <span className="text-brand-600 font-semibold">/site/{site.slug}</span>
                  </div>

                  {isPublished && (
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600 truncate">http://localhost:5173/site/{site.slug}</span>
                      <Link
                        to={`/site/${site.slug}`}
                        target="_blank"
                        className="text-brand-600 font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                  <Link
                    to={`/dashboard/builder?id=${site.id}`}
                    className="flex-1 py-2.5 px-3 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95"
                  >
                    <Palette className="w-4 h-4" />
                    <span>Open Builder</span>
                  </Link>

                  <button
                    onClick={() => handleTogglePublish(site)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-colors ${
                      isPublished
                        ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                        : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {isPublished ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => handleDelete(site.id)}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Website"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE WEBSITE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Create New Website</h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose an initial starter template and public URL slug for your site.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Website Name</label>
                <input
                  type="text"
                  required
                  value={newSiteData.name}
                  onChange={(e) => setNewSiteData({ ...newSiteData, name: e.target.value })}
                  placeholder={business ? `${business.businessName} Website` : 'My Business Website'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Custom URL Slug</label>
                <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
                  <span className="px-3 py-2.5 bg-slate-50 text-slate-400 text-xs font-mono border-r border-slate-200">
                    /site/
                  </span>
                  <input
                    type="text"
                    value={newSiteData.slug}
                    onChange={(e) => setNewSiteData({ ...newSiteData, slug: e.target.value })}
                    placeholder={business?.slug || 'my-business'}
                    className="w-full px-3 py-2.5 text-sm focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Starter Template</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewSiteData({ ...newSiteData, templateId: t.id })}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        newSiteData.templateId === t.id
                          ? 'border-brand-500 bg-blue-50/70 ring-1 ring-brand-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-900">{t.name}</span>
                      <span className="text-[10px] text-slate-500">{t.category}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Initialize & Open Builder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
