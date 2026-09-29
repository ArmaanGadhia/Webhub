import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Save, Eye, Globe, Undo2, Redo2, Monitor, Tablet, Smartphone, 
  Trash2, Copy, ArrowUp, ArrowDown, Plus, Check, Sparkles, 
  Settings2, Layers, Palette, ChevronLeft, ExternalLink, X, 
  Image as ImageIcon, Type, Layout, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { api } from '../../services/api';

export default function WebsiteBuilder() {
  const [searchParams] = useSearchParams();
  const websiteIdParam = searchParams.get('id');
  const navigate = useNavigate();

  const [website, setWebsite] = useState(null);
  const [websitesList, setWebsitesList] = useState([]);
  const [content, setContent] = useState({
    theme: {
      primaryColor: '#2563eb',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      fontFamily: 'Plus Jakarta Sans',
    },
    sections: [],
  });

  // History stack for Undo/Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Builder UI State
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [activeTab, setActiveTab] = useState('sections'); // 'sections' | 'add' | 'theme'
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  // Load website data
  useEffect(() => {
    async function load() {
      try {
        const listRes = await api.getWebsites();
        const allSites = listRes.websites || [];
        setWebsitesList(allSites);

        let targetSite = null;
        if (websiteIdParam) {
          targetSite = allSites.find((w) => String(w.id) === String(websiteIdParam));
        }
        if (!targetSite && allSites.length > 0) {
          targetSite = allSites[0];
        }

        if (targetSite) {
          const detailedRes = await api.getWebsite(targetSite.id);
          const current = detailedRes.website;
          setWebsite(current);

          let parsed = { theme: {}, sections: [] };
          try {
            parsed = JSON.parse(current.contentJson);
          } catch (e) {
            console.error('Error parsing site contentJson', e);
          }
          setContent(parsed);
          setHistory([parsed]);
          setHistoryIndex(0);
          if (parsed.sections?.length > 0) {
            setSelectedSectionId(parsed.sections[0].id);
          }
        }
      } catch (err) {
        console.error('Builder load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [websiteIdParam]);

  // Push new state to history
  const updateContentWithHistory = (newContent) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newContent);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setContent(newContent);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setContent(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setContent(next);
    }
  };

  // Section Management
  const selectedSection = content.sections?.find((s) => s.id === selectedSectionId);

  const handleUpdateSectionContent = (field, value) => {
    if (!selectedSectionId) return;
    const newSections = content.sections.map((sec) => {
      if (sec.id === selectedSectionId) {
        return {
          ...sec,
          content: { ...sec.content, [field]: value },
        };
      }
      return sec;
    });
    updateContentWithHistory({ ...content, sections: newSections });
  };

  const handleUpdateSectionStyle = (field, value) => {
    if (!selectedSectionId) return;
    const newSections = content.sections.map((sec) => {
      if (sec.id === selectedSectionId) {
        return {
          ...sec,
          style: { ...sec.style, [field]: value },
        };
      }
      return sec;
    });
    updateContentWithHistory({ ...content, sections: newSections });
  };

  const handleMoveSection = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= content.sections.length) return;
    const newSections = [...content.sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);
    updateContentWithHistory({ ...content, sections: newSections });
  };

  const handleDeleteSection = (id) => {
    if (content.sections.length <= 1) {
      alert('A website must contain at least one section.');
      return;
    }
    const newSections = content.sections.filter((s) => s.id !== id);
    updateContentWithHistory({ ...content, sections: newSections });
    if (selectedSectionId === id) {
      setSelectedSectionId(newSections[0]?.id || null);
    }
  };

  const handleDuplicateSection = (sec) => {
    const duplicated = {
      ...sec,
      id: `${sec.type}-${Date.now()}`,
      content: { ...sec.content, title: sec.content?.title ? `${sec.content.title} (Copy)` : undefined },
    };
    const index = content.sections.findIndex((s) => s.id === sec.id);
    const newSections = [...content.sections];
    newSections.splice(index + 1, 0, duplicated);
    updateContentWithHistory({ ...content, sections: newSections });
    setSelectedSectionId(duplicated.id);
  };

  const handleAddSection = (type) => {
    let newSec = null;
    const timestamp = Date.now();

    switch (type) {
      case 'hero':
        newSec = {
          id: `hero-${timestamp}`,
          type: 'hero',
          content: {
            badge: 'NEW SECTION',
            title: 'Your Compelling Headline',
            subtitle: 'Engaging subtext communicating your core offer clearly to website visitors.',
            primaryButtonText: 'Get Started',
            primaryButtonLink: '#contact',
            secondaryButtonText: 'Learn More',
            secondaryButtonLink: '#about',
            imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          },
          style: { paddingY: 'py-20', textAlign: 'text-center', bgType: 'gradient' },
        };
        break;
      case 'features':
        newSec = {
          id: `features-${timestamp}`,
          type: 'features',
          content: {
            heading: 'Key Offerings & Advantages',
            subtitle: 'Discover what sets our business apart from competitors.',
            items: [
              { title: 'Quality Assurance', description: 'Certified excellence across all services.', icon: 'CheckCircle' },
              { title: 'Rapid Support', description: 'Prompt and friendly assistance 7 days a week.', icon: 'Clock' },
              { title: 'Affordable Value', description: 'Fair transparent pricing without hidden fees.', icon: 'Shield' },
            ],
          },
          style: { paddingY: 'py-20', bgType: 'light' },
        };
        break;
      case 'products':
        newSec = {
          id: `products-${timestamp}`,
          type: 'products',
          content: {
            heading: 'Featured Catalog / Menu',
            subtitle: 'Our most popular items loved by customers.',
            items: [
              { name: 'Specialty Item #1', price: '₹299', description: 'Signature premium item crafted with perfection.', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80', tag: 'Popular' },
              { name: 'Specialty Item #2', price: '₹499', description: 'Handcrafted selection with high customer ratings.', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80', tag: 'New' },
            ],
          },
          style: { paddingY: 'py-20', bgType: 'light' },
        };
        break;
      case 'about':
        newSec = {
          id: `about-${timestamp}`,
          type: 'about',
          content: {
            heading: 'About Our Business',
            story: 'We are passionate about serving our local community with authentic hospitality, exceptional products, and lasting relationships.',
            stats: [
              { label: 'Happy Customers', value: '10,000+' },
              { label: 'Years Active', value: '8' },
            ],
            imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
          },
          style: { paddingY: 'py-16', bgType: 'gray' },
        };
        break;
      case 'testimonials':
        newSec = {
          id: `testimonials-${timestamp}`,
          type: 'testimonials',
          content: {
            heading: 'Customer Feedback',
            items: [
              { quote: 'Outstanding service and unmatched quality! Will definitely visit again.', author: 'Pooja Hegde', role: 'Verified Customer', rating: 5 },
              { quote: 'Very impressed with their attention to detail and friendly team.', author: 'Kiran Desai', role: 'Regular Client', rating: 5 },
            ],
          },
          style: { paddingY: 'py-16', bgType: 'light' },
        };
        break;
      case 'gallery':
        newSec = {
          id: `gallery-${timestamp}`,
          type: 'gallery',
          content: {
            heading: 'Photo Showcase',
            subtitle: 'A glance into our boutique and recent works.',
            items: [
              { title: 'Interior Ambience', subtitle: 'Showcase', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80' },
              { title: 'Product Display', subtitle: 'Collection', imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80' },
            ],
          },
          style: { paddingY: 'py-16', bgType: 'light' },
        };
        break;
      case 'contact':
        newSec = {
          id: `contact-${timestamp}`,
          type: 'contact',
          content: {
            heading: 'Get In Touch With Us',
            subtitle: 'Send us a message or visit our branch during operating hours.',
            phone: '+91 98765 43210',
            email: 'contact@example.com',
            address: 'City Center Mall, Main Boulevard',
          },
          style: { paddingY: 'py-20', bgType: 'gray' },
        };
        break;
      case 'footer':
        newSec = {
          id: `footer-${timestamp}`,
          type: 'footer',
          content: {
            brandName: website?.business?.businessName || 'Business Name',
            tagline: 'Delivering excellence and quality everyday.',
            copyright: `© ${new Date().getFullYear()} All Rights Reserved. Built with WebHub.`,
          },
          style: { paddingY: 'py-8', bgType: 'dark' },
        };
        break;
      default:
        return;
    }

    const newSections = [...content.sections, newSec];
    updateContentWithHistory({ ...content, sections: newSections });
    setSelectedSectionId(newSec.id);
    setActiveTab('sections');
  };

  // Save Website Draft
  const handleSave = async () => {
    if (!website) return;
    setSaving(true);
    setToast('');
    try {
      const res = await api.updateWebsite(website.id, {
        contentJson: content,
      });
      setWebsite(res.website);
      setToast('Website changes saved successfully!');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save website changes.');
    } finally {
      setSaving(false);
    }
  };

  // Publish Website
  const handlePublish = async () => {
    if (!website) return;
    setPublishing(true);
    setToast('');
    try {
      // First save latest draft
      await api.updateWebsite(website.id, { contentJson: content });
      const res = await api.publishWebsite(website.id);
      setWebsite(res.website);
      
      // Fire confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setToast(`🎉 Website Published! Live at /site/${res.website.slug}`);
      setTimeout(() => setToast(''), 5000);
    } catch (err) {
      alert(err.message || 'Failed to publish website.');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading Website Builder Canvas...</div>;
  }

  if (!website) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto space-y-4">
        <h3 className="text-xl font-bold text-slate-900">No Website Found</h3>
        <p className="text-xs text-slate-500">
          You haven't created a website yet. Please head to My Websites to start a new one.
        </p>
        <Link to="/dashboard/websites" className="px-6 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold">
          Create Website
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-0 left-0 bg-slate-900 z-50 flex flex-col h-screen text-slate-800 overflow-hidden font-sans">
      
      {/* 1. TOP BUILDER TOOLBAR */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/websites"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Builder"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">{website.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                website.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {website.status}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">/site/{website.slug}</span>
          </div>
        </div>

        {/* Center: Device Mode & Undo/Redo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                deviceMode === 'desktop' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                deviceMode === 'tablet' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                deviceMode === 'mobile' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Preview, Save, Publish */}
        <div className="flex items-center gap-2">
          {website.status === 'PUBLISHED' && (
            <Link
              to={`/site/${website.slug}`}
              target="_blank"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Site</span>
            </Link>
          )}

          <button
            onClick={() => setPreviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl gradient-brand text-white text-xs font-bold shadow-md shadow-blue-500/25 hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{publishing ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>

      </header>

      {/* Toast Notification Banner */}
      {toast && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 text-center shrink-0 flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* BUILDER WORKSPACE (3-COLUMN LAYOUT) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. LEFT SIDEBAR: SECTIONS LIST & COMPONENT PICKER */}
        <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-800 p-2 gap-1 bg-slate-950/60">
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'sections' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sections ({content.sections.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'add' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Block</span>
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'theme' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Theme
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {activeTab === 'sections' && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                  Reorder & Select Sections
                </span>
                {content.sections.map((sec, index) => {
                  const isSelected = selectedSectionId === sec.id;

                  return (
                    <div
                      key={sec.id}
                      onClick={() => setSelectedSectionId(sec.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-950/60 border-brand-500 text-white ring-1 ring-brand-500'
                          : 'bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-5 h-5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="truncate">
                          <p className="text-xs font-bold capitalize truncate">
                            {sec.type} Section
                          </p>
                          <span className="text-[10px] text-slate-500 truncate block">
                            {sec.content?.title || sec.content?.heading || sec.id}
                          </span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleMoveSection(index, -1)}
                          disabled={index === 0}
                          className="p-1 text-slate-500 hover:text-white disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(index, 1)}
                          disabled={index === content.sections.length - 1}
                          className="p-1 text-slate-500 hover:text-white disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicateSection(sec)}
                          className="p-1 text-slate-500 hover:text-blue-400"
                          title="Duplicate Section"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(sec.id)}
                          className="p-1 text-slate-500 hover:text-red-400"
                          title="Delete Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'add' && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                  Click to Append Section
                </span>
                {[
                  { type: 'hero', name: 'Hero Section', desc: 'Cover banner, headline & CTA buttons' },
                  { type: 'features', name: 'Features & Services', desc: 'Grid of company capabilities with icons' },
                  { type: 'products', name: 'Products / Menu Items', desc: 'Cards with images, prices, and tags' },
                  { type: 'about', name: 'About Us & Story', desc: 'Narrative description, stats & photo' },
                  { type: 'testimonials', name: 'Customer Testimonials', desc: 'Ratings & verified customer endorsements' },
                  { type: 'gallery', name: 'Photo Gallery', desc: 'Grid image portfolio showcase' },
                  { type: 'contact', name: 'Contact & Map Form', desc: 'Direct lead inquiry contact form' },
                  { type: 'footer', name: 'Footer Bar', desc: 'Copyright, brand statement & links' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleAddSection(item.type)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-brand-900/40 border border-slate-700/80 hover:border-brand-500 transition-all group flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-slate-700 group-hover:bg-brand-600 text-white shrink-0 mt-0.5">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-brand-300">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-4 p-2 text-slate-300">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Global Website Theme
                </span>

                <div>
                  <label className="block text-xs font-semibold mb-1">Primary Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.theme?.primaryColor || '#2563eb'}
                      onChange={(e) =>
                        updateContentWithHistory({
                          ...content,
                          theme: { ...content.theme, primaryColor: e.target.value },
                        })
                      }
                      className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={content.theme?.primaryColor || '#2563eb'}
                      onChange={(e) =>
                        updateContentWithHistory({
                          ...content,
                          theme: { ...content.theme, primaryColor: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Accent Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.theme?.accentColor || '#f59e0b'}
                      onChange={(e) =>
                        updateContentWithHistory({
                          ...content,
                          theme: { ...content.theme, accentColor: e.target.value },
                        })
                      }
                      className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={content.theme?.accentColor || '#f59e0b'}
                      onChange={(e) =>
                        updateContentWithHistory({
                          ...content,
                          theme: { ...content.theme, accentColor: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Typography Font</label>
                  <select
                    value={content.theme?.fontFamily || 'Plus Jakarta Sans'}
                    onChange={(e) =>
                      updateContentWithHistory({
                        ...content,
                        theme: { ...content.theme, fontFamily: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern)</option>
                    <option value="Inter">Inter (Clean Tech)</option>
                    <option value="system-ui">System Sans</option>
                  </select>
                </div>
              </div>
            )}
          </div>

        </aside>

        {/* 3. CENTER LIVE PREVIEW CANVAS */}
        <main className="flex-1 bg-slate-950 flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto">
          
          <div
            className={`transition-all duration-300 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800/80 my-auto ${
              deviceMode === 'desktop'
                ? 'w-full max-w-5xl min-h-[85vh]'
                : deviceMode === 'tablet'
                ? 'w-[768px] min-h-[85vh]'
                : 'w-[375px] min-h-[85vh]'
            }`}
            style={{
              fontFamily: content.theme?.fontFamily || 'Plus Jakarta Sans',
            }}
          >
            {content.sections.map((sec, index) => {
              const isSelected = selectedSectionId === sec.id;

              return (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`relative transition-all cursor-pointer ${
                    isSelected ? 'ring-4 ring-brand-500 ring-inset' : 'hover:outline hover:outline-2 hover:outline-brand-400'
                  }`}
                >
                  {/* Floating Action Tag on Selection */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5 bg-brand-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold shadow-md">
                      <span className="capitalize">{sec.type} Section</span>
                      <span>• Active</span>
                    </div>
                  )}

                  {/* Render Section Types */}
                  {renderSectionComponent(sec, content.theme)}
                </div>
              );
            })}
          </div>

        </main>

        {/* 4. RIGHT SIDEBAR: INSPECTOR & PROPERTY CONTROLS */}
        <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 text-white">
          <div className="h-12 border-b border-slate-800 px-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Section Inspector
            </span>
            {selectedSection && (
              <span className="text-[10px] font-bold text-brand-400 px-2 py-0.5 rounded bg-brand-950 border border-brand-800 capitalize">
                {selectedSection.type}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {selectedSection ? (
              <div className="space-y-5">
                
                {/* Content Properties */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Text & Content
                  </span>

                  {selectedSection.content?.badge !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Badge / Tagline</label>
                      <input
                        type="text"
                        value={selectedSection.content.badge}
                        onChange={(e) => handleUpdateSectionContent('badge', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  )}

                  {selectedSection.content?.title !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Main Title</label>
                      <input
                        type="text"
                        value={selectedSection.content.title}
                        onChange={(e) => handleUpdateSectionContent('title', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  )}

                  {selectedSection.content?.heading !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Heading</label>
                      <input
                        type="text"
                        value={selectedSection.content.heading}
                        onChange={(e) => handleUpdateSectionContent('heading', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  )}

                  {selectedSection.content?.subtitle !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Subtitle / Bio</label>
                      <textarea
                        rows={2}
                        value={selectedSection.content.subtitle}
                        onChange={(e) => handleUpdateSectionContent('subtitle', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                      ></textarea>
                    </div>
                  )}

                  {selectedSection.content?.story !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Story / Narrative</label>
                      <textarea
                        rows={3}
                        value={selectedSection.content.story}
                        onChange={(e) => handleUpdateSectionContent('story', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                      ></textarea>
                    </div>
                  )}

                  {/* Buttons */}
                  {selectedSection.content?.primaryButtonText !== undefined && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Button 1 Text</label>
                        <input
                          type="text"
                          value={selectedSection.content.primaryButtonText}
                          onChange={(e) => handleUpdateSectionContent('primaryButtonText', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Link Target</label>
                        <input
                          type="text"
                          value={selectedSection.content.primaryButtonLink || '#'}
                          onChange={(e) => handleUpdateSectionContent('primaryButtonLink', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Image URL */}
                  {selectedSection.content?.imageUrl !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Photo / Image URL</label>
                      <input
                        type="url"
                        value={selectedSection.content.imageUrl}
                        onChange={(e) => handleUpdateSectionContent('imageUrl', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  )}

                  {/* Contact Fields */}
                  {selectedSection.type === 'contact' && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Phone</label>
                        <input
                          type="text"
                          value={selectedSection.content.phone || ''}
                          onChange={(e) => handleUpdateSectionContent('phone', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                        <input
                          type="text"
                          value={selectedSection.content.email || ''}
                          onChange={(e) => handleUpdateSectionContent('email', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Address</label>
                        <input
                          type="text"
                          value={selectedSection.content.address || ''}
                          onChange={(e) => handleUpdateSectionContent('address', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Style Options */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Appearance & Background
                  </span>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Background Style</label>
                    <select
                      value={selectedSection.style?.bgType || 'light'}
                      onChange={(e) => handleUpdateSectionStyle('bgType', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                    >
                      <option value="light">Pure White</option>
                      <option value="gray">Subtle Slate</option>
                      <option value="dark">Dark Theme</option>
                      <option value="gradient">Brand Gradient</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Vertical Padding</label>
                    <select
                      value={selectedSection.style?.paddingY || 'py-16'}
                      onChange={(e) => handleUpdateSectionStyle('paddingY', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                    >
                      <option value="py-8">Compact (32px)</option>
                      <option value="py-16">Standard (64px)</option>
                      <option value="py-24">Spacious (96px)</option>
                    </select>
                  </div>

                  {selectedSection.style?.textAlign !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Text Alignment</label>
                      <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleUpdateSectionStyle('textAlign', 'text-left')}
                          className={`py-1 rounded text-xs flex justify-center ${selectedSection.style.textAlign === 'text-left' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
                        >
                          <AlignLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateSectionStyle('textAlign', 'text-center')}
                          className={`py-1 rounded text-xs flex justify-center ${selectedSection.style.textAlign === 'text-center' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
                        >
                          <AlignCenter className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateSectionStyle('textAlign', 'text-right')}
                          className={`py-1 rounded text-xs flex justify-center ${selectedSection.style.textAlign === 'text-right' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
                        >
                          <AlignRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select a section in the center canvas to customize its text, colors, and options.
              </div>
            )}
          </div>

        </aside>

      </div>

      {/* 5. FULL-SCREEN CLEAN PREVIEW MODAL */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col">
          <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-400" />
              <span>Full-Screen Live Website Preview</span>
            </span>
            <button
              onClick={() => setPreviewModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-white" style={{ fontFamily: content.theme?.fontFamily || 'Plus Jakarta Sans' }}>
            {content.sections.map((sec) => (
              <div key={sec.id}>
                {renderSectionComponent(sec, content.theme, true)}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// SECTION RENDERER FUNCTION (SHARED BY BUILDER & PREVIEW)
function renderSectionComponent(sec, theme, isInteractive = false) {
  const { content, style, type } = sec;
  const primaryColor = theme?.primaryColor || '#2563eb';
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
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-slate-800 space-y-3">
              <h4 className="font-bold text-sm">Send Direct Inquiry</h4>
              <input type="text" placeholder="Your Name" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs" />
              <input type="email" placeholder="Your Email" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs" />
              <textarea placeholder="Your Message..." rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"></textarea>
              <button
                type="button"
                style={{ backgroundColor: primaryColor }}
                className="w-full py-2.5 rounded-lg text-white font-bold text-xs shadow-md"
              >
                Send Message
              </button>
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
