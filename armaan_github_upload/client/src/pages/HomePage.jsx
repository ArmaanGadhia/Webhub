import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, Sparkles, CheckCircle2, Store, Palette, 
  Share2, Eye, ShieldCheck, ChevronRight, MapPin, ExternalLink,
  Layers, Zap, Users, BarChart3
} from 'lucide-react';
import { api } from '../services/api';
import CategoryIcon from '../components/CategoryIcon';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, busRes] = await Promise.all([
          api.getCategories(),
          api.getBusinesses({ limit: 6, sort: 'newest' }),
        ]);
        setCategories(catRes.categories || []);
        setFeaturedBusinesses(busRes.businesses || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest font-sans text-on-surface">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-surface-container border-b border-outline-variant">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -left-[10%] w-[60%] h-[80%] rounded-full bg-brand-500/10 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[60%] rounded-full bg-secondary/10 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high border border-outline-variant text-secondary text-xs sm:text-sm font-semibold shadow-glow-emerald">
              <Sparkles className="w-4 h-4 text-tertiary" />
              <span>Next-Gen Business Discovery & Drag-and-Drop Website Builder</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-white tracking-tight leading-[1.15]">
              Discover Businesses. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-secondary">Build Your Presence.</span> <br />
              Grow Online.
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-lg sm:text-xl text-on-surface-variant max-w-2xl mx-auto font-normal leading-relaxed">
              WebHub helps local businesses build and publish stunning websites in minutes without coding, while enabling customers to discover verified local services with ease.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center shadow-lg rounded-2xl bg-surface-container-low border border-outline-variant focus-within:ring-1 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all p-2">
                <Search className="w-6 h-6 text-outline ml-3 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search restaurants, doctors, tech firms, boutiques or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 py-2 text-white placeholder-outline bg-transparent text-sm sm:text-base focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-500 shadow-glow-indigo transition-all flex items-center gap-2"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="px-7 py-3.5 rounded-xl border border-outline-variant text-white font-semibold hover:bg-surface-bright hover:border-brand-500 transition-all flex items-center gap-2"
              >
                <Palette className="w-5 h-5 text-brand-400" />
                <span>Create Your Website Free</span>
              </Link>
              <Link
                to="/explore"
                className="px-7 py-3.5 rounded-xl border border-outline-variant text-white font-semibold hover:bg-surface-bright hover:border-secondary transition-all flex items-center gap-2"
              >
                <Store className="w-5 h-5 text-secondary" />
                <span>Explore Directory</span>
              </Link>
            </div>

            {/* Quick Metrics ticker */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-3xl mx-auto border-t border-slate-200/70">
              <div className="p-3 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">15+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Active Categories</p>
              </div>
              <div className="p-3 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-brand-600">100%</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">No-Code Builder</p>
              </div>
              <div className="p-3 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">5+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">SaaS Templates</p>
              </div>
              <div className="p-3 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">Verified</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Admin Approvals</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-brand-600">Diverse Sectors</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Browse Popular Categories</h2>
              <p className="text-sm text-slate-500 mt-2">Find verified local businesses organized across modern enterprise domains.</p>
            </div>
            <Link
              to="/categories"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>View All 15 Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category.id}
                to={`/explore?category=${category.slug}`}
                className="group p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-brand-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 text-center flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100/70 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                  <CategoryIcon name={category.icon} className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-1">
                  {category.name}
                </h3>
                <span className="text-xs text-slate-400 mt-1 font-medium">
                  {category._count?.businesses || 0} Listed
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 3. FEATURED BUSINESSES & WEBSITES */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-600">Verified Listings</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Featured Businesses & Live Sites</h2>
              <p className="text-sm text-slate-500 mt-2">Discover active businesses powered by WebHub's drag-and-drop website engine.</p>
            </div>
            <Link
              to="/explore"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>Explore All Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBusinesses.map((biz) => {
              const liveWebsite = biz.websites && biz.websites.length > 0 ? biz.websites[0] : null;

              return (
                <div
                  key={biz.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Card Cover */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={biz.coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'}
                      alt={biz.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      {liveWebsite ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-md">
                          <Eye className="w-3 h-3" />
                          <span>Website Live</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-white">
                          <span>Directory Profile</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-brand-700 border border-blue-100">
                          {biz.category?.name || 'General'}
                        </span>
                        {biz.city && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" />
                            <span>{biz.city}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {biz.businessName}
                      </h3>

                      <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {biz.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                      {liveWebsite ? (
                        <Link
                          to={`/site/${liveWebsite.slug}`}
                          className="w-full py-2.5 px-4 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/15 hover:opacity-95 transition-opacity"
                        >
                          <span>View Official Website</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link
                          to={`/explore?search=${encodeURIComponent(biz.businessName)}`}
                          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>View Business Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. HOW WEBHUB WORKS */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-brand-600">Simplicity By Design</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              How WebHub Works for Businesses
            </h2>
            <p className="text-base text-slate-500 mt-3">
              Go from zero digital footprint to a published high-conversion business website in three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-brand-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl gradient-brand text-white flex items-center justify-center font-extrabold text-lg shadow-md mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Create Business Profile</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Register as a business owner, select your business category, and provide essential contact, opening hours, and location details.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-brand-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instant Directory Listing</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-brand-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl gradient-brand text-white flex items-center justify-center font-extrabold text-lg shadow-md mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Build with Drag & Drop</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pick from 5 industry starter templates or assemble custom sections: Hero, Menu, Services, Testimonials, and Contact Forms.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-brand-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Real-Time Visual Customization</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-brand-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl gradient-brand text-white flex items-center justify-center font-extrabold text-lg shadow-md mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Publish & Grow Online</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Publish to your unique public slug (e.g. <span className="font-mono text-xs text-brand-600">/site/your-business</span>), receive customer enquiries, and monitor visitor analytics.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-brand-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Built-in Analytics & Inquiries</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. BENEFITS SECTION */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700 text-blue-300 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Empowering MSMEs & Local Commerce</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Why WebHub is the Ideal SaaS Platform for Local Businesses
              </h2>

              <p className="text-base text-slate-400 leading-relaxed">
                Traditional website agencies cost thousands and require weeks of development. WebHub provides local business owners with a turnkey platform to establish credibility, generate leads, and be found on the web.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <Layers className="w-6 h-6 text-brand-400 mb-2" />
                  <h4 className="font-semibold text-white text-base">Structured JSON Engine</h4>
                  <p className="text-xs text-slate-400 mt-1">Lightweight, portable website schemas stored cleanly in MySQL database.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <BarChart3 className="w-6 h-6 text-emerald-400 mb-2" />
                  <h4 className="font-semibold text-white text-base">Internal Analytics</h4>
                  <p className="text-xs text-slate-400 mt-1">Track views, customer clicks, and traffic patterns with built-in privacy.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <ShieldCheck className="w-6 h-6 text-purple-400 mb-2" />
                  <h4 className="font-semibold text-white text-base">Admin Moderation</h4>
                  <p className="text-xs text-slate-400 mt-1">Businesses are reviewed to guarantee legitimate and safe community listings.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <Share2 className="w-6 h-6 text-pink-400 mb-2" />
                  <h4 className="font-semibold text-white text-base">SEO & Public URLs</h4>
                  <p className="text-xs text-slate-400 mt-1">Dedicated friendly slug URLs designed for easy WhatsApp and social sharing.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"
                  alt="WebHub SaaS Dashboard Showcase"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 gradient-brand text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Take Your Business Online Today?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Join WebHub now. Register your business profile and launch your custom website in less than 5 minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-white text-brand-700 font-bold hover:bg-blue-50 shadow-xl transition-all"
            >
              Start Building Now
            </Link>
            <Link
              to="/explore"
              className="px-8 py-4 rounded-xl bg-blue-800/60 text-white font-semibold hover:bg-blue-800 border border-blue-400/40 transition-all"
            >
              Browse Public Directory
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
