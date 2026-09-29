import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, Filter, MapPin, ExternalLink, Mail, Phone, 
  Clock, X, CheckCircle2, ChevronRight, SlidersHorizontal, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';
import CategoryIcon from '../components/CategoryIcon';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  // Filters state from URL query
  const querySearch = searchParams.get('search') || '';
  const queryCategory = searchParams.get('category') || '';
  const queryCity = searchParams.get('city') || '';
  const querySort = searchParams.get('sort') || 'newest';

  const [searchInput, setSearchInput] = useState(querySearch);
  const [selectedCity, setSelectedCity] = useState(queryCity);
  const [selectedSort, setSelectedSort] = useState(querySort);

  // Quick Enquiry Modal State
  const [enquiryModalBiz, setEnquiryModalBiz] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        setCategories(res.categories || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        const params = {
          search: querySearch,
          category: queryCategory,
          city: queryCity,
          sort: querySort,
          page: searchParams.get('page') || 1,
          limit: 9,
        };
        const res = await api.getBusinesses(params);
        setBusinesses(res.businesses || []);
        setPagination(res.pagination || { total: 0, page: 1, totalPages: 1 });
      } catch (err) {
        console.error('Failed to load businesses', err);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, [searchParams]);

  const updateFilters = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v) updated.set(k, v);
      else updated.delete(k);
    });
    updated.set('page', '1');
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const handleCategoryClick = (slug) => {
    if (queryCategory === slug) {
      updateFilters({ category: '' });
    } else {
      updateFilters({ category: slug });
    }
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedCity('');
    setSelectedSort('newest');
    setSearchParams({});
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!enquiryModalBiz) return;
    setEnquirySubmitting(true);
    try {
      await api.submitEnquiry({
        businessId: enquiryModalBiz.id,
        name: enquiryForm.name,
        email: enquiryForm.email,
        phone: enquiryForm.phone,
        message: enquiryForm.message,
      });
      setEnquirySuccess(true);
      setTimeout(() => {
        setEnquirySuccess(false);
        setEnquiryModalBiz(null);
        setEnquiryForm({ name: '', email: '', phone: '', message: '' });
      }, 2000);
    } catch (err) {
      alert(err.message || 'Failed to submit enquiry.');
    } finally {
      setEnquirySubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Business Directory
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Discover verified local enterprises, review their offerings, and visit their official websites.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="md:col-span-5 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search business name, service, keyword..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </form>

            {/* City Input */}
            <div className="md:col-span-3 relative">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="City (e.g. Mysuru, Belagavi)"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  updateFilters({ city: e.target.value });
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  updateFilters({ sort: e.target.value });
                }}
                className="w-full py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700"
              >
                <option value="newest">Sort: Newest</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
                <option value="oldest">Sort: Oldest</option>
              </select>
            </div>

            {/* Reset / Search Actions */}
            <div className="md:col-span-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full py-2.5 px-4 gradient-brand text-white text-sm font-semibold rounded-xl hover:opacity-95 shadow-sm transition-all"
              >
                Apply
              </button>
              {(querySearch || queryCategory || queryCity) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  title="Reset All Filters"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Chips Carousel */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => updateFilters({ category: '' })}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !queryCategory
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  queryCategory === cat.slug
                    ? 'gradient-brand text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
                <span className="opacity-75">({cat._count?.businesses || 0})</span>
              </button>
            ))}
          </div>

        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-600 font-medium">
            Showing <span className="font-bold text-slate-900">{businesses.length}</span> of{' '}
            <span className="font-bold text-slate-900">{pagination.total}</span> verified businesses
            {queryCategory && <span> in <span className="text-brand-600 font-bold capitalize">{queryCategory.replace('-', ' ')}</span></span>}
            {queryCity && <span> located in <span className="text-brand-600 font-bold">{queryCity}</span></span>}
          </p>
        </div>

        {/* Businesses Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 border border-slate-200"></div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No businesses found</h3>
            <p className="text-sm text-slate-500 mt-2">
              We couldn't find any business matching your search or filters. Try adjusting your query or clear filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((biz) => {
              const liveWebsite = biz.websites && biz.websites.length > 0 ? biz.websites[0] : null;

              return (
                <div
                  key={biz.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group justify-between"
                >
                  <div>
                    {/* Header Image */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={biz.coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'}
                        alt={biz.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-md backdrop-blur-sm">
                          {biz.category?.name || 'General'}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        {liveWebsite ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-md">
                            Website Live
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-white">
                            Directory
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {biz.businessName}
                      </h3>

                      <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {biz.description || 'Verified local business registered on WebHub.'}
                      </p>

                      <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                        {biz.city && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{biz.address ? `${biz.address}, ${biz.city}` : biz.city}</span>
                          </div>
                        )}
                        {biz.openingHours && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{biz.openingHours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center gap-2">
                    {liveWebsite ? (
                      <Link
                        to={`/site/${liveWebsite.slug}`}
                        className="flex-1 py-2.5 px-3 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/15 hover:opacity-95 transition-opacity"
                      >
                        <span>Open Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <div className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-medium text-center">
                        Website in Progress
                      </div>
                    )}

                    <button
                      onClick={() => setEnquiryModalBiz(biz)}
                      className="py-2.5 px-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Send message to this business"
                    >
                      <Mail className="w-3.5 h-3.5 text-brand-600" />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination controls */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => updateFilters({ page: String(pageNum) })}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                  pagination.page === pageNum
                    ? 'gradient-brand text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* QUICK ENQUIRY MODAL */}
      {enquiryModalBiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setEnquiryModalBiz(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {enquirySuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-slate-900">Enquiry Sent!</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Your message has been delivered to {enquiryModalBiz.businessName}. They will contact you shortly.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Send Enquiry to {enquiryModalBiz.businessName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your details below. The business owner will receive your inquiry directly in their dashboard.
                </p>

                <form onSubmit={handleEnquirySubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Hegde"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="+91 98765..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Requirements *</label>
                    <textarea
                      required
                      rows={4}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      placeholder="Specify dates, package details, or service quotation..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEnquiryModalBiz(null)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={enquirySubmitting}
                      className="px-6 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50"
                    >
                      {enquirySubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
