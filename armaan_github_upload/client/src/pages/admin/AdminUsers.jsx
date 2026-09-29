import React, { useState, useEffect } from 'react';
import { Users, Shield, Store, User, Power, CheckCircle2, Search } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await api.getUsers();
      setUsers(res.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleStatus = async (user) => {
    try {
      await api.toggleUserStatus(user.id);
      setToast(`User status toggled successfully.`);
      fetchUsers();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Status toggle failed.');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            User Accounts & Access Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review registered business owners, consumers, and platform administrators.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading user accounts...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Businesses</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-white">
                      <div>{u.name}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{u.email}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-950 text-purple-400 border border-purple-800'
                            : u.role === 'BUSINESS_OWNER'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {u.phone || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-white font-medium">
                      {u._count?.businesses || 0} Listed
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-red-950 text-red-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1 ml-auto ${
                            u.status === 'ACTIVE'
                              ? 'bg-red-950 text-red-300 border border-red-800 hover:bg-red-900'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
