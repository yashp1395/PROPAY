import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Tab,
  Tabs
} from 'react-bootstrap';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { employeeService, salaryService } from '../services/employeeService';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import { FaChartBar, FaCalendarAlt, FaUsers, FaDollarSign } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalEmployees: 65,
      totalSalaryBudget: 2850000,
      averageSalary: 43846,
      totalDepartments: 5
    },
    monthlyData: [],
    departmentData: [],
    salaryDistribution: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedYear]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch real analytics data from backend
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [overviewResponse, monthlyResponse, departmentResponse, salaryResponse] = await Promise.all([
        fetch('http://localhost:8080/api/analytics/overview', { headers }),
        fetch(`http://localhost:8080/api/analytics/monthly/${selectedYear}`, { headers }),
        fetch('http://localhost:8080/api/analytics/department', { headers }),
        fetch('http://localhost:8080/api/analytics/salary-distribution', { headers })
      ]);

      const overview = await overviewResponse.json();
      const monthly = await monthlyResponse.json();
      const department = await departmentResponse.json();
      const salary = await salaryResponse.json();

      const analyticsData = {
        overview: overview,
        monthlyData: monthly.monthlyData || [],
        departmentData: department.departmentData || [],
        salaryDistribution: salary.salaryDistribution || []
      };
      
      setAnalyticsData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      
      // Fallback to mock data if API fails
      const mockData = {
        overview: {
          totalEmployees: 65,
          totalSalaryBudget: 2850000,
          averageSalary: 43846,
          totalDepartments: 5
        },
        monthlyData: [
          { month: 'Jan', employees: 58, salaryBudget: 2400000 },
          { month: 'Feb', employees: 59, salaryBudget: 2450000 },
          { month: 'Mar', employees: 61, salaryBudget: 2500000 },
          { month: 'Apr', employees: 62, salaryBudget: 2550000 },
          { month: 'May', employees: 63, salaryBudget: 2600000 },
          { month: 'Jun', employees: 64, salaryBudget: 2650000 },
          { month: 'Jul', employees: 65, salaryBudget: 2700000 },
          { month: 'Aug', employees: 65, salaryBudget: 2750000 },
          { month: 'Sep', employees: 65, salaryBudget: 2800000 },
          { month: 'Oct', employees: 65, salaryBudget: 2850000 }
        ],
        departmentData: [
          { name: 'IT', employees: 15, budget: 900000 },
          { name: 'Operations', employees: 20, budget: 800000 },
          { name: 'Finance', employees: 12, budget: 600000 },
          { name: 'Marketing', employees: 10, budget: 350000 },
          { name: 'HR', employees: 8, budget: 200000 }
        ],
        salaryDistribution: [
          { range: '30K-40K', count: 15 },
          { range: '40K-50K', count: 25 },
          { range: '50K-60K', count: 15 },
          { range: '60K-70K', count: 7 },
          { range: '70K+', count: 3 }
        ]
      };
      
      setAnalyticsData(mockData);
      toast.error('Using offline data - API connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const employeeGrowthChart = {
    data: {
      labels: analyticsData.monthlyData.map(item => item.month),
      datasets: [
        {
          label: 'Total Employees',
          data: analyticsData.monthlyData.map(item => item.employees),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Employee Growth Trend'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  const salaryBudgetChart = {
    data: {
      labels: analyticsData.monthlyData.map(item => item.month),
      datasets: [
        {
          label: 'Salary Budget ($)',
          data: analyticsData.monthlyData.map(item => item.salaryBudget),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Monthly Salary Budget'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + (value / 1000000).toFixed(1) + 'M';
            }
          }
        }
      }
    }
  };

  const departmentChart = {
    data: {
      labels: analyticsData.departmentData.map(item => item.name),
      datasets: [
        {
          label: 'Employee Count',
          data: analyticsData.departmentData.map(item => item.employees),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right'
        },
        title: {
          display: true,
          text: 'Employees by Department'
        }
      }
    }
  };

  const salaryDistributionChart = {
    data: {
      labels: analyticsData.salaryDistribution.map(item => item.range),
      datasets: [
        {
          data: analyticsData.salaryDistribution.map(item => item.count),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Salary Distribution'
        }
      }
    }
  };

  if (loading) {
    return <Loading text="Loading analytics..." />;
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-0">
            <FaChartBar className="me-2" />
            Analytics & Reports
          </h1>
          <p className="text-muted">
            {isAdmin() 
              ? 'Comprehensive insights into workforce and payroll analytics' 
              : 'View your personal performance and salary insights'
            }
          </p>
        </div>
        <div className="d-flex gap-3">
          <Form.Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ width: 'auto' }}
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </Form.Select>
          <Button variant="outline-primary">
            <FaCalendarAlt className="me-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="overview" title="Overview">
          {/* Overview Cards */}
          <Row className="g-4 mb-4">
            <Col md={3}>
              <Card className="text-center border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-center mb-2">
                    <div className="icon-circle bg-primary">
                      <FaUsers className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-primary">{analyticsData.overview.totalEmployees}</h3>
                  <p className="mb-0 text-muted">Total Employees</p>
                  <small className="text-success">+2 this month</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-center mb-2">
                    <div className="icon-circle bg-success">
                      <FaDollarSign className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-success">
                    ${(analyticsData.overview.totalSalaryBudget / 1000000).toFixed(1)}M
                  </h3>
                  <p className="mb-0 text-muted">Total Salary Budget</p>
                  <small className="text-success">+5.2% this year</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-center mb-2">
                    <div className="icon-circle bg-info">
                      <FaDollarSign className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-info">
                    ${analyticsData.overview.averageSalary.toLocaleString()}
                  </h3>
                  <p className="mb-0 text-muted">Average Salary</p>
                  <small className="text-success">+3.8% this year</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-center mb-2">
                    <div className="icon-circle bg-warning">
                      <FaChartBar className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-warning">{analyticsData.overview.totalDepartments}</h3>
                  <p className="mb-0 text-muted">Departments</p>
                  <small className="text-muted">Active divisions</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row className="g-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Line {...employeeGrowthChart} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Bar {...salaryBudgetChart} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="departments" title="Departments">
          <Row className="g-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Pie {...departmentChart} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Department Breakdown</h5>
                </Card.Header>
                <Card.Body>
                  {analyticsData.departmentData.map((dept, index) => (
                    <div key={dept.name} className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <strong>{dept.name}</strong>
                        <br />
                        <small className="text-muted">{dept.employees} employees</small>
                      </div>
                      <div className="text-end">
                        <strong>${(dept.budget / 1000).toFixed(0)}K</strong>
                        <br />
                        <small className="text-muted">budget</small>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="salary" title="Salary Analysis">
          <Row className="g-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Doughnut {...salaryDistributionChart} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Salary Statistics</h5>
                </Card.Header>
                <Card.Body>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="text-center p-3 bg-light rounded">
                        <h4 className="text-primary mb-1">$65,000</h4>
                        <small>Highest Salary</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-3 bg-light rounded">
                        <h4 className="text-danger mb-1">$35,000</h4>
                        <small>Lowest Salary</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-3 bg-light rounded">
                        <h4 className="text-success mb-1">$45,500</h4>
                        <small>Median Salary</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-3 bg-light rounded">
                        <h4 className="text-info mb-1">$8,500</h4>
                        <small>Salary Range</small>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <h6 className="mb-3">Salary Distribution</h6>
                  {analyticsData.salaryDistribution.map((range, index) => (
                    <div key={range.range} className="d-flex justify-content-between align-items-center mb-2">
                      <span>{range.range}</span>
                      <div className="d-flex align-items-center">
                        <div 
                          className="progress me-2" 
                          style={{width: '100px', height: '8px'}}
                        >
                          <div 
                            className="progress-bar" 
                            style={{
                              width: `${(range.count / 65) * 100}%`,
                              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index]
                            }}
                          ></div>
                        </div>
                        <span className="badge bg-secondary">{range.count}</span>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Analytics;