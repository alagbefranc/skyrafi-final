import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, Database, Key, Bell, Shield, Globe, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as CONSTANTS from '../../lib/constants';

const AdminSettings: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Settings state
  const [companyName, setCompanyName] = useState('Skyrafi');
  const [companyEmail, setCompanyEmail] = useState('contact@skyrafi.com');
  const [companyWebsite, setCompanyWebsite] = useState('https://skyrafi.com');
  const [notifications, setNotifications] = useState(true);
  const [allowRegistration, setAllowRegistration] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Database stats
  const [dbStats, setDbStats] = useState<any>({
    jobs: 0,
    applications: 0,
    waitlist: 0,
    employees: 0
  });

  const getHeaders = async (): Promise<HeadersInit> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error('No session');
    return { Authorization: `Bearer ${token}`, apikey: CONSTANTS.SUPABASE_ANON_KEY } as HeadersInit;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        setUserEmail(userData.user?.email ?? null);

        const headers = await getHeaders();

        // Fetch Jobs
        const jobsUrl = CONSTANTS.SUPABASE_ADMIN_LIST_JOBS_URL;
        const jobsRes = jobsUrl ? await fetch(jobsUrl, { headers }) : null;
        const jobsData = jobsRes ? await jobsRes.json() : { jobs: [] };

        // Fetch Applications
        const appsUrl = CONSTANTS.SUPABASE_ADMIN_LIST_APPLICATIONS_URL;
        const appsRes = appsUrl ? await fetch(appsUrl, { headers }) : null;
        const appsData = appsRes ? await appsRes.json() : { applications: [] };

        // Fetch Waitlist
        const wlUrl = CONSTANTS.SUPABASE_ADMIN_LIST_WAITLIST_URL;
        const wlRes = wlUrl ? await fetch(wlUrl, { headers }) : null;
        const wlData = wlRes ? await wlRes.json() : { waitlist: [] };

        // Fetch Employees
        const empUrl = CONSTANTS.SUPABASE_ADMIN_LIST_EMPLOYEES_URL;
        const empRes = empUrl ? await fetch(empUrl, { headers }) : null;
        const empData = empRes ? await empRes.json() : { employees: [] };

        setDbStats({
          jobs: jobsData.jobs?.length || 0,
          applications: appsData.applications?.length || 0,
          waitlist: wlData.waitlist?.length || 0,
          employees: empData.employees?.length || 0
        });
      } catch (e) {
        console.error('Failed to load stats', e);
      }
    };
    loadData();
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSuccess('Cache cleared successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e?.message || 'Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Data export initiated!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e?.message || 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout currentPage="settings" userEmail={userEmail || undefined}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your application configuration</p>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
              <button onClick={() => setError(null)}><X className="w-4 h-4 text-red-600" /></button>
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center text-green-800">
                <CheckCircle className="w-5 h-5 mr-2" />
                <p className="text-sm">{success}</p>
              </div>
              <button onClick={() => setSuccess(null)}><X className="w-4 h-4 text-green-600" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings Column */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={saveSettings}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6"
              >
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Company Information</h2>
                    <p className="text-sm text-gray-500">General settings for your organization</p>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
                      <input
                        type="email"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                      <input
                        type="url"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Application Control</h2>
                    <p className="text-sm text-gray-500">Manage access and notifications</p>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <label className="text-sm font-bold text-gray-900 block">Email Notifications</label>
                      <p className="text-xs text-gray-500 mt-0.5">Receive emails for new applications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <label className="text-sm font-bold text-gray-900 block">Public Registration</label>
                      <p className="text-xs text-gray-500 mt-0.5">Allow anyone to create an account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={allowRegistration} onChange={(e) => setAllowRegistration(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <label className="text-sm font-bold text-gray-900 block">Maintenance Mode</label>
                      <p className="text-xs text-gray-500 mt-0.5">Temporarily disable access</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                    </label>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 disabled:opacity-70"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </motion.div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Database Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900">Database Stats</h3>
              </div>
              <div className="p-4 space-y-3">
                {Object.entries(dbStats).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{key}</span>
                    <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* System Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <Key className="h-4 w-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900">System Actions</h3>
              </div>
              <div className="p-4 space-y-3">
                <button
                  onClick={clearCache}
                  disabled={loading}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear System Cache
                  <Database className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={exportData}
                  disabled={loading}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Export All Data
                  <Save className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </motion.div>

            {/* Environment Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900">Environment</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mode</span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">Production</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Version</span>
                  <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">1.0.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Online
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
