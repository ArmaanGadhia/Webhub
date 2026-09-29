import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CategoriesPage from './pages/CategoriesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PublicWebsitePage from './pages/PublicWebsitePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Business Owner Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyBusinessPage from './pages/dashboard/MyBusinessPage';
import MyWebsitesPage from './pages/dashboard/MyWebsitesPage';
import WebsiteBuilder from './pages/builder/WebsiteBuilder';
import TemplatesPage from './pages/dashboard/TemplatesPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import EnquiriesPage from './pages/dashboard/EnquiriesPage';
import SettingsPage from './pages/dashboard/SettingsPage';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBusinesses from './pages/admin/AdminBusinesses';
import AdminCategories from './pages/admin/AdminCategories';
import AdminWebsites from './pages/admin/AdminWebsites';
import AdminUsers from './pages/admin/AdminUsers';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Public Website Viewing Route */}
          <Route path="/site/:slug" element={<PublicWebsitePage />} />

          {/* Standalone Fullscreen Website Builder */}
          <Route
            path="/dashboard/builder"
            element={
              <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'ADMIN']}>
                <WebsiteBuilder />
              </ProtectedRoute>
            }
          />

          {/* Public Pages with Standard Header/Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Business Owner Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="business" element={<MyBusinessPage />} />
            <Route path="websites" element={<MyWebsitesPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="enquiries" element={<EnquiriesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Admin Portal */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="businesses" element={<AdminBusinesses />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="websites" element={<AdminWebsites />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
