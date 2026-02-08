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
  ListGroup
} from 'react-bootstrap';
import { 
  FaCalendarPlus, 
  FaCalendarCheck, 
  FaClock, 
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaHistory
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';

const LeaveManagement = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('apply');
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [applicationForm, setApplicationForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    isHalfDay: false,
    halfDaySession: 'FIRST_HALF',
    reason: '',
    emergencyContact: '',
    addressDuringLeave: '',
    isCompensatory: false,
    compensatoryWorkDate: ''
  });

  const leaveTypes = [
    { value: 'CASUAL', label: 'Casual Leave', color: 'primary', maxDays: 12 },
    { value: 'SICK', label: 'Sick Leave', color: 'warning', maxDays: 12 },
    { value: 'EARNED', label: 'Earned Leave', color: 'success', maxDays: 18 },
    { value: 'MATERNITY', label: 'Maternity Leave', color: 'info', maxDays: 180 },
    { value: 'PATERNITY', label: 'Paternity Leave', color: 'info', maxDays: 15 },
    { value: 'BEREAVEMENT', label: 'Bereavement Leave', color: 'dark', maxDays: 5 },
    { value: 'MARRIAGE', label: 'Marriage Leave', color: 'danger', maxDays: 5 },
    { value: 'STUDY', label: 'Study Leave', color: 'secondary', maxDays: 30 },
    { value: 'COMPENSATORY', label: 'Compensatory Leave', color: 'light', maxDays: 0 }
  ];

  const applicationStatuses = [
    { value: 'PENDING', label: 'Pending', color: 'warning' },
    { value: 'APPROVED', label: 'Approved', color: 'success' },
    { value: 'REJECTED', label: 'Rejected', color: 'danger' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'secondary' },
    { value: 'WITHDRAWN', label: 'Withdrawn', color: 'dark' }
  ];

  useEffect(() => {
    fetchLeaveBalances();
    fetchLeaveApplications();
  }, []);

  const fetchLeaveBalances = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentYear = new Date().getFullYear();
      const employeeId = user.employeeId || user.id;
      
      const response = await fetch(`http://localhost:8080/api/leave/balance/employee/${employeeId}/year/${currentYear}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Transform API data for frontend display
        const transformedBalances = data.map(item => ({
          leaveType: item.leaveType,
          allocated: item.allocatedDays,
          used: item.usedDays,
          pending: 0, // We can calculate this from pending applications
          available: item.remainingDays
        }));
        
        setLeaveBalances(transformedBalances);
      } else {
        throw new Error('Failed to fetch leave balances');
      }
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      
      // Fallback to mock data
      const mockBalances = [
        { leaveType: 'CASUAL', allocated: 12, used: 3, pending: 2, available: 7 },
        { leaveType: 'SICK', allocated: 12, used: 1, pending: 0, available: 11 },
        { leaveType: 'EARNED', allocated: 18, used: 5, pending: 3, available: 10 },
        { leaveType: 'COMPENSATORY', allocated: 4, used: 2, pending: 0, available: 2 }
      ];
      setLeaveBalances(mockBalances);
      toast.error('Using offline data - API connection failed');
    }
  };

  const fetchLeaveApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const employeeId = user.employeeId || user.id;
      
      let url = `http://localhost:8080/api/leave/applications/employee/${employeeId}`;
      if (isAdmin) {
        url = 'http://localhost:8080/api/leave/applications';
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Transform API data for frontend display
        const transformedApplications = data.map(item => ({
          id: item.id,
          employeeName: item.employee ? `${item.employee.firstName} ${item.employee.lastName}` : 'Unknown',
          employeeCode: item.employee?.employeeCode || '',
          leaveType: item.leaveType,
          startDate: item.startDate,
          endDate: item.endDate,
          totalDays: item.leaveDays,
          reason: item.reason,
          status: item.status,
          appliedOn: item.applicationDate ? new Date(item.applicationDate).toISOString().split('T')[0] : '',
          approvedBy: item.approvedBy ? `${item.approvedBy.firstName} ${item.approvedBy.lastName}` : null,
          isHalfDay: item.leaveDays === 0.5
        }));
        
        setLeaveApplications(transformedApplications);
      } else {
        throw new Error('Failed to fetch leave applications');
      }
    } catch (error) {
      console.error('Error fetching leave applications:', error);
      
      // Fallback to mock data
      const mockApplications = [
        {
          id: 1,
          employeeName: 'Rajesh Sharma',
          employeeCode: 'EMP001',
          leaveType: 'CASUAL',
          startDate: '2025-10-15',
          endDate: '2025-10-17',
          totalDays: 3,
          reason: 'Diwali celebrations with family',
          status: 'PENDING',
          appliedOn: '2025-10-01',
          approvedBy: null,
          isHalfDay: false
        },
        {
          id: 2,
          employeeName: 'Priya Patel',
          employeeCode: 'EMP002',
          leaveType: 'SICK',
          startDate: '2025-09-25',
          endDate: '2025-09-25',
          totalDays: 0.5,
          reason: 'Medical checkup',
          status: 'APPROVED',
          appliedOn: '2025-09-24',
          approvedBy: 'HR Manager',
          isHalfDay: true
        },
        {
          id: 3,
          employeeName: 'Vikram Singh',
          employeeCode: 'EMP003',
          leaveType: 'EARNED',
          startDate: '2025-09-20',
          endDate: '2025-09-22',
          totalDays: 3,
          reason: 'Family wedding in Punjab',
          status: 'APPROVED',
          appliedOn: '2025-09-10',
          approvedBy: 'Team Lead',
          isHalfDay: false
        }
      ];
      setLeaveApplications(mockApplications);
      toast.error('Using offline data - API connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Calculate total days
      const startDate = new Date(applicationForm.startDate);
      const endDate = new Date(applicationForm.endDate);
      const totalDays = applicationForm.isHalfDay ? 0.5 : 
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      // Check if enough leave balance available
      const leaveBalance = leaveBalances.find(b => b.leaveType === applicationForm.leaveType);
      if (leaveBalance && totalDays > leaveBalance.available) {
        toast.error(`Insufficient leave balance. Available: ${leaveBalance.available} days`);
        return;
      }

      // Real API call
      const token = localStorage.getItem('token');
      const employeeId = user.employeeId || user.id;
      
      const leaveApplicationData = {
        employeeId: employeeId,
        leaveType: applicationForm.leaveType,
        startDate: applicationForm.startDate,
        endDate: applicationForm.endDate,
        reason: applicationForm.reason
      };

      const response = await fetch('http://localhost:8080/api/leave/applications/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leaveApplicationData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Leave application submitted successfully!');
        setShowApplicationModal(false);
        fetchLeaveApplications();
        fetchLeaveBalances();
      } else {
        const errorData = await response.text();
        toast.error(errorData || 'Failed to submit leave application');
        return;
      }
      
      // Reset form
      setApplicationForm({
        leaveType: '',
        startDate: '',
        endDate: '',
        isHalfDay: false,
        halfDaySession: 'FIRST_HALF',
        reason: '',
        emergencyContact: '',
        addressDuringLeave: '',
        isCompensatory: false,
        compensatoryWorkDate: ''
      });
      
      fetchLeaveBalances(); // Refresh balances
    } catch (error) {
      toast.error('Failed to submit leave application');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (applicationId, action, comments) => {
    try {
      setLoading(true);
      
      // Mock API call
      setLeaveApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              status: action.toUpperCase(),
              approvedBy: user.fullName,
              approverComments: comments
            }
          : app
      ));
      
      toast.success(`Leave application ${action} successfully!`);
      fetchLeaveBalances(); // Refresh balances
    } catch (error) {
      toast.error(`Failed to ${action} leave application`);
    } finally {
      setLoading(false);
    }
  };

  const getLeaveTypeConfig = (type) => {
    return leaveTypes.find(lt => lt.value === type) || { label: type, color: 'secondary' };
  };

  const getStatusBadge = (status) => {
    const statusConfig = applicationStatuses.find(s => s.value === status);
    return (
      <Badge bg={statusConfig?.color || 'secondary'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const calculateDays = () => {
    if (applicationForm.startDate && applicationForm.endDate) {
      const start = new Date(applicationForm.startDate);
      const end = new Date(applicationForm.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return applicationForm.isHalfDay ? 0.5 : days;
    }
    return 0;
  };

  if (loading) {
    return <Loading text="Loading leave management..." />;
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <FaCalendarCheck className="me-2" />
            Leave Management
          </h2>
          <p className="text-muted mb-0">
            Manage leave applications and balances
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary">
            <FaDownload className="me-1" />
            Export Report
          </Button>
          <Button variant="success" onClick={() => setShowApplicationModal(true)}>
            <FaCalendarPlus className="me-1" />
            Apply Leave
          </Button>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        {/* Leave Balance Tab */}
        <Tab eventKey="balance" title={
          <span>
            <FaClock className="me-1" />
            Leave Balance
          </span>
        }>
          <Row>
            {leaveBalances.map((balance) => {
              const leaveTypeConfig = getLeaveTypeConfig(balance.leaveType);
              const usagePercentage = (balance.used / balance.allocated) * 100;
              
              return (
                <Col lg={3} md={6} key={balance.leaveType} className="mb-3">
                  <Card className="h-100">
                    <Card.Header className={`bg-${leaveTypeConfig.color} text-white`}>
                      <h6 className="mb-0">{leaveTypeConfig.label}</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="text-center mb-3">
                        <h3 className="text-success">{balance.available}</h3>
                        <small className="text-muted">Available Days</small>
                      </div>
                      
                      <ProgressBar 
                        now={usagePercentage} 
                        variant={usagePercentage > 80 ? 'danger' : usagePercentage > 60 ? 'warning' : 'success'}
                        className="mb-2"
                      />
                      
                      <Row className="text-center">
                        <Col xs={4}>
                          <small className="text-muted">Allocated</small>
                          <div className="fw-bold">{balance.allocated}</div>
                        </Col>
                        <Col xs={4}>
                          <small className="text-muted">Used</small>
                          <div className="fw-bold text-warning">{balance.used}</div>
                        </Col>
                        <Col xs={4}>
                          <small className="text-muted">Pending</small>
                          <div className="fw-bold text-info">{balance.pending}</div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Tab>

        {/* My Applications Tab */}
        <Tab eventKey="apply" title={
          <span>
            <FaCalendarPlus className="me-1" />
            My Applications
          </span>
        }>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Leave Applications</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Period</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Approved By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveApplications.filter(app => !isAdmin || app.employeeName === user.fullName).map((application) => {
                    const leaveTypeConfig = getLeaveTypeConfig(application.leaveType);
                    
                    return (
                      <tr key={application.id}>
                        <td>
                          <Badge bg={leaveTypeConfig.color}>
                            {leaveTypeConfig.label}
                          </Badge>
                        </td>
                        <td>
                          <div>
                            {new Date(application.startDate).toLocaleDateString()}
                            {application.startDate !== application.endDate && (
                              <> to {new Date(application.endDate).toLocaleDateString()}</>
                            )}
                            {application.isHalfDay && (
                              <small className="d-block text-muted">Half Day</small>
                            )}
                          </div>
                        </td>
                        <td>{application.totalDays} day(s)</td>
                        <td>
                          <div style={{ maxWidth: '200px' }}>
                            {application.reason.length > 50 
                              ? application.reason.substring(0, 50) + '...'
                              : application.reason
                            }
                          </div>
                        </td>
                        <td>{new Date(application.appliedOn).toLocaleDateString()}</td>
                        <td>{getStatusBadge(application.status)}</td>
                        <td>{application.approvedBy || '--'}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowDetailsModal(true);
                              }}
                            >
                              <FaEye />
                            </Button>
                            {application.status === 'PENDING' && (
                              <>
                                <Button variant="outline-warning" size="sm">
                                  <FaEdit />
                                </Button>
                                <Button variant="outline-danger" size="sm">
                                  <FaTrash />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Admin: All Applications Tab */}
        {isAdmin && (
          <Tab eventKey="manage" title={
            <span>
              <FaHourglassHalf className="me-1" />
              Manage Applications
            </span>
          }>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Pending Approvals</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>Period</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Applied On</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveApplications.map((application) => {
                      const leaveTypeConfig = getLeaveTypeConfig(application.leaveType);
                      
                      return (
                        <tr key={application.id}>
                          <td>
                            <div>
                              <strong>{application.employeeName}</strong>
                              <br />
                              <small className="text-muted">{application.employeeCode}</small>
                            </div>
                          </td>
                          <td>
                            <Badge bg={leaveTypeConfig.color}>
                              {leaveTypeConfig.label}
                            </Badge>
                          </td>
                          <td>
                            <div>
                              {new Date(application.startDate).toLocaleDateString()}
                              {application.startDate !== application.endDate && (
                                <> to {new Date(application.endDate).toLocaleDateString()}</>
                              )}
                              {application.isHalfDay && (
                                <small className="d-block text-muted">Half Day</small>
                              )}
                            </div>
                          </td>
                          <td>{application.totalDays} day(s)</td>
                          <td>
                            <div style={{ maxWidth: '200px' }}>
                              {application.reason.length > 50 
                                ? application.reason.substring(0, 50) + '...'
                                : application.reason
                              }
                            </div>
                          </td>
                          <td>{new Date(application.appliedOn).toLocaleDateString()}</td>
                          <td>{getStatusBadge(application.status)}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setShowDetailsModal(true);
                                }}
                              >
                                <FaEye />
                              </Button>
                              {application.status === 'PENDING' && (
                                <>
                                  <Button 
                                    variant="outline-success" 
                                    size="sm"
                                    onClick={() => handleApproveReject(application.id, 'approved', 'Approved')}
                                  >
                                    <FaCheckCircle />
                                  </Button>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleApproveReject(application.id, 'rejected', 'Rejected')}
                                  >
                                    <FaTimesCircle />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        )}
      </Tabs>

      {/* Leave Application Modal */}
      <Modal show={showApplicationModal} onHide={() => setShowApplicationModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Apply for Leave</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleApplicationSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Leave Type *</Form.Label>
                  <Form.Select
                    value={applicationForm.leaveType}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      leaveType: e.target.value
                    }))}
                    required
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Available Balance
                    {applicationForm.leaveType && (
                      <Badge bg="info" className="ms-2">
                        {leaveBalances.find(b => b.leaveType === applicationForm.leaveType)?.available || 0} days
                      </Badge>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={applicationForm.leaveType ? 
                      `${leaveBalances.find(b => b.leaveType === applicationForm.leaveType)?.available || 0} days available` 
                      : 'Select leave type first'}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={applicationForm.startDate}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      startDate: e.target.value,
                      endDate: prev.isHalfDay ? e.target.value : prev.endDate
                    }))}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={applicationForm.endDate}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      endDate: e.target.value
                    }))}
                    min={applicationForm.startDate || new Date().toISOString().split('T')[0]}
                    disabled={applicationForm.isHalfDay}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Half Day Leave"
                    checked={applicationForm.isHalfDay}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      isHalfDay: e.target.checked,
                      endDate: e.target.checked ? prev.startDate : prev.endDate
                    }))}
                  />
                  {applicationForm.isHalfDay && (
                    <Form.Select
                      className="mt-2"
                      value={applicationForm.halfDaySession}
                      onChange={(e) => setApplicationForm(prev => ({
                        ...prev,
                        halfDaySession: e.target.value
                      }))}
                    >
                      <option value="FIRST_HALF">First Half</option>
                      <option value="SECOND_HALF">Second Half</option>
                    </Form.Select>
                  )}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Alert variant="info">
                  <strong>Total Days:</strong> {calculateDays()} day(s)
                </Alert>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Reason *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={applicationForm.reason}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      reason: e.target.value
                    }))}
                    placeholder="Please provide reason for leave..."
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Emergency Contact</Form.Label>
                  <Form.Control
                    type="tel"
                    value={applicationForm.emergencyContact}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      emergencyContact: e.target.value
                    }))}
                    placeholder="Emergency contact number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address During Leave</Form.Label>
                  <Form.Control
                    type="text"
                    value={applicationForm.addressDuringLeave}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      addressDuringLeave: e.target.value
                    }))}
                    placeholder="Address where you'll be during leave"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowApplicationModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Application
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Application Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Leave Application Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplication && (
            <Row>
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Employee:</strong> {selectedApplication.employeeName}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Employee Code:</strong> {selectedApplication.employeeCode}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Leave Type:</strong> {getLeaveTypeConfig(selectedApplication.leaveType).label}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Period:</strong> {new Date(selectedApplication.startDate).toLocaleDateString()}
                    {selectedApplication.startDate !== selectedApplication.endDate && 
                      ` to ${new Date(selectedApplication.endDate).toLocaleDateString()}`
                    }
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Total Days:</strong> {selectedApplication.totalDays}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Applied On:</strong> {new Date(selectedApplication.appliedOn).toLocaleDateString()}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Status:</strong> {getStatusBadge(selectedApplication.status)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Approved By:</strong> {selectedApplication.approvedBy || 'Pending'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Half Day:</strong> {selectedApplication.isHalfDay ? 'Yes' : 'No'}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={12} className="mt-3">
                <Card>
                  <Card.Header>
                    <strong>Reason</strong>
                  </Card.Header>
                  <Card.Body>
                    {selectedApplication.reason}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LeaveManagement;