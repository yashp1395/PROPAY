import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaDollarSign, 
  FaFileInvoiceDollar,
  FaBuilding,
  FaUser,
  FaRobot,
  FaChartBar,
  FaCog,
  FaClock,
  FaCalendarAlt,
  FaFolder,
  FaShieldAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: FaTachometerAlt,
      label: 'Dashboard',
      roles: ['ADMIN', 'EMPLOYEE']
    },
    {
      path: '/employees',
      icon: FaUsers,
      label: 'Employees',
      roles: ['ADMIN']
    },
    {
      path: '/departments',
      icon: FaBuilding,
      label: 'Departments',
      roles: ['ADMIN']
    },
    {
      path: '/attendance',
      icon: FaClock,
      label: 'Attendance',
      roles: ['ADMIN', 'EMPLOYEE']
    },
    {
      path: '/leave-management',
      icon: FaCalendarAlt,
      label: 'Leave Management',
      roles: ['ADMIN', 'EMPLOYEE']
    },
    {
      path: '/documents',
      icon: FaFolder,
      label: 'Document Management',
      roles: ['ADMIN', 'EMPLOYEE']
    },
    {
      path: '/compliance',
      icon: FaShieldAlt,
      label: 'Compliance Reports',
      roles: ['ADMIN']
    },
    {
      path: '/salary',
      icon: FaDollarSign,
      label: 'Salary Management',
      roles: ['ADMIN']
    },
    {
      path: '/payslips',
      icon: FaFileInvoiceDollar,
      label: 'Payslips',
      roles: ['ADMIN', 'EMPLOYEE']
    },
    {
      path: '/analytics',
      icon: FaChartBar,
      label: 'Analytics',
      roles: ['ADMIN']
    },
    {
      path: '/ai-assistant',
      icon: FaRobot,
      label: 'AI Assistant',
      roles: ['ADMIN', 'EMPLOYEE']
    },
    {
      path: '/profile',
      icon: FaUser,
      label: 'My Profile',
      roles: ['ADMIN', 'EMPLOYEE']
    },
    {
      path: '/settings',
      icon: FaCog,
      label: 'Settings',
      roles: ['ADMIN', 'EMPLOYEE']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="sidebar p-3">
      <div className="mb-4">
        <h5 className="text-white mb-0">Welcome back!</h5>
        <small className="text-white-50">{user?.fullName}</small>
      </div>
      
      <Nav className="flex-column">
        {filteredMenuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <IconComponent className="me-2" />
              {item.label}
            </Nav.Link>
          );
        })}
      </Nav>
      
      <div className="mt-auto pt-4">
        <div className="text-center">
          <small className="text-white-50">
            Role: <span className="badge bg-light text-dark">{user?.role}</span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;