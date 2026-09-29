import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, HelpCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const faqs = [
    {
      q: 'How does WebHub help my local business?',
      a: 'WebHub provides a free or low-cost way to build a high-performance business website with our drag-and-drop builder, and lists your company in our search directory so local customers can discover your services.',
    },
    {
      q: 'Do I need web hosting or a domain name?',
      a: 'No! Every business website is hosted on WebHub with a dedicated URL (e.g. /site/your-business-name) with fast page load speeds and zero maintenance required.',
    },
    {
      q: 'Can I edit my website after publishing?',
      a: 'Yes! You can log in anytime to your Business Owner Dashboard, click Website Builder, update your text, images, or sections, and re-publish with one click.',
    },
    {
      q: 'How do I receive customer leads and enquiries?',
      a: 'Every published website includes a built-in contact form. Submissions are instantly stored in your private Enquiries inbox inside your Business Owner Dashboard.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-brand-700 text-xs font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Support & Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact the WebHub Team
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Have questions about listing your business, our visual website builder, or technical features? We’re here to help.
          </p>
        </div>

        {/* Form & Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Platform Headquarters</h3>
              
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Campus Address</p>
                    <p className="text-xs text-slate-500 mt-0.5">BCA Department, Computer Science Block, Belagavi, Karnataka 590006</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Email Address</p>
                    <p className="text-xs text-slate-500 mt-0.5">support@webhub-platform.local</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Phone Support</p>
                    <p className="text-xs text-slate-500 mt-0.5">+91 98450 12345 (Mon - Fri: 9AM - 6PM)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 rounded-2xl text-white shadow-lg space-y-3">
              <h4 className="font-bold text-base">Quick Demonstration Notice</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                For project evaluation and presentations, you can use the instant 1-Click Demo Login in the top navigation bar to test all user roles (Admin, Business Owner, Visitor).
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-bold text-slate-900">Message Delivered!</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Thank you for reaching out. We have logged your enquiry in our platform support queue and will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-slate-900">Send Us a Direct Message</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Hegde"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="General Inquiry / Business Verification / Bug Report"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message Content *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe how we can assist you..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl gradient-brand text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:opacity-95 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* FAQ Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-brand-600">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {faqs.map((faq, index) => (
              <div key={index} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">{faq.q}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
