import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';

const Table = ({
  columns = [],
  data = [],
  onView,
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = 'No records found.',
  itemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination calculation
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = data.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Reset page if data length changes significantly
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-white/5">
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-left text-sm text-slate-300">
          <thead>
            <tr className="bg-slate-900/60 border-b border-white/10 text-slate-200 uppercase tracking-wider text-xs font-semibold">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4">
                  {col.header}
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-6 py-4 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-slate-950/20">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-slate-500">
                  <div className="flex justify-center space-x-2 animate-pulse">
                    <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
                  </div>
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500 font-medium">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              currentData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-white/[0.03] transition-colors duration-150">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4.5 font-medium text-slate-300 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <td className="px-6 py-4.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="p-2 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-all active:scale-95"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-2 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-all active:scale-95"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-all active:scale-95"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Panel */}
      {!isLoading && totalItems > 0 && (
        <div className="px-6 py-4 bg-slate-900/30 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-4">
          <div>
            Showing <span className="font-semibold text-slate-200">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-slate-200">{endIndex}</span> of{' '}
            <span className="font-semibold text-slate-200">{totalItems}</span> employees
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white transition-all active:scale-95"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 py-2 text-slate-300 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white transition-all active:scale-95"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
