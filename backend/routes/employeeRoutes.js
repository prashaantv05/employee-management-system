import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getStats,
} from '../controllers/employeeController.js';

const router = express.Router();

// Stats route (place before resource routes to prevent conflict with :id parameter)
router.get('/stats', getStats);

// Resource routes
router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;
