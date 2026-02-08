#!/bin/bash

# EquiPay - Complete Startup Script
# This script starts both backend and frontend services

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# Log files
BACKEND_LOG="$PROJECT_ROOT/backend.log"
FRONTEND_LOG="$PROJECT_ROOT/frontend.log"

# PID files
BACKEND_PID="$PROJECT_ROOT/.backend.pid"
FRONTEND_PID="$PROJECT_ROOT/.frontend.pid"

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════╗"
echo "║                                                    ║"
echo "║                    EquiPay                         ║"
echo "║      Employee Payroll Management System            ║"
echo "║                                                    ║"
echo "╚════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    echo -e "${YELLOW}Checking port $port...${NC}"
    if check_port $port; then
        echo -e "${YELLOW}Port $port is in use. Stopping existing process...${NC}"
        local pid=$(lsof -ti:$port)
        kill -9 $pid 2>/dev/null || true
        sleep 2
        echo -e "${GREEN}Port $port is now free${NC}"
    else
        echo -e "${GREEN}Port $port is available${NC}"
    fi
}

# Function to check if MySQL is running
check_mysql() {
    echo -e "${BLUE}[1/6] Checking MySQL service...${NC}"
    if systemctl is-active --quiet mysql 2>/dev/null || systemctl is-active --quiet mysqld 2>/dev/null; then
        echo -e "${GREEN}✓ MySQL is running${NC}"
        return 0
    else
        echo -e "${RED}✗ MySQL is not running${NC}"
        echo -e "${YELLOW}Please start MySQL service first:${NC}"
        echo "  sudo systemctl start mysql"
        return 1
    fi
}

# Function to check if database exists
check_database() {
    echo -e "${BLUE}[2/6] Checking database...${NC}"
    if mysql -u payroll_user -ppassword -e "USE payroll_system;" 2>/dev/null; then
        echo -e "${GREEN}✓ Database 'payroll_system' exists and is accessible${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Database or user not found${NC}"
        echo -e "${YELLOW}Creating database and user...${NC}"
        mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS payroll_system; CREATE USER IF NOT EXISTS 'payroll_user'@'localhost' IDENTIFIED BY 'password'; GRANT ALL PRIVILEGES ON payroll_system.* TO 'payroll_user'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null || {
            echo -e "${RED}✗ Failed to create database. Please run manually:${NC}"
            echo "  mysql -u root -p"
            echo "  CREATE DATABASE IF NOT EXISTS payroll_system;"
            echo "  CREATE USER IF NOT EXISTS 'payroll_user'@'localhost' IDENTIFIED BY 'password';"
            echo "  GRANT ALL PRIVILEGES ON payroll_system.* TO 'payroll_user'@'localhost';"
            echo "  FLUSH PRIVILEGES;"
            return 1
        }
        echo -e "${GREEN}✓ Database created successfully${NC}"
        return 0
    fi
}

# Function to start backend
start_backend() {
    echo -e "${BLUE}[3/6] Starting Backend Service...${NC}"
    
    # Check if backend port is available
    kill_port 8080
    
    cd "$BACKEND_DIR"
    
    # Start backend in background
    echo -e "${YELLOW}Starting Spring Boot backend...${NC}"
    nohup mvn spring-boot:run > "$BACKEND_LOG" 2>&1 &
    BACKEND_PID_NUM=$!
    echo $BACKEND_PID_NUM > "$BACKEND_PID"
    
    echo -e "${YELLOW}Waiting for backend to start...${NC}"
    
    # Wait for backend to start (max 60 seconds)
    for i in {1..60}; do
        if check_port 8080; then
            echo -e "${GREEN}✓ Backend is running on http://localhost:8080/api${NC}"
            echo -e "${GREEN}  PID: $BACKEND_PID_NUM${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
    done
    
    echo -e "${RED}✗ Backend failed to start within 60 seconds${NC}"
    echo -e "${YELLOW}Check logs at: $BACKEND_LOG${NC}"
    return 1
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}[4/6] Starting Frontend Service...${NC}"
    
    # Check if frontend port is available
    kill_port 3000
    
    cd "$FRONTEND_DIR"
    
    # Start frontend in background
    echo -e "${YELLOW}Starting React frontend...${NC}"
    nohup npm start > "$FRONTEND_LOG" 2>&1 &
    FRONTEND_PID_NUM=$!
    echo $FRONTEND_PID_NUM > "$FRONTEND_PID"
    
    echo -e "${YELLOW}Waiting for frontend to start...${NC}"
    
    # Wait for frontend to start (max 60 seconds)
    for i in {1..60}; do
        if check_port 3000; then
            echo -e "${GREEN}✓ Frontend is running on http://localhost:3000${NC}"
            echo -e "${GREEN}  PID: $FRONTEND_PID_NUM${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
    done
    
    echo -e "${RED}✗ Frontend failed to start within 60 seconds${NC}"
    echo -e "${YELLOW}Check logs at: $FRONTEND_LOG${NC}"
    return 1
}

# Function to verify services
verify_services() {
    echo -e "${BLUE}[5/6] Verifying services...${NC}"
    
    local backend_ok=false
    local frontend_ok=false
    
    if check_port 8080; then
        echo -e "${GREEN}✓ Backend is responding on port 8080${NC}"
        backend_ok=true
    else
        echo -e "${RED}✗ Backend is not responding${NC}"
    fi
    
    if check_port 3000; then
        echo -e "${GREEN}✓ Frontend is responding on port 3000${NC}"
        frontend_ok=true
    else
        echo -e "${RED}✗ Frontend is not responding${NC}"
    fi
    
    if [ "$backend_ok" = true ] && [ "$frontend_ok" = true ]; then
        return 0
    else
        return 1
    fi
}

# Function to display success message
display_success() {
    echo ""
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════╗"
    echo "║                                                    ║"
    echo "║            🎉 EquiPay Started Successfully! 🎉     ║"
    echo "║                                                    ║"
    echo "╚════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${CYAN}[6/6] Access Points:${NC}"
    echo -e "${GREEN}  Frontend:        ${YELLOW}http://localhost:3000${NC}"
    echo -e "${GREEN}  Backend API:     ${YELLOW}http://localhost:8080/api${NC}"
    echo -e "${GREEN}  API Docs:        ${YELLOW}http://localhost:8080/api/swagger-ui.html${NC}"
    echo ""
    echo -e "${CYAN}Features:${NC}"
    echo -e "${GREEN}  ✓ Dark theme by default${NC}"
    echo -e "${GREEN}  ✓ Indian localization${NC}"
    echo -e "${GREEN}  ✓ Theme toggle${NC}"
    echo -e "${GREEN}  ✓ AI Assistant with Gemini${NC}"
    echo ""
    echo -e "${CYAN}Logs:${NC}"
    echo -e "${YELLOW}  Backend:  tail -f $BACKEND_LOG${NC}"
    echo -e "${YELLOW}  Frontend: tail -f $FRONTEND_LOG${NC}"
    echo ""
    echo -e "${CYAN}To stop services:${NC}"
    echo -e "${YELLOW}  ./stop-equipay.sh${NC}"
    echo ""
    echo -e "${BLUE}Press Ctrl+C to stop monitoring (services will continue running)${NC}"
    echo ""
}

# Main execution
main() {
    # Check MySQL
    if ! check_mysql; then
        exit 1
    fi
    
    # Check database
    if ! check_database; then
        exit 1
    fi
    
    # Start backend
    if ! start_backend; then
        echo -e "${RED}Failed to start backend. Check logs at: $BACKEND_LOG${NC}"
        exit 1
    fi
    
    # Start frontend
    if ! start_frontend; then
        echo -e "${RED}Failed to start frontend. Check logs at: $FRONTEND_LOG${NC}"
        exit 1
    fi
    
    # Verify services
    if ! verify_services; then
        echo -e "${RED}Some services are not running properly${NC}"
        exit 1
    fi
    
    # Display success message
    display_success
    
    # Monitor logs
    echo -e "${YELLOW}Monitoring services (Ctrl+C to exit monitoring)...${NC}"
    echo ""
    trap "echo -e '\n${GREEN}Services are still running in background${NC}'; exit 0" INT
    tail -f "$BACKEND_LOG" "$FRONTEND_LOG"
}

# Run main function
main
