import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatsCard from '../../components/admin/StatsCard';
import { Users, Briefcase, UserCheck, Clock, Plus } from 'lucide-react';
import { getEnv } from '../../lib/env';

const AdminDashboard: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Create job form state
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Remote');
  const [type, setType] = useState('Full-time');
  const [description, setDescription] = useState('');

  const fn = (key: string) => getEnv(key);

  // Helper to get the current session access token for authenticated admin calls
  const getAuthHeader = async (): Promise<HeadersInit> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      window.location.href = '/admin/login';
      throw new Error('No session');
    }
    return { Authorization: `Bearer ${token}` } as HeadersInit;
  };

  const getHeaders = async (): Promise<HeadersInit> => {
    const auth = await getAuthHeader();
    const anon = fn('VITE_SUPABASE_ANON_KEY');
    return { ...(auth as any), apikey: anon ?? '' } as HeadersInit;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Ensure we have a session; if not, redirect to login
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        window.location.href = '/admin/login';
        return;
      }
      // Store user email for debugging
      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData.user?.email ?? null);
      const headers = await getHeaders();

      // Check admin
      const checkUrl = fn('VITE_SUPABASE_ADMIN_CHECK_URL');
      if (!checkUrl) throw new Error('Missing admin check URL');
      const checkRes = await fetch(checkUrl, { headers });
      const checkData = await checkRes.json();
      if (!checkRes.ok) throw new Error(checkData?.error || 'Admin check failed');
      setIsAdmin(!!checkData?.is_admin);
      if (!checkData?.is_admin) return;

      // Load jobs
      const jobsUrl = fn('VITE_SUPABASE_ADMIN_LIST_JOBS_URL');
      if (!jobsUrl) throw new Error('Missing admin list jobs URL');
      const jobsRes = await fetch(jobsUrl, { headers });
      const jobsData = await jobsRes.json();
      if (!jobsRes.ok) throw new Error(jobsData?.error || 'Failed to load jobs');
      setJobs(jobsData?.jobs ?? []);

      // Load applications
      const appsUrl = fn('VITE_SUPABASE_ADMIN_LIST_APPLICATIONS_URL');
      if (!appsUrl) throw new Error('Missing admin list applications URL');
      const appsRes = await fetch(appsUrl, { headers });
      const appsData = await appsRes.json();
      if (!appsRes.ok) throw new Error(appsData?.error || 'Failed to load applications');
      setApps(appsData?.applications ?? []);

      // Load waitlist
      const wlUrl = fn('VITE_SUPABASE_ADMIN_LIST_WAITLIST_URL');
      if (!wlUrl) throw new Error('Missing admin list waitlist URL');
      const wlRes = await fetch(wlUrl, { headers });
      const wlData = await wlRes.json();
      if (!wlRes.ok) throw new Error(wlData?.error || 'Failed to load waitlist');
      setWaitlist(wlData?.waitlist ?? []);

      // Load employees
      const empUrl = fn('VITE_SUPABASE_ADMIN_LIST_EMPLOYEES_URL');
      if (!empUrl) throw new Error('Missing admin list employees URL');
      const empRes = await fetch(empUrl, { headers });
      const empData = await empRes.json();
      if (!empRes.ok) throw new Error(empData?.error || 'Failed to load employees');
      setEmployees(empData?.employees ?? []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createUrl = fn('VITE_SUPABASE_ADMIN_CREATE_JOB_URL');
      if (!createUrl) throw new Error('Missing admin create job config');
      const res = await fetch(createUrl, {
        method: 'POST',
        headers: { ...(await getHeaders()), 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, location, type, description, status: 'open' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create job');
      // Reload jobs
      setTitle(''); setLocation('Remote'); setType('Full-time'); setDescription('');
      // Simple reload of list
      const jobsUrl = fn('VITE_SUPABASE_ADMIN_LIST_JOBS_URL');
      if (jobsUrl) {
        const jobsRes = await fetch(jobsUrl, { headers: await getAuthHeader() });
        const jobsData = await jobsRes.json();
        if (jobsRes.ok) setJobs(jobsData?.jobs ?? []);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to create job');
    }
  };

  const _signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  const refreshWaitlist = async () => {
    try {
      const wlUrl = fn('VITE_SUPABASE_ADMIN_LIST_WAITLIST_URL');
      if (!wlUrl) return;
      const wlRes = await fetch(wlUrl, { headers: await getAuthHeader() });
      const wlData = await wlRes.json();
      if (wlRes.ok) setWaitlist(wlData?.waitlist ?? []);
    } catch {}
  };

  const _updateWaitlist = async (id: string, status: string, note: string) => {
    try {
      const updUrl = fn('VITE_SUPABASE_ADMIN_UPDATE_WAITLIST_URL');
      if (!updUrl) throw new Error('Missing waitlist update config');
      const res = await fetch(updUrl, {
        method: 'POST',
        headers: { ...(await getHeaders()), 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update waitlist');
      await refreshWaitlist();
    } catch (e: any) {
      setError(e?.message || 'Failed to update waitlist');
    }
  };

  const refreshEmployees = async () => {
    try {
      const empUrl = fn('VITE_SUPABASE_ADMIN_LIST_EMPLOYEES_URL');
      if (!empUrl) return;
      const empRes = await fetch(empUrl, { headers: await getAuthHeader() });
      const empData = await empRes.json();
      if (empRes.ok) setEmployees(empData?.employees ?? []);
    } catch {}
  };

  const _upsertEmployee = async (employee: any) => {
    try {
      const upUrl = fn('VITE_SUPABASE_ADMIN_UPSERT_EMPLOYEE_URL');
      if (!upUrl) throw new Error('Missing upsert employee config');
      const res = await fetch(upUrl, {
        method: 'POST',
        headers: { ...(await getHeaders()), 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to upsert employee');
      await refreshEmployees();
    } catch (e: any) {
      setError(e?.message || 'Failed to upsert employee');
    }
  };

  if (loading) return (
    <AdminLayout currentPage="dashboard" userEmail={userEmail || undefined}>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    </AdminLayout>
  );

  if (isAdmin === false) return (
    <AdminLayout currentPage="dashboard" userEmail={userEmail || undefined}>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">Please login with an admin email.</p>
          {userEmail && (
            <p className="mt-2 text-sm text-gray-600">Signed in as: <span className="font-mono">{userEmail}</span></p>
          )}
          <div className="mt-6 flex justify-center space-x-3">
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  const checkUrl = (import.meta as any).env?.VITE_SUPABASE_ADMIN_CHECK_URL as string | undefined;
                  if (!checkUrl) throw new Error('Missing admin check URL');
                  const res = await fetch(checkUrl, { headers: await getHeaders() });
                  const json = await res.json();
                  setIsAdmin(!!json?.is_admin);
                } catch (e: any) {
                  setError(e?.message || 'Failed to recheck admin');
                } finally {
                  setLoading(false);
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-sky-blue-700 bg-sky-blue-100 hover:bg-sky-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-blue-500"
            >
              Recheck Access
            </button>
            <a
              href="/admin/login"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-blue-500"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );

  // Column definitions for tables
  const jobColumns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (value: string) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        value === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    )},
    { key: 'created_at', label: 'Created', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() }
  ];

  const applicationColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'jobs', label: 'Job', sortable: true, render: (value: any) => value?.title || 'N/A' },
    { key: 'resume_url', label: 'Resume', render: (value: string) => (
      value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sky-blue-600 hover:text-sky-blue-800 font-medium">
          View Resume
        </a>
      ) : (
        <span className="text-gray-400">No resume</span>
      )
    )},
    { key: 'created_at', label: 'Applied', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() }
  ];

  const waitlistColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (value: string) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        value === 'new' ? 'bg-blue-100 text-blue-800' :
        value === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
        value === 'qualified' ? 'bg-green-100 text-green-800' :
        value === 'converted' ? 'bg-purple-100 text-purple-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    )},
    { key: 'note', label: 'Notes', render: (value: string) => (
      <span className="text-sm text-gray-600 truncate max-w-xs block">{value || 'No notes'}</span>
    )},
    { key: 'created_at', label: 'Joined', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() }
  ];

  const employeeColumns = [
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (value: string) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        value === 'manager' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {value}
      </span>
    )},
    { key: 'created_at', label: 'Added', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() }
  ];

  return (
    <AdminLayout currentPage="dashboard" userEmail={userEmail || undefined}>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Jobs"
          value={jobs.length}
          icon={Briefcase}
          color="blue"
        />
        <StatsCard
          title="Applications"
          value={apps.length}
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Waitlist"
          value={waitlist.length}
          icon={UserCheck}
          color="yellow"
        />
        <StatsCard
          title="Employees"
          value={employees.length}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={createJob} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job Title"
              required
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500"
            />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500"
            >
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-blue-600 hover:bg-sky-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </button>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Job Description"
              className="md:col-span-2 lg:col-span-4 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500"
              rows={3}
            />
          </form>
        </div>
      </div>

      {/* Data Tables */}
      <div className="space-y-8">
        <DataTable
          data={jobs}
          columns={jobColumns}
          title="Recent Jobs"
        />

        <DataTable
          data={apps}
          columns={applicationColumns}
          title="Recent Applications"
        />

        <DataTable
          data={waitlist}
          columns={waitlistColumns}
          title="Waitlist Entries"
        />

        <DataTable
          data={employees}
          columns={employeeColumns}
          title="Team Members"
        />
      </div>
    </AdminLayout>
  );
};

const _EmployeeManager = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); }} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="employee@example.com" className="flex-1 px-3 py-2 border rounded" required />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 border rounded">
          <option value="employee">employee</option>
          <option value="manager">manager</option>
        </select>
        <button className="bg-sky-blue-600 text-white px-4 py-2 rounded">Add / Update</button>
      </form>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">When</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {[].map((e: any) => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{new Date(e.created_at).toLocaleString()}</td>
                <td className="p-2">{e.email}</td>
                <td className="p-2">{e.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
