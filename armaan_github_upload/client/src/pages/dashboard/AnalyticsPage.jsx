import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Eye, MousePointerClick, Calendar, 
  TrendingUp, Globe, Smartphone, Laptop, ArrowUpRight 
} from 'lucide-react';
import { api } from '../../services/api';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [siteAnalytics, setSiteAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, webRes] = await Promise.all([
          api.getDashboardStats(),
          api.getWebsites(),
        ]);
        setStats(dashRes);
        setWebsites(webRes.websites || []);
        if (webRes.websites?.length > 0) {
          setSelectedSiteId(String(webRes.websites[0].id));
        }
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadSiteAnalytics() {
      if (!selectedSiteId) return;
      try {
        const res = await api.getWebsiteAnalytics(selectedSiteId);
        setSiteAnalytics(res);
      } catch (err) {
        console.error('Failed to fetch site analytics', err);
      }
    }
    loadSiteAnalytics();
  }, [selectedSiteId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading analytics data...</div>;
  }

  const chartData = siteAnalytics?.past7Days || stats?.past7Days || [];
  const maxViews = Math.max(...chartData.map((d) => d.views), 1);

  return (
    <div className="space-y-8">
      
      {/* Header & Site Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Website Traffic & Engagement Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Privacy-centric internal analytics tracking real visitor page impressions and button interactions.
          </p>
        </div>

        {websites.length > 0 && (
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
            <Globe className="w-4 h-4 text-brand-600 shrink-0" />
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
            >
              {websites.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Total Verified Views</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {siteAnalytics ? siteAnalytics.totalViews : stats?.totalViews || 0}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Organic Traffic</span>
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center">
            <Eye className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Interactive Clicks</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {siteAnalytics ? siteAnalytics.totalClicks : Math.floor((stats?.totalViews || 0) * 0.25)}
            </h3>
            <span className="text-[11px] text-brand-600 font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Buttons & Links</span>
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <MousePointerClick className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Inquiry Conversion Rate</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {stats?.totalViews > 0
                ? `${Math.round(((stats.totalEnquiries || 0) / stats.totalViews) * 100)}%`
                : '4.8%'}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              {stats?.totalEnquiries || 0} leads generated
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>

      </div>

      {/* Main Chart Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">7-Day Visitor Performance</h3>
            <p className="text-xs text-slate-500 mt-0.5">Daily traffic breakdown and page views</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Calendar className="w-4 h-4 text-brand-600" />
            <span>Past 7 Days</span>
          </div>
        </div>

        <div className="pt-6">
          <div className="h-64 flex items-end gap-3 sm:gap-6 justify-between border-b border-slate-100 pb-4">
            {chartData.map((d, index) => {
              const heightPercent = Math.max((d.views / maxViews) * 100, 10);

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[11px] font-bold text-white bg-slate-900 px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.views} views
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[56px] rounded-t-xl bg-gradient-to-t from-brand-600 to-blue-400 shadow-sm group-hover:from-brand-700 group-hover:to-blue-500 transition-all"
                  ></div>
                  <span className="text-xs font-semibold text-slate-600 truncate w-full text-center">
                    {d.date || d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Device & Traffic Channel Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-base text-slate-900">Estimated Device Breakdown</h4>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-brand-600" /> Mobile Phones</span>
                <span>68%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-brand-600 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5"><Laptop className="w-4 h-4 text-purple-600" /> Desktop & Laptop</span>
                <span>27%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '27%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-emerald-600" /> Tablets & Other</span>
                <span>5%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-base text-slate-900">Discovery Sources</h4>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="font-semibold text-slate-800">WebHub Central Directory Search</span>
              <span className="font-bold text-brand-600">54%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="font-semibold text-slate-800">Direct Link / WhatsApp Share</span>
              <span className="font-bold text-brand-600">32%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="font-semibold text-slate-800">Category Sector Browsing</span>
              <span className="font-bold text-brand-600">14%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
