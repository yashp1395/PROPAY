import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Badge,
  Alert
} from 'react-bootstrap';
import { aiService } from '../services/employeeService';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import { FaRobot, FaPaperPlane, FaLightbulb, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AIAssistant = () => {
  const { user, isAdmin } = useAuth();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [taxAdvice, setTaxAdvice] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (user?.employeeId) {
      fetchInsights();
      fetchTaxAdvice();
    }
    if (isAdmin) {
      fetchAnalytics();
    }
  }, [user, isAdmin]);

  const fetchInsights = async () => {
    try {
      // Use the correct service method that matches backend
      const response = await aiService.getMySalaryInsights();
      setInsights(response.data);
    } catch (error) {
      console.log('No salary insights available:', error.message);
    }
  };

  const fetchTaxAdvice = async () => {
    try {
      // Use the correct service method that matches backend
      const response = await aiService.getMyTaxAdvice();
      setTaxAdvice(response.data);
    } catch (error) {
      console.log('No tax advice available:', error.message);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // For now, we'll use payroll report for current month/year
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const response = await aiService.getPayrollReport(month, year);
      setAnalytics(response.data);
    } catch (error) {
      console.log('No analytics available:', error.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { text: message, sender: 'user', timestamp: new Date() };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await aiService.chatWithAI(message);
      const aiMessage = { 
        text: response.data.response || response.data, 
        sender: 'ai', 
        timestamp: new Date() 
      };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { 
        text: 'Sorry, I encountered an error. Please try again.', 
        sender: 'ai', 
        timestamp: new Date() 
      };
      setChatHistory(prev => [...prev, errorMessage]);
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "What are my 80C tax saving options in India?",
    "How can I optimize my salary structure for tax benefits?",
    "Explain HRA and LTA allowances for Indian employees",
    "What are the EPF and PPF contribution benefits?",
    "Calculate my tax liability under new tax regime",
    "Help me understand Indian payroll deductions"
  ];

  const adminQuestions = [
    "Show payroll analytics for this month in India",
    "Which employees need salary reviews as per Indian standards?",
    "What are the tax implications for Diwali bonuses?",
    "How to optimize company payroll costs in India?",
    "Generate salary benchmark report for Indian market",
    "Show department-wise salary distribution and compliance"
  ];

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h1 className="h2 mb-0">
          <FaRobot className="me-2 text-primary" />
          AI Assistant
        </h1>
        <p className="text-muted">
          Get intelligent insights about payroll, taxes, and salary optimization
        </p>
      </div>

      <Row className="g-4">
        {/* AI Insights Cards */}
        <Col lg={4}>
          <div className="d-flex flex-column gap-3">
            {insights && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <FaLightbulb className="me-2" />
                  Salary Insights
                </Card.Header>
                <Card.Body>
                  <div dangerouslySetInnerHTML={{ __html: insights.insights || insights }} />
                </Card.Body>
              </Card>
            )}

            {taxAdvice && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-success text-white">
                  <FaChartLine className="me-2" />
                  Tax Advice
                </Card.Header>
                <Card.Body>
                  <div dangerouslySetInnerHTML={{ __html: taxAdvice.advice || taxAdvice }} />
                </Card.Body>
              </Card>
            )}

            {isAdmin() && analytics && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-warning text-dark">
                  <FaChartLine className="me-2" />
                  Payroll Analytics
                </Card.Header>
                <Card.Body>
                  <div dangerouslySetInnerHTML={{ __html: analytics.analytics || analytics }} />
                </Card.Body>
              </Card>
            )}

            {/* Quick Questions */}
            <Card className="border-0 shadow-sm">
              <Card.Header>
                <strong>Quick Questions</strong>
              </Card.Header>
              <ListGroup variant="flush">
                {(isAdmin() ? adminQuestions : quickQuestions).map((question, index) => (
                  <ListGroup.Item 
                    key={index}
                    action
                    onClick={() => setMessage(question)}
                    className="border-0 py-2"
                  >
                    <small>{question}</small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </div>
        </Col>

        {/* Chat Interface */}
        <Col lg={8}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header>
              <div className="d-flex align-items-center">
                <FaRobot className="me-2 text-primary" />
                <strong>Chat with AI Assistant</strong>
                <Badge bg="success" className="ms-auto">Online</Badge>
              </div>
            </Card.Header>
            
            <Card.Body className="d-flex flex-column" style={{ height: '500px' }}>
              {/* Chat History */}
              <div className="flex-grow-1 overflow-auto mb-3 p-3 border rounded bg-light">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FaRobot size={48} className="mb-3 opacity-50" />
                    <h5>Hello! I'm your AI Payroll Assistant</h5>
                    <p>Ask me anything about salaries, taxes, benefits, or payroll management.</p>
                  </div>
                ) : (
                  <div>
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`mb-3 d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`p-3 rounded-3 max-width-75 ${
                          msg.sender === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-white border'
                        }`} style={{ maxWidth: '75%' }}>
                          <div className="mb-1">
                            {typeof msg.text === 'string' ? (
                              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                            ) : (
                              <div>{JSON.stringify(msg.text)}</div>
                            )}
                          </div>
                          <small className={`opacity-75 ${msg.sender === 'user' ? 'text-white-50' : 'text-muted'}`}>
                            {msg.timestamp.toLocaleTimeString()}
                          </small>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="d-flex justify-content-start mb-3">
                        <div className="bg-white border p-3 rounded-3">
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          <small className="text-muted">AI is thinking...</small>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <Form onSubmit={handleSendMessage}>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Ask me about payroll, taxes, or salary optimization..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                  />
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading || !message.trim()}
                  >
                    {loading ? (
                      <div className="spinner-border spinner-border-sm" />
                    ) : (
                      <FaPaperPlane />
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
          margin-bottom: 5px;
        }
        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #6c757d;
          opacity: 0.4;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
          0%, 80%, 100% { transform: scale(1); opacity: 0.4; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </Container>
  );
};

export default AIAssistant;