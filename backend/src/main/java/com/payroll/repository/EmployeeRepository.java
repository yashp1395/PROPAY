package com.payroll.repository;

import com.payroll.entity.Employee;
import com.payroll.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmail(String email);
    
    Optional<Employee> findByEmployeeCode(String employeeCode);
    
    List<Employee> findByRole(Role role);
    
    List<Employee> findByDepartmentDeptId(Long departmentId);
    
    List<Employee> findByIsActive(Boolean isActive);
    
    Page<Employee> findByIsActive(Boolean isActive, Pageable pageable);
    
    @Query("SELECT e FROM Employee e WHERE e.isActive = true AND " +
           "(LOWER(e.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Employee> searchActiveEmployees(@Param("keyword") String keyword, Pageable pageable);
    
    // Search by employee name (first or last name)
    @Query("SELECT e FROM Employee e WHERE e.isActive = true AND " +
           "(LOWER(CONCAT(e.firstName, ' ', e.lastName)) LIKE LOWER(CONCAT('%', :name, '%')))")
    List<Employee> searchByName(@Param("name") String name);
    
    // Search by employee ID
    @Query("SELECT e FROM Employee e WHERE e.employeeId = :id")
    Optional<Employee> searchById(@Param("id") Long id);
    
    // Search by employee code
    @Query("SELECT e FROM Employee e WHERE LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :code, '%'))")
    List<Employee> searchByEmployeeCode(@Param("code") String code);
    
    // Search by department
    @Query("SELECT e FROM Employee e JOIN e.department d WHERE e.isActive = true AND " +
           "LOWER(d.deptName) LIKE LOWER(CONCAT('%', :deptName, '%'))")
    List<Employee> searchByDepartmentName(@Param("deptName") String deptName);
    
    // Advanced search with multiple criteria
    @Query("SELECT e FROM Employee e LEFT JOIN e.department d WHERE e.isActive = true AND " +
           "(:name IS NULL OR LOWER(CONCAT(e.firstName, ' ', e.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:employeeId IS NULL OR e.employeeId = :employeeId) AND " +
           "(:employeeCode IS NULL OR LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :employeeCode, '%'))) AND " +
           "(:deptId IS NULL OR d.deptId = :deptId)")
    Page<Employee> advancedSearch(
        @Param("name") String name,
        @Param("employeeId") Long employeeId,
        @Param("employeeCode") String employeeCode,
        @Param("deptId") Long deptId,
        Pageable pageable
    );
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.isActive = true")
    Long countActiveEmployees();
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department.deptId = :departmentId AND e.isActive = true")
    Long countActiveEmployeesByDepartment(@Param("departmentId") Long departmentId);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByEmployeeCode(String employeeCode);
}