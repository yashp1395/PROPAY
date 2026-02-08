package com.payroll.repository;

import com.payroll.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
    Optional<Department> findByDeptName(String deptName);
    
    Boolean existsByDeptName(String deptName);
    
    @Query("SELECT d FROM Department d LEFT JOIN FETCH d.employees WHERE d.deptId = :id")
    Optional<Department> findByIdWithEmployees(Long id);
    
    @Query("SELECT d FROM Department d ORDER BY d.deptName")
    List<Department> findAllOrderByName();
}