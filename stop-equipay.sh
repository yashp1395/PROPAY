#!/bin/bash

# EquiPay - Stop Script
# This script stops both backend and frontend services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# PID files
BACKEND_PID="$PROJECT_ROOT/.backend.pid"
FRONTEND_PID="$PROJECT_ROOT/.frontend.pid"

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════╗"
echo "║          Stopping EquiPay Services...              ║"
echo "╚════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to kill process on port
kill_port() {
    local port=$1
    local name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}Stopping $name on port $port...${NC}"
        local pid=$(lsof -ti:$port)
        kill -9 $pid 2>/dev/null || true
        sleep 1
        
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "${RED}✗ Failed to stop $name${NC}"
        else
            echo -e "${GREEN}✓ $name stopped${NC}"
        fi
    else
        echo -e "${GREEN}✓ $name is not running${NC}"
    fi
}

# Stop backend
kill_port 8080 "Backend"

# Stop frontend
kill_port 3000 "Frontend"

# Remove PID files
rm -f "$BACKEND_PID" "$FRONTEND_PID"

# Kill any remaining Maven or npm processes
pkill -f "spring-boot:run" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════╗"
echo "║         All EquiPay Services Stopped! ✓            ║"
echo "╚════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${CYAN}To start services again:${NC}"
echo -e "${YELLOW}  ./start-equipay.sh${NC}"
echo ""
