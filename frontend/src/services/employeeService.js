import api, { endpoints } from './api';

export const employeeService = {
  // Admin endpoints - using correct endpoints
  getAllEmployees: () => api.get(endpoints.employees),
  getEmployeeById: (id) => api.get(`${endpoints.employees}/${id}`),
  createEmployee: (data) => api.post(endpoints.employees, data),
  updateEmployee: (id, data) => api.put(`${endpoints.employees}/${id}`, data),
  deleteEmployee: (id) => api.delete(`${endpoints.employees}/${id}`),
  searchEmployees: (keyword, params) => api.get(`${endpoints.employeesSearch}?keyword=${keyword}`, { params }),
  getEmployeesByDepartment: (deptId) => api.get(endpoints.employeesByDepartment(deptId)),
  getEmployeesByRole: (role) => api.get(endpoints.employeesByRole(role)),
  
  // New search methods
  searchByName: (name) => api.get(`/admin/employees/search/name?name=${encodeURIComponent(name)}`),
  searchById: (id) => api.get(`/admin/employees/search/id/${id}`),
  searchByEmployeeCode: (code) => api.get(`/admin/employees/search/code?code=${encodeURIComponent(code)}`),
  searchByDepartmentName: (deptName) => api.get(`/admin/employees/search/department?deptName=${encodeURIComponent(deptName)}`),
  advancedSearch: (params) => {
    const queryParams = new URLSearchParams();
    if (params.name) queryParams.append('name', params.name);
    if (params.employeeId) queryParams.append('employeeId', params.employeeId);
    if (params.employeeCode) queryParams.append('employeeCode', params.employeeCode);
    if (params.deptId) queryParams.append('deptId', params.deptId);
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);
    return api.get(`/admin/employees/search/advanced?${queryParams.toString()}`);
  },
  
  // Employee endpoints - correct paths
  getProfile: () => api.get(endpoints.profile),
  getProfileById: (id) => api.get(endpoints.profileById(id)),
  updateProfile: (data) => api.put(endpoints.profile, data),
  
  // Department endpoints - correct paths
  getAllDepartments: () => api.get(endpoints.departments),
  getDepartmentById: (id) => api.get(`${endpoints.departments}/${id}`),
  createDepartment: (data) => api.post(endpoints.departments, data),
  updateDepartment: (id, data) => api.put(`${endpoints.departments}/${id}`, data),
  deleteDepartment: (id) => api.delete(`${endpoints.departments}/${id}`),
  
  // Statistics
  getEmployeeCount: () => api.get(endpoints.employeeCount),
  getEmployeeCountByDept: (deptId) => api.get(endpoints.employeeCountByDept(deptId)),
};

export const salaryService = {
  // Using correct salary endpoints
  createSalary: (empId, data) => api.post(endpoints.salaryByEmployee(empId), data),
  getSalaryByEmployee: (empId) => api.get(endpoints.salaryByEmployee(empId)),
  getSalaryByMonth: (empId, month, year) => api.get(endpoints.salaryByMonth(empId, month, year)),
  getSalariesByPeriod: (month, year) => api.get(endpoints.salariesByPeriod(month, year)),
  getSalariesByYear: (year) => api.get(endpoints.salariesByYear(year)),
  getUnprocessedSalaries: () => api.get(endpoints.unprocessedSalaries),
  
  // Payslips
  generatePayslip: (empId, month, year) => {
    return api.get(endpoints.payslip(empId, month, year), {
      responseType: 'blob'
    });
  },
  getPayslipById: (salaryId) => {
    return api.get(endpoints.payslipById(salaryId), {
      responseType: 'blob'
    });
  },
  
  // My salary (for employees)
  getMySalary: () => api.get(endpoints.mySalary),
  getMySalaryByMonth: (month, year) => api.get(endpoints.mySalaryByMonth(month, year)),
  getMyPayslip: (month, year) => {
    return api.get(endpoints.myPayslip(month, year), {
      responseType: 'blob'
    });
  },
};

export const aiService = {
  // Using correct AI endpoints that match the backend controller
  getSalaryInsights: (employeeId) => api.get(`/ai/salary-insights/${employeeId}`),
  getMySalaryInsights: () => api.get('/ai/my-salary-insights'),
  getTaxAdvice: (employeeId) => api.get(`/ai/tax-advice/${employeeId}`),
  getMyTaxAdvice: () => api.get('/ai/my-tax-advice'),
  getPayrollReport: (month, year) => api.get(`/ai/payroll-report/${month}/${year}`),
  getCompensationBenchmark: (data) => api.post('/ai/compensation-benchmark', data),
  askQuestion: (question) => api.post(`/ai/ask-question?question=${encodeURIComponent(question)}`),
  chatWithAI: (message) => api.post(`/ai/ask-question?question=${encodeURIComponent(message)}`),
};

export const authService = {
  login: (credentials) => api.post(endpoints.login, credentials),
  logout: () => api.post(endpoints.logout),
};

export const departmentService = {
  // Department-specific service methods
  getAllDepartments: () => api.get(endpoints.departments),
  getDepartmentById: (id) => api.get(`${endpoints.departments}/${id}`),
  createDepartment: (data) => api.post(endpoints.departments, data),
  updateDepartment: (id, data) => api.put(`${endpoints.departments}/${id}`, data),
  deleteDepartment: (id) => api.delete(`${endpoints.departments}/${id}`),
};