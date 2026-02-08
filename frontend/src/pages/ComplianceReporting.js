import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Form,
  Modal,
  Alert,
  ProgressBar,
  Tabs,
  Tab,
  ListGroup,
  Accordion
} from 'react-bootstrap';
import { 
  FaFileAlt, 
  FaDownload, 
  FaCalendarAlt, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaFileExcel,
  FaFilePdf,
  FaChartLine,
  FaBell,
  FaShieldAlt,
  FaCalculator,
  FaUniversity,
  FaGavel
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';

const ComplianceReporting = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('reports');
  const [complianceAlerts, setComplianceAlerts] = useState([]);
  const [statutoryReports, setStatutoryReports] = useState([]);
  const [taxCalculations, setTaxCalculations] = useState([]);
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const reportTypes = [
    {
      id: 'pf_report',
      name: 'Provident Fund Report',
      description: 'Monthly PF contributions and employee details',
      frequency: 'Monthly',
      dueDate: '15th of next month',
      category: 'PF',
      icon: FaUniversity,
      color: 'primary'
    },
    {
      id: 'esi_report',
      name: 'ESI Contribution Report',
      description: 'Employee State Insurance contributions',
      frequency: 'Monthly',
      dueDate: '21st of next month',
      category: 'ESI',
      icon: FaShieldAlt,
      color: 'success'
    },
    {
      id: 'tds_report',
      name: 'TDS Deduction Report',
      description: 'Tax Deducted at Source details',
      frequency: 'Quarterly',
      dueDate: '30th July, Oct, Jan, Apr',
      category: 'TDS',
      icon: FaCalculator,
      color: 'warning'
    },
    {
      id: 'pt_report',
      name: 'Professional Tax Report',
      description: 'State-wise Professional Tax deductions',
      frequency: 'Monthly',
      dueDate: '15th of next month',
      category: 'PT',
      icon: FaGavel,
      color: 'info'
    },
    {
      id: 'form16_report',
      name: 'Form 16 Generation',
      description: 'Annual salary and tax certificate',
      frequency: 'Annually',
      dueDate: '15th June',
      category: 'Income Tax',
      icon: FaFileAlt,
      color: 'danger'
    },
    {
      id: 'lwf_report',
      name: 'Labour Welfare Fund',
      description: 'State Labour Welfare Fund contributions',
      frequency: 'Half-yearly',
      dueDate: '30th June, 31st Dec',
      category: 'LWF',
      icon: FaShieldAlt,
      color: 'dark'
    }
  ];

  const complianceMetrics = [
    {
      category: 'PF Compliance',
      status: 'compliant',
      percentage: 100,
      details: 'All employees registered, contributions up to date'
    },
    {
      category: 'ESI Compliance',
      status: 'compliant',
      percentage: 95,
      details: '2 employees pending registration'
    },
    {
      category: 'TDS Compliance',
      status: 'pending',
      percentage: 85,
      details: 'Q2 TDS return pending submission'
    },
    {
      category: 'Labour Law Compliance',
      status: 'compliant',
      percentage: 100,
      details: 'All registrations and renewals current'
    }
  ];

  useEffect(() => {
    fetchComplianceAlerts();
    fetchStatutoryReports();
    fetchTaxCalculations();
  }, []);

  const fetchComplianceAlerts = async () => {
    try {
      const mockAlerts = [
        {
          id: 1,
          type: 'deadline',
          severity: 'high',
          title: 'PF Return Due',
          message: 'Monthly PF return for September 2025 is due on 15th October',
          dueDate: '2025-10-15',
          category: 'PF'
        },
        {
          id: 2,
          type: 'renewal',
          severity: 'medium',
          title: 'Labour License Renewal',
          message: 'Factory license renewal due in 30 days',
          dueDate: '2025-11-01',
          category: 'Labour Law'
        },
        {
          id: 3,
          type: 'submission',
          severity: 'low',
          title: 'ESI Return Submitted',
          message: 'ESI return for September successfully submitted',
          dueDate: '2025-09-21',
          category: 'ESI'
        }
      ];
      setComplianceAlerts(mockAlerts);
    } catch (error) {
      toast.error('Failed to fetch compliance alerts');
    }
  };

  const fetchStatutoryReports = async () => {
    try {
      const mockReports = [
        {
          id: 1,
          reportType: 'PF Report',
          month: 'September 2025',
          status: 'generated',
          generatedOn: '2025-09-30',
          fileSize: '245 KB',
          employees: 50
        },
        {
          id: 2,
          reportType: 'ESI Report',
          month: 'September 2025',
          status: 'pending',
          generatedOn: null,
          fileSize: null,
          employees: 45
        },
        {
          id: 3,
          reportType: 'TDS Report Q2',
          month: 'July-Sept 2025',
          status: 'generated',
          generatedOn: '2025-09-30',
          fileSize: '189 KB',
          employees: 50
        }
      ];
      setStatutoryReports(mockReports);
    } catch (error) {
      toast.error('Failed to fetch statutory reports');
    }
  };

  const fetchTaxCalculations = async () => {
    try {
      const mockTaxData = [
        {
          employeeName: 'John Doe',
          employeeCode: 'EMP001',
          annualSalary: 1200000,
          taxDeducted: 156000,
          remainingTax: 24000,
          regime: 'Old'
        },
        {
          employeeName: 'Jane Smith',
          employeeCode: 'EMP002',
          annualSalary: 800000,
          taxDeducted: 62000,
          remainingTax: 8000,
          regime: 'New'
        }
      ];
      setTaxCalculations(mockTaxData);
    } catch (error) {
      toast.error('Failed to fetch tax calculations');
    }
  };

  const generateReport = async (reportType) => {
    try {
      setLoading(true);
      
      // Mock API call for report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${reportType} generated successfully!`);
      fetchStatutoryReports(); // Refresh reports
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (reportId, format) => {
    // Mock download functionality
    toast.success(`Report downloaded in ${format.toUpperCase()} format`);
  };

  const getAlertBadge = (severity) => {
    const variants = {
      high: 'danger',
      medium: 'warning',
      low: 'success'
    };
    return <Badge bg={variants[severity] || 'secondary'}>{severity.toUpperCase()}</Badge>;
  };

  const getComplianceColor = (status) => {
    return status === 'compliant' ? 'success' : status === 'pending' ? 'warning' : 'danger';
  };

  if (loading) {
    return <Loading text="Loading compliance data..." />;
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <FaShieldAlt className="me-2" />
            Compliance & Reporting
          </h2>
          <p className="text-muted mb-0">
            Statutory compliance and government reporting
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-warning">
            <FaBell className="me-1" />
            Alerts ({complianceAlerts.length})
          </Button>
          <Button variant="success">
            <FaDownload className="me-1" />
            Bulk Export
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FaChartLine className="me-2" />
                Compliance Overview
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {complianceMetrics.map((metric, index) => (
                  <Col lg={3} md={6} key={index} className="mb-3">
                    <div className="compliance-metric">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{metric.category}</h6>
                        <Badge bg={getComplianceColor(metric.status)}>
                          {metric.status.toUpperCase()}
                        </Badge>
                      </div>
                      <ProgressBar 
                        now={metric.percentage} 
                        variant={getComplianceColor(metric.status)}
                        className="mb-2"
                      />
                      <small className="text-muted">{metric.details}</small>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        {/* Reports Tab */}
        <Tab eventKey="reports" title={
          <span>
            <FaFileAlt className="me-1" />
            Statutory Reports
          </span>
        }>
          <Row>
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Generate Reports</h5>
                    <div className="d-flex gap-2">
                      <Form.Select 
                        size="sm" 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      >
                        {Array.from({length: 12}, (_, i) => (
                          <option key={i+1} value={i+1}>
                            {new Date(2025, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Select 
                        size="sm" 
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      >
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                        <option value={2023}>2023</option>
                      </Form.Select>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {reportTypes.map((report) => {
                      const IconComponent = report.icon;
                      return (
                        <Col lg={6} key={report.id} className="mb-3">
                          <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                              <div className="d-flex align-items-center mb-3">
                                <div className={`p-2 rounded bg-${report.color} text-white me-3`}>
                                  <IconComponent />
                                </div>
                                <div>
                                  <h6 className="mb-0">{report.name}</h6>
                                  <small className="text-muted">{report.category}</small>
                                </div>
                              </div>
                              <p className="text-muted small mb-2">{report.description}</p>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <small><strong>Frequency:</strong> {report.frequency}</small>
                                <small><strong>Due:</strong> {report.dueDate}</small>
                              </div>
                              <Button 
                                variant={`outline-${report.color}`} 
                                size="sm" 
                                className="w-100"
                                onClick={() => generateReport(report.name)}
                              >
                                Generate Report
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    <FaBell className="me-2" />
                    Compliance Alerts
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {complianceAlerts.map((alert) => (
                      <ListGroup.Item key={alert.id} className="px-0">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="mb-1">{alert.title}</h6>
                          {getAlertBadge(alert.severity)}
                        </div>
                        <p className="mb-1 small">{alert.message}</p>
                        <small className="text-muted">
                          <FaCalendarAlt className="me-1" />
                          Due: {new Date(alert.dueDate).toLocaleDateString()}
                        </small>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>

              <Card className="mt-3">
                <Card.Header>
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" size="sm">
                      <FaCalculator className="me-1" />
                      Tax Calculator
                    </Button>
                    <Button variant="outline-success" size="sm">
                      <FaUniversity className="me-1" />
                      PF/ESI Rates
                    </Button>
                    <Button variant="outline-info" size="sm">
                      <FaGavel className="me-1" />
                      Labour Laws
                    </Button>
                    <Button variant="outline-warning" size="sm">
                      <FaBell className="me-1" />
                      Set Reminders
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Generated Reports Tab */}
        <Tab eventKey="generated" title={
          <span>
            <FaDownload className="me-1" />
            Generated Reports
          </span>
        }>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Report History</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Report Type</th>
                    <th>Period</th>
                    <th>Status</th>
                    <th>Generated On</th>
                    <th>File Size</th>
                    <th>Employees</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statutoryReports.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <strong>{report.reportType}</strong>
                      </td>
                      <td>{report.month}</td>
                      <td>
                        {report.status === 'generated' ? (
                          <Badge bg="success">
                            <FaCheckCircle className="me-1" />
                            Generated
                          </Badge>
                        ) : (
                          <Badge bg="warning">
                            <FaTimesCircle className="me-1" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td>
                        {report.generatedOn ? 
                          new Date(report.generatedOn).toLocaleDateString() 
                          : '--'
                        }
                      </td>
                      <td>{report.fileSize || '--'}</td>
                      <td>{report.employees}</td>
                      <td>
                        {report.status === 'generated' ? (
                          <div className="d-flex gap-1">
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => downloadReport(report.id, 'pdf')}
                            >
                              <FaFilePdf />
                            </Button>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => downloadReport(report.id, 'excel')}
                            >
                              <FaFileExcel />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline-warning" 
                            size="sm"
                            onClick={() => generateReport(report.reportType)}
                          >
                            Generate
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Tax Calculations Tab */}
        <Tab eventKey="tax" title={
          <span>
            <FaCalculator className="me-1" />
            Tax Calculations
          </span>
        }>
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Employee Tax Summary - FY 2025-26</h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Annual Salary</th>
                        <th>Tax Deducted</th>
                        <th>Remaining Tax</th>
                        <th>Tax Regime</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxCalculations.map((tax, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <strong>{tax.employeeName}</strong>
                              <br />
                              <small className="text-muted">{tax.employeeCode}</small>
                            </div>
                          </td>
                          <td>₹{tax.annualSalary.toLocaleString('en-IN')}</td>
                          <td>₹{tax.taxDeducted.toLocaleString('en-IN')}</td>
                          <td>
                            <span className={tax.remainingTax > 0 ? 'text-warning' : 'text-success'}>
                              ₹{tax.remainingTax.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td>
                            <Badge bg={tax.regime === 'New' ? 'primary' : 'secondary'}>
                              {tax.regime} Regime
                            </Badge>
                          </td>
                          <td>
                            {tax.remainingTax > 0 ? (
                              <Badge bg="warning">Pending</Badge>
                            ) : (
                              <Badge bg="success">Complete</Badge>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button variant="outline-primary" size="sm">
                                <FaCalculator />
                              </Button>
                              <Button variant="outline-success" size="sm">
                                <FaFilePdf />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Compliance Rules Tab */}
        <Tab eventKey="rules" title={
          <span>
            <FaGavel className="me-1" />
            Compliance Rules
          </span>
        }>
          <Row>
            <Col lg={12}>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <FaUniversity className="me-2" />
                    Provident Fund (PF) Rules
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>Employee contribution: 12% of basic salary</li>
                      <li>Employer contribution: 12% of basic salary (3.67% to EPF, 8.33% to EPS)</li>
                      <li>Applicable to employees earning up to ₹15,000 basic salary</li>
                      <li>Monthly returns due by 15th of next month</li>
                      <li>Annual returns due by 30th May</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <FaShieldAlt className="me-2" />
                    Employee State Insurance (ESI) Rules
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>Employee contribution: 0.75% of gross salary</li>
                      <li>Employer contribution: 3.25% of gross salary</li>
                      <li>Applicable to employees earning up to ₹25,000 per month</li>
                      <li>Monthly returns due by 21st of next month</li>
                      <li>Half-yearly returns due by 30th June and 31st December</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <FaCalculator className="me-2" />
                    Tax Deduction at Source (TDS) Rules
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>TDS applicable on salary exceeding basic exemption limit</li>
                      <li>Monthly TDS deduction based on projected annual income</li>
                      <li>Quarterly TDS returns due by 31st July, October, January, and May</li>
                      <li>Annual TDS certificate (Form 16) due by 15th June</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    <FaGavel className="me-2" />
                    Professional Tax Rules
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>State-specific tax on employment/profession</li>
                      <li>Varies by state (₹200-₹2,500 per month)</li>
                      <li>Monthly returns due by 15th of next month</li>
                      <li>Annual returns due by 30th June</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ComplianceReporting;