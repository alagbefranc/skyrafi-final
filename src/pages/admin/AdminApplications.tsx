import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { Eye, Download, Mail, CheckCircle, XCircle } from 'lucide-react';
import { getEnv } from '../../lib/env';

const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const fn = (key: string) => getEnv(key);

  const getHeaders = async (): Promise<HeadersInit> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const anon = fn('VITE_SUPABASE_ANON_KEY');
    if (!token) throw new Error('No session');
    return { Authorization: `Bearer ${token}`, apikey: anon ?? '' } as HeadersInit;
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData.user?.email ?? null);

      const appsUrl = fn('VITE_SUPABASE_ADMIN_LIST_APPLICATIONS_URL');
      if (!appsUrl) throw new Error('Missing applications URL');
      
      const headers = await getHeaders();
      const res = await fetch(appsUrl, { headers });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data?.error || 'Failed to load applications');
      setApplications(data?.applications ?? []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateApplicationStatus = async (appId: string, status: string) => {
    try {
      // Note: You'll need to create this endpoint
      const updateUrl = fn('VITE_SUPABASE_ADMIN_UPDATE_APPLICATION_URL');
      if (!updateUrl) throw new Error('Missing update application URL');

      const headers = await getHeaders();
      const res = await fetch(updateUrl, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, status }),
      });

      if (!res.ok) throw new Error('Failed to update application');
      
      // Refresh list
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status } : app
      ));
    } catch (e: any) {
      setError(e?.message || 'Failed to update application');
    }
  };

  const applicationColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'jobs', label: 'Job', sortable: true, render: (value: any) => value?.title || 'N/A' },
    { key: 'status', label: 'Status', sortable: true, render: (value: string) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        value === 'new' ? 'bg-blue-100 text-blue-800' :
        value === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
        value === 'shortlisted' ? 'bg-green-100 text-green-800' :
        value === 'rejected' ? 'bg-red-100 text-red-800' :
        value === 'hired' ? 'bg-emerald-100 text-emerald-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {value || 'new'}
      </span>
    )},
    { key: 'resume_url', label: 'Resume', render: (value: string) => (
      value ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center text-sky-blue-600 hover:text-sky-blue-800"
        >
          <Download className="h-4 w-4 mr-1" />
          View
        </a>
      ) : (
        <span className="text-gray-400">No resume</span>
      )
    )},
    { key: 'created_at', label: 'Applied', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'actions', label: 'Actions', render: (_: any, row: any) => (
      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedApp(row)}
          className="text-blue-600 hover:text-blue-800"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => updateApplicationStatus(row.id, 'shortlisted')}
          className="text-green-600 hover:text-green-800"
          title="Shortlist"
        >
          <CheckCircle className="h-4 w-4" />
        </button>
        <button
          onClick={() => updateApplicationStatus(row.id, 'rejected')}
          className="text-red-600 hover:text-red-800"
          title="Reject"
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    )}
  ];

  if (loading) return (
    <AdminLayout currentPage="applications" userEmail={userEmail || undefined}>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-blue-600"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout currentPage="applications" userEmail={userEmail || undefined}>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <p className="mt-1 text-sm text-gray-500">Review and manage job applications</p>
      </div>

      <DataTable
        data={applications}
        columns={applicationColumns}
        title={`Applications (${applications.length})`}
        searchable={true}
        exportable={true}
      />

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApp.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApp.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApp.jobs?.title || 'N/A'}</p>
                  </div>
                </div>
                
                {selectedApp.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{selectedApp.message}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedApp.status || 'new'}
                    onChange={(e) => updateApplicationStatus(selectedApp.id, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  {selectedApp.email && (
                    <a
                      href={`mailto:${selectedApp.email}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </a>
                  )}
                  {selectedApp.resume_url && (
                    <a
                      href={selectedApp.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-blue-600 hover:bg-sky-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminApplications;
