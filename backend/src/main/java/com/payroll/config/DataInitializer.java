package com.payroll.config;

import com.payroll.entity.Department;
import com.payroll.entity.Employee;
import com.payroll.entity.SalaryDetails;
import com.payroll.enums.Role;
import com.payroll.repository.DepartmentRepository;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.SalaryDetailsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private SalaryDetailsRepository salaryDetailsRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private final Random random = new Random();
    
    @Override
    public void run(String... args) throws Exception {
        createDefaultDepartments();
        createDefaultAdminUser();
        createSampleEmployees();
    }
    
    private void createDefaultDepartments() {
        if (departmentRepository.count() == 0) {
            logger.info("Creating default departments...");
            
            List<Department> departments = Arrays.asList(
                new Department("Human Resources", "Manages employee relations, recruitment, and HR policies"),
                new Department("Finance", "Handles financial operations, accounting, and budgeting"),
                new Department("Marketing", "Manages marketing campaigns, brand promotion, and customer engagement"),
                new Department("Analytics", "Data analysis, business intelligence, and reporting"),
                new Department("Information Technology", "Software development, system maintenance, and technical support"),
                new Department("Support", "Customer support, help desk, and technical assistance"),
                new Department("Operations", "Day-to-day operations, logistics, and process management"),
                new Department("Sales", "Sales operations, client relations, and revenue generation")
            );
            
            departmentRepository.saveAll(departments);
            logger.info("Default departments created successfully!");
        }
    }
    
    private void createDefaultAdminUser() {
        if (!employeeRepository.existsByEmail("admin@payroll.com")) {
            logger.info("Creating default admin user...");
            
            Department hrDept = departmentRepository.findByDeptName("Human Resources")
                    .orElse(null);
            
            Employee admin = new Employee();
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setEmail("admin@payroll.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setEmployeeCode("ADM0001");
            admin.setHireDate(LocalDate.now());
            admin.setIsActive(true);
            admin.setDepartment(hrDept);
            admin.setPhoneNumber("+1-555-0123");
            admin.setAddress("123 Admin Street, Admin City, AC 12345");
            
            employeeRepository.save(admin);
            
            logger.info("Default admin user created successfully!");
            logger.info("Email: admin@payroll.com");
            logger.info("Password: admin123");
        }
        
        // Create a sample employee for testing
        if (!employeeRepository.existsByEmail("employee@payroll.com")) {
            logger.info("Creating sample employee user...");
            
            Department itDept = departmentRepository.findByDeptName("Information Technology")
                    .orElse(null);
            
            Employee employee = new Employee();
            employee.setFirstName("John");
            employee.setLastName("Doe");
            employee.setEmail("employee@payroll.com");
            employee.setPassword(passwordEncoder.encode("emp123"));
            employee.setRole(Role.EMPLOYEE);
            employee.setEmployeeCode("EMP0001");
            employee.setHireDate(LocalDate.now().minusMonths(6));
            employee.setIsActive(true);
            employee.setDepartment(itDept);
            employee.setPhoneNumber("+1-555-0124");
            employee.setAddress("456 Employee Lane, Employee City, EC 12345");
            employee.setDateOfBirth(LocalDate.of(1990, 5, 15));
            
            employeeRepository.save(employee);
            
            logger.info("Sample employee user created successfully!");
            logger.info("Email: employee@payroll.com");
            logger.info("Password: emp123");
        }
    }
    
    private void createSampleEmployees() {
        // Only create if we don't have many employees already
        if (employeeRepository.count() < 10) {
            logger.info("Creating sample employees...");
            
            List<Department> departments = departmentRepository.findAll();
            
            // Indian names covering different regions
            String[] firstNames = {
                "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
                "Aadhya", "Ananya", "Diya", "Ira", "Pihu", "Prisha", "Anaya", "Fatima", "Riya", "Sara",
                "Rajesh", "Suresh", "Ramesh", "Mahesh", "Dinesh", "Naresh", "Kiran", "Vikram", "Ravi", "Amit",
                "Sunita", "Kavita", "Geeta", "Meera", "Neha", "Pooja", "Rekha", "Sita", "Rita", "Lata",
                "Harpreet", "Gurpreet", "Manpreet", "Jaspreet", "Simran", "Radhika", "Lakshmi", "Saraswati", "Parvati", "Durga"
            };

            String[] lastNames = {
                "Sharma", "Verma", "Singh", "Kumar", "Gupta", "Agarwal", "Jain", "Bansal", "Srivastava", "Tiwari",
                "Yadav", "Mishra", "Pandey", "Shukla", "Dubey", "Saxena", "Arora", "Malhotra", "Kapoor", "Chopra",
                "Mehta", "Shah", "Patel", "Reddy", "Nair", "Iyer", "Pillai", "Menon", "Das", "Ghosh",
                "Mukherjee", "Chatterjee", "Banerjee", "Saha", "Roy", "Bose", "Sen", "Dutta", "Chakraborty", "Bhattacharya",
                "Khan", "Ali", "Ahmed", "Hussain", "Rahman", "Ansari", "Sheikh", "Siddiqui", "Qureshi", "Malik"
            };

            String[] cities = {
                "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", 
                "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
                "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut"
            };
            
            // Create 15 more employees initially (we already have admin and employee)
            // We can add more later through the UI
            for (int i = 0; i < 15; i++) {
                String firstName = firstNames[random.nextInt(firstNames.length)];
                String lastName = lastNames[random.nextInt(lastNames.length)];
                String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + (i + 1) + "@payroll.com";
                
                Department dept = departments.get(random.nextInt(departments.size()));
                String city = cities[random.nextInt(cities.length)];
                
                // Determine position and salary based on role distribution
                Role role = Role.EMPLOYEE;
                BigDecimal basicSalary;
                
                // 5 peons with lower salaries (first 5)
                if (i < 5) {
                    basicSalary = new BigDecimal(String.valueOf(18000 + random.nextInt(7000))); // 18k-25k
                } else if (random.nextInt(10) < 3) { // 30% managers/seniors
                    basicSalary = new BigDecimal(String.valueOf(80000 + random.nextInt(40000))); // 80k-120k
                } else { // Regular employees
                    basicSalary = new BigDecimal(String.valueOf(35000 + random.nextInt(25000))); // 35k-60k
                }
                
                try {
                    Employee employee = createEmployee(firstName, lastName, email, "password123", role, dept, city);
                    createSalaryRecord(employee, basicSalary);
                    // Add small delay to prevent overwhelming the connection pool
                    Thread.sleep(50);
                } catch (Exception e) {
                    logger.error("Error creating employee: " + e.getMessage());
                }
            }
            
            logger.info("Sample employees created successfully!");
        }
    }
    
    private Employee createEmployee(String firstName, String lastName, String email, String password, 
                                   Role role, Department department, String city) {
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
        
        return employeeRepository.save(employee);
    }
    
    private void createSalaryRecord(Employee employee, BigDecimal basicSalary) {
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
}