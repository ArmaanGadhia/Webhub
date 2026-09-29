import React, { useState, useEffect } from 'react';
import { 
  FolderTree, Plus, Edit2, Trash2, CheckCircle2, 
  X, Check, Power, AlertCircle 
} from 'lucide-react';
import { api } from '../../services/api';
import CategoryIcon from '../../components/CategoryIcon';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', icon: 'Briefcase', description: '', status: 'ACTIVE' });
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await api.getCategories({ includeInactive: true });
      setCategories(res.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', icon: 'Briefcase', description: '', status: 'ACTIVE' });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      icon: cat.icon || 'Briefcase',
      description: cat.description || '',
      status: cat.status || 'ACTIVE',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
        setToast('Category updated successfully!');
      } else {
        await api.createCategory(formData);
        setToast('New category added to WebHub!');
      }
      setModalOpen(false);
      fetchCategories();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (cat) => {
    const newStatus = cat.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.updateCategory(cat.id, { status: newStatus });
      setToast(`Category set to ${newStatus}`);
      fetchCategories();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert('Status update failed.');
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    try {
      await api.deleteCategory(cat.id);
      setToast('Category removed successfully.');
      fetchCategories();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete category.');
    }
  };

  const iconOptions = [
    'Briefcase', 'Cpu', 'UtensilsCrossed', 'Shirt', 'Compass', 
    'Sparkles', 'Activity', 'GraduationCap', 'Hotel', 'ShoppingBag', 
    'Home', 'Dumbbell', 'Car', 'TrendingUp', 'Lamp', 'Music', 'Camera'
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Category Taxonomy Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain industry sectors, metadata icons, and public visibility states.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-36 bg-slate-950 rounded-2xl border border-slate-800"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                c.status === 'ACTIVE'
                  ? 'bg-slate-950 border-slate-800 text-white'
                  : 'bg-slate-950/50 border-slate-900 opacity-60 text-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center">
                    <CategoryIcon name={c.icon} className="w-5 h-5" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-850 text-slate-500'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white">{c.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {c.description || 'No description provided.'}
                </p>

                <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  <span>Slug:</span>
                  <span className="text-purple-400">/{c.slug}</span>
                  <span>•</span>
                  <span>{c._count?.businesses || 0} Businesses</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleToggleStatus(c)}
                  className={`text-[11px] font-semibold flex items-center gap-1 ${
                    c.status === 'ACTIVE' ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{c.status === 'ACTIVE' ? 'Disable' : 'Enable'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-900"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Health & Clinics"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Lucide Icon</label>
                <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto pr-1">
                  {iconOptions.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: ic })}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center ${
                        formData.icon === ic
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CategoryIcon name={ic} className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short summary for directory visitors..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
