import React from 'react';

const Loading = ({ type = 'page' }) => {
  if (type === 'skeleton') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-slate-800 rounded-lg w-full"></div>
        <div className="h-10 bg-slate-800 rounded-lg w-full"></div>
        <div className="h-10 bg-slate-800 rounded-lg w-full"></div>
        <div className="h-10 bg-slate-800 rounded-lg w-full"></div>
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="h-32 bg-slate-800 rounded-xl"></div>
        <div className="h-32 bg-slate-800 rounded-xl"></div>
        <div className="h-32 bg-slate-800 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
        {/* Animated Inner Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-slate-400 font-medium text-sm animate-pulse">Loading employee data...</p>
    </div>
  );
};

export default Loading;
