import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loading from './components/common/Loading';

// Import theme styles
import './styles/themes.css';

// Auth Components
import Login from './components/auth/Login';

// Pages
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import AttendanceManagement from './pages/AttendanceManagement';
import LeaveManagement from './pages/LeaveManagement';
import DocumentManagement from './pages/DocumentManagement';
import ComplianceReporting from './pages/ComplianceReporting';
import SalaryManagement from './pages/SalaryManagement';
import Payslips from './pages/Payslips';
import Analytics from './pages/Analytics';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  const { user, loading } = useAuth();
  const { isDarkMode } = useTheme();

  if (loading) {
    return <Loading text="Loading application..." />;
  }

  if (!user) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </>
    );
  }

  return (
    <>

      <Header />
      <Container fluid className="px-0" style={{ marginTop: '56px' }}>
        <Row className="g-0">
          <Col md={3} lg={2} className="d-none d-md-block">
            <Sidebar />
          </Col>
          <Col md={9} lg={10}>
            <div className="p-4">
              <Routes>
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employees" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <Employees />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/departments" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <Departments />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/attendance" 
                  element={
                    <ProtectedRoute>
                      <AttendanceManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/leave-management" 
                  element={
                    <ProtectedRoute>
                      <LeaveManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/documents" 
                  element={
                    <ProtectedRoute>
                      <DocumentManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/compliance" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <ComplianceReporting />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/salary" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <SalaryManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/payslips" 
                  element={
                    <ProtectedRoute>
                      <Payslips />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/analytics" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <Analytics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ai-assistant" 
                  element={
                    <ProtectedRoute>
                      <AIAssistant />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/unauthorized" 
                  element={
                    <div className="text-center mt-5">
                      <h2>Access Denied</h2>
                      <p>You don't have permission to access this page.</p>
                    </div>
                  } 
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Col>
        </Row>
      </Container>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </>
  );
}

export default App;