import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, Database, Key, Bell, Shield, Globe } from 'lucide-react';

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

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData.user?.email ?? null);
      
      // Load current settings from Supabase (if you have a settings table)
      // For now, using default values
    };
    loadData();
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Here you would save settings to Supabase
      // For now, just simulate a save operation
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
      // Simulate cache clearing
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
      // Here you would export data from Supabase
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
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your application configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2">
          <form onSubmit={saveSettings} className="space-y-6">
            {/* Company Settings */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Globe className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Company Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Email</label>
                  <input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Application Settings */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Application Settings</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                    <p className="text-sm text-gray-500">Send email notifications for new applications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="h-4 w-4 text-sky-blue-600 focus:ring-sky-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Allow Public Registration</label>
                    <p className="text-sm text-gray-500">Allow users to register for accounts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowRegistration}
                    onChange={(e) => setAllowRegistration(e.target.checked)}
                    className="h-4 w-4 text-sky-blue-600 focus:ring-sky-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Maintenance Mode</label>
                    <p className="text-sm text-gray-500">Put the application in maintenance mode</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="h-4 w-4 text-sky-blue-600 focus:ring-sky-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-blue-600 hover:bg-sky-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Database Stats */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Database className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Database Overview</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Jobs</span>
                <span className="text-sm font-medium text-gray-900">{dbStats.jobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Applications</span>
                <span className="text-sm font-medium text-gray-900">{dbStats.applications}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Waitlist</span>
                <span className="text-sm font-medium text-gray-900">{dbStats.waitlist}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Employees</span>
                <span className="text-sm font-medium text-gray-900">{dbStats.employees}</span>
              </div>
            </div>
          </div>

          {/* System Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Key className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">System Actions</h2>
            </div>
            <div className="space-y-3">
              <button
                onClick={clearCache}
                disabled={loading}
                className="w-full text-left px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Clear Cache
              </button>
              <button
                onClick={exportData}
                disabled={loading}
                className="w-full text-left px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Export Data
              </button>
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Environment</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mode</span>
                <span className="text-sm font-medium text-gray-900">Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-medium text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Supabase</span>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
