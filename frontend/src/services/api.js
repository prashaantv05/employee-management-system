import axios from 'axios';

// Get API base URL from Vite environment variables or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeAPI = {
  // Fetch all employees with optional filters
  getEmployees: async (params = {}) => {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  // Get single employee details
  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Add new employee
  createEmployee: async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  // Update employee details
  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  // Delete employee record
  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Get dashboard metrics
  getDashboardStats: async () => {
    const response = await api.get('/employees/stats');
    return response.data;
  },
};

export default api;
