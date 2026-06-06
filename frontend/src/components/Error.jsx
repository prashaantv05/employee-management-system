import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

const Error = ({ message = 'An unexpected error occurred.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-6 glass-card rounded-2xl max-w-lg mx-auto text-center my-8">
      <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 animate-bounce">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">Operation Failed</h3>
      <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 duration-200"
        >
          <RotateCcw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;
