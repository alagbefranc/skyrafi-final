import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { Edit, Mail, UserCheck, Archive } from 'lucide-react';
import { getEnv } from '../../lib/env';

const AdminWaitlist: React.FC = () => {
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  // Form state
  const [status, setStatus] = useState('new');
  const [note, setNote] = useState('');

  const fn = (key: string) => getEnv(key);

  const getHeaders = async (): Promise<HeadersInit> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const anon = fn('VITE_SUPABASE_ANON_KEY');
    if (!token) throw new Error('No session');
    return { Authorization: `Bearer ${token}`, apikey: anon ?? '' } as HeadersInit;
  };

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData.user?.email ?? null);

      const waitlistUrl = fn('VITE_SUPABASE_ADMIN_LIST_WAITLIST_URL');
      if (!waitlistUrl) throw new Error('Missing waitlist URL');
      
      const headers = await getHeaders();
      const res = await fetch(waitlistUrl, { headers });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data?.error || 'Failed to load waitlist');
      setWaitlist(data?.waitlist ?? []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load waitlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const updateWaitlistEntry = async (id: string, newStatus: string, newNote: string) => {
    try {
      const updateUrl = fn('VITE_SUPABASE_ADMIN_UPDATE_WAITLIST_URL');
      if (!updateUrl) throw new Error('Missing update waitlist URL');

      const headers = await getHeaders();
      const res = await fetch(updateUrl, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, note: newNote }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update waitlist entry');

      // Update local state
      setWaitlist(prev => prev.map(entry => 
        entry.id === id ? { ...entry, status: newStatus, note: newNote } : entry
      ));
      setEditingEntry(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to update waitlist entry');
    }
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setStatus(entry.status || 'new');
    setNote(entry.note || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      updateWaitlistEntry(editingEntry.id, status, note);
    }
  };

  const waitlistColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (value: string) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        value === 'new' ? 'bg-blue-100 text-blue-800' :
        value === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
        value === 'qualified' ? 'bg-green-100 text-green-800' :
        value === 'converted' ? 'bg-purple-100 text-purple-800' :
        value === 'archived' ? 'bg-gray-100 text-gray-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {value || 'new'}
      </span>
    )},
    { key: 'note', label: 'Notes', render: (value: string) => (
      <span className="text-sm text-gray-600 truncate max-w-xs block" title={value}>
        {value || 'No notes'}
      </span>
    )},
    { key: 'created_at', label: 'Joined', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'actions', label: 'Actions', render: (_: any, row: any) => (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEdit(row)}
          className="text-blue-600 hover:text-blue-800"
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </button>
        <a
          href={`mailto:${row.email}`}
          className="text-green-600 hover:text-green-800"
          title="Send Email"
        >
          <Mail className="h-4 w-4" />
        </a>
        <button
          onClick={() => updateWaitlistEntry(row.id, 'converted', row.note || '')}
          className="text-purple-600 hover:text-purple-800"
          title="Mark as Converted"
        >
          <UserCheck className="h-4 w-4" />
        </button>
        <button
          onClick={() => updateWaitlistEntry(row.id, 'archived', row.note || '')}
          className="text-gray-600 hover:text-gray-800"
          title="Archive"
        >
          <Archive className="h-4 w-4" />
        </button>
      </div>
    )}
  ];

  if (loading) return (
    <AdminLayout currentPage="waitlist" userEmail={userEmail || undefined}>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-blue-600"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout currentPage="waitlist" userEmail={userEmail || undefined}>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Waitlist Management</h1>
        <p className="mt-1 text-sm text-gray-500">Manage and track waitlist entries</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {['new', 'contacted', 'qualified', 'converted', 'archived'].map(statusType => {
          const count = waitlist.filter(entry => (entry.status || 'new') === statusType).length;
          return (
            <div key={statusType} className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-500 capitalize">{statusType}</div>
            </div>
          );
        })}
      </div>

      <DataTable
        data={waitlist}
        columns={waitlistColumns}
        title={`Waitlist Entries (${waitlist.length})`}
        searchable={true}
        exportable={true}
      />

      {/* Edit Entry Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Waitlist Entry: {editingEntry.name}
              </h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="Add notes about this entry..."
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingEntry(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-sky-blue-600 hover:bg-sky-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminWaitlist;
