import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Globe, Phone, Mail, MapPin, Send, CheckCircle2, 
  ExternalLink, Share2, Monitor, Tablet, Smartphone, AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';

export default function PublicWebsitePage() {
  const { slug } = useParams();
  const [website, setWebsite] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deviceMode, setDeviceMode] = useState('desktop');

  // Contact form submission state
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    async function loadWebsite() {
      try {
        const res = await api.getPublicWebsite(slug);
        setWebsite(res.website);

        try {
          const parsed = JSON.parse(res.website.contentJson);
          setContent(parsed);
        } catch (e) {
          console.error('Error parsing contentJson', e);
        }

        // Track page view event anonymously
        api.trackEvent({ websiteSlug: slug, eventType: 'VIEW', page: 'home' }).catch(() => {});
      } catch (err) {
        setError(err.message || 'Website not found or not currently published.');
      } finally {
        setLoading(false);
      }
    }
    loadWebsite();
  }, [slug]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!website) return;
    setContactSubmitting(true);
    try {
      await api.submitEnquiry({
        businessId: website.business.id,
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        message: contactForm.message,
      });

      // Track enquiry event
      api.trackEvent({ websiteSlug: slug, eventType: 'ENQUIRY', page: 'home' }).catch(() => {});

      setContactSuccess(true);
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (err) {
      alert(err.message || 'Failed to submit enquiry.');
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: website?.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Website URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">
        Loading published website...
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 text-center shadow-lg space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Website Unavailable</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {error || 'This business website is either in draft mode or the URL does not exist.'}
          </p>
          <div className="pt-2">
            <Link
              to="/explore"
              className="px-6 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md inline-block"
            >
              Browse Public Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const primaryColor = content?.theme?.primaryColor || '#2563eb';
  const fontFamily = content?.theme?.fontFamily || 'Plus Jakarta Sans';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      
      {/* Top Floating WebHub Presence Bar */}
      <header className="h-12 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between text-white shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center text-white">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-extrabold text-white">
              Web<span className="text-brand-400">Hub</span>
            </span>
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400 truncate max-w-xs">{website.name}</span>
        </div>

        {/* Device Frame Switcher */}
        <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1 rounded text-xs transition-colors ${deviceMode === 'desktop' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Desktop Mode"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1 rounded text-xs transition-colors ${deviceMode === 'tablet' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Tablet Mode"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1 rounded text-xs transition-colors ${deviceMode === 'mobile' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Mobile Mode"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700"
          >
            <Share2 className="w-3 h-3 text-brand-400" />
            <span>Share</span>
          </button>
          <Link
            to="/explore"
            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
          >
            Directory
          </Link>
        </div>
      </header>

      {/* Website Frame Canvas */}
      <main className="flex-1 flex justify-center items-start overflow-y-auto bg-slate-900/50 py-4 sm:py-8 px-2 sm:px-4">
        
        <div
          className={`bg-white shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden border border-slate-800/60 ${
            deviceMode === 'desktop'
              ? 'w-full max-w-5xl'
              : deviceMode === 'tablet'
              ? 'w-[768px]'
              : 'w-[375px]'
          }`}
          style={{ fontFamily }}
        >
          {content?.sections?.map((sec) => (
            <div key={sec.id}>
              {renderPublicSection(sec, primaryColor, contactForm, setContactForm, handleContactSubmit, contactSubmitting, contactSuccess)}
            </div>
          ))}
        </div>

      </main>

    </div>
  );
}

// RENDER PUBLIC SECTION
function renderPublicSection(sec, primaryColor, form, setForm, onSubmit, submitting, success) {
  const { content, style, type } = sec;
  const paddingClass = style?.paddingY || 'py-16';

  let bgClass = 'bg-white text-slate-900';
  if (style?.bgType === 'gray') bgClass = 'bg-slate-50 text-slate-900';
  if (style?.bgType === 'dark') bgClass = 'bg-slate-900 text-white';
  if (style?.bgType === 'gradient') bgClass = 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white';

  switch (type) {
    case 'hero':
      return (
        <section className={`${bgClass} ${paddingClass} px-6 sm:px-12 relative overflow-hidden`}>
          <div className={`max-w-4xl mx-auto ${style?.textAlign || 'text-center'} space-y-6 relative z-10`}>
            {content.badge && (
              <span
                style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-current"
              >
                {content.badge}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {content.title}
            </h1>
            <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
              {content.subtitle}
            </p>
            <div className={`flex flex-wrap gap-3 ${style?.textAlign === 'text-left' ? 'justify-start' : 'justify-center'} pt-2`}>
              {content.primaryButtonText && (
                <a
                  href={content.primaryButtonLink || '#'}
                  style={{ backgroundColor: primaryColor }}
                  className="px-7 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity inline-block"
                >
                  {content.primaryButtonText}
                </a>
              )}
              {content.secondaryButtonText && (
                <a
                  href={content.secondaryButtonLink || '#'}
                  className="px-7 py-3 rounded-xl border border-current opacity-80 hover:opacity-100 font-bold text-sm transition-opacity inline-block"
                >
                  {content.secondaryButtonText}
                </a>
              )}
            </div>
            {content.imageUrl && (
              <div className="pt-6">
                <img
                  src={content.imageUrl}
                  alt={content.title}
                  className="rounded-2xl max-h-96 w-full object-cover shadow-2xl mx-auto"
                />
              </div>
            )}
          </div>
        </section>
      );

    case 'features':
      return (
        <section className={`${bgClass} ${paddingClass} px-6 sm:px-12 border-b border-slate-100`}>
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{content.heading}</h2>
              {content.subtitle && <p className="text-sm opacity-70 mt-2 max-w-xl mx-auto">{content.subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {content.items?.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-slate-200/20 shadow-xs space-y-2">
                  <div
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mb-3"
                  >
                    ✓
                  </div>
                  <h3 className="font-bold text-base">{item.title}</h3>
                  <p className="text-xs opacity-75 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'products':
      return (
        <section id="menu" className={`${bgClass} ${paddingClass} px-6 sm:px-12 border-b border-slate-100`}>
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{content.heading}</h2>
              {content.subtitle && <p className="text-sm opacity-70 mt-2 max-w-xl mx-auto">{content.subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
              {content.items?.map((item, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white text-slate-900 group">
                  {item.imageUrl && (
                    <div className="h-44 bg-slate-100 overflow-hidden relative">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {item.tag && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white/95 text-slate-800 shadow">
                          {item.tag}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base">{item.name}</h4>
                      <span style={{ color: primaryColor }} className="font-extrabold text-sm">{item.price}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'about':
      return (
        <section id="about" className={`${bgClass} ${paddingClass} px-6 sm:px-12 border-b border-slate-100`}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{content.heading}</h2>
              <p className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap">{content.story}</p>
              {content.stats && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/20">
                  {content.stats.map((st, i) => (
                    <div key={i}>
                      <p style={{ color: primaryColor }} className="text-2xl font-black">{st.value}</p>
                      <p className="text-xs opacity-70 font-semibold">{st.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {content.imageUrl && (
              <div>
                <img src={content.imageUrl} alt="About Us" className="rounded-2xl shadow-xl w-full h-80 object-cover" />
              </div>
            )}
          </div>
        </section>
      );

    case 'testimonials':
      return (
        <section className={`${bgClass} ${paddingClass} px-6 sm:px-12 border-b border-slate-100`}>
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{content.heading}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {content.items?.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-900 space-y-3">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <p className="text-xs text-slate-600 italic leading-relaxed">"{item.quote}"</p>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{item.author}</p>
                    <p className="text-[10px] text-slate-400">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'gallery':
      return (
        <section className={`${bgClass} ${paddingClass} px-6 sm:px-12 border-b border-slate-100`}>
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{content.heading}</h2>
              {content.subtitle && <p className="text-sm opacity-70 mt-2">{content.subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {content.items?.map((item, idx) => (
                <div key={idx} className="h-60 rounded-2xl overflow-hidden relative group">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent flex items-end p-4 text-white text-left">
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-[11px] opacity-75">{item.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'contact':
      return (
        <section id="contact" className={`${bgClass} ${paddingClass} px-6 sm:px-12 border-b border-slate-100`}>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{content.heading}</h2>
              <p className="text-sm opacity-80 leading-relaxed">{content.subtitle}</p>
              <div className="space-y-2 text-xs pt-2">
                {content.phone && <p>📞 Phone: <span className="font-semibold">{content.phone}</span></p>}
                {content.email && <p>✉️ Email: <span className="font-semibold">{content.email}</span></p>}
                {content.address && <p>📍 Address: <span className="font-semibold">{content.address}</span></p>}
              </div>
            </div>

            {/* LIVE WORKING ENQUIRY FORM */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-800">
              {success ? (
                <div className="text-center py-8 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-base text-slate-900">Enquiry Submitted!</h4>
                  <p className="text-xs text-slate-500">
                    Your message has been sent directly to the business owner.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Send Direct Message</h4>
                  
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <textarea
                      required
                      rows={3}
                      placeholder="Your message, quotation request, or booking notes *"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ backgroundColor: primaryColor }}
                    className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Send Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      );

    case 'footer':
      return (
        <footer className={`${bgClass} ${paddingClass} px-6 sm:px-12 text-center text-xs opacity-75 space-y-2`}>
          <p className="font-bold text-sm tracking-tight">{content.brandName}</p>
          <p>{content.tagline}</p>
          <p className="pt-2 text-[11px] opacity-60">{content.copyright}</p>
        </footer>
      );

    default:
      return null;
  }
}
