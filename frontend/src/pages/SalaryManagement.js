import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button,
  Table,
  Badge,
  Modal
} from 'react-bootstrap';
import { employeeService, salaryService } from '../services/employeeService';
import Loading from '../components/common/Loading';
import { FaCalculator, FaDollarSign, FaFileInvoiceDollar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SalaryManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [salaryData, setSalaryData] = useState({
    employeeId: '',
    month: new Date().toISOString().slice(0, 7), // Current month
    hoursWorked: 160,
    overtimeHours: 0,
    bonus: 0,
    allowances: 0,
    deductions: 0
  });
  const [calculatedSalary, setCalculatedSalary] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateSalary = async (e) => {
    e.preventDefault();
    try {
      const response = await salaryService.calculateSalary(salaryData);
      setCalculatedSalary(response.data);
      toast.success('Salary calculated successfully');
    } catch (error) {
      toast.error('Failed to calculate salary');
    }
  };

  const handleGeneratePayslip = async (employeeId, month) => {
    try {
      const response = await salaryService.generatePayslip(employeeId, month);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payslip-${employeeId}-${month}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Payslip generated successfully');
    } catch (error) {
      toast.error('Failed to generate payslip');
    }
  };

  const handleInputChange = (e) => {
    setSalaryData({
      ...salaryData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmployeeSelect = (employeeId) => {
    setSalaryData({
      ...salaryData,
      employeeId: employeeId
    });
    setSelectedEmployee(employeeId);
    setShowModal(true);
  };

  if (loading) {
    return <Loading text="Loading salary management..." />;
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-0">
            <FaDollarSign className="me-2" />
            Salary Management
          </h1>
          <p className="text-muted">Calculate and manage employee salaries</p>
        </div>
      </div>

      <Row className="g-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Employee List</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table striped hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Base Salary</th>
                      <th>Last Salary</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.employeeId}>
                        <td>
                          <div>
                            <strong>{employee.fullName}</strong>
                            <br />
                            <small className="text-muted">{employee.employeeCode}</small>
                          </div>
                        </td>
                        <td>
                          <Badge bg="secondary">{employee.departmentName}</Badge>
                        </td>
                        <td>
                          {employee.baseSalary ? 
                            `$${employee.baseSalary.toLocaleString()}` : 
                            'Not set'
                          }
                        </td>
                        <td>
                          <Badge bg="info">Current Month</Badge>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleEmployeeSelect(employee.employeeId)}
                            >
                              <FaCalculator className="me-1" />
                              Calculate
                            </Button>
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleGeneratePayslip(
                                employee.employeeId, 
                                new Date().toISOString().slice(0, 7)
                              )}
                            >
                              <FaFileInvoiceDollar className="me-1" />
                              Payslip
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Stats</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Total Employees:</span>
                  <strong>{employees.length}</strong>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Active Employees:</span>
                  <strong>{employees.filter(emp => emp.isActive).length}</strong>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Total Salary Budget:</span>
                  <strong>
                    ${employees.reduce((sum, emp) => sum + (emp.baseSalary || 0), 0).toLocaleString()}
                  </strong>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <span>Current Month:</span>
                  <strong>
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Salary Calculator Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCalculator className="me-2" />
            Calculate Salary
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCalculateSalary}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employee</Form.Label>
                  <Form.Select
                    name="employeeId"
                    value={salaryData.employeeId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.employeeId} value={emp.employeeId}>
                        {emp.fullName} ({emp.employeeCode})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Month</Form.Label>
                  <Form.Control
                    type="month"
                    name="month"
                    value={salaryData.month}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hours Worked</Form.Label>
                  <Form.Control
                    type="number"
                    name="hoursWorked"
                    value={salaryData.hoursWorked}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Overtime Hours</Form.Label>
                  <Form.Control
                    type="number"
                    name="overtimeHours"
                    value={salaryData.overtimeHours}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Bonus ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="bonus"
                    value={salaryData.bonus}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Allowances ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="allowances"
                    value={salaryData.allowances}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Deductions ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="deductions"
                    value={salaryData.deductions}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
            </Row>

            {calculatedSalary && (
              <Card className="mt-4 bg-light">
                <Card.Header>
                  <h6 className="mb-0">Calculated Salary Details</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="mb-2">
                        <strong>Basic Salary:</strong> ${calculatedSalary.basicSalary?.toLocaleString()}
                      </div>
                      <div className="mb-2">
                        <strong>Gross Salary:</strong> ${calculatedSalary.grossSalary?.toLocaleString()}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-2">
                        <strong>Tax Amount:</strong> ${calculatedSalary.taxAmount?.toLocaleString()}
                      </div>
                      <div className="mb-2">
                        <strong className="text-success">Net Salary:</strong> ${calculatedSalary.netSalary?.toLocaleString()}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Calculate Salary
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default SalaryManagement;