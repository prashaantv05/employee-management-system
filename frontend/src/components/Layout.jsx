import React from 'react';
import { Users, LayoutDashboard, UserPlus, LogOut, Briefcase } from 'lucide-react';

const Layout = ({ children, currentTab, setCurrentTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'list', label: 'Employees', icon: Users },
    { id: 'add', label: 'Add Employee', icon: UserPlus },
  ];

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Sidebar Panel */}
      <aside className="w-64 glass-panel border-r border-white/5 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          {/* Logo Brand */}
          <div className="px-6 py-8 flex items-center gap-3 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Briefcase size={20} />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-md tracking-tight leading-none">EMS Panel</h1>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Management</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="mt-8 px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'list' && currentTab === 'edit');
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
              AD
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-200 truncate">Admin Account</p>
              <p className="text-[10px] text-slate-500 font-medium truncate">admin@ems.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 glass-panel flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Nav Menu Icon (can just click to cycle tabs on mobile) */}
            <div className="md:hidden flex items-center gap-2">
              <span className="font-bold text-indigo-400 text-sm">EMS</span>
            </div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest hidden md:inline-block">
              {currentTab === 'dashboard'
                ? 'System Dashboard'
                : currentTab === 'list'
                ? 'Employee Registry'
                : currentTab === 'add'
                ? 'New Registration'
                : 'Modify Employee'}
            </h2>
          </div>

          {/* Quick Mobile Navigation links */}
          <div className="md:hidden flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'list' && currentTab === 'edit');
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Connected
            </span>
          </div>
        </header>

        {/* Main Content body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
