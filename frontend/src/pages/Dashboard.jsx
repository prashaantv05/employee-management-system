import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Users, Briefcase, Plus, Calendar, ArrowRight, DollarSign } from 'lucide-react';

const Dashboard = ({ setCurrentTab, setSelectedEmployee }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await employeeAPI.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch dashboard stats.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to connect to the backend server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={fetchStats} />;

  const { totalEmployees = 0, departmentCount = 0, recentEmployees = [], deptBreakdown = [] } = stats || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome banner */}
      <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/5">
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Admin</span>!
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl leading-relaxed">
            Here's an overview of your organization's workforce, departments, and recent registrations.
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('add')}
          className="relative z-10 flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Register Employee
        </button>
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Employees */}
        <div className="glass-card p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Total Employees</span>
            <span className="text-3xl font-black text-slate-100 tracking-tight">{totalEmployees}</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 text-indigo-500">
            <Users size={96} />
          </div>
        </div>

        {/* Departments count */}
        <div className="glass-card p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Briefcase size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Departments</span>
            <span className="text-3xl font-black text-slate-100 tracking-tight">{departmentCount}</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 text-purple-500">
            <Briefcase size={96} />
          </div>
        </div>

        {/* Average Salary Estimation */}
        <div className="glass-card p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Active Branches</span>
            <span className="text-3xl font-black text-slate-100 tracking-tight">HQ - Global</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 text-emerald-500">
            <DollarSign size={96} />
          </div>
        </div>

      </div>

      {/* Main Stats breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Registered Employees */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-200 text-lg">Recent Employees</h3>
                <p className="text-xs text-slate-400 mt-1">Recently registered profiles across departments</p>
              </div>
              <button
                onClick={() => setCurrentTab('list')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs flex items-center gap-1.5 transition-colors group"
              >
                View Registry
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 uppercase font-semibold pb-3">
                    <th className="py-2.5">ID</th>
                    <th className="py-2.5">Name</th>
                    <th className="py-2.5">Department</th>
                    <th className="py-2.5">Designation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                  {recentEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">
                        No employees registered yet.
                      </td>
                    </tr>
                  ) : (
                    recentEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setCurrentTab('list');
                        }}
                        className="hover:bg-white/[0.02] cursor-pointer transition-colors duration-150"
                      >
                        <td className="py-3 pr-2 text-indigo-400 font-semibold">{emp.employee_id}</td>
                        <td className="py-3 font-semibold text-slate-200">{emp.name}</td>
                        <td className="py-3 text-slate-400">{emp.department}</td>
                        <td className="py-3 text-slate-400 truncate max-w-[150px]">{emp.designation}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Department Breakdown statistics */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-slate-200 text-lg mb-1">Departments Mix</h3>
          <p className="text-xs text-slate-400 mb-6 font-medium">Headcount density analysis</p>

          <div className="space-y-4">
            {deptBreakdown.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No department data to display.</p>
            ) : (
              deptBreakdown.map((dept, index) => {
                const percentage = totalEmployees > 0 ? (dept.count / totalEmployees) * 100 : 0;
                
                // Curated gradients for progress bars
                const barColors = [
                  'bg-gradient-to-r from-indigo-500 to-indigo-400',
                  'bg-gradient-to-r from-purple-500 to-purple-400',
                  'bg-gradient-to-r from-pink-500 to-pink-400',
                  'bg-gradient-to-r from-emerald-500 to-emerald-400',
                  'bg-gradient-to-r from-cyan-500 to-cyan-400',
                  'bg-gradient-to-r from-amber-500 to-amber-400',
                ];
                const barColor = barColors[index % barColors.length];

                return (
                  <div key={dept.department} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                        {dept.department}
                      </span>
                      <span>
                        {dept.count} {dept.count === 1 ? 'employee' : 'employees'} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
