import pool from '../config/db.js';

class Employee {
  // Get all employees with optional search and department filter
  static async getAll({ search = '', department = '' }) {
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR employee_id LIKE ?)';
      const searchWildcard = `%${search}%`;
      params.push(searchWildcard, searchWildcard, searchWildcard);
    }

    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  }

  // Get employee by ID
  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
    return rows[0] || null;
  }

  // Get employee by Employee ID (for uniqueness check)
  static async getByEmployeeId(employeeId) {
    const [rows] = await pool.query('SELECT * FROM employees WHERE employee_id = ?', [employeeId]);
    return rows[0] || null;
  }

  // Get employee by Email (for uniqueness check)
  static async getByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM employees WHERE email = ?', [email]);
    return rows[0] || null;
  }

  // Create new employee
  static async create(employeeData) {
    const {
      employee_id,
      name,
      email,
      phone,
      department,
      designation,
      salary,
      joining_date,
    } = employeeData;

    const query = `
      INSERT INTO employees (employee_id, name, email, phone, department, designation, salary, joining_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [employee_id, name, email, phone, department, designation, salary, joining_date];
    const [result] = await pool.query(query, params);
    
    return { id: result.insertId, ...employeeData };
  }

  // Update employee
  static async update(id, employeeData) {
    const {
      employee_id,
      name,
      email,
      phone,
      department,
      designation,
      salary,
      joining_date,
    } = employeeData;

    const query = `
      UPDATE employees 
      SET employee_id = ?, name = ?, email = ?, phone = ?, department = ?, designation = ?, salary = ?, joining_date = ?
      WHERE id = ?
    `;
    const params = [employee_id, name, email, phone, department, designation, salary, joining_date, id];
    const [result] = await pool.query(query, params);
    
    return result.affectedRows > 0;
  }

  // Delete employee
  static async delete(id) {
    const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Get dashboard statistics
  static async getStats() {
    // Total employees
    const [totalRes] = await pool.query('SELECT COUNT(*) AS total_employees FROM employees');
    const totalEmployees = totalRes[0].total_employees;

    // Unique departments count
    const [deptRes] = await pool.query('SELECT COUNT(DISTINCT department) AS dept_count FROM employees');
    const departmentCount = deptRes[0].dept_count;

    // Recent employees (latest 5)
    const [recentEmployees] = await pool.query(
      'SELECT * FROM employees ORDER BY created_at DESC LIMIT 5'
    );

    // Department Breakdown (Extra premium analytics)
    const [deptBreakdown] = await pool.query(
      'SELECT department, COUNT(*) as count FROM employees GROUP BY department'
    );

    return {
      totalEmployees,
      departmentCount,
      recentEmployees,
      deptBreakdown,
    };
  }
}

export default Employee;
