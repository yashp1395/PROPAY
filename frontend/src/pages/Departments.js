import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  InputGroup
} from 'react-bootstrap';
import { departmentService } from '../services/employeeService';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import { FaBuilding, FaPlus, FaEdit, FaTrash, FaUsers, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Departments = () => {
  const { isAdmin } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    budget: '',
    location: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockDepartments = [
        {
          id: 1,
          name: 'Information Technology',
          description: 'Manages all technology infrastructure and software development',
          manager: 'Vikram Singh',
          employeeCount: 15,
          budget: 500000,
          location: 'Building A, Floor 3',
          status: 'Active'
        },
        {
          id: 2,
          name: 'Human Resources',
          description: 'Handles employee relations, recruitment, and organizational development',
          manager: 'Priya Patel',
          employeeCount: 8,
          budget: 200000,
          location: 'Building B, Floor 1',
          status: 'Active'
        },
        {
          id: 3,
          name: 'Finance',
          description: 'Manages company finances, accounting, and financial planning',
          manager: 'Michael Brown',
          employeeCount: 12,
          budget: 300000,
          location: 'Building A, Floor 2',
          status: 'Active'
        },
        {
          id: 4,
          name: 'Marketing',
          description: 'Handles brand management, advertising, and customer engagement',
          manager: 'Neha Gupta',
          employeeCount: 10,
          budget: 250000,
          location: 'Building C, Floor 1',
          status: 'Active'
        },
        {
          id: 5,
          name: 'Operations',
          description: 'Oversees daily operations and process optimization',
          manager: 'Amit Kumar',
          employeeCount: 20,
          budget: 400000,
          location: 'Building A, Floor 1',
          status: 'Active'
        }
      ];
      
      setDepartments(mockDepartments);
    } catch (error) {
      toast.error('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        // Update department
        const updatedDepartment = { ...editingDepartment, ...formData };
        setDepartments(departments.map(dept => 
          dept.id === editingDepartment.id ? updatedDepartment : dept
        ));
        toast.success('Department updated successfully');
      } else {
        // Create new department
        const newDepartment = {
          id: Date.now(),
          ...formData,
          employeeCount: 0,
          status: 'Active'
        };
        setDepartments([...departments, newDepartment]);
        toast.success('Department created successfully');
      }
      
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save department');
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      manager: department.manager,
      budget: department.budget,
      location: department.location
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        setDepartments(departments.filter(dept => dept.id !== id));
        toast.success('Department deleted successfully');
      } catch (error) {
        toast.error('Failed to delete department');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDepartment(null);
    setFormData({
      name: '',
      description: '',
      manager: '',
      budget: '',
      location: ''
    });
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading text="Loading departments..." />;
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-0">
            <FaBuilding className="me-2" />
            Departments
          </h1>
          <p className="text-muted">Manage company departments and organizational structure</p>
        </div>
        {isAdmin() && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" />
            Add Department
          </Button>
        )}
      </div>

      {/* Search and Stats */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <div className="d-flex gap-3">
            <Card className="flex-fill text-center">
              <Card.Body className="py-2">
                <h4 className="text-primary mb-0">{departments.length}</h4>
                <small className="text-muted">Total Departments</small>
              </Card.Body>
            </Card>
            <Card className="flex-fill text-center">
              <Card.Body className="py-2">
                <h4 className="text-success mb-0">
                  {departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}
                </h4>
                <small className="text-muted">Total Employees</small>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Departments Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Department List ({filteredDepartments.length})</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredDepartments.length === 0 ? (
            <div className="empty-state">
              <FaBuilding size={48} className="text-muted mb-3" />
              <h3>No departments found</h3>
              <p>
                {searchTerm 
                  ? 'No departments match your search criteria.' 
                  : 'No departments have been created yet.'
                }
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover className="mb-0">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Manager</th>
                    <th>Employees</th>
                    <th>Budget</th>
                    <th>Location</th>
                    <th>Status</th>
                    {isAdmin() && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((department) => (
                    <tr key={department.id}>
                      <td>
                        <div>
                          <strong>{department.name}</strong>
                          <br />
                          <small className="text-muted">{department.description}</small>
                        </div>
                      </td>
                      <td>{department.manager}</td>
                      <td>
                        <Badge bg="info">
                          <FaUsers className="me-1" />
                          {department.employeeCount}
                        </Badge>
                      </td>
                      <td>${department.budget?.toLocaleString()}</td>
                      <td>{department.location}</td>
                      <td>
                        <Badge bg={department.status === 'Active' ? 'success' : 'secondary'}>
                          {department.status}
                        </Badge>
                      </td>
                      {isAdmin() && (
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(department)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(department.id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Department Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDepartment ? 'Edit Department' : 'Add New Department'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Department Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Manager *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Budget</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingDepartment ? 'Update' : 'Create'} Department
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Departments;