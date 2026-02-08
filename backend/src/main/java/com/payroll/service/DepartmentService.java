package com.payroll.service;

import com.payroll.entity.Department;
import com.payroll.exception.ResourceNotFoundException;
import com.payroll.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DepartmentService {
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    public List<Department> getAllDepartments() {
        return departmentRepository.findAllOrderByName();
    }
    
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }
    
    public Department createDepartment(Department department) {
        if (departmentRepository.existsByDeptName(department.getDeptName())) {
            throw new IllegalArgumentException("Department name already exists: " + department.getDeptName());
        }
        return departmentRepository.save(department);
    }
    
    public Department updateDepartment(Long id, Department departmentDetails) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        
        // Check if the new name already exists for another department
        if (!department.getDeptName().equals(departmentDetails.getDeptName()) &&
            departmentRepository.existsByDeptName(departmentDetails.getDeptName())) {
            throw new IllegalArgumentException("Department name already exists: " + departmentDetails.getDeptName());
        }
        
        department.setDeptName(departmentDetails.getDeptName());
        department.setDescription(departmentDetails.getDescription());
        
        return departmentRepository.save(department);
    }
    
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findByIdWithEmployees(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        
        if (department.getEmployees() != null && !department.getEmployees().isEmpty()) {
            throw new IllegalArgumentException("Cannot delete department with existing employees");
        }
        
        departmentRepository.delete(department);
    }
    
    public Department getDepartmentByName(String name) {
        return departmentRepository.findByDeptName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with name: " + name));
    }
}