import Employee from '../models/employeeModel.js';

// Helper for basic regex validation
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  // Allow numbers, spaces, dashes, parentheses, plus sign. Min length 7, max length 20
  const re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 7;
};

export const getEmployees = async (req, res, next) => {
  try {
    const { search, department } = req.query;
    const employees = await Employee.getAll({ search, department });
    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.getById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found.`,
      });
    }
    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const {
      employee_id,
      name,
      email,
      phone,
      department,
      designation,
      salary,
      joining_date,
    } = req.body;

    // Field presence checks
    if (!employee_id || !name || !email || !phone || !department || !designation || salary === undefined || !joining_date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    // Email validation
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Phone validation
    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number (at least 7 digits).',
      });
    }

    // Salary numeric validation
    const parsedSalary = parseFloat(salary);
    if (isNaN(parsedSalary) || parsedSalary < 0) {
      return res.status(400).json({
        success: false,
        message: 'Salary must be a positive number.',
      });
    }

    // Check unique employee_id
    const existingEmpId = await Employee.getByEmployeeId(employee_id);
    if (existingEmpId) {
      return res.status(409).json({
        success: false,
        message: `Employee ID "${employee_id}" is already assigned to another employee.`,
      });
    }

    // Check unique email
    const existingEmail = await Employee.getByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: `Email "${email}" is already registered.`,
      });
    }

    const newEmployee = await Employee.create({
      employee_id,
      name,
      email,
      phone,
      department,
      designation,
      salary: parsedSalary,
      joining_date,
    });

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully.',
      data: newEmployee,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      employee_id,
      name,
      email,
      phone,
      department,
      designation,
      salary,
      joining_date,
    } = req.body;

    // Check if employee exists
    const employee = await Employee.getById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found.`,
      });
    }

    // Field presence checks
    if (!employee_id || !name || !email || !phone || !department || !designation || salary === undefined || !joining_date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    // Email validation
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Phone validation
    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number.',
      });
    }

    // Salary numeric validation
    const parsedSalary = parseFloat(salary);
    if (isNaN(parsedSalary) || parsedSalary < 0) {
      return res.status(400).json({
        success: false,
        message: 'Salary must be a positive number.',
      });
    }

    // Check unique employee_id (excluding current employee)
    const existingEmpId = await Employee.getByEmployeeId(employee_id);
    if (existingEmpId && existingEmpId.id !== parseInt(id, 10)) {
      return res.status(409).json({
        success: false,
        message: `Employee ID "${employee_id}" is already assigned to another employee.`,
      });
    }

    // Check unique email (excluding current employee)
    const existingEmail = await Employee.getByEmail(email);
    if (existingEmail && existingEmail.id !== parseInt(id, 10)) {
      return res.status(409).json({
        success: false,
        message: `Email "${email}" is already registered.`,
      });
    }

    const updated = await Employee.update(id, {
      employee_id,
      name,
      email,
      phone,
      department,
      designation,
      salary: parsedSalary,
      joining_date,
    });

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update employee details.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully.',
      data: { id, employee_id, name, email, phone, department, designation, salary: parsedSalary, joining_date },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.getById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found.`,
      });
    }

    const deleted = await Employee.delete(id);
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete employee.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await Employee.getStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
