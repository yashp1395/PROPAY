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
  Dropdown,
  ButtonGroup
} from 'react-bootstrap';
import { 
  FaFileUpload, 
  FaDownload, 
  FaEye, 
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaFolder,
  FaSearch,
  FaFilter,
  FaFileAlt,
  FaFileImage,
  FaFilePdf
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';

const DocumentManagement = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('my-documents');
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadForm, setUploadForm] = useState({
    documentType: '',
    title: '',
    description: '',
    file: null,
    employeeId: user.employeeId || user.id
  });

  const documentTypes = [
    { value: 'AADHAR', label: 'Aadhar Card', required: true },
    { value: 'PAN', label: 'PAN Card', required: true },
    { value: 'PASSPORT', label: 'Passport', required: false },
    { value: 'DRIVING_LICENSE', label: 'Driving License', required: false },
    { value: 'BANK_PASSBOOK', label: 'Bank Passbook', required: true },
    { value: 'EDUCATION_CERTIFICATE', label: 'Education Certificate', required: true },
    { value: 'EXPERIENCE_LETTER', label: 'Experience Letter', required: false },
    { value: 'RELIEVING_LETTER', label: 'Relieving Letter', required: false },
    { value: 'SALARY_SLIP', label: 'Previous Salary Slip', required: false },
    { value: 'MEDICAL_CERTIFICATE', label: 'Medical Certificate', required: false },
    { value: 'PHOTO', label: 'Passport Photo', required: true },
    { value: 'RESUME', label: 'Resume/CV', required: true },
    { value: 'OTHER', label: 'Other Documents', required: false }
  ];

  const documentStatuses = [
    { value: 'PENDING', label: 'Pending Verification', color: 'warning' },
    { value: 'VERIFIED', label: 'Verified', color: 'success' },
    { value: 'REJECTED', label: 'Rejected', color: 'danger' },
    { value: 'EXPIRED', label: 'Expired', color: 'secondary' }
  ];

  useEffect(() => {
    fetchDocuments();
  }, [activeTab]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      let url = `http://localhost:8080/api/documents/employee/${user.employeeId || user.id}`;
      if (activeTab === 'all-documents' && isAdmin) {
        url = 'http://localhost:8080/api/documents';
      } else if (activeTab === 'pending-verification' && isAdmin) {
        url = 'http://localhost:8080/api/documents/status/PENDING';
      }

      const response = await fetch(url, { headers });

      if (response.ok) {
        const data = await response.json();
        const transformedDocuments = data.map(doc => ({
          id: doc.id,
          employeeName: doc.employee ? `${doc.employee.firstName} ${doc.employee.lastName}` : 'Unknown',
          employeeCode: doc.employee?.employeeCode || '',
          documentType: doc.documentType,
          title: doc.title,
          description: doc.description,
          fileName: doc.fileName,
          filePath: doc.filePath,
          fileSize: doc.fileSize,
          status: doc.status,
          uploadDate: new Date(doc.uploadDate).toLocaleDateString('en-IN'),
          verifiedBy: doc.verifiedBy ? `${doc.verifiedBy.firstName} ${doc.verifiedBy.lastName}` : null,
          verificationDate: doc.verificationDate ? new Date(doc.verificationDate).toLocaleDateString('en-IN') : null,
          comments: doc.comments
        }));
        setDocuments(transformedDocuments);
      } else {
        throw new Error('Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      
      // Fallback to mock data
      const mockDocuments = [
        {
          id: 1,
          employeeName: 'Rajesh Sharma',
          employeeCode: 'EMP001',
          documentType: 'AADHAR',
          title: 'Aadhar Card',
          description: 'Government ID proof',
          fileName: 'aadhar_rajesh_sharma.pdf',
          fileSize: '245 KB',
          status: 'VERIFIED',
          uploadDate: '15/09/2025',
          verifiedBy: 'HR Manager',
          verificationDate: '16/09/2025',
          comments: 'Document verified successfully'
        },
        {
          id: 2,
          employeeName: 'Priya Patel',
          employeeCode: 'EMP002',
          documentType: 'PAN',
          title: 'PAN Card',
          description: 'Tax identification document',
          fileName: 'pan_priya_patel.pdf',
          fileSize: '189 KB',
          status: 'PENDING',
          uploadDate: '20/09/2025',
          verifiedBy: null,
          verificationDate: null,
          comments: null
        }
      ];
      setDocuments(mockDocuments);
      toast.error('Using offline data - API connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (!uploadForm.file) {
        toast.error('Please select a file to upload');
        return;
      }

      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('documentType', uploadForm.documentType);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('employeeId', uploadForm.employeeId);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Document uploaded successfully!');
        setShowUploadModal(false);
        fetchDocuments();
        resetUploadForm();
      } else {
        const errorData = await response.text();
        toast.error(errorData || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Document upload error:', error);
      toast.error('Failed to upload document - network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentVerification = async (documentId, status, comments) => {
    try {
      const token = localStorage.getItem('token');
      const verificationData = {
        status: status,
        comments: comments,
        verifierId: user.id
      };

      const response = await fetch(`http://localhost:8080/api/documents/${documentId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(verificationData)
      });

      if (response.ok) {
        toast.success(`Document ${status.toLowerCase()} successfully!`);
        fetchDocuments();
      } else {
        const errorData = await response.text();
        toast.error(errorData || 'Failed to update document status');
      }
    } catch (error) {
      console.error('Document verification error:', error);
      toast.error('Failed to verify document - network error');
    }
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/documents/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Document downloaded successfully!');
      } else {
        toast.error('Failed to download document');
      }
    } catch (error) {
      console.error('Document download error:', error);
      toast.error('Failed to download document - network error');
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      documentType: '',
      title: '',
      description: '',
      file: null,
      employeeId: user.employeeId || user.id
    });
  };

  const getStatusBadge = (status) => {
    const statusInfo = documentStatuses.find(s => s.value === status);
    return statusInfo ? 
      <Badge bg={statusInfo.color}>{statusInfo.label}</Badge> : 
      <Badge bg="secondary">{status}</Badge>;
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-danger" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaFileImage className="text-primary" />;
      default:
        return <FaFileAlt className="text-secondary" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = filterBy === 'all' || doc.status === filterBy;
    const matchesSearch = doc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <Loading text="Loading documents..." />;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3">
            <FaFolder className="me-2" />
            Document Management
          </h2>
          <p className="text-muted">
            Manage employee documents, verify compliance, and maintain records
          </p>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All Documents</option>
            {documentStatuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <Button 
            variant="primary" 
            onClick={() => setShowUploadModal(true)}
          >
            <FaFileUpload className="me-2" />
            Upload Document
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="my-documents" title="My Documents">
              <DocumentTable 
                documents={filteredDocuments.filter(doc => 
                  doc.employeeCode === user.employeeCode || 
                  doc.employeeName.includes(user.firstName)
                )}
                isAdmin={false}
                onDownload={handleDownloadDocument}
                onView={setSelectedDocument}
                onVerify={handleDocumentVerification}
                getStatusBadge={getStatusBadge}
                getFileIcon={getFileIcon}
              />
            </Tab>
            
            {isAdmin && (
              <>
                <Tab eventKey="all-documents" title="All Documents">
                  <DocumentTable 
                    documents={filteredDocuments}
                    isAdmin={true}
                    onDownload={handleDownloadDocument}
                    onView={setSelectedDocument}
                    onVerify={handleDocumentVerification}
                    getStatusBadge={getStatusBadge}
                    getFileIcon={getFileIcon}
                  />
                </Tab>
                
                <Tab eventKey="pending-verification" title="Pending Verification">
                  <DocumentTable 
                    documents={filteredDocuments.filter(doc => doc.status === 'PENDING')}
                    isAdmin={true}
                    onDownload={handleDownloadDocument}
                    onView={setSelectedDocument}
                    onVerify={handleDocumentVerification}
                    getStatusBadge={getStatusBadge}
                    getFileIcon={getFileIcon}
                  />
                </Tab>
              </>
            )}
          </Tabs>
        </Card.Body>
      </Card>

      {/* Upload Document Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Document</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFileUpload}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Document Type *</Form.Label>
                  <Form.Select
                    value={uploadForm.documentType}
                    onChange={(e) => setUploadForm({...uploadForm, documentType: e.target.value})}
                    required
                  >
                    <option value="">Select Document Type</option>
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} {type.required && '*'}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Document Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    placeholder="Enter document title"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                placeholder="Enter document description"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Select File *</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                required
              />
              <Form.Text className="text-muted">
                Supported formats: PDF, JPG, PNG, DOC, DOCX (Max size: 5MB)
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

// Document Table Component
const DocumentTable = ({ 
  documents, 
  isAdmin, 
  onDownload, 
  onView, 
  onVerify, 
  getStatusBadge, 
  getFileIcon 
}) => {
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>File</th>
          {isAdmin && <th>Employee</th>}
          <th>Document Type</th>
          <th>Title</th>
          <th>Upload Date</th>
          <th>Status</th>
          <th>Size</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {documents.map(doc => (
          <tr key={doc.id}>
            <td>
              <div className="d-flex align-items-center">
                {getFileIcon(doc.fileName)}
                <span className="ms-2">{doc.fileName}</span>
              </div>
            </td>
            {isAdmin && (
              <td>
                <div>
                  <strong>{doc.employeeName}</strong>
                  <br />
                  <small className="text-muted">{doc.employeeCode}</small>
                </div>
              </td>
            )}
            <td>
              <Badge bg="light" text="dark">
                {doc.documentType.replace('_', ' ')}
              </Badge>
            </td>
            <td>{doc.title}</td>
            <td>{doc.uploadDate}</td>
            <td>{getStatusBadge(doc.status)}</td>
            <td>{doc.fileSize}</td>
            <td>
              <Dropdown as={ButtonGroup} size="sm">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onDownload(doc.id, doc.fileName)}
                >
                  <FaDownload />
                </Button>
                <Dropdown.Toggle 
                  split 
                  variant="outline-primary" 
                  id={`dropdown-split-${doc.id}`}
                />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => onView(doc)}>
                    <FaEye className="me-2" /> View Details
                  </Dropdown.Item>
                  {isAdmin && doc.status === 'PENDING' && (
                    <>
                      <Dropdown.Item 
                        onClick={() => onVerify(doc.id, 'VERIFIED', 'Document verified successfully')}
                        className="text-success"
                      >
                        <FaCheckCircle className="me-2" /> Verify
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={() => onVerify(doc.id, 'REJECTED', 'Document rejected - please reupload')}
                        className="text-danger"
                      >
                        <FaTimesCircle className="me-2" /> Reject
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default DocumentManagement;