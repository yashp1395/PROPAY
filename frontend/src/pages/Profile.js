import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Tab,
  Tabs,
  Alert
} from 'react-bootstrap';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    department: '',
    position: '',
    joinDate: '',
    salary: ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        department: user.department || '',
        position: user.position || '',
        joinDate: user.joinDate || '',
        salary: user.salary || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedProfile = await employeeService.updateEmployee(user.employeeId, profile);
      updateUser(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await employeeService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!user) {
    return <Loading text="Loading profile..." />;
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-0">
            <FaUser className="me-2" />
            My Profile
          </h1>
          <p className="text-muted">Manage your personal information and account settings</p>
        </div>
      </div>

      <Row>
        <Col lg={8} className="mx-auto">
          <Card>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab eventKey="profile" title="Personal Information">
                  <Form onSubmit={handleProfileSubmit}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            <FaUser className="me-2" />
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={profile.fullName}
                            onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            <FaEnvelope className="me-2" />
                            Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            <FaPhone className="me-2" />
                            Phone Number
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            value={profile.phoneNumber}
                            onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Department</Form.Label>
                          <Form.Control
                            type="text"
                            value={profile.department}
                            onChange={(e) => setProfile({...profile, department: e.target.value})}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Position</Form.Label>
                          <Form.Control
                            type="text"
                            value={profile.position}
                            onChange={(e) => setProfile({...profile, position: e.target.value})}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Join Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={profile.joinDate}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>
                            <FaMapMarkerAlt className="me-2" />
                            Address
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={profile.address}
                            onChange={(e) => setProfile({...profile, address: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        <FaSave className="me-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </Form>
                </Tab>

                <Tab eventKey="security" title="Security">
                  <Alert variant="info">
                    <strong>Change Password</strong>
                    <p className="mb-0 mt-2">
                      Choose a strong password that includes uppercase and lowercase letters, 
                      numbers, and special characters.
                    </p>
                  </Alert>

                  <Form onSubmit={handlePasswordSubmit}>
                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Current Password</Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              type={showPasswords.current ? "text" : "password"}
                              value={passwords.currentPassword}
                              onChange={(e) => setPasswords({
                                ...passwords, 
                                currentPassword: e.target.value
                              })}
                              required
                            />
                            <Button
                              variant="link"
                              className="position-absolute end-0 top-50 translate-middle-y pe-3"
                              style={{ border: 'none', background: 'none' }}
                              onClick={() => togglePasswordVisibility('current')}
                              type="button"
                            >
                              {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>New Password</Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              type={showPasswords.new ? "text" : "password"}
                              value={passwords.newPassword}
                              onChange={(e) => setPasswords({
                                ...passwords, 
                                newPassword: e.target.value
                              })}
                              minLength={6}
                              required
                            />
                            <Button
                              variant="link"
                              className="position-absolute end-0 top-50 translate-middle-y pe-3"
                              style={{ border: 'none', background: 'none' }}
                              onClick={() => togglePasswordVisibility('new')}
                              type="button"
                            >
                              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Confirm New Password</Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwords.confirmPassword}
                              onChange={(e) => setPasswords({
                                ...passwords, 
                                confirmPassword: e.target.value
                              })}
                              minLength={6}
                              required
                            />
                            <Button
                              variant="link"
                              className="position-absolute end-0 top-50 translate-middle-y pe-3"
                              style={{ border: 'none', background: 'none' }}
                              onClick={() => togglePasswordVisibility('confirm')}
                              type="button"
                            >
                              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                          </div>
                          {passwords.newPassword && passwords.confirmPassword && 
                           passwords.newPassword !== passwords.confirmPassword && (
                            <Form.Text className="text-danger">
                              Passwords do not match
                            </Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading || passwords.newPassword !== passwords.confirmPassword}
                      >
                        <FaSave className="me-2" />
                        {loading ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;