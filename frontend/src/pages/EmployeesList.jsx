import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import Table from '../components/Table';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Search, SlidersHorizontal, UserCheck, Phone, Mail, Calendar, DollarSign, Briefcase, Eye, Trash2, X, Plus } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Finance',
  'Sales',
  'Operations',
  'Design'
];

const EmployeesList = ({
  setCurrentTab,
  setSelectedEmployee,
  selectedEmployeeForModal = null,
  clearSelectedEmployee = null,
}) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and Filter State
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modals state
  const [viewEmployee, setViewEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (department) params.department = department;

      const res = await employeeAPI.getEmployees(params);
      if (res.success) {
        setEmployees(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch employees.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not fetch employees. Check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [debouncedSearch, department]);

  // Trigger viewing detailed employee if passed down from dashboard
  useEffect(() => {
    if (selectedEmployeeForModal) {
      setViewEmployee(selectedEmployeeForModal);
      if (clearSelectedEmployee) clearSelectedEmployee();
    }
  }, [selectedEmployeeForModal]);

  // Handle delete action
  const handleDeleteConfirm = async () => {
    if (!deleteEmployee) return;
    try {
      setDeleteLoading(true);
      const res = await employeeAPI.deleteEmployee(deleteEmployee.id);
      if (res.success) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== deleteEmployee.id));
        setDeleteEmployee(null);
      } else {
        alert(res.message || 'Failed to delete employee.');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error occurred while deleting employee.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Reusable columns for the Table component
  const columns = [
    {
      header: 'Employee',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500/20 to-indigo-500/30 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-100">{row.name}</div>
            <div className="text-xs text-slate-400">{row.employee_id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      key: 'email',
      render: (row) => (
        <div className="space-y-0.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
            <Mail size={12} />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone size={12} />
            <span>{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      key: 'department',
      render: (row) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/15">
          {row.department}
        </span>
      ),
    },
    {
      header: 'Designation',
      key: 'designation',
      render: (row) => (
        <div className="text-xs font-semibold text-slate-300 truncate max-w-[150px]" title={row.designation}>
          {row.designation}
        </div>
      ),
    },
    {
      header: 'Salary',
      key: 'salary',
      render: (row) => (
        <span className="font-bold text-emerald-400 font-mono text-xs">
          ${parseFloat(row.salary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Employee Directory</h2>
          <p className="text-slate-400 text-xs mt-1">Manage, filter, and search your organization's talent profiles</p>
        </div>
        <button
          onClick={() => setCurrentTab('add')}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus size={16} />
          New Registration
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 border border-white/5 shadow-md">
        
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-lg text-sm font-semibold glass-input"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative w-full md:w-56">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-lg text-sm font-semibold glass-input appearance-none cursor-pointer"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-slate-900 text-slate-200">
                  {dept}
                </option>
              ))}
            </select>
            <SlidersHorizontal size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          {(search || department) && (
            <button
              onClick={() => {
                setSearch('');
                setDepartment('');
              }}
              className="px-4 py-2.5 rounded-lg bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors shrink-0 active:scale-95"
            >
              Clear Filters
            </button>
          )}
        </div>

      </div>

      {/* Main Table component */}
      {error ? (
        <Error message={error} onRetry={fetchEmployees} />
      ) : (
        <Table
          columns={columns}
          data={employees}
          isLoading={loading}
          emptyMessage={
            search || department
              ? 'No employees match your search criteria.'
              : 'No employees registered. Click "New Registration" to add one!'
          }
          onView={(row) => setViewEmployee(row)}
          onEdit={(row) => {
            setSelectedEmployee(row);
            setCurrentTab('edit');
          }}
          onDelete={(row) => setDeleteEmployee(row)}
          itemsPerPage={6}
        />
      )}

      {/* View Detail Modal */}
      {viewEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card max-w-xl w-full rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-slate-900/60 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm">
                  {viewEmployee.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-base leading-none">{viewEmployee.name}</h3>
                  <span className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider">{viewEmployee.employee_id}</span>
                </div>
              </div>
              <button
                onClick={() => setViewEmployee(null)}
                className="p-1.5 text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Email Address */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-indigo-400 mt-0.5">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Email Address</span>
                    <span className="text-sm font-semibold text-slate-200">{viewEmployee.email}</span>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-indigo-400 mt-0.5">
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Phone Number</span>
                    <span className="text-sm font-semibold text-slate-200">{viewEmployee.phone}</span>
                  </div>
                </div>

                {/* Department */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-indigo-400 mt-0.5">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Department</span>
                    <span className="text-sm font-semibold text-slate-200">{viewEmployee.department}</span>
                  </div>
                </div>

                {/* Designation */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-indigo-400 mt-0.5">
                    <UserCheck size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Designation</span>
                    <span className="text-sm font-semibold text-slate-200">{viewEmployee.designation}</span>
                  </div>
                </div>

                {/* Salary */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-indigo-400 mt-0.5">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Annual Salary</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      ${parseFloat(viewEmployee.salary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Joining Date */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-indigo-400 mt-0.5">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Joining Date</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {new Date(viewEmployee.joining_date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-900/40 border-t border-white/5 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedEmployee(viewEmployee);
                  setViewEmployee(null);
                  setCurrentTab('edit');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all active:scale-95"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setViewEmployee(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 rounded-lg text-xs font-semibold transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card max-w-md w-full rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-6 relative">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Delete Employee Profile?</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-200">{deleteEmployee.name}</span>'s profile (ID: <span className="font-semibold text-slate-200">{deleteEmployee.employee_id}</span>)? This action is permanent and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteEmployee(null)}
                disabled={deleteLoading}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeesList;
