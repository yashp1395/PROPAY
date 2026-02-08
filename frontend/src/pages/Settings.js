import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Badge,
  ListGroup
} from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { FaSun, FaMoon, FaCog, FaUser, FaBell, FaLock, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    payslipNotifications: true,
    monthlyReports: true,
    language: 'en',
    timezone: 'Asia/Kolkata',
    currency: 'INR'
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, you would save these to the backend
    toast.success('Settings saved successfully!');
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <FaCog className="me-2" />
            Settings
          </h2>
          <p className="text-muted mb-0">Manage your application preferences</p>
        </div>
      </div>

      <Row>
        <Col lg={8}>
          {/* Theme Settings */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaSun className="me-2" />
                Appearance
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Theme</Form.Label>
                    <div className="d-flex gap-3">
                      <Button
                        variant={!isDarkMode ? "primary" : "outline-primary"}
                        onClick={() => isDarkMode && toggleTheme()}
                        className="d-flex align-items-center"
                      >
                        <FaSun className="me-2" />
                        Light
                      </Button>
                      <Button
                        variant={isDarkMode ? "primary" : "outline-primary"}
                        onClick={() => !isDarkMode && toggleTheme()}
                        className="d-flex align-items-center"
                      >
                        <FaMoon className="me-2" />
                        Dark
                      </Button>
                    </div>
                    <Form.Text className="text-muted">
                      Choose your preferred theme for the application
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Language</Form.Label>
                    <Form.Select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Regional Settings */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaCog className="me-2" />
                Regional Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Timezone</Form.Label>
                    <Form.Select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="Asia/Mumbai">Asia/Mumbai (IST)</option>
                      <option value="Asia/Delhi">Asia/Delhi (IST)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Currency</Form.Label>
                    <Form.Select
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Notification Settings */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaBell className="me-2" />
                Notifications
              </h5>
            </Card.Header>
            <Card.Body>
              <Form.Check
                type="switch"
                id="email-notifications"
                label="Email Notifications"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="mb-3"
              />
              <Form.Check
                type="switch"
                id="payslip-notifications"
                label="Payslip Generated Notifications"
                checked={settings.payslipNotifications}
                onChange={(e) => handleSettingChange('payslipNotifications', e.target.checked)}
                className="mb-3"
              />
              <Form.Check
                type="switch"
                id="monthly-reports"
                label="Monthly Salary Reports"
                checked={settings.monthlyReports}
                onChange={(e) => handleSettingChange('monthlyReports', e.target.checked)}
                className="mb-3"
              />
            </Card.Body>
          </Card>

          {/* Privacy & Security */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaLock className="me-2" />
                Privacy & Security
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Change Password</h6>
                      <small className="text-muted">Update your account password</small>
                    </div>
                    <Button variant="outline-secondary" size="sm">
                      Change
                    </Button>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Two-Factor Authentication</h6>
                      <small className="text-muted">Add an extra layer of security</small>
                    </div>
                    <Badge bg="secondary">Coming Soon</Badge>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Login Sessions</h6>
                      <small className="text-muted">Manage your active sessions</small>
                    </div>
                    <Button variant="outline-secondary" size="sm">
                      View
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={handleSaveSettings}>
              <FaSave className="me-2" />
              Save Settings
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          {/* User Info Card */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaUser className="me-2" />
                Profile Information
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <div 
                  className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                  style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                >
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <h6 className="mt-2 mb-1">{user?.fullName || `${user?.firstName} ${user?.lastName}`}</h6>
                <small className="text-muted">{user?.email}</small>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0 py-2">
                  <small className="text-muted">Employee ID</small>
                  <div>{user?.employeeCode}</div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2">
                  <small className="text-muted">Department</small>
                  <div>{user?.departmentName}</div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2">
                  <small className="text-muted">Role</small>
                  <div>
                    <Badge bg={user?.role === 'ADMIN' ? 'danger' : 'primary'}>
                      {user?.role}
                    </Badge>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="sm">
                  Export Data
                </Button>
                <Button variant="outline-secondary" size="sm">
                  Download Reports
                </Button>
                <Button variant="outline-info" size="sm">
                  Contact Support
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;