import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Palette, CheckCircle2, ArrowRight, Eye, X } from 'lucide-react';
import { api } from '../../services/api';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const [tmplRes, bizRes] = await Promise.all([
          api.getTemplates(),
          api.getMyBusiness(),
        ]);
        setTemplates(tmplRes.templates || []);
        setBusiness(bizRes.business || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleUseTemplate = async (template) => {
    if (!business) {
      alert('Please configure your Business Profile first!');
      navigate('/dashboard/business');
      return;
    }

    setCreating(true);
    try {
      const res = await api.createWebsite({
        businessId: business.id,
        name: `${business.businessName} - ${template.name}`,
        slug: `${business.slug}-${template.id}`,
        template: template.id,
        contentJson: template.data,
      });

      navigate(`/dashboard/builder?id=${res.website.id}`);
    } catch (err) {
      alert(err.message || 'Failed to initialize template website.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Website Starter Templates
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select from 5 professionally pre-designed templates. Each includes structured hero, about, services, products, and contact sections.
        </p>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-white rounded-3xl border border-slate-200"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all group"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={tmpl.thumbnail}
                    alt={tmpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 shadow-md">
                      {tmpl.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {tmpl.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Includes 5+ modular sections & mobile responsive CSS</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(tmpl)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Layout</span>
                </button>

                <button
                  type="button"
                  disabled={creating}
                  onClick={() => handleUseTemplate(tmpl)}
                  className="flex-1 py-2.5 px-3 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 hover:opacity-95 disabled:opacity-50"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Use Template</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INSPECT MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  {previewTemplate.category}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{previewTemplate.name}</h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <img
                src={previewTemplate.thumbnail}
                alt={previewTemplate.name}
                className="w-full h-56 object-cover rounded-2xl shadow-sm"
              />
              <p className="text-sm text-slate-600 leading-relaxed">
                {previewTemplate.description}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Pre-Configured Sections ({previewTemplate.data.sections.length})
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  {previewTemplate.data.sections.map((sec, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 capitalize">
                      <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                      <span>{sec.type} Section</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setPreviewTemplate(null);
                  handleUseTemplate(previewTemplate);
                }}
                className="px-6 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md shadow-blue-500/20"
              >
                Build Website With This Template
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
