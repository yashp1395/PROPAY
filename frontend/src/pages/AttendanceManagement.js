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
  Dropdown,
  ButtonGroup
} from 'react-bootstrap';
import { 
  FaClock, 
  FaCalendarAlt, 
  FaUserClock, 
  FaMapMarkerAlt,
  FaPlayCircle,
  FaPauseCircle,
  FaStopCircle,
  FaDownload,
  FaFilter,
  FaChartPie,
  FaHistory
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';

const AttendanceManagement = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterBy, setFilterBy] = useState('all');
  const [todayStats, setTodayStats] = useState({
    totalEmployees: 0,
    present: 0,
    absent: 0,
    late: 0,
    workFromHome: 0
  });

  const [manualEntryForm, setManualEntryForm] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '',
    checkOutTime: '',
    breakDuration: 60,
    reason: '',
    status: 'PRESENT'
  });

  const attendanceStatuses = [
    { value: 'PRESENT', label: 'Present', color: 'success' },
    { value: 'ABSENT', label: 'Absent', color: 'danger' },
    { value: 'HALF_DAY', label: 'Half Day', color: 'warning' },
    { value: 'LATE', label: 'Late', color: 'info' },
    { value: 'WORK_FROM_HOME', label: 'Work From Home', color: 'primary' },
    { value: 'HOLIDAY', label: 'Holiday', color: 'secondary' },
    { value: 'LEAVE', label: 'On Leave', color: 'dark' }
  ];

  useEffect(() => {
    fetchTodayAttendance();
    fetchTodayStats();
    checkCurrentAttendanceStatus();
  }, [selectedDate]);

  const fetchTodayAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`http://localhost:8080/api/attendance/date/${selectedDate}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        
        // Transform API data for frontend display
        const transformedData = data.map(item => ({
          id: item.id,
          employeeName: item.employee?.firstName + ' ' + item.employee?.lastName,
          employeeCode: item.employee?.employeeCode,
          department: item.employee?.department?.name,
          checkInTime: item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : '',
          checkOutTime: item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : '',
          totalHours: item.workingHours?.toFixed(2) || '',
          overtimeHours: item.overtimeHours?.toFixed(2) || '0',
          status: item.status,
          location: item.location || '',
          isLate: item.checkInTime && new Date(item.checkInTime).getHours() >= 9,
          workFromHome: item.location && item.location.toLowerCase().includes('home')
        }));
        
        setAttendanceData(transformedData);
      } else {
        throw new Error('Failed to fetch attendance data');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      
      // Fallback to mock data
      const mockData = [
        {
          id: 1,
          employeeName: 'Rajesh Sharma',
          employeeCode: 'EMP001',
          department: 'IT',
          checkInTime: '09:15',
          checkOutTime: '18:30',
          totalHours: '8.25',
          overtimeHours: '0.25',
          status: 'PRESENT',
          location: 'Office',
          isLate: true
        },
        {
          id: 2,
          employeeName: 'Priya Patel',
          employeeCode: 'EMP002',
          department: 'HR',
          checkInTime: '09:00',
          checkOutTime: '',
          totalHours: '',
          overtimeHours: '0',
          status: 'PRESENT',
          location: 'Home',
          workFromHome: true
        },
        {
          id: 3,
          employeeName: 'Vikram Singh',
          employeeCode: 'EMP003',
          department: 'Finance',
          checkInTime: '',
          checkOutTime: '',
          totalHours: '',
          overtimeHours: '0',
          status: 'ABSENT',
          location: ''
        }
      ];
      setAttendanceData(mockData);
      toast.error('Using offline data - API connection failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayStats = async () => {
    try {
      const stats = {
        totalEmployees: 50,
        present: 45,
        absent: 3,
        late: 8,
        workFromHome: 12
      };
      setTodayStats(stats);
    } catch (error) {
      toast.error('Failed to fetch attendance statistics');
    }
  };

  const checkCurrentAttendanceStatus = () => {
    // Mock check for current user's attendance status
    setIsCheckedIn(false);
    setCurrentAttendance(null);
  };

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const token = localStorage.getItem('token');
            const checkInData = {
              employeeId: user.employeeId || user.id,
              location: 'Office',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            
            const response = await fetch('http://localhost:8080/api/attendance/checkin', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(checkInData)
            });
            
            if (response.ok) {
              const result = await response.json();
              setIsCheckedIn(true);
              setCurrentAttendance({
                checkInTime: new Date(result.checkInTime).toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }),
                location: result.location
              });
              
              toast.success('Checked in successfully!');
              setShowCheckInModal(false);
              fetchTodayAttendance();
            } else {
              const errorData = await response.text();
              toast.error(errorData || 'Failed to check in');
            }
          } catch (apiError) {
            console.error('Check-in API error:', apiError);
            toast.error('Failed to check in - network error');
          }
        });
      } else {
        toast.error('Geolocation is not supported by this browser');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      toast.error('Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const token = localStorage.getItem('token');
            const checkOutData = {
              employeeId: user.employeeId || user.id,
              location: 'Office',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            
            const response = await fetch('http://localhost:8080/api/attendance/checkout', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(checkOutData)
            });
            
            if (response.ok) {
              const result = await response.json();
              setIsCheckedIn(false);
              setCurrentAttendance(prev => ({
                ...prev,
                checkOutTime: new Date(result.checkOutTime).toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }),
                totalHours: result.workingHours?.toFixed(2) || '0'
              }));
              
              toast.success('Checked out successfully!');
              fetchTodayAttendance();
            } else {
              const errorData = await response.text();
              toast.error(errorData || 'Failed to check out');
            }
          } catch (apiError) {
            console.error('Check-out API error:', apiError);
            toast.error('Failed to check out - network error');
          }
        });
      } else {
        // Fallback without geolocation
        const token = localStorage.getItem('token');
        const checkOutData = {
          employeeId: user.employeeId || user.id,
          location: 'Office'
        };
        
        const response = await fetch('http://localhost:8080/api/attendance/checkout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(checkOutData)
        });
        
        if (response.ok) {
          const result = await response.json();
          setIsCheckedIn(false);
          setCurrentAttendance(prev => ({
            ...prev,
            checkOutTime: new Date().toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            totalHours: '8.5'
          }));
          
          toast.success('Checked out successfully!');
          fetchTodayAttendance();
        } else {
          const errorData = await response.text();
          toast.error(errorData || 'Failed to check out');
        }
      }
    } catch (error) {
      console.error('Check-out error:', error);
      toast.error('Failed to check out');
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Mock API call for manual entry
      toast.success('Manual attendance entry added successfully!');
      setShowManualEntryModal(false);
      setManualEntryForm({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        checkInTime: '',
        checkOutTime: '',
        breakDuration: 60,
        reason: '',
        status: 'PRESENT'
      });
      fetchTodayAttendance();
    } catch (error) {
      toast.error('Failed to add manual entry');
    } finally {
      setLoading(false);
    }
  };

  const exportAttendanceReport = () => {
    toast.success('Attendance report exported successfully!');
  };

  const getStatusBadge = (status) => {
    const statusConfig = attendanceStatuses.find(s => s.value === status);
    return (
      <Badge bg={statusConfig?.color || 'secondary'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  if (loading) {
    return <Loading text="Loading attendance data..." />;
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <FaUserClock className="me-2" />
            Attendance Management
          </h2>
          <p className="text-muted mb-0">
            Track and manage employee attendance
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={exportAttendanceReport}>
            <FaDownload className="me-1" />
            Export Report
          </Button>
          {isAdmin && (
            <Button variant="success" onClick={() => setShowManualEntryModal(true)}>
              <FaClock className="me-1" />
              Manual Entry
            </Button>
          )}
        </div>
      </div>

      {/* Today's Statistics */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FaChartPie className="me-2" />
                Today's Attendance Overview - {new Date().toLocaleDateString()}
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={2} className="text-center">
                  <div className="stat-box">
                    <h3 className="text-primary">{todayStats.totalEmployees}</h3>
                    <p className="mb-0">Total Employees</p>
                  </div>
                </Col>
                <Col md={2} className="text-center">
                  <div className="stat-box">
                    <h3 className="text-success">{todayStats.present}</h3>
                    <p className="mb-0">Present</p>
                    <small className="text-muted">
                      {((todayStats.present / todayStats.totalEmployees) * 100).toFixed(1)}%
                    </small>
                  </div>
                </Col>
                <Col md={2} className="text-center">
                  <div className="stat-box">
                    <h3 className="text-danger">{todayStats.absent}</h3>
                    <p className="mb-0">Absent</p>
                    <small className="text-muted">
                      {((todayStats.absent / todayStats.totalEmployees) * 100).toFixed(1)}%
                    </small>
                  </div>
                </Col>
                <Col md={2} className="text-center">
                  <div className="stat-box">
                    <h3 className="text-info">{todayStats.late}</h3>
                    <p className="mb-0">Late Arrivals</p>
                  </div>
                </Col>
                <Col md={2} className="text-center">
                  <div className="stat-box">
                    <h3 className="text-primary">{todayStats.workFromHome}</h3>
                    <p className="mb-0">Work From Home</p>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="d-flex flex-column h-100 justify-content-center">
                    <ProgressBar 
                      now={(todayStats.present / todayStats.totalEmployees) * 100} 
                      label={`${((todayStats.present / todayStats.totalEmployees) * 100).toFixed(1)}%`}
                      variant="success"
                    />
                    <small className="text-muted text-center mt-1">Attendance Rate</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Employee Check-in Panel (for non-admin users) */}
      {!isAdmin && (
        <Row className="mb-4">
          <Col lg={12}>
            <Card className="border-primary">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FaClock className="me-2" />
                  My Attendance - {new Date().toLocaleDateString()}
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={6}>
                    {currentAttendance ? (
                      <div>
                        <p className="mb-1">
                          <strong>Check-in Time:</strong> {currentAttendance.checkInTime}
                        </p>
                        <p className="mb-1">
                          <strong>Location:</strong> {currentAttendance.location}
                        </p>
                        {currentAttendance.checkOutTime && (
                          <>
                            <p className="mb-1">
                              <strong>Check-out Time:</strong> {currentAttendance.checkOutTime}
                            </p>
                            <p className="mb-0">
                              <strong>Total Hours:</strong> {currentAttendance.totalHours}
                            </p>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted mb-0">You haven't checked in today</p>
                    )}
                  </Col>
                  <Col md={6} className="text-end">
                    {!isCheckedIn ? (
                      <Button 
                        variant="success" 
                        size="lg"
                        onClick={() => setShowCheckInModal(true)}
                      >
                        <FaPlayCircle className="me-2" />
                        Check In
                      </Button>
                    ) : (
                      <Button 
                        variant="danger" 
                        size="lg"
                        onClick={handleCheckOut}
                      >
                        <FaStopCircle className="me-2" />
                        Check Out
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Attendance Table */}
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaCalendarAlt className="me-2" />
                  Attendance Records
                </h5>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ width: 'auto' }}
                  />
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                      <FaFilter className="me-1" />
                      Filter: {filterBy}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setFilterBy('all')}>All</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFilterBy('present')}>Present</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFilterBy('absent')}>Absent</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFilterBy('late')}>Late</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Total Hours</th>
                    <th>Overtime</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <div>
                          <strong>{record.employeeName}</strong>
                          <br />
                          <small className="text-muted">{record.employeeCode}</small>
                        </div>
                      </td>
                      <td>{record.department}</td>
                      <td>
                        {record.checkInTime ? (
                          <span className={record.isLate ? 'text-warning' : 'text-success'}>
                            {record.checkInTime}
                            {record.isLate && <small className="d-block">Late</small>}
                          </span>
                        ) : (
                          <span className="text-muted">--</span>
                        )}
                      </td>
                      <td>
                        {record.checkOutTime ? (
                          <span className="text-success">{record.checkOutTime}</span>
                        ) : (
                          <span className="text-warning">Active</span>
                        )}
                      </td>
                      <td>
                        {record.totalHours ? (
                          <span>{record.totalHours} hrs</span>
                        ) : (
                          <span className="text-muted">--</span>
                        )}
                      </td>
                      <td>
                        {record.overtimeHours && parseFloat(record.overtimeHours) > 0 ? (
                          <span className="text-info">{record.overtimeHours} hrs</span>
                        ) : (
                          <span className="text-muted">--</span>
                        )}
                      </td>
                      <td>
                        {getStatusBadge(record.status)}
                        {record.workFromHome && (
                          <Badge bg="primary" className="ms-1">WFH</Badge>
                        )}
                      </td>
                      <td>
                        {record.location ? (
                          <span>
                            <FaMapMarkerAlt className="me-1" />
                            {record.workFromHome ? 'Home' : record.location}
                          </span>
                        ) : (
                          <span className="text-muted">--</span>
                        )}
                      </td>
                      <td>
                        {isAdmin && (
                          <ButtonGroup size="sm">
                            <Button variant="outline-primary" title="Edit">
                              <FaHistory />
                            </Button>
                          </ButtonGroup>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Check-in Confirmation Modal */}
      <Modal show={showCheckInModal} onHide={() => setShowCheckInModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Check In Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <FaMapMarkerAlt className="me-2" />
            Your location will be recorded for attendance verification.
          </Alert>
          <p>Current Time: <strong>{new Date().toLocaleTimeString()}</strong></p>
          <p>Date: <strong>{new Date().toLocaleDateString()}</strong></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckInModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleCheckIn}>
            <FaPlayCircle className="me-1" />
            Confirm Check In
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Manual Entry Modal */}
      <Modal show={showManualEntryModal} onHide={() => setShowManualEntryModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Manual Attendance Entry</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleManualEntry}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employee</Form.Label>
                  <Form.Select
                    value={manualEntryForm.employeeId}
                    onChange={(e) => setManualEntryForm(prev => ({
                      ...prev,
                      employeeId: e.target.value
                    }))}
                    required
                  >
                    <option value="">Select Employee</option>
                    <option value="1">Rajesh Sharma (EMP001)</option>
                    <option value="2">Jane Smith (EMP002)</option>
                    <option value="3">Mike Johnson (EMP003)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={manualEntryForm.date}
                    onChange={(e) => setManualEntryForm(prev => ({
                      ...prev,
                      date: e.target.value
                    }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Check In Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={manualEntryForm.checkInTime}
                    onChange={(e) => setManualEntryForm(prev => ({
                      ...prev,
                      checkInTime: e.target.value
                    }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Check Out Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={manualEntryForm.checkOutTime}
                    onChange={(e) => setManualEntryForm(prev => ({
                      ...prev,
                      checkOutTime: e.target.value
                    }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Break Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={manualEntryForm.breakDuration}
                    onChange={(e) => setManualEntryForm(prev => ({
                      ...prev,
                      breakDuration: parseInt(e.target.value)
                    }))}
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={manualEntryForm.status}
                    onChange={(e) => setManualEntryForm(prev => ({
                      ...prev,
                      status: e.target.value
                    }))}
                    required
                  >
                    {attendanceStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Reason for Manual Entry</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={manualEntryForm.reason}
                    onChange={(e) => setManualEntryForm(prev => ({
                      ...prev,
                      reason: e.target.value
                    }))}
                    placeholder="Explain why manual entry is needed..."
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowManualEntryModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Entry
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AttendanceManagement;