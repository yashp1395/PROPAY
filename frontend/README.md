# Employee Payroll Management System - React Frontend

A modern, responsive React frontend for the Employee Payroll Management System built with Bootstrap and Chart.js for data visualization.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Employee)
- Protected routes and components
- Automatic token refresh

### Dashboard
- Role-specific dashboards
- Real-time statistics and metrics
- Quick action buttons
- Recent activities overview

### Employee Management (Admin Only)
- CRUD operations for employee records
- Advanced search and filtering
- Bulk operations
- Employee profile management

### Salary Management
- Salary calculation and processing
- Payslip generation and download
- Salary history tracking
- Department-wise salary reports

### AI Assistant
- Integrated Google Gemini AI chat
- Context-aware responses
- HR and payroll assistance
- Smart recommendations

### Departments Management
- Department creation and management
- Employee allocation
- Budget tracking
- Organizational structure visualization

### Profile Management
- Personal information updates
- Password change functionality
- Security settings
- Activity history

### Analytics & Reports
- Interactive charts and graphs
- Salary distribution analysis
- Department-wise insights
- Export functionality

### Payslips
- View and download payslips
- Monthly payroll records
- Print-friendly format
- Archive management

## 🛠️ Technology Stack

- **React** 18.2.0 - Core framework
- **React Router DOM** 6.8.0 - Client-side routing
- **Bootstrap** 5.2.3 - UI framework
- **React Bootstrap** 2.7.0 - React Bootstrap components
- **Axios** 1.3.0 - HTTP client
- **Chart.js** 4.2.1 - Data visualization
- **React Toastify** 9.1.1 - Notifications
- **React Icons** 4.7.1 - Icon library
- **Formik** 2.2.9 - Form handling
- **Yup** 1.0.0 - Form validation
- **JWT Decode** 3.1.2 - JWT token handling

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Loading.js
│   │   │   └── ProtectedRoute.js
│   │   └── layout/
│   │       ├── Navbar.js
│   │       └── Sidebar.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── Employees.js
│   │   ├── SalaryManagement.js
│   │   ├── Departments.js
│   │   ├── Profile.js
│   │   ├── Payslips.js
│   │   ├── Analytics.js
│   │   └── AIAssistant.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── employeeService.js
│   ├── styles/
│   │   └── App.css
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (version 16.0 or higher)
- npm or yarn package manager
- Running backend server on `http://localhost:8080`

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the frontend root:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   REACT_APP_APP_NAME=Employee Payroll System
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `build` folder.

## 🔐 Authentication

The application uses JWT tokens for authentication. Default credentials:

**Admin:**
- Email: `admin@payroll.com`
- Password: `admin123`

**Employee:**
- Email: `employee@payroll.com`
- Password: `emp123`

## 📱 Responsive Design

The frontend is fully responsive and works seamlessly across:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile devices (< 768px)

## 🎨 UI Components

### Custom Components
- **Loading**: Reusable loading spinner
- **ProtectedRoute**: Route protection based on authentication
- **Navbar**: Top navigation with user menu
- **Sidebar**: Collapsible side navigation

### Page Components
- **Login**: Authentication page with form validation
- **Dashboard**: Role-based dashboard with metrics
- **Employees**: Employee management with CRUD operations
- **SalaryManagement**: Salary processing and payslip generation
- **Departments**: Department management interface
- **Profile**: User profile and settings
- **Payslips**: Payslip viewing and download
- **Analytics**: Data visualization and reports
- **AIAssistant**: AI-powered chat interface

## 🔌 API Integration

The frontend communicates with the Spring Boot backend through RESTful APIs:

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh

### Employee Endpoints
- `GET /employees` - Get all employees
- `POST /employees` - Create employee
- `PUT /employees/{id}` - Update employee
- `DELETE /employees/{id}` - Delete employee

### Salary Endpoints
- `GET /salaries` - Get salary records
- `POST /salaries/calculate` - Calculate salary
- `GET /salaries/payslip/{id}` - Download payslip

### AI Assistant Endpoints
- `POST /ai/chat` - Send message to AI assistant

## 🔍 Features by User Role

### Admin Features
- Complete employee management
- Salary processing and management
- Department management
- System analytics and reports
- AI assistant access
- Payslip generation for all employees

### Employee Features
- Personal dashboard
- Profile management
- Salary information viewing
- Personal payslips download
- AI assistant for HR queries

## 🚨 Error Handling

The application includes comprehensive error handling:
- Network error detection
- Authentication error handling
- Form validation errors
- User-friendly error messages
- Automatic retry mechanisms

## 🔔 Notifications

Toast notifications are used throughout the application for:
- Success messages
- Error alerts
- Information updates
- Warning messages

## 📊 Data Visualization

Charts and graphs are implemented using Chart.js:
- Employee growth trends
- Salary distribution analysis
- Department-wise statistics
- Monthly budget tracking

## 🛡️ Security Features

- JWT token-based authentication
- Automatic token refresh
- Protected routes
- Role-based access control
- Secure API communication
- XSS protection

## 🚀 Performance Optimizations

- Code splitting with React.lazy()
- Memoization of expensive components
- Optimized bundle size
- Efficient state management
- Lazy loading of routes

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📦 Deployment

### Development Deployment
```bash
npm start
```

### Production Deployment
```bash
npm run build
npm install -g serve
serve -s build -l 3000
```

### Docker Deployment
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Integration with Backend

Ensure the Spring Boot backend is running on `http://localhost:8080` for full functionality. The frontend automatically handles:
- API endpoint configuration
- Authentication token management
- Error handling and retry logic
- Real-time data synchronization

## 📈 Future Enhancements

- Real-time notifications
- Advanced reporting features
- Mobile app development
- Multi-language support
- Advanced analytics
- Integration with third-party services