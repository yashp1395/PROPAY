import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Badge,
  Modal,
  Form,
  Alert,
  Pagination,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import api, { endpoints, formatCurrency } from '../services/api';
import Loading from '../components/common/Loading';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    position: '',
    baseSalary: '',
    departmentId: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: ''
  });
  
  // Search functionality
  const [searchType, setSearchType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get(endpoints.employees);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get(endpoints.departments);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    }
  };
  
  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchEmployees();
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    setLoading(true);
    
    try {
      let response;
      switch (searchType) {
        case 'name':
          response = await api.get(`/admin/employees/search/name?name=${encodeURIComponent(searchQuery)}`);
          break;
        case 'id':
          response = await api.get(`/admin/employees/search/id/${searchQuery}`);
          setEmployees([response.data]);
          setLoading(false);
          return;
        case 'code':
          response = await api.get(`/admin/employees/search/code?code=${encodeURIComponent(searchQuery)}`);
          break;
        case 'department':
          response = await api.get(`/admin/employees/search/department?deptName=${encodeURIComponent(searchQuery)}`);
          break;
        default:
          response = await api.get(`${endpoints.employeesSearch}?keyword=${encodeURIComponent(searchQuery)}`);
      }
      setEmployees(response.data.content || response.data);
    } catch (error) {
      console.error('Error searching employees:', error);
      toast.error('Search failed');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    fetchEmployees();
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      position: '',
      baseSalary: '',
      departmentId: '',
      phoneNumber: '',
      address: '',
      dateOfBirth: ''
    });
    setShowModal(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      password: '', // Don't populate password for editing
      position: employee.position || '',
      baseSalary: employee.baseSalary || '',
      departmentId: employee.departmentId || '',
      phoneNumber: employee.phoneNumber || '',
      address: employee.address || '',
      dateOfBirth: employee.dateOfBirth || ''
    });
    setShowModal(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`${endpoints.employees}/${employeeId}`);
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await api.put(`${endpoints.employees}/${editingEmployee.employeeId}`, formData);
        toast.success('Employee updated successfully');
      } else {
        await api.post(endpoints.employees, formData);
        toast.success('Employee created successfully');
      }
      setShowModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error(error.response?.data?.message || 'Failed to save employee');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <Loading text="Loading employees..." />;
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-0">Employee Management</h1>
          <p className="text-muted">Manage your organization's employees</p>
        </div>
        <Button variant="primary" onClick={handleAddEmployee}>
          <FaPlus className="me-2" />
          Add Employee
        </Button>
      </div>

      {/* Search Section */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="all">All Fields</option>
                <option value="name">Name</option>
                <option value="id">Employee ID</option>
                <option value="code">Employee Code</option>
                <option value="department">Department</option>
              </Form.Select>
            </Col>
            <Col md={7}>
              <InputGroup>
                <FormControl
                  placeholder={
                    searchType === 'id' ? 'Enter employee ID...' :
                    searchType === 'code' ? 'Enter employee code...' :
                    searchType === 'name' ? 'Enter employee name...' :
                    searchType === 'department' ? 'Enter department name...' :
                    'Search by name, code, email, or department...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="primary" onClick={handleSearch}>
                  <FaSearch className="me-2" />
                  Search
                </Button>
                {isSearching && (
                  <Button variant="outline-secondary" onClick={handleClearSearch}>
                    Clear
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col md={2}>
              <div className="text-muted small">
                {isSearching && `Found ${employees.length} results`}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">
            {isSearching ? `Search Results (${employees.length})` : `All Employees (${employees.length})`}
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {employees.length === 0 ? (
            <div className="empty-state">
              <h3>No employees found</h3>
              <p>Start by adding your first employee to the system.</p>
              <Button variant="primary" onClick={handleAddEmployee}>
                <FaPlus className="me-2" />
                Add First Employee
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover className="mb-0">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.employeeId}>
                      <td>
                        <strong>{employee.employeeCode}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{employee.fullName}</strong>
                          <br />
                          <small className="text-muted">{employee.phoneNumber}</small>
                        </div>
                      </td>
                      <td>{employee.email}</td>
                      <td>
                        <Badge bg="secondary">{employee.departmentName}</Badge>
                      </td>
                      <td>{employee.position || 'N/A'}</td>
                      <td>
                        {employee.baseSalary ? 
                          `$${employee.baseSalary.toLocaleString()}` : 
                          'Not set'
                        }
                      </td>
                      <td>
                        <Badge bg={employee.isActive ? 'success' : 'danger'}>
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.employeeId)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Employee Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {editingEmployee ? 'New Password (leave blank to keep current)' : 'Password'}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingEmployee}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.deptId} value={dept.deptId}>
                        {dept.deptName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Position</Form.Label>
                  <Form.Control
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Salary</Form.Label>
                  <Form.Control
                    type="number"
                    name="baseSalary"
                    value={formData.baseSalary}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingEmployee ? 'Update Employee' : 'Add Employee'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Employees;