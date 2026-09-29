import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Heart, Shield, Code, Sparkles, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">Web<span className="text-brand-400">Hub</span></span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              WebHub bridges the digital divide for local enterprises by offering an intuitive drag-and-drop website creator and a centralized verified business discovery directory.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-900/40 text-blue-300 border border-blue-800">
                <Code className="w-3.5 h-3.5" />
                <span>BCA Capstone Project 2026</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/40 text-emerald-300 border border-emerald-800">
                <Shield className="w-3.5 h-3.5" />
                <span>Verified Listings</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/explore" className="hover:text-white transition-colors">Explore Businesses</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">All Categories</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Build Your Website</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">System Architecture</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Help & Contact</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Top Sectors</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/explore?category=restaurants" className="hover:text-white transition-colors">Restaurants & Cafes</Link></li>
              <li><Link to="/explore?category=technology" className="hover:text-white transition-colors">Technology & IT</Link></li>
              <li><Link to="/explore?category=fashion" className="hover:text-white transition-colors">Fashion & Handlooms</Link></li>
              <li><Link to="/explore?category=travel" className="hover:text-white transition-colors">Travel & Tourism</Link></li>
              <li><Link to="/explore?category=beauty-salon" className="hover:text-white transition-colors">Beauty & Wellness</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Direct Reach</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Belagavi, Karnataka, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>contact@webhub-bca.local</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+91 98450 12345</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} WebHub Platform. Developed for BCA Final Year Evaluation.</p>
          <div className="flex items-center gap-4">
            <span>MySQL 10.4 + Prisma ORM</span>
            <span>•</span>
            <span>Express.js REST APIs</span>
            <span>•</span>
            <span>React & Vite SPA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
