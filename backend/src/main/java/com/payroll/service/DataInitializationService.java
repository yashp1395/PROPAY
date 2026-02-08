package com.payroll.service;

import com.payroll.entity.Department;
import com.payroll.entity.Employee;
import com.payroll.entity.SalaryDetails;
import com.payroll.enums.Role;
import com.payroll.repository.DepartmentRepository;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.SalaryDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private SalaryDetailsRepository salaryDetailsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no employees exist
        if (employeeRepository.count() == 0) {
            initializeDepartments();
            initializeEmployees();
            initializeSalaries();
        }
    }

    private void initializeDepartments() {
        List<Department> departments = Arrays.asList(
            createDepartment("Human Resources", "Manages employee relations, recruitment, and HR policies"),
            createDepartment("Finance", "Handles financial operations, accounting, and budgeting"),
            createDepartment("Marketing", "Manages marketing campaigns, brand promotion, and customer engagement"),
            createDepartment("Analytics", "Data analysis, business intelligence, and reporting"),
            createDepartment("Information Technology", "Software development, system maintenance, and technical support"),
            createDepartment("Support", "Customer support, help desk, and technical assistance"),
            createDepartment("Operations", "Day-to-day operations, logistics, and process management"),
            createDepartment("Sales", "Sales operations, client relations, and revenue generation")
        );

        departmentRepository.saveAll(departments);
    }

    private Department createDepartment(String name, String description) {
        Department dept = new Department();
        dept.setDeptName(name);
        dept.setDescription(description);
        dept.setCreatedAt(LocalDateTime.now());
        dept.setUpdatedAt(LocalDateTime.now());
        return dept;
    }

    private void initializeEmployees() {
        List<Department> departments = departmentRepository.findAll();
        
        // Sample Indian names
        String[] firstNames = {
            "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
            "Aadhya", "Ananya", "Diya", "Ira", "Pihu", "Prisha", "Anaya", "Fatima", "Riya", "Sara",
            "Rahul", "Rohan", "Amit", "Sunil", "Vikram", "Ravi", "Deepak", "Ajay", "Sandeep", "Manish",
            "Priya", "Sneha", "Pooja", "Kavya", "Meera", "Neha", "Divya", "Swati", "Rekha", "Sunita",
            "Aryan", "Dev", "Karan", "Nitin", "Gaurav", "Harsh", "Yash", "Varun", "Akash", "Rishabh"
        };

        String[] lastNames = {
            "Sharma", "Verma", "Singh", "Kumar", "Gupta", "Agarwal", "Jain", "Bansal", "Srivastava", "Tiwari",
            "Yadav", "Mishra", "Pandey", "Shukla", "Dubey", "Saxena", "Arora", "Malhotra", "Kapoor", "Chopra",
            "Mehta", "Shah", "Patel", "Reddy", "Nair", "Iyer", "Pillai", "Menon", "Das", "Ghosh",
            "Mukherjee", "Chatterjee", "Banerjee", "Saha", "Roy", "Bose", "Sen", "Dutta", "Chakraborty", "Bhattacharya",
            "Khan", "Ali", "Ahmed", "Hassan", "Hussain", "Rahman", "Ansari", "Sheikh", "Siddiqui", "Qureshi"
        };

        String[] cities = {
            "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
        };

        // Create admin user
        createEmployee("Admin", "User", "admin@payroll.com", "admin123", Role.ADMIN, 
                      departments.get(0), new BigDecimal("120000"), cities[0]);

        // Create regular employee
        createEmployee("Employee", "Test", "employee@payroll.com", "emp123", Role.EMPLOYEE, 
                      departments.get(1), new BigDecimal("45000"), cities[1]);

        // Create 48 more employees
        int employeeCount = 0;
        for (int i = 0; i < 48; i++) {
            String firstName = firstNames[random.nextInt(firstNames.length)];
            String lastName = lastNames[random.nextInt(lastNames.length)];
            String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@payroll.com";
            
            Department dept = departments.get(random.nextInt(departments.size()));
            String city = cities[random.nextInt(cities.length)];
            
            // Determine position and salary based on department and role distribution
            Role role = Role.EMPLOYEE;
            BigDecimal salary;
            
            // 10 peons with lower salaries
            if (employeeCount < 10) {
                salary = new BigDecimal(String.valueOf(18000 + random.nextInt(7000))); // 18k-25k
            } else if (random.nextInt(10) < 2) { // 20% managers/seniors
                salary = new BigDecimal(String.valueOf(80000 + random.nextInt(40000))); // 80k-120k
            } else { // Regular employees
                salary = new BigDecimal(String.valueOf(35000 + random.nextInt(25000))); // 35k-60k
            }
            
            createEmployee(firstName, lastName, email, "password123", role, dept, salary, city);
            employeeCount++;
        }
    }

    private void createEmployee(String firstName, String lastName, String email, String password, 
                               Role role, Department department, BigDecimal salary, String city) {
        Employee employee = new Employee();
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setEmail(email);
        employee.setPassword(passwordEncoder.encode(password));
        employee.setRole(role);
        employee.setDepartment(department);
        employee.setPhoneNumber("9" + String.format("%09d", random.nextInt(1000000000)));
        employee.setAddress(generateAddress(city));
        employee.setDateOfBirth(generateRandomBirthDate());
        employee.setHireDate(generateRandomHireDate());
        employee.setEmployeeCode(generateEmployeeCode(department));
        employee.setIsActive(true);
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());
        
        Employee savedEmployee = employeeRepository.save(employee);
        
        // Create initial salary record
        createInitialSalary(savedEmployee, salary);
    }

    private void createInitialSalary(Employee employee, BigDecimal basicSalary) {
        // Calculate allowances (HRA + DA + Medical + Conveyance + Special)
        BigDecimal hra = basicSalary.multiply(new BigDecimal("0.4")); // 40% HRA
        BigDecimal da = basicSalary.multiply(new BigDecimal("0.1")); // 10% DA
        BigDecimal medical = new BigDecimal("2500");
        BigDecimal conveyance = new BigDecimal("1500");
        BigDecimal special = basicSalary.multiply(new BigDecimal("0.05")); // 5% Special
        BigDecimal totalAllowances = hra.add(da).add(medical).add(conveyance).add(special);
        
        // Calculate deductions (PF + ESI + other)
        BigDecimal pf = basicSalary.multiply(new BigDecimal("0.12")); // 12% PF
        BigDecimal esi = basicSalary.multiply(new BigDecimal("0.0175")); // 1.75% ESI
        BigDecimal totalDeductions = pf.add(esi);
        
        // Calculate tax percentage based on annual salary
        BigDecimal taxPercent = calculateTaxPercent(basicSalary);
        
        // Create salary record for current month
        LocalDateTime now = LocalDateTime.now();
        SalaryDetails salary = new SalaryDetails(
            employee, 
            basicSalary, 
            totalAllowances, 
            totalDeductions, 
            taxPercent, 
            now.getMonthValue(), 
            now.getYear()
        );
        
        salary.setIsProcessed(true);
        salaryDetailsRepository.save(salary);
    }

    private BigDecimal calculateTaxPercent(BigDecimal basicSalary) {
        BigDecimal annualSalary = basicSalary.multiply(new BigDecimal("12"));
        
        // Simplified tax percentage calculation based on Indian tax slabs
        if (annualSalary.compareTo(new BigDecimal("250000")) <= 0) {
            return BigDecimal.ZERO; // 0% tax
        } else if (annualSalary.compareTo(new BigDecimal("500000")) <= 0) {
            return new BigDecimal("5"); // 5% tax
        } else if (annualSalary.compareTo(new BigDecimal("1000000")) <= 0) {
            return new BigDecimal("20"); // 20% tax
        } else {
            return new BigDecimal("30"); // 30% tax
        }
    }

    private String generateAddress(String city) {
        String[] areas = {"Sector", "Block", "Phase", "Area", "Colony", "Nagar"};
        String area = areas[random.nextInt(areas.length)];
        int number = random.nextInt(100) + 1;
        return number + ", " + area + " " + (random.nextInt(50) + 1) + ", " + city + ", India";
    }

    private LocalDate generateRandomBirthDate() {
        int year = 1980 + random.nextInt(25); // Ages 18-43
        int month = random.nextInt(12) + 1;
        int day = random.nextInt(28) + 1;
        return LocalDate.of(year, month, day);
    }

    private LocalDate generateRandomHireDate() {
        int year = 2020 + random.nextInt(5); // Hired in last 5 years
        int month = random.nextInt(12) + 1;
        int day = random.nextInt(28) + 1;
        return LocalDate.of(year, month, day);
    }

    private String generateEmployeeCode(Department department) {
        String deptCode = department.getDeptName().substring(0, Math.min(3, department.getDeptName().length())).toUpperCase();
        return deptCode + String.format("%04d", random.nextInt(9999) + 1);
    }

    private void initializeSalaries() {
        // Salaries are already created in createEmployee method
        // This method can be used for additional salary records if needed
    }
}