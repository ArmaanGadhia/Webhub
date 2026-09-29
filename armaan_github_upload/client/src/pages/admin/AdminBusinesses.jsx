import React, { useState, useEffect } from 'react';
import { 
  Store, CheckCircle2, XCircle, Clock, Search, 
  MapPin, ExternalLink, Filter, AlertCircle 
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [rejectModalBiz, setRejectModalBiz] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  async function fetchBusinesses() {
    setLoading(true);
    try {
      const res = await api.getBusinesses({ status: 'ALL', limit: 100 });
      setBusinesses(res.businesses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id) => {
    try {
      await api.updateBusinessStatus(id, { status: 'APPROVED' });
      setToast('Business approved successfully! Now visible in public directory.');
      fetchBusinesses();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert('Approval failed.');
    }
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectModalBiz) return;
    try {
      await api.updateBusinessStatus(rejectModalBiz.id, {
        status: 'REJECTED',
        rejectionReason: rejectionReason || 'Information incomplete or terms violation',
      });
      setToast('Business rejected.');
      setRejectModalBiz(null);
      setRejectionReason('');
      fetchBusinesses();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert('Rejection failed.');
    }
  };

  const filtered = businesses.filter((b) => {
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchesSearch =
      b.businessName.toLowerCase().includes(search.toLowerCase()) ||
      (b.city && b.city.toLowerCase().includes(search.toLowerCase())) ||
      (b.category?.name && b.category.name.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Business Approval & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review newly submitted business listings. Approved listings immediately display in the public search directory.
          </p>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search business or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading listings...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No businesses match current filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Business Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Websites</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{b.businessName}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{b.description}</p>
                      <span className="text-[10px] text-purple-400 font-mono">/site/{b.slug}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                        {b.category?.name}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{b.city || 'Not specified'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {b.websites && b.websites.length > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {b.websites.length} Site(s)
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">None</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          b.status === 'APPROVED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : b.status === 'PENDING'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {b.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                        {b.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {b.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        <span>{b.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-1">
                      {b.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleApprove(b.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {b.status !== 'REJECTED' && (
                        <button
                          onClick={() => setRejectModalBiz(b)}
                          className="px-3 py-1.5 rounded-xl bg-red-900/80 hover:bg-red-800 text-red-200 font-semibold text-xs transition-colors"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REJECT REASON MODAL */}
      {rejectModalBiz && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">
                Reject Business: {rejectModalBiz.businessName}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Provide an explanation to the business owner for rejecting this listing.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <textarea
                required
                rows={3}
                placeholder="Reason: e.g. Incomplete address, inappropriate imagery, duplicate entity..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              ></textarea>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalBiz(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
