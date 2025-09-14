import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { getEnv } from '../../lib/env';

const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Remote');
  const [type, setType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('open');

  const fn = (key: string) => getEnv(key);

  const getHeaders = async (): Promise<HeadersInit> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const anon = fn('VITE_SUPABASE_ANON_KEY');
    if (!token) throw new Error('No session');
    return { Authorization: `Bearer ${token}`, apikey: anon ?? '' } as HeadersInit;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: userData } = await supabase.auth.getUser();
        setUserEmail(userData.user?.email ?? null);

        const jobsUrl = fn('VITE_SUPABASE_ADMIN_LIST_JOBS_URL');
        if (!jobsUrl) throw new Error('Missing jobs URL');
        
        const headers = await getHeaders();
        const res = await fetch(jobsUrl, { headers });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data?.error || 'Failed to load jobs');
        setJobs(data?.jobs ?? []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const createJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createUrl = fn('VITE_SUPABASE_ADMIN_CREATE_JOB_URL');
      if (!createUrl) throw new Error('Missing create job URL');

      const headers = await getHeaders();
      const res = await fetch(createUrl, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, location, type, description, requirements, salary, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create job');

      // Refresh jobs list
      const jobsUrl = fn('VITE_SUPABASE_ADMIN_LIST_JOBS_URL');
      if (jobsUrl) {
        const jobsRes = await fetch(jobsUrl, { headers });
        const jobsData = await jobsRes.json();
        if (jobsRes.ok) setJobs(jobsData?.jobs ?? []);
      }

      // Reset form
      setTitle('');
      setLocation('Remote');
      setType('Full-time');
      setDescription('');
      setRequirements('');
      setSalary('');
      setStatus('open');
      setShowCreateModal(false);
    } catch (e: any) {
      setError(e?.message || 'Failed to create job');
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      // Note: You'll need to create this endpoint
      const deleteUrl = fn('VITE_SUPABASE_ADMIN_DELETE_JOB_URL');
      if (!deleteUrl) throw new Error('Missing delete job URL');

      const headers = await getHeaders();
      const res = await fetch(deleteUrl, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId }),
      });

      if (!res.ok) throw new Error('Failed to delete job');
      
      // Refresh list
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (e: any) {
      setError(e?.message || 'Failed to delete job');
    }
  };

  const jobColumns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'salary', label: 'Salary', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (value: string) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        value === 'open' ? 'bg-green-100 text-green-800' : 
        value === 'closed' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    )},
    { key: 'created_at', label: 'Created', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'actions', label: 'Actions', render: (_: any, row: any) => (
      <div className="flex space-x-2">
        <button
          onClick={() => setEditingJob(row)}
          className="text-blue-600 hover:text-blue-800"
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => deleteJob(row.id)}
          className="text-red-600 hover:text-red-800"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    )}
  ];

  if (loading) return (
    <AdminLayout currentPage="jobs" userEmail={userEmail || undefined}>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-blue-600"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout currentPage="jobs" userEmail={userEmail || undefined}>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
            <p className="mt-1 text-sm text-gray-500">Create and manage job postings</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-blue-600 hover:bg-sky-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </button>
        </div>
      </div>

      <DataTable
        data={jobs}
        columns={jobColumns}
        title={`Jobs (${jobs.length})`}
        searchable={true}
        exportable={true}
      />

      {/* Create/Edit Job Modal */}
      {(showCreateModal || editingJob) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingJob ? 'Edit Job' : 'Create New Job'}
              </h3>
              <form onSubmit={createJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Job Title"
                    required
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                  />
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="Salary (e.g., $80k-$120k)"
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                  />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                  >
                    <option>Remote</option>
                    <option>On-site</option>
                    <option>Hybrid</option>
                  </select>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Job Description"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                />
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Requirements & Qualifications"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingJob(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-sky-blue-600 hover:bg-sky-blue-700"
                  >
                    {editingJob ? 'Update' : 'Create'} Job
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

export default AdminJobs;
