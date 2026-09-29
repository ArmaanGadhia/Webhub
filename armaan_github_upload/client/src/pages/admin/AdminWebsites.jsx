import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, Eye, ExternalLink, ShieldAlert, Power, 
  Trash2, CheckCircle2, Search 
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminWebsites() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchWebsites();
  }, []);

  async function fetchWebsites() {
    setLoading(true);
    try {
      const res = await api.getWebsites({ all: 'true' });
      setWebsites(res.websites || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleTogglePublish = async (site) => {
    try {
      if (site.status === 'PUBLISHED') {
        await api.unpublishWebsite(site.id);
        setToast('Website unpublished from directory.');
      } else {
        await api.publishWebsite(site.id);
        setToast('Website published live.');
      }
      fetchWebsites();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Operation failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently remove this website?')) return;
    try {
      await api.deleteWebsite(id);
      setToast('Website deleted.');
      fetchWebsites();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const filtered = websites.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.slug.toLowerCase().includes(search.toLowerCase()) ||
      (w.business?.businessName && w.business.businessName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Websites Moderation & Oversight
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supervise all websites created and published across businesses on WebHub.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search websites or businesses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading websites...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No websites found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4">Associated Business</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Total Impressions</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-white">
                      <div>{w.name}</div>
                      <span className="text-[10px] text-purple-400 font-mono">/site/{w.slug}</span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-white font-medium">{w.business?.businessName}</p>
                      <span className="text-[10px] text-slate-500">{w.business?.category?.name}</span>
                    </td>
                    <td className="py-4 px-4 capitalize text-slate-400">
                      {w.template}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          w.status === 'PUBLISHED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {w._count?.analytics || 0}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Link
                        to={`/site/${w.slug}`}
                        target="_blank"
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-purple-400 hover:text-white text-[11px] font-semibold inline-flex items-center gap-1"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => handleTogglePublish(w)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          w.status === 'PUBLISHED'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {w.status === 'PUBLISHED' ? 'Take Offline' : 'Publish'}
                      </button>

                      <button
                        onClick={() => handleDelete(w.id)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded"
                        title="Delete Website"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
