import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Shield, User, Search, Filter, MoreVertical, Mail, Briefcase, CheckCircle, X, AlertCircle, Lock } from 'lucide-react';
import * as CONSTANTS from '../../lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

const AdminEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // View & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('active');

  const getHeaders = async (): Promise<HeadersInit> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error('No session');
    return { Authorization: `Bearer ${token}`, apikey: CONSTANTS.SUPABASE_ANON_KEY } as HeadersInit;
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData.user?.email ?? null);

      const employeesUrl = CONSTANTS.SUPABASE_ADMIN_LIST_EMPLOYEES_URL;
      if (!employeesUrl) throw new Error('Missing employees URL');
      
      const headers = await getHeaders();
      const res = await fetch(employeesUrl, { headers });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data?.error || 'Failed to load employees');
      setEmployees(data?.employees ?? []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setRole('employee');
    setDepartment('');
    setStatus('active');
    setEditingEmployee(null);
    setShowDrawer(false);
  };

  const openDrawer = (employee?: any) => {
    if (employee) {
      setEditingEmployee(employee);
      setEmail(employee.email);
      setPassword(''); // Don't show/edit password for existing users
      setRole(employee.role);
      setDepartment(employee.department || '');
      setStatus(employee.status || 'active');
    } else {
      resetForm();
      // set defaults for new employee
      setRole('employee');
      setStatus('active');
    }
    setShowDrawer(true);
  };

  const upsertEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const upsertUrl = CONSTANTS.SUPABASE_ADMIN_UPSERT_EMPLOYEE_URL;
      if (!upsertUrl) throw new Error('Missing upsert employee URL');

      const headers = await getHeaders();
      const res = await fetch(upsertUrl, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password: password || undefined, // Only send if provided
          role, 
          department, 
          status,
          id: editingEmployee?.id 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to save employee');

      setSuccess(editingEmployee ? 'Employee updated successfully!' : 'Employee added successfully!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchEmployees();
      resetForm();
    } catch (e: any) {
      setError(e?.message || 'Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  };

  const initiateDelete = (empId: string) => {
    setEmployeeToDelete(empId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    setSubmitting(true);
    try {
      const deleteUrl = CONSTANTS.SUPABASE_ADMIN_DELETE_EMPLOYEE_URL;
      if (!deleteUrl) throw new Error('Missing delete employee URL');

      const headers = await getHeaders();
      const res = await fetch(deleteUrl, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: employeeToDelete }),
      });

      if (!res.ok) throw new Error('Failed to delete employee');
      
      setSuccess('Employee removed successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete));
    } catch (e: any) {
      setError(e?.message || 'Failed to delete employee');
    } finally {
      setSubmitting(false);
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      (emp.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (emp.department?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || emp.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const getRoleColor = (r: string) => {
    switch(r) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'manager': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout currentPage="employees" userEmail={userEmail || undefined}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage employees, roles, and access</p>
          </div>
          <button
            onClick={() => openDrawer()}
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
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
              placeholder="Search by email or department..."
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
                className={`p-2 rounded-lg border transition-colors flex items-center gap-2 text-sm ${filterRole !== 'all' ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-500 hover:bg-gray-50 border-gray-200'}`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">{filterRole === 'all' ? 'Role' : filterRole}</span>
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1">
                  {['all', 'admin', 'manager', 'employee'].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setFilterRole(r);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 capitalize ${filterRole === r ? 'font-bold text-gray-900 bg-gray-50' : 'text-gray-600'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['total', 'admin', 'manager', 'active'].map(type => {
            const count = type === 'total' ? employees.length :
                          type === 'active' ? employees.filter(e => e.status === 'active').length :
                          employees.filter(e => e.role === type).length;
            return (
              <div key={type} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">{type}s</div>
              </div>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
            <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No employees found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredEmployees.map((emp) => (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group ${viewMode === 'list' ? 'flex flex-col sm:flex-row items-center p-4 gap-6' : ''}`}
              >
                <div className={viewMode === 'list' ? "flex-1 w-full" : "p-6"}>
                  <div className={viewMode === 'list' ? "flex items-center gap-4" : "flex justify-between items-start mb-4"}>
                    <div className={`p-3 rounded-xl ${emp.role === 'admin' ? 'bg-purple-50' : 'bg-blue-50'} ${viewMode === 'list' ? 'flex-shrink-0' : ''}`}>
                      {emp.role === 'admin' ? <Shield className="w-6 h-6 text-purple-600" /> : <User className="w-6 h-6 text-blue-600" />}
                    </div>
                    
                    <div className={viewMode === 'list' ? "flex-1 min-w-0" : "flex-1 ml-4"}>
                       {viewMode === 'grid' && (
                         <div className="flex justify-end items-center gap-2 mb-4 -mt-3 -mr-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {emp.status || 'active'}
                            </span>
                            <div className="relative group/menu">
                              <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover/menu:block z-10">
                                <button onClick={() => openDrawer(emp)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-xl">Edit</button>
                                <button onClick={() => initiateDelete(emp.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-xl">Remove</button>
                              </div>
                            </div>
                         </div>
                       )}
                       
                       <h3 className="text-lg font-bold text-gray-900 truncate">{emp.email}</h3>
                       <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-md capitalize ${getRoleColor(emp.role)}`}>{emp.role}</span>
                          {emp.department && <span className="text-xs text-gray-500 flex items-center"><span className="w-1 h-1 rounded-full bg-gray-300 mx-1.5"></span>{emp.department}</span>}
                       </div>
                    </div>
                  </div>

                  {viewMode === 'grid' && (
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-2 text-xs text-gray-400 mt-4">
                      <span>Added {new Date(emp.created_at).toLocaleDateString()}</span>
                      <button onClick={() => openDrawer(emp)} className="text-blue-600 font-medium hover:underline">Edit Profile</button>
                    </div>
                  )}
                </div>

                {viewMode === 'list' && (
                  <div className="flex items-center gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 mt-4 sm:mt-0 justify-between sm:justify-end px-4 sm:px-0">
                     <div className="flex flex-col items-end gap-1 mr-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {emp.status || 'active'}
                        </span>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => openDrawer(emp)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => initiateDelete(emp.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors" title="Remove">
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
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-100"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{editingEmployee ? 'Edit Employee' : 'New Employee'}</h2>
                    <p className="text-sm text-gray-500">{editingEmployee ? 'Update employee access' : 'Add new team member'}</p>
                  </div>
                  <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={upsertEmployee} className="space-y-6 flex-1">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="employee@company.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    {!editingEmployee && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Set initial password"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">User can change this after logging in.</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="e.g. Engineering"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white appearance-none text-gray-900"
                        >
                          <option value="employee">Employee</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50 focus:bg-white appearance-none text-gray-900"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
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
                      {submitting ? 'Saving...' : (editingEmployee ? 'Update Member' : 'Add Member')}
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
                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Remove Team Member?</h3>
                <p className="text-center text-gray-500 mb-6">
                  Are you sure you want to remove this employee? This might affect their ability to access the system.
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
                    {submitting ? 'Removing...' : 'Remove Member'}
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

export default AdminEmployees;
