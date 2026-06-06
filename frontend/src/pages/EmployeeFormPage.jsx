import React, { useState } from 'react';
import Form from '../components/Form';
import { employeeAPI } from '../services/api';
import { ChevronLeft, AlertTriangle } from 'lucide-react';

const EmployeeFormPage = ({
  employeeToEdit = null,
  onSuccess,
  onCancel,
  mode = 'add', // 'add' or 'edit'
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      let response;
      if (mode === 'edit' && employeeToEdit) {
        response = await employeeAPI.updateEmployee(employeeToEdit.id, formData);
      } else {
        response = await employeeAPI.createEmployee(formData);
      }

      if (response.success) {
        onSuccess();
      } else {
        throw new Error(response.message || 'Operation failed.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'An error occurred while saving employee.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95"
        >
          <ChevronLeft size={16} />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-100 tracking-tight">
            {mode === 'edit' ? 'Modify Employee Profile' : 'New Registration'}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {mode === 'edit'
              ? 'Update the details below to change the employee registry record.'
              : 'Add a new member to the registry. All fields marked with * are required.'}
          </p>
        </div>
      </div>

      {/* Alert message box */}
      {errorMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 flex items-start gap-3 text-sm font-semibold animate-shake">
          <AlertTriangle size={18} className="shrink-0 mt-0.5 text-rose-400" />
          <div>
            <span className="block font-bold">Registration Failure</span>
            <span className="text-xs text-rose-400/90 font-medium">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl">
        <Form
          initialValues={mode === 'edit' ? employeeToEdit : {}}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isLoading={loading}
          submitLabel={mode === 'edit' ? 'Update Details' : 'Register Profile'}
        />
      </div>
    </div>
  );
};

export default EmployeeFormPage;
