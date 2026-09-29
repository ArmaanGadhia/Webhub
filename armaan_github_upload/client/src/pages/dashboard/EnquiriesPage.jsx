import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Mail, Phone, Clock, CheckCircle2, 
  Trash2, Send, Check, Search, Filter 
} from 'lucide-react';
import { api } from '../../services/api';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [activeMessage, setActiveMessage] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getEnquiries();
        setEnquiries(res.enquiries || []);
      } catch (err) {
        console.error('Failed to load enquiries', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.updateEnquiryStatus(id, newStatus);
      setEnquiries(enquiries.map((e) => (e.id === id ? res.enquiry : e)));
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage(res.enquiry);
      }
    } catch (err) {
      alert('Failed to update enquiry status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer inquiry?')) return;
    try {
      await api.deleteEnquiry(id);
      setEnquiries(enquiries.filter((e) => e.id !== id));
      if (activeMessage?.id === id) setActiveMessage(null);
    } catch (err) {
      alert('Failed to delete enquiry.');
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchesStatus = filterStatus === 'ALL' || e.status === filterStatus;
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.message.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Customer Inquiries & Leads
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review customer inquiries submitted through your published website contact forms.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          {['ALL', 'NEW', 'READ', 'RESPONDED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'gradient-brand text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

      </div>

      {/* Main Enquiries Layout (Split View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Enquiries List */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-28 bg-white rounded-2xl border border-slate-200"></div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              No inquiries found matching current filter.
            </div>
          ) : (
            filtered.map((enq) => {
              const isSelected = activeMessage?.id === enq.id;

              return (
                <div
                  key={enq.id}
                  onClick={() => {
                    setActiveMessage(enq);
                    if (enq.status === 'NEW') {
                      handleUpdateStatus(enq.id, 'READ');
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                      : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900 truncate">{enq.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        enq.status === 'NEW'
                          ? 'bg-blue-100 text-brand-700'
                          : enq.status === 'RESPONDED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {enq.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span>{enq.email}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Enquiry Detailed Viewer */}
        <div className="lg:col-span-7">
          {activeMessage ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{activeMessage.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Received on {new Date(activeMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={activeMessage.status}
                    onChange={(e) => handleUpdateStatus(activeMessage.id, e.target.value)}
                    className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50"
                  >
                    <option value="NEW">Status: NEW</option>
                    <option value="READ">Status: READ</option>
                    <option value="RESPONDED">Status: RESPONDED</option>
                  </select>

                  <button
                    onClick={() => handleDelete(activeMessage.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`mailto:${activeMessage.email}`}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-brand-700 transition-colors"
                >
                  <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="truncate">{activeMessage.email}</span>
                </a>

                {activeMessage.phone ? (
                  <a
                    href={`tel:${activeMessage.phone}`}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{activeMessage.phone}</span>
                  </a>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs text-slate-400">
                    <Phone className="w-4 h-4 text-slate-300" />
                    <span>No phone provided</span>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Customer Message
                </label>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {activeMessage.message}
                </div>
              </div>

              {/* Response action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Target Website: <span className="font-semibold text-slate-700">{activeMessage.business?.businessName || 'Business Website'}</span>
                </span>
                <a
                  href={`mailto:${activeMessage.email}?subject=Response to your inquiry on WebHub&body=Hi ${activeMessage.name},%0D%0A%0D%0AThank you for reaching out to us on WebHub regarding:%0D%0A"${encodeURIComponent(activeMessage.message)}"%0D%0A%0D%0A`}
                  className="px-5 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:opacity-95 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 space-y-3">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Select an inquiry from the list to view details</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Customer contacts and messages will be shown with quick reply options.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
