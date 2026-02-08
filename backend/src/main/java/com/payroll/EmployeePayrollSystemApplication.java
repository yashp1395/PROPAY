package com.payroll;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EmployeePayrollSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeePayrollSystemApplication.class, args);
        System.out.println("🚀 EquiPay is running!");
        System.out.println("📚 API Documentation: http://localhost:8080/api/swagger-ui.html");
    }
}