import React, { useState, useEffect } from 'react';
import { Save, XCircle } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Finance',
  'Sales',
  'Operations',
  'Design'
];

const Form = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Save Employee',
}) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    salary: '',
    joining_date: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      // If editing, map fields and format date to YYYY-MM-DD
      const formattedDate = initialValues.joining_date
        ? new Date(initialValues.joining_date).toISOString().split('T')[0]
        : '';
      setFormData({
        employee_id: initialValues.employee_id || '',
        name: initialValues.name || '',
        email: initialValues.email || '',
        phone: initialValues.phone || '',
        department: initialValues.department || '',
        designation: initialValues.designation || '',
        salary: initialValues.salary || '',
        joining_date: formattedDate,
      });
    }
  }, [initialValues]);

  // Validation rules
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'employee_id':
        if (!value.trim()) {
          error = 'Employee ID is required.';
        } else if (!/^[A-Za-z0-9-_]+$/.test(value)) {
          error = 'ID must only contain letters, numbers, dashes, and underscores.';
        }
        break;
      case 'name':
        if (!value.trim()) {
          error = 'Full Name is required.';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters.';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address.';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required.';
        } else {
          // Check digit length
          const digits = value.replace(/\D/g, '');
          if (digits.length < 7 || digits.length > 15) {
            error = 'Phone must be between 7 and 15 digits.';
          }
        }
        break;
      case 'department':
        if (!value) {
          error = 'Please select a department.';
        }
        break;
      case 'designation':
        if (!value.trim()) {
          error = 'Designation is required.';
        }
        break;
      case 'salary':
        if (value === undefined || value === '') {
          error = 'Salary is required.';
        } else {
          const num = parseFloat(value);
          if (isNaN(num) || num <= 0) {
            error = 'Salary must be a positive number.';
          }
        }
        break;
      case 'joining_date':
        if (!value) {
          error = 'Joining date is required.';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched and validate
    const newErrors = {};
    const newTouched = {};
    
    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Employee ID */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Employee ID <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading || (initialValues && initialValues.id)} // Prevent editing of ID in update
            placeholder="e.g. EMP101"
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium glass-input ${
              errors.employee_id && touched.employee_id
                ? 'border-rose-500/50 focus:border-rose-500 bg-rose-500/5 focus:ring-rose-500/10'
                : 'border-white/10 focus:border-indigo-500'
            }`}
          />
          {errors.employee_id && touched.employee_id && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
              {errors.employee_id}
            </p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="e.g. Arjun Sharma"
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium glass-input ${
              errors.name && touched.name
                ? 'border-rose-500/50 focus:border-rose-500 bg-rose-500/5 focus:ring-rose-500/10'
                : 'border-white/10 focus:border-indigo-500'
            }`}
          />
          {errors.name && touched.name && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="e.g. arjun.sharma@example.com"
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium glass-input ${
              errors.email && touched.email
                ? 'border-rose-500/50 focus:border-rose-500 bg-rose-500/5 focus:ring-rose-500/10'
                : 'border-white/10 focus:border-indigo-500'
            }`}
          />
          {errors.email && touched.email && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="e.g. 9876543210"
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium glass-input ${
              errors.phone && touched.phone
                ? 'border-rose-500/50 focus:border-rose-500 bg-rose-500/5 focus:ring-rose-500/10'
                : 'border-white/10 focus:border-indigo-500'
            }`}
          />
          {errors.phone && touched.phone && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
              {errors.phone}
            </p>
          )}
        </div>

        {/* Department Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Department <span className="text-rose-500">*</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium glass-input ${
              errors.department && touched.department
                ? 'border-rose-500/50 focus:border-rose-500 bg-rose-500/5'
                : 'border-white/10 focus:border-indigo-500'
            }`}
          >
            <option value="" disabled className="bg-slate-900 text-slate-400">
              Select Department
            </option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept} className="bg-slate-900 text-slate-200">
                {dept}
              </option>
            ))}
          </select>
          {errors.department && touched.department && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
              {errors.department}
            </p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Designation <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="e.g. Senior Software Engineer"
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium glass-input ${
              errors.designation && touched.designation
                ? 'border-rose-500/50 focus:border-rose-500 bg-rose-500/5 focus:ring-rose-500/10'
                : 'border-white/10 focus:border-indigo-500'
            }`}
          />
          {errors.designation && touched.designation && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
              {errors.designation}
            </p>
          )}
        </div>

        {/* Salary */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Annual Salary (USD) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="e.g. 95000"
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium glass-input ${
              errors.salary && touched.salary
                ? 'border-rose-500/50 focus:border-rose-500 bg-rose-500/5 focus:ring-rose-500/10'
                : 'border-white/10 focus:border-indigo-500'
            }`}
          />
          {errors.salary && touched.salary && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
              {errors.salary}
            </p>
          )}
        </div>

        {/* Joining Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Joining Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="joining_date"
            value={formData.joining_date}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium glass-input ${
              errors.joining_date && touched.joining_date
                ? 'border-rose-500/50 focus:border-rose-500 bg-rose-500/5 focus:ring-rose-500/10'
                : 'border-white/10 focus:border-indigo-500'
            }`}
          />
          {errors.joining_date && touched.joining_date && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-rose-500"></span>
              {errors.joining_date}
            </p>
          )}
        </div>

      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 active:bg-white/10 font-semibold text-sm transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Save size={16} />
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default Form;
