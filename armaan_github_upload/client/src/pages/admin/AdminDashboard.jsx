import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Store, Layers, Clock, Eye, MessageSquare, 
  CheckCircle2, XCircle, ArrowUpRight, ShieldCheck, FolderTree 
} from 'lucide-react';
import { api } from '../../services/api';
import CategoryIcon from '../../components/CategoryIcon';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getAdminStats();
        setStats(res);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.updateBusinessStatus(id, { status: 'APPROVED' });
      setToast('Business approved and listed in directory!');
      // Refresh
      const res = await api.getAdminStats();
      setStats(res);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert('Approval failed.');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter reason for rejecting this listing (optional):');
    try {
      await api.updateBusinessStatus(id, { status: 'REJECTED', rejectionReason: reason });
      setToast('Business marked as rejected.');
      const res = await api.getAdminStats();
      setStats(res);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert('Rejection failed.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading system overview statistics...</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Platform System Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global metrics, approval queue, and category performance across the WebHub SaaS directory.
          </p>
        </div>

        <Link
          to="/admin/businesses"
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Clock className="w-4 h-4" />
          <span>Review Approval Queue ({stats?.pendingApprovals || 0})</span>
        </Link>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Total Users */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Registered Accounts</p>
            <h3 className="text-3xl font-black text-white mt-1">{stats?.totalUsers || 0}</h3>
            <span className="text-[11px] text-purple-400 font-medium mt-1 block">Owners & Visitors</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-950 text-purple-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Businesses */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Businesses</p>
            <h3 className="text-3xl font-black text-white mt-1">{stats?.totalBusinesses || 0}</h3>
            <span className="text-[11px] text-blue-400 font-medium mt-1 block">Across all categories</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-950 text-blue-400 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Approvals</p>
            <h3 className="text-3xl font-black text-amber-400 mt-1">{stats?.pendingApprovals || 0}</h3>
            <span className="text-[11px] text-amber-500 font-medium mt-1 block">Awaiting review</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Published Websites */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Published Websites</p>
            <h3 className="text-3xl font-black text-emerald-400 mt-1">{stats?.publishedWebsites || 0}</h3>
            <span className="text-[11px] text-emerald-500 font-medium mt-1 block">Live on WebHub</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Impressions</p>
            <h3 className="text-3xl font-black text-white mt-1">{stats?.totalViews || 0}</h3>
            <span className="text-[11px] text-cyan-400 font-medium mt-1 block">Internal tracking</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Total Enquiries */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Customer Enquiries</p>
            <h3 className="text-3xl font-black text-white mt-1">{stats?.totalEnquiries || 0}</h3>
            <span className="text-[11px] text-pink-400 font-medium mt-1 block">Leads generated</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-950 text-pink-400 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Recent Submissions & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Businesses Table */}
        <div className="lg:col-span-8 bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Business Submissions</h3>
            <Link to="/admin/businesses" className="text-xs text-purple-400 hover:underline">
              View All Businesses →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Business</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Owner</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {stats?.recentBusinesses?.map((biz) => (
                  <tr key={biz.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 font-semibold text-white">
                      <div>
                        <span>{biz.businessName}</span>
                        <span className="block text-[10px] text-slate-500 font-mono">/site/{biz.slug}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                        {biz.category?.name}
                      </span>
                    </td>
                    <td className="py-3">
                      <p className="text-white">{biz.user?.name}</p>
                      <p className="text-[10px] text-slate-500">{biz.user?.email}</p>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        biz.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : biz.status === 'PENDING'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {biz.status}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-1">
                      {biz.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleApprove(biz.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold"
                          title="Approve Listing"
                        >
                          Approve
                        </button>
                      )}
                      {biz.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleReject(biz.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-900/80 hover:bg-red-800 text-red-200 text-[11px] font-semibold"
                          title="Reject Listing"
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
        </div>

        {/* Category Distribution */}
        <div className="lg:col-span-4 bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Top Sectors</h3>
            <Link to="/admin/categories" className="text-xs text-purple-400 hover:underline">
              Manage All →
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.categoryStats?.map((c) => (
              <div key={c.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center">
                    <CategoryIcon name={c.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{c.name}</h4>
                    <span className="text-[10px] text-slate-500">/{c.slug}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-purple-400 px-2 py-0.5 rounded bg-purple-950/60">
                  {c._count?.businesses || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
