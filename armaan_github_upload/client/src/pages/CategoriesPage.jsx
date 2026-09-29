import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Layers } from 'lucide-react';
import { api } from '../services/api';
import CategoryIcon from '../components/CategoryIcon';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getCategories();
        setCategories(res.categories || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-brand-700 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Structured Business Sectors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Browse All Business Categories
          </h1>
          <p className="text-base text-slate-500 mt-2">
            Explore verified local commerce across 15+ dedicated industry verticals. Click any sector to view all active businesses and their published websites.
          </p>
        </div>

        {/* Quick Search */}
        <div className="max-w-md mb-8 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter categories (e.g. Health, Food, IT)..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-44 border border-slate-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cat) => (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.slug}`}
                className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-colors shadow-sm">
                      <CategoryIcon name={cat.icon} className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-brand-700 transition-colors">
                      {cat._count?.businesses || 0} Businesses
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                    {cat.description || 'Verified enterprises and local service providers in this sector.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600 group-hover:text-brand-700">
                  <span>Explore Listings</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
