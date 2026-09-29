import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, Layers, MessageSquare, CheckCircle2, Clock, 
  ArrowUpRight, Palette, Store, AlertCircle, Plus, ExternalLink, Globe 
} from 'lucide-react';
import { api } from '../../services/api';

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getDashboardStats();
        setStats(res);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-white rounded-2xl border border-slate-200"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200"></div>
          ))}
        </div>
      </div>
    );
  }

  const primaryBusiness = stats?.businesses?.[0];
  const isApproved = primaryBusiness?.status === 'APPROVED';

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-brand-600">Enterprise Workspace</span>
            {primaryBusiness && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isApproved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {isApproved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                <span>{primaryBusiness.status}</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {primaryBusiness ? primaryBusiness.businessName : 'Welcome to WebHub Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor real-time visitor traffic, manage customer inquiries, and maintain your published website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/builder"
            className="px-5 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:opacity-95 transition-opacity flex items-center gap-1.5"
          >
            <Palette className="w-4 h-4" />
            <span>Launch Builder</span>
          </Link>
          {primaryBusiness && (
            <Link
              to="/dashboard/business"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Store className="w-4 h-4 text-slate-500" />
              <span>Edit Profile</span>
            </Link>
          )}
        </div>
      </div>

      {/* Approval Alert if Pending */}
      {!isApproved && primaryBusiness && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-950">Business Profile Verification in Progress</p>
            <p className="text-amber-800">
              Your business profile is currently in pending review. It will appear publicly in the WebHub directory once approved by our administration team. You can continue designing and previewing your website in the builder in the meantime.
            </p>
          </div>
        </div>
      )}

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Views */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Website Views</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalViews || 0}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>Direct Traffic</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Published Websites */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Published Sites</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.publishedWebsites || 0}</h3>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              of {stats?.totalWebsites || 0} created
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Enquiries Received */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Customer Enquiries</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalEnquiries || 0}</h3>
            <Link to="/dashboard/enquiries" className="text-[11px] text-brand-600 font-semibold hover:underline mt-1 block">
              View Inbox →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Website Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Public Status</p>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {stats?.publishedWebsites > 0 ? 'Live & Discoverable' : 'Draft / Offline'}
            </h3>
            <span className={`text-[11px] font-semibold mt-1 block ${
              stats?.publishedWebsites > 0 ? 'text-emerald-600' : 'text-slate-400'
            }`}>
              {stats?.publishedWebsites > 0 ? 'Ready for visitors' : 'Publish in builder'}
            </span>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            stats?.publishedWebsites > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
          }`}>
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 7-Day Analytics Bar Chart Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Website Traffic Trends</h3>
            <p className="text-xs text-slate-500 mt-0.5">Visitor impressions across the past 7 days</p>
          </div>
          <Link
            to="/dashboard/analytics"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Detailed Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Chart representation */}
        <div className="pt-4">
          <div className="h-56 flex items-end gap-3 sm:gap-6 justify-between border-b border-slate-100 pb-3">
            {stats?.past7Days && stats.past7Days.length > 0 ? (
              stats.past7Days.map((item, idx) => {
                const maxViews = Math.max(...stats.past7Days.map((d) => d.views), 1);
                const heightPercent = Math.max((item.views / maxViews) * 100, 8);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-1.5 py-0.5 rounded shadow">
                      {item.views}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[48px] rounded-t-xl gradient-brand group-hover:opacity-90 transition-all shadow-xs"
                    ></div>
                    <span className="text-[11px] font-semibold text-slate-500 truncate w-full text-center">
                      {item.day}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center py-12 text-slate-400 text-sm">
                No visitor traffic recorded yet. Publish your site to begin tracking views!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Launchpad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Link
          to="/dashboard/builder"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all group"
        >
          <div className="w-10 h-10 rounded-xl gradient-brand text-white flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
            <Palette className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
            Drag-and-Drop Website Builder
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Customize sections, typography, imagery, and preview live on mobile & desktop before publishing.
          </p>
        </Link>

        <Link
          to="/dashboard/templates"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-md shadow-purple-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
            Browse 5 Industry Templates
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Quick-start with pre-designed templates for Restaurants, Tech Agencies, Fashion, Beauty, or Retail.
          </p>
        </Link>

        <Link
          to="/dashboard/enquiries"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
            Customer Inquiries Inbox
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Read direct visitor messages, contact phone numbers, and respond directly to prospective clients.
          </p>
        </Link>

      </div>

    </div>
  );
}
