import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('Access denied. You do not have permission to perform this action.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/login',
  logout: '/auth/logout',
  
  // Admin endpoints
  employees: '/admin/employees',
  departments: '/admin/departments',
  employeesPaged: '/admin/employees/paged',
  employeesSearch: '/admin/employees/search',
  employeesByDepartment: (deptId) => `/admin/employees/department/${deptId}`,
  employeesByRole: (role) => `/admin/employees/role/${role}`,
  
  // Employee endpoints
  profile: '/employee/profile',
  profileById: (id) => `/employee/profile/${id}`,
  
  // Salary endpoints
  salaries: '/salary',
  salaryByEmployee: (empId) => `/salary/${empId}`,
  salaryPaged: (empId) => `/salary/${empId}/paged`,
  salaryByMonth: (empId, month, year) => `/salary/${empId}/${month}/${year}`,
  salariesByPeriod: (month, year) => `/salary/month/${month}/year/${year}`,
  salariesByYear: (year) => `/salary/year/${year}`,
  unprocessedSalaries: '/salary/unprocessed',
  payslip: (empId, month, year) => `/salary/${empId}/payslip/${month}/${year}`,
  payslipById: (salaryId) => `/salary/payslip/${salaryId}`,
  mySalary: '/salary/my-salary',
  mySalaryByMonth: (month, year) => `/salary/my-salary/${month}/${year}`,
  myPayslip: (month, year) => `/salary/my-payslip/${month}/${year}`,
  
  // AI endpoints - matching backend controller
  aiChat: '/ai/ask-question',
  salaryInsights: (empId) => `/ai/salary-insights/${empId}`,
  mySalaryInsights: '/ai/my-salary-insights',
  taxAdvice: (empId) => `/ai/tax-advice/${empId}`,
  myTaxAdvice: '/ai/my-tax-advice',
  payrollReport: (month, year) => `/ai/payroll-report/${month}/${year}`,
  compensationBenchmark: '/ai/compensation-benchmark',
  askQuestion: '/ai/ask-question',
  
  // Statistics
  employeeCount: '/admin/statistics/employees/count',
  employeeCountByDept: (deptId) => `/admin/statistics/employees/count/department/${deptId}`
};

// Currency formatter for Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Number formatter for Indian numbering system
export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-IN').format(number);
};

export default api;