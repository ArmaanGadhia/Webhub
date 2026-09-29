import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, Database, Layers, ShieldCheck, Zap, Code, 
  Cpu, Users, CheckCircle2, ArrowRight 
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Banner */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-brand-700 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>Platform Overview & Capstone Project</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About the WebHub Platform
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            WebHub is an integrated full-stack SaaS platform combining a verified local business directory with an intuitive, no-code drag-and-drop website creation suite.
          </p>
        </div>

        {/* Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl">
              !
            </div>
            <h3 className="text-xl font-bold text-slate-900">The Problem</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Millions of local businesses, retail shops, and professional service providers operate without an active website due to prohibitive agency fees, complex domain management, and technical barriers. Consequently, potential local customers cannot discover their products, working hours, or contact info.
            </p>
            <ul className="space-y-2 text-xs text-slate-500 pt-2">
              <li className="flex items-center gap-2">❌ Expensive commercial website builders</li>
              <li className="flex items-center gap-2">❌ Fragmented local business directories</li>
              <li className="flex items-center gap-2">❌ High technical barrier for non-tech owners</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-900">The WebHub Solution</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              WebHub provides a dual-sided marketplace: business owners register, design their own responsive website using our visual component editor, and publish immediately to a clean public URL. Visitors search verified local companies, browse published websites, and submit enquiries directly.
            </p>
            <ul className="space-y-2 text-xs text-emerald-700 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Instant drag-and-drop site assembly</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Admin-moderated business directory</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Built-in analytics & direct leads</li>
            </ul>
          </div>

        </div>

        {/* Technical Architecture */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">System Architecture & Tech Stack</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The platform is engineered according to enterprise full-stack design patterns using a modern, scalable JavaScript architecture:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <Code className="w-6 h-6 text-brand-600 mb-2" />
              <h4 className="font-bold text-slate-900 text-sm">Frontend SPA</h4>
              <p className="text-xs text-slate-500 mt-1">React 19, Vite, Tailwind CSS, Lucide Icons, and React Router.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <Cpu className="w-6 h-6 text-purple-600 mb-2" />
              <h4 className="font-bold text-slate-900 text-sm">Backend API</h4>
              <p className="text-xs text-slate-500 mt-1">Node.js with Express.js RESTful endpoints and JWT authentication.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <Database className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="font-bold text-slate-900 text-sm">Database & ORM</h4>
              <p className="text-xs text-slate-500 mt-1">MySQL relational database managed via Prisma ORM schemas & migrations.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <Layers className="w-6 h-6 text-amber-600 mb-2" />
              <h4 className="font-bold text-slate-900 text-sm">Builder Engine</h4>
              <p className="text-xs text-slate-500 mt-1">Modular structured JSON component system with live reactive preview.</p>
            </div>
          </div>
        </div>

        {/* Capstone Project Meta */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Academic Project Details</span>
              <h3 className="text-xl font-bold mt-1">BCA 3rd Year Final Year Project</h3>
              <p className="text-xs text-slate-400 mt-1">Developed for Bachelor of Computer Applications degree presentation & evaluation.</p>
            </div>
            <Link
              to="/explore"
              className="px-6 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold self-start sm:self-auto hover:opacity-95 shadow-md"
            >
              Test Application
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
