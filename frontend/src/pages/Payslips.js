import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Form,
  InputGroup
} from 'react-bootstrap';
import { salaryService } from '../services/employeeService';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import { FaFileInvoiceDollar, FaDownload, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Payslips = () => {
  const { user, isAdmin } = useAuth();
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      // For demo purposes, we'll create mock payslip data
      // In real implementation, you'd fetch actual payslip records
      const mockPayslips = [
        {
          id: 1,
          employeeId: user.employeeId,
          employeeName: user.fullName,
          month: '2025-09',
          basicSalary: 5000,
          netSalary: 4200,
          status: 'Generated',
          generatedDate: '2025-09-30'
        },
        {
          id: 2,
          employeeId: user.employeeId,
          employeeName: user.fullName,
          month: '2025-08',
          basicSalary: 5000,
          netSalary: 4150,
          status: 'Generated',
          generatedDate: '2025-08-31'
        },
        {
          id: 3,
          employeeId: user.employeeId,
          employeeName: user.fullName,
          month: '2025-07',
          basicSalary: 5000,
          netSalary: 4300,
          status: 'Generated',
          generatedDate: '2025-07-31'
        }
      ];
      
      setPayslips(mockPayslips);
    } catch (error) {
      toast.error('Failed to fetch payslips');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPayslip = async (employeeId, month) => {
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
      
      toast.success('Payslip downloaded successfully');
    } catch (error) {
      toast.error('Failed to download payslip');
    }
  };

  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = payslip.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = !selectedMonth || payslip.month === selectedMonth;
    return matchesSearch && matchesMonth;
  });

  if (loading) {
    return <Loading text="Loading payslips..." />;
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-0">
            <FaFileInvoiceDollar className="me-2" />
            Payslips
          </h1>
          <p className="text-muted">
            {isAdmin() ? 'Manage and download employee payslips' : 'View and download your payslips'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by employee name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaCalendarAlt />
                </InputGroup.Text>
                <Form.Control
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Payslips Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            {isAdmin() ? 'All Payslips' : 'My Payslips'} ({filteredPayslips.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredPayslips.length === 0 ? (
            <div className="empty-state">
              <FaFileInvoiceDollar size={48} className="text-muted mb-3" />
              <h3>No payslips found</h3>
              <p>
                {searchTerm || selectedMonth 
                  ? 'No payslips match your search criteria.' 
                  : 'No payslips have been generated yet.'
                }
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover className="mb-0">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Month</th>
                    <th>Basic Salary</th>
                    <th>Net Salary</th>
                    <th>Status</th>
                    <th>Generated Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayslips.map((payslip) => (
                    <tr key={payslip.id}>
                      <td>
                        <div>
                          <strong>{payslip.employeeName}</strong>
                          <br />
                          <small className="text-muted">ID: {payslip.employeeId}</small>
                        </div>
                      </td>
                      <td>
                        <Badge bg="primary">
                          {new Date(payslip.month + '-01').toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </Badge>
                      </td>
                      <td>${payslip.basicSalary.toLocaleString()}</td>
                      <td>
                        <strong className="text-success">
                          ${payslip.netSalary.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <Badge bg={payslip.status === 'Generated' ? 'success' : 'warning'}>
                          {payslip.status}
                        </Badge>
                      </td>
                      <td>
                        {new Date(payslip.generatedDate).toLocaleDateString()}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleDownloadPayslip(payslip.employeeId, payslip.month)}
                        >
                          <FaDownload className="me-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Summary Cards */}
      <Row className="g-4 mt-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{filteredPayslips.length}</h3>
              <p className="mb-0 text-muted">Total Payslips</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">
                ${filteredPayslips.reduce((sum, p) => sum + p.netSalary, 0).toLocaleString()}
              </h3>
              <p className="mb-0 text-muted">Total Net Salary</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">
                {filteredPayslips.length > 0 
                  ? new Date(Math.max(...filteredPayslips.map(p => new Date(p.month + '-01')))).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : 'N/A'
                }
              </h3>
              <p className="mb-0 text-muted">Latest Month</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">
                {filteredPayslips.filter(p => p.status === 'Generated').length}
              </h3>
              <p className="mb-0 text-muted">Generated</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payslips;