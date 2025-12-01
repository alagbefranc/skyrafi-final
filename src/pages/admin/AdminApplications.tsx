import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../components/admin/AdminLayout';
import { Eye, Download, Mail, CheckCircle, X, Search, Filter, MoreVertical, User, Briefcase, Calendar, Phone, FileText, AlertCircle } from 'lucide-react';
import * as CONSTANTS from '../../lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [updating, setUpdating] = useState(false);

  const getHeaders = async (): Promise<HeadersInit> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error('No session');
    return { Authorization: `Bearer ${token}`, apikey: CONSTANTS.SUPABASE_ANON_KEY } as HeadersInit;
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData.user?.email ?? null);

      const appsUrl = CONSTANTS.SUPABASE_ADMIN_LIST_APPLICATIONS_URL;
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
    setUpdating(true);
    try {
      const updateUrl = CONSTANTS.SUPABASE_ADMIN_UPDATE_APPLICATION_URL;
      if (!updateUrl) throw new Error('Missing update application URL');

      const headers = await getHeaders();
      const res = await fetch(updateUrl, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, status }),
      });

      if (!res.ok) throw new Error('Failed to update application');
      
      setSuccess(`Application status updated to ${status}`);
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh list locally
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status } : app
      ));
      
      // Update selected app if open
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, status });
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to update application');
    } finally {
      setUpdating(false);
    }
  };

  const openDrawer = (app: any) => {
    setSelectedApp(app);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setTimeout(() => setSelectedApp(null), 300);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.jobs?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'reviewed': return 'bg-yellow-100 text-yellow-700';
      case 'shortlisted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'hired': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout currentPage="applications" userEmail={userEmail || undefined}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-sm text-gray-500 mt-1">Review and manage candidate applications</p>
          </div>
          <div className="flex items-center gap-2">
             <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600">
               Total: {applications.length}
             </span>
          </div>
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

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search applicants, emails, or jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* View Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`p-2 rounded-lg border transition-colors flex items-center gap-2 text-sm ${filterStatus !== 'all' ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-500 hover:bg-gray-50 border-gray-200'}`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">{filterStatus === 'all' ? 'Filter' : filterStatus}</span>
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1">
                  {['all', 'new', 'reviewed', 'shortlisted', 'rejected', 'hired'].map((statusOption) => (
                    <button
                      key={statusOption}
                      onClick={() => {
                        setFilterStatus(statusOption);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 capitalize ${filterStatus === statusOption ? 'font-bold text-gray-900 bg-gray-50' : 'text-gray-600'}`}
                    >
                      {statusOption}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
            <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No applications found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredApplications.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group ${viewMode === 'list' ? 'flex flex-col sm:flex-row items-center p-4 gap-6' : ''}`}
              >
                <div className={viewMode === 'list' ? "flex-1 w-full" : "p-6"}>
                  <div className={viewMode === 'list' ? "flex items-center gap-4" : "flex justify-between items-start mb-4"}>
                    <div className={`p-3 bg-gray-50 rounded-xl ${viewMode === 'list' ? 'flex-shrink-0' : ''}`}>
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    <div className={viewMode === 'list' ? "flex-1 min-w-0" : "flex-1 ml-4"}>
                       {viewMode === 'grid' && (
                         <div className="flex justify-end items-center gap-2 mb-4 -mt-3 -mr-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                            <div className="relative group/menu">
                              <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover/menu:block z-10">
                                <button onClick={() => openDrawer(app)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-xl">View Details</button>
                                <button onClick={() => updateApplicationStatus(app.id, 'shortlisted')} className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50">Shortlist</button>
                                <button onClick={() => updateApplicationStatus(app.id, 'rejected')} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-xl">Reject</button>
                              </div>
                            </div>
                         </div>
                       )}
                       
                       <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{app.name}</h3>
                       <p className="text-sm text-gray-500 truncate">{app.email}</p>
                       
                       <div className={viewMode === 'list' ? "flex items-center gap-6 mt-1 text-sm text-gray-500" : "space-y-2 mt-4 mb-6"}>
                          <div className="flex items-center text-sm text-gray-600 bg-blue-50/50 px-2 py-1 rounded-md w-fit">
                            <Briefcase className="w-3.5 h-3.5 mr-2 text-blue-500 flex-shrink-0" />
                            <span className="truncate font-medium">{app.jobs?.title || 'Unknown Role'}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Calendar className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                            <span>Applied {new Date(app.created_at).toLocaleDateString()}</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  {viewMode === 'grid' && (
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                      {app.resume_url ? (
                        <a 
                          href={app.resume_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          Resume
                        </a>
                      ) : (
                        <span className="flex-1 text-center text-xs text-gray-400 py-2">No Resume</span>
                      )}
                      <button 
                        onClick={() => openDrawer(app)} 
                        className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        View
                      </button>
                    </div>
                  )}
                </div>

                {viewMode === 'list' && (
                  <div className="flex items-center gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 mt-4 sm:mt-0 justify-between sm:justify-end px-4 sm:px-0">
                     <div className="flex flex-col items-end gap-1 mr-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => openDrawer(app)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        {app.resume_url && (
                          <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors" title="Download Resume">
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                     </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {showDrawer && selectedApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-100"
            >
              <div className="h-full flex flex-col">
                {/* Drawer Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-500 shadow-sm">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedApp.name}</h2>
                      <p className="text-sm text-gray-500">{selectedApp.email}</p>
                    </div>
                  </div>
                  <button onClick={closeDrawer} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 p-6 space-y-8">
                  {/* Status Section */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Application Status</label>
                    <div className="flex flex-wrap gap-2">
                      {['new', 'reviewed', 'shortlisted', 'rejected', 'hired'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateApplicationStatus(selectedApp.id, status)}
                          disabled={updating}
                          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all border ${
                            selectedApp.status === status
                              ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                        <Briefcase className="w-4 h-4" /> Applied Role
                      </label>
                      <p className="text-gray-900 font-medium">{selectedApp.jobs?.title || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                        <Calendar className="w-4 h-4" /> Applied Date
                      </label>
                      <p className="text-gray-900 font-medium">{new Date(selectedApp.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                        <Phone className="w-4 h-4" /> Phone
                      </label>
                      <p className="text-gray-900 font-medium">{selectedApp.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                      <FileText className="w-4 h-4" /> Cover Letter / Message
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm leading-relaxed border border-gray-100">
                      {selectedApp.message ? selectedApp.message : <span className="italic text-gray-400">No message provided.</span>}
                    </div>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                  {selectedApp.email && (
                    <a
                      href={`mailto:${selectedApp.email}`}
                      className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </a>
                  )}
                  {selectedApp.resume_url ? (
                    <a
                      href={selectedApp.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </a>
                  ) : (
                    <button disabled className="flex-1 px-4 py-3 bg-gray-200 text-gray-400 rounded-xl text-sm font-bold cursor-not-allowed">
                      No Resume
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminApplications;
