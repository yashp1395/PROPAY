import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/dashboard" className="text-primary">
          💼 Employee Payroll System
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown
              title={
                <span>
                  <FaUser className="me-2" />
                  {user?.fullName || user?.email}
                </span>
              }
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item href="/profile">
                <FaUser className="me-2" />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="/settings">
                <FaCog className="me-2" />
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;