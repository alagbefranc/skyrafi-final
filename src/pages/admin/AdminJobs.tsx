import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, X, Search, Filter, MoreVertical, Briefcase, MapPin, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import * as CONSTANTS from '../../lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Remote');
  const [type, setType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('open');

  const getHeaders = async (): Promise<HeadersInit> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error('No session');
    return { Authorization: `Bearer ${token}`, apikey: CONSTANTS.SUPABASE_ANON_KEY } as HeadersInit;
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData.user?.email ?? null);

      const jobsUrl = CONSTANTS.SUPABASE_ADMIN_LIST_JOBS_URL;
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

  useEffect(() => {
    fetchJobs();
  }, []);

  const createJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const createUrl = CONSTANTS.SUPABASE_ADMIN_CREATE_JOB_URL;
      if (!createUrl) throw new Error('Missing create job URL');

      const headers = await getHeaders();
      const res = await fetch(createUrl, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, location, type, description, requirements, salary, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create job');

      setSuccess('Job created successfully!');
      setTimeout(() => setSuccess(null), 3000);

      // Refresh jobs list
      await fetchJobs();
      resetForm();
    } catch (e: any) {
      setError(e?.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  const updateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    
    setSubmitting(true);
    try {
      const updateUrl = CONSTANTS.SUPABASE_ADMIN_CREATE_JOB_URL; // Same endpoint handles update with id
      const headers = await getHeaders();
      const res = await fetch(updateUrl, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editingJob.id, 
          title, 
          location, 
          type, 
          description, 
          requirements, 
          salary, 
          status 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update job');

      setSuccess('Job updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh jobs list
      await fetchJobs();
      resetForm();
    } catch (e: any) {
      setError(e?.message || 'Failed to update job');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteJob = (jobId: string) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    
    setSubmitting(true);
    try {
      const deleteUrl = CONSTANTS.SUPABASE_ADMIN_DELETE_JOB_URL;
      if (!deleteUrl) throw new Error('Missing delete job URL');

      const headers = await getHeaders();
      const res = await fetch(deleteUrl, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobToDelete }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete job');
      
      setSuccess('Job deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh list
      setJobs(jobs.filter(job => job.id !== jobToDelete));
    } catch (e: any) {
      setError(e?.message || 'Failed to delete job');
    } finally {
      setSubmitting(false);
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };

  const resetForm = () => {
    setTitle('');
    setLocation('Remote');
    setType('Full-time');
    setDescription('');
    setRequirements('');
    setSalary('');
    setStatus('open');
    setShowDrawer(false);
    setEditingJob(null);
  };

  const openEditDrawer = (job: any) => {
    setTitle(job.title || '');
    setLocation(job.location || 'Remote');
    setType(job.type || 'Full-time');
    setDescription(job.description || '');
    setRequirements(job.requirements || '');
    setSalary(job.salary || '');
    setStatus(job.status || 'open');
    setEditingJob(job);
    setShowDrawer(true);
  };

  const openCreateDrawer = () => {
    resetForm();
    setShowDrawer(true);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout currentPage="jobs" userEmail={userEmail || undefined}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage recruitment and open positions</p>
          </div>
          <button
            onClick={openCreateDrawer}
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Job
          </button>
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
              placeholder="Search jobs by title or location..."
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
                  {['all', 'open', 'closed', 'draft'].map((statusOption) => (
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

        {/* Jobs Grid/List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group ${viewMode === 'list' ? 'flex flex-col sm:flex-row items-center p-4 gap-6' : ''}`}
              >
                <div className={viewMode === 'list' ? "flex-1 w-full" : "p-6"}>
                  <div className={viewMode === 'list' ? "flex items-center gap-4" : "flex justify-between items-start mb-4"}>
                    <div className={`p-3 bg-blue-50 rounded-xl ${viewMode === 'list' ? 'flex-shrink-0' : ''}`}>
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div className={viewMode === 'list' ? "flex-1 min-w-0" : "flex-1 ml-4"}>
                       {viewMode === 'grid' && (
                         <div className="flex justify-end items-center gap-2 mb-4 -mt-3 -mr-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              job.status === 'open' ? 'bg-green-100 text-green-700' :
                              job.status === 'closed' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                            <div className="relative group/menu">
                              <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover/menu:block z-10">
                                <button onClick={() => openEditDrawer(job)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-xl">Edit</button>
                                <button onClick={() => deleteJob(job.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-xl">Delete</button>
                              </div>
                            </div>
                         </div>
                       )}
                       
                       <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{job.title}</h3>
                       
                       <div className={viewMode === 'list' ? "flex items-center gap-6 mt-1 text-sm text-gray-500" : "space-y-2 mt-2 mb-6"}>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{job.type}</span>
                          </div>
                          {job.salary && viewMode === 'grid' && (
                            <div className="flex items-center text-sm text-gray-500">
                              <DollarSign className="w-4 h-4 mr-2" />
                              {job.salary}
                            </div>
                          )}
                       </div>
                    </div>
                  </div>

                  {viewMode === 'grid' && (
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                      <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                      <button onClick={() => openEditDrawer(job)} className="text-blue-600 font-medium hover:underline">View Details</button>
                    </div>
                  )}
                </div>

                {viewMode === 'list' && (
                  <div className="flex items-center gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 mt-4 sm:mt-0 justify-between sm:justify-end px-4 sm:px-0">
                     <div className="flex flex-col items-end gap-1 mr-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          job.status === 'open' ? 'bg-green-100 text-green-700' :
                          job.status === 'closed' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-400">Posted {new Date(job.created_at).toLocaleDateString()}</span>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => openEditDrawer(job)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteJob(job.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-over Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-100"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{editingJob ? 'Edit Job' : 'New Job'}</h2>
                    <p className="text-sm text-gray-500">{editingJob ? 'Update job details' : 'Create a new opening'}</p>
                  </div>
                  <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={editingJob ? updateJob : createJob} className="space-y-6 flex-1">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Senior Product Designer"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white appearance-none text-gray-900"
                        >
                          <option>Remote</option>
                          <option>On-site</option>
                          <option>Hybrid</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white appearance-none text-gray-900"
                        >
                          <option>Full-time</option>
                          <option>Part-time</option>
                          <option>Contract</option>
                          <option>Internship</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          placeholder="e.g. 80k - 120k"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white resize-none text-gray-900 placeholder-gray-400"
                        placeholder="Detailed job description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                      <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white resize-none text-gray-900 placeholder-gray-400"
                        placeholder="List key requirements..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <div className="flex gap-3">
                        {['open', 'closed', 'draft'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(s)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize border transition-all ${
                              status === s 
                                ? 'bg-gray-900 text-white border-gray-900' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto border-t border-gray-100 flex gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Saving...' : (editingJob ? 'Update Job' : 'Create Job')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl pointer-events-auto border border-gray-100 m-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Job Posting?</h3>
                <p className="text-center text-gray-500 mb-6">
                  Are you sure you want to delete this job? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Deleting...' : 'Delete Job'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminJobs;
