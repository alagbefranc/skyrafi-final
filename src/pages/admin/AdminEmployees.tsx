import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { Plus, Edit, Trash2, Shield, User } from 'lucide-react';
import { getEnv } from '../../lib/env';

const AdminEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('active');

  const fn = (key: string) => getEnv(key);

  const getHeaders = async (): Promise<HeadersInit> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const anon = fn('VITE_SUPABASE_ANON_KEY');
    if (!token) throw new Error('No session');
    return { Authorization: `Bearer ${token}`, apikey: anon ?? '' } as HeadersInit;
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData.user?.email ?? null);

      const employeesUrl = fn('VITE_SUPABASE_ADMIN_LIST_EMPLOYEES_URL');
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

  const upsertEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const upsertUrl = fn('VITE_SUPABASE_ADMIN_UPSERT_EMPLOYEE_URL');
      if (!upsertUrl) throw new Error('Missing upsert employee URL');

      const headers = await getHeaders();
      const res = await fetch(upsertUrl, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          role, 
          department, 
          status,
          id: editingEmployee?.id 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to save employee');

      // Refresh employees list
      const employeesUrl = fn('VITE_SUPABASE_ADMIN_LIST_EMPLOYEES_URL');
      if (employeesUrl) {
        const empRes = await fetch(employeesUrl, { headers });
        const empData = await empRes.json();
        if (empRes.ok) setEmployees(empData?.employees ?? []);
      }

      // Reset form
      setEmail('');
      setRole('employee');
      setDepartment('');
      setStatus('active');
      setShowAddModal(false);
      setEditingEmployee(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to save employee');
    }
  };

  const deleteEmployee = async (empId: string) => {
    if (!window.confirm('Are you sure you want to remove this employee?')) return;
    
    try {
      // Note: You'll need to create this endpoint
      const deleteUrl = fn('VITE_SUPABASE_ADMIN_DELETE_EMPLOYEE_URL');
      if (!deleteUrl) throw new Error('Missing delete employee URL');

      const headers = await getHeaders();
      const res = await fetch(deleteUrl, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: empId }),
      });

      if (!res.ok) throw new Error('Failed to delete employee');
      
      // Refresh list
      setEmployees(employees.filter(emp => emp.id !== empId));
    } catch (e: any) {
      setError(e?.message || 'Failed to delete employee');
    }
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setEmail(employee.email);
    setRole(employee.role);
    setDepartment(employee.department || '');
    setStatus(employee.status || 'active');
    setShowAddModal(true);
  };

  const employeeColumns = [
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (value: string) => (
      <div className="flex items-center">
        {value === 'admin' || value === 'manager' ? (
          <Shield className="h-4 w-4 text-purple-500 mr-2" />
        ) : (
          <User className="h-4 w-4 text-blue-500 mr-2" />
        )}
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'admin' ? 'bg-purple-100 text-purple-800' :
          value === 'manager' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      </div>
    )},
    { key: 'department', label: 'Department', sortable: true, render: (value: string) => value || 'N/A' },
    { key: 'status', label: 'Status', sortable: true, render: (value: string) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value || 'active'}
      </span>
    )},
    { key: 'created_at', label: 'Added', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'actions', label: 'Actions', render: (_: any, row: any) => (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEdit(row)}
          className="text-blue-600 hover:text-blue-800"
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => deleteEmployee(row.id)}
          className="text-red-600 hover:text-red-800"
          title="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    )}
  ];

  if (loading) return (
    <AdminLayout currentPage="employees" userEmail={userEmail || undefined}>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-blue-600"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout currentPage="employees" userEmail={userEmail || undefined}>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="mt-1 text-sm text-gray-500">Manage employees and their roles</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-blue-600 hover:bg-sky-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {['admin', 'manager', 'employee', 'active'].map(type => {
          const count = type === 'active' 
            ? employees.filter(emp => (emp.status || 'active') === 'active').length
            : employees.filter(emp => emp.role === type).length;
          return (
            <div key={type} className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-500 capitalize">{type}s</div>
            </div>
          );
        })}
      </div>

      <DataTable
        data={employees}
        columns={employeeColumns}
        title={`Team Members (${employees.length})`}
        searchable={true}
        exportable={true}
      />

      {/* Add/Edit Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              <form onSubmit={upsertEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="employee@company.com"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g., Engineering, Marketing"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingEmployee(null);
                      setEmail('');
                      setRole('employee');
                      setDepartment('');
                      setStatus('active');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-sky-blue-600 hover:bg-sky-blue-700"
                  >
                    {editingEmployee ? 'Update' : 'Add'} Employee
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

export default AdminEmployees;
