import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { employeeService, salaryService } from '../services/employeeService';
import Loading from '../components/common/Loading';
import { 
  FaUsers, 
  FaDollarSign, 
  FaBuilding, 
  FaChartLine,
  FaCalendarAlt,
  FaMoneyBillWave 
} from 'react-icons/fa';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalaryAmount: 0,
    pendingPayslips: 0
  });
  const [recentSalaries, setRecentSalaries] = useState([]);
  const [userSalary, setUserSalary] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isAdmin()) {
        // Admin dashboard data
        const [employeesRes, departmentsRes] = await Promise.all([
          employeeService.getAllEmployees(),
          employeeService.getAllDepartments()
        ]);

        const employees = employeesRes.data;
        const departments = departmentsRes.data;

        // Calculate total salary (mock calculation for demo)
        const totalSalary = employees.reduce((sum, emp) => sum + (emp.baseSalary || 0), 0);

        setStats({
          totalEmployees: employees.length,
          totalDepartments: departments.length,
          totalSalaryAmount: totalSalary,
          pendingPayslips: Math.floor(employees.length * 0.3) // Mock pending payslips
        });
      } else {
        // Employee dashboard data
        try {
          const salaryRes = await salaryService.getEmployeeSalary(user.employeeId);
          setUserSalary(salaryRes.data);
        } catch (error) {
          console.log('No salary data found for employee');
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading dashboard..." />;
  }

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className={`rounded-circle p-3 me-3 bg-${color} bg-opacity-10`}>
            <Icon className={`text-${color}`} size={24} />
          </div>
          <div>
            <h3 className="mb-0">{value}</h3>
            <p className="text-muted mb-0">{title}</p>
            {subtitle && <small className="text-muted">{subtitle}</small>}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-0">
            {isAdmin() ? 'Admin Dashboard' : 'Employee Dashboard'}
          </h1>
          <p className="text-muted">
            Welcome back, {user?.fullName || user?.email}
          </p>
        </div>
        <div>
          <span className="badge bg-primary fs-6 px-3 py-2">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {isAdmin() ? (
        // Admin Dashboard
        <>
          <Row className="g-4 mb-4">
            <Col md={3}>
              <StatCard
                icon={FaUsers}
                title="Total Employees"
                value={stats.totalEmployees}
                color="primary"
                subtitle="Active employees"
              />
            </Col>
            <Col md={3}>
              <StatCard
                icon={FaBuilding}
                title="Departments"
                value={stats.totalDepartments}
                color="success"
                subtitle="Active departments"
              />
            </Col>
            <Col md={3}>
              <StatCard
                icon={FaDollarSign}
                title="Total Salary"
                value={`$${stats.totalSalaryAmount.toLocaleString()}`}
                color="warning"
                subtitle="Monthly budget"
              />
            </Col>
            <Col md={3}>
              <StatCard
                icon={FaCalendarAlt}
                title="Pending Payslips"
                value={stats.pendingPayslips}
                color="danger"
                subtitle="This month"
              />
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={8}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">
                    <FaChartLine className="me-2" />
                    Quick Actions
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Button 
                        variant="outline-primary" 
                        className="w-100 py-3"
                        href="/employees"
                      >
                        <FaUsers className="me-2" />
                        Manage Employees
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button 
                        variant="outline-success" 
                        className="w-100 py-3"
                        href="/salary"
                      >
                        <FaDollarSign className="me-2" />
                        Process Salaries
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button 
                        variant="outline-warning" 
                        className="w-100 py-3"
                        href="/departments"
                      >
                        <FaBuilding className="me-2" />
                        Manage Departments
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button 
                        variant="outline-info" 
                        className="w-100 py-3"
                        href="/analytics"
                      >
                        <FaChartLine className="me-2" />
                        View Analytics
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">System Status</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success rounded-circle me-3" style={{width: '12px', height: '12px'}}></div>
                    <span>All systems operational</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success rounded-circle me-3" style={{width: '12px', height: '12px'}}></div>
                    <span>Database connected</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success rounded-circle me-3" style={{width: '12px', height: '12px'}}></div>
                    <span>AI Assistant active</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-warning rounded-circle me-3" style={{width: '12px', height: '12px'}}></div>
                    <span>Backup pending</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        // Employee Dashboard
        <>
          <Row className="g-4 mb-4">
            <Col md={4}>
              <StatCard
                icon={FaMoneyBillWave}
                title="Current Salary"
                value={userSalary ? `$${userSalary.netSalary?.toLocaleString() || '0'}` : 'N/A'}
                color="success"
                subtitle="Net monthly salary"
              />
            </Col>
            <Col md={4}>
              <StatCard
                icon={FaCalendarAlt}
                title="This Month"
                value={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                color="primary"
                subtitle="Current period"
              />
            </Col>
            <Col md={4}>
              <StatCard
                icon={FaDollarSign}
                title="YTD Earnings"
                value={userSalary ? `$${(userSalary.netSalary * new Date().getMonth() + 1).toLocaleString() || '0'}` : 'N/A'}
                color="warning"
                subtitle="Year to date"
              />
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={8}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Button 
                        variant="outline-primary" 
                        className="w-100 py-3"
                        href="/profile"
                      >
                        <FaUsers className="me-2" />
                        View Profile
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button 
                        variant="outline-success" 
                        className="w-100 py-3"
                        href="/payslips"
                      >
                        <FaMoneyBillWave className="me-2" />
                        Download Payslips
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button 
                        variant="outline-info" 
                        className="w-100 py-3"
                        href="/ai-assistant"
                      >
                        <FaChartLine className="me-2" />
                        AI Assistant
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button 
                        variant="outline-warning" 
                        className="w-100 py-3"
                        href="/salary-history"
                      >
                        <FaDollarSign className="me-2" />
                        Salary History
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Salary Details</h5>
                </Card.Header>
                <Card.Body>
                  {userSalary ? (
                    <div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Basic Salary:</span>
                        <strong>${userSalary.basicSalary?.toLocaleString() || '0'}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Allowances:</span>
                        <strong className="text-success">+${userSalary.allowances?.toLocaleString() || '0'}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Deductions:</span>
                        <strong className="text-danger">-${userSalary.deductions?.toLocaleString() || '0'}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax:</span>
                        <strong className="text-danger">-${userSalary.taxAmount?.toLocaleString() || '0'}</strong>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Net Salary:</strong>
                        <strong className="text-primary">${userSalary.netSalary?.toLocaleString() || '0'}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted">
                      <p>No salary information available</p>
                      <small>Contact HR for details</small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Dashboard;