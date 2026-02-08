package com.payroll.repository;

import com.payroll.entity.SalaryDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryDetailsRepository extends JpaRepository<SalaryDetails, Long> {
    
    List<SalaryDetails> findByEmployeeEmployeeId(Long employeeId);
    
    Optional<SalaryDetails> findByEmployeeEmployeeIdAndMonthAndYear(Long employeeId, Integer month, Integer year);
    
    List<SalaryDetails> findByMonthAndYear(Integer month, Integer year);
    
    List<SalaryDetails> findByEmployeeEmployeeIdOrderByYearDescMonthDesc(Long employeeId);
    
    Page<SalaryDetails> findByEmployeeEmployeeIdOrderByYearDescMonthDesc(Long employeeId, Pageable pageable);
    
    @Query("SELECT s FROM SalaryDetails s WHERE s.year = :year ORDER BY s.month DESC")
    List<SalaryDetails> findByYearOrderByMonth(@Param("year") Integer year);
    
    @Query("SELECT s FROM SalaryDetails s WHERE s.isProcessed = :processed")
    List<SalaryDetails> findByProcessedStatus(@Param("processed") Boolean processed);
    
    @Query("SELECT COUNT(s) FROM SalaryDetails s WHERE s.employee.employeeId = :employeeId")
    Long countSalaryRecordsByEmployee(@Param("employeeId") Long employeeId);
    
    Boolean existsByEmployeeEmployeeIdAndMonthAndYear(Long employeeId, Integer month, Integer year);
}