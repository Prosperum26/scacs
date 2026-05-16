# 🏫 SCACS - Smart Campus Access Control System

A modern web-based smart campus access control platform designed to streamline campus security and entry management. This project simulates a real-world campus security system using QR-based access verification, combining security monitoring, access logging, and analytics into a single integrated platform.

> **Note**: This is a university project created for an Information Systems / Project Management course, designed as a live demo product for presentation purposes.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Project](#-running-the-project)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🎯 Overview

SCACS is a comprehensive campus access control solution that replaces traditional manual gate verification with an intelligent, automated system. The platform provides:

- **Real-time access verification** through QR code scanning or manual student ID input
- **Centralized security dashboard** for monitoring and analytics
- **Complete audit trail** of all campus entries and access attempts
- **Role-based access simulation** for different user types
- **Advanced reporting and analytics** for security insights

The system is built with modern web technologies and is ready for deployment, making it a production-grade demonstration of an enterprise-level information system.

---

## ✨ Features

### 🔐 Core Access Control
- **QR-Based Verification**: Instant access validation through QR code scanning
- **Manual Student ID Input**: Alternative verification method for emergency situations
- **Real-time Gate Monitoring**: Live status of campus entry points
- **Access Granted/Denied**: Immediate feedback with automatic logging

### 📊 Security & Monitoring
- **Admin Dashboard**: Comprehensive overview of campus access activity
- **Access Logs**: Detailed records of all entry attempts with timestamps and outcomes
- **Search & Filtering**: Advanced query capabilities for access history
- **Real-time Alerts**: Immediate notification of security events

### 👥 User Management
- **Role-Based Access**: Different permission levels (Admin, Security, Staff, Students)
- **User Profiles**: Complete user information and access rights management
- **Activity Tracking**: Individual user access history and patterns

### 📈 Analytics & Reporting
- **Activity Reports**: Comprehensive access statistics and trends
- **Peak Hours Analysis**: Identify high-traffic periods
- **Anomaly Detection**: Highlight unusual access patterns
- **Export Capabilities**: Generate detailed reports for compliance

### 🛡️ Security Features
- **Secure Authentication**: Login system with role-based access control
- **Audit Trail**: Complete logging of all system actions
- **Data Integrity**: Reliable storage and retrieval of security information
- **Modern Security Practices**: Implementation of current security standards

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React** | UI framework for interactive components |
| **TypeScript** | Type-safe development for scalability |
| **Vite** | Fast build tool and development server |
| **Tailwind CSS** | Utility-first styling for responsive design |
| **Axios** | HTTP client for API communication |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web framework for API development |
| **TypeScript** | Type-safe server-side code |
| **PostgreSQL** | Relational database via Supabase |

### Database & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Supabase** | PostgreSQL database and authentication |
| **Vercel** | Frontend deployment platform |
| **Render/Railway** | Backend deployment platform |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SCACS Architecture                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐              ┌──────────────────┐      │
│  │   Browser/UI    │              │   Mobile Scanner │      │
│  └────────┬────────┘              └────────┬─────────┘      │
│           │                                 │               │
│           └─────────────────┬───────────────┘               │
│                             │                               │
│                  ┌──────────▼──────────┐                    │
│                  │   Vite Dev Server   │                    │
│                  │   (React + TS)      │                    │
│                  └──────────┬──────────┘                    │
│                             │ HTTP/REST                     │
│           ┌─────────────────┴─────────────────┐             │
│           │                                   │             │
│    ┌──────▼───────────┐           ┌──────────▼────┐         │
│    │  Express Server  │           │  QR Scanner   │         │
│    │  (Node.js)       │           │  Processing   │         │
│    │  (TypeScript)    │           │  & Logging    │         │
│    └──────┬───────────┘           └───────────────┘         │
│           │ SQL                                             │
│    ┌──────▼──────────────────────┐                          │
│    │  Supabase PostgreSQL DB     │                          │
│    │  • Users                    │                          │
│    │  • Access Logs              │                          │
│    │  • Gate Configurations      │                          │
│    │  • Audit Records            │                          │
│    └─────────────────────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
scacs/
├── README.md                  # Project documentation
├── LICENSE                    # Project license
│
├── frontend/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components
│   │   ├── App.tsx            # Main application component
│   │   ├── main.tsx           # Entry point
│   │   ├── App.css            # Application styles
│   │   └── index.css          # Global styles
│   ├── public/                # Static assets
│   ├── vite.config.ts         # Vite configuration
│   ├── tsconfig.json          # TypeScript configuration
│   ├── eslint.config.js       # ESLint rules
│   ├── package.json           # Frontend dependencies
│   └── README.md              # Frontend-specific documentation
│
└── backend/                   # Express.js + Node.js backend
    ├── src/
    │   ├── routes/            # API route definitions
    │   ├── controllers/       # Request handlers
    │   ├── models/            # Database models
    │   ├── middleware/        # Custom middleware
    │   ├── services/          # Business logic
    │   ├── types/             # TypeScript type definitions
    │   ├── config/            # Configuration files
    │   └── server.ts          # Server entry point
    ├── package.json           # Backend dependencies
    └── README.md              # Backend-specific documentation
```

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Included with Node.js
- **Git** - [Download](https://git-scm.com/)

### Clone the Repository

```bash
git clone https://github.com/yourusername/scacs.git
cd scacs
```

### Install Dependencies

#### Frontend Setup
```bash
cd frontend
npm install
```

#### Backend Setup
```bash
cd ../backend
npm install
```

---

## ⚙️ Environment Setup

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (Supabase)
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-api-key

# Authentication
JWT_SECRET=your-secret-key-for-jwt-tokens
JWT_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000

# Application Environment
VITE_ENV=development

# Optional: Analytics or Third-party Services
VITE_ANALYTICS_ID=your-analytics-id
```

### Database Setup (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up the following tables:

**users table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  full_name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'student',
  student_id VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**access_logs table**
```sql
CREATE TABLE access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  gate_name VARCHAR NOT NULL,
  qr_code VARCHAR,
  student_id VARCHAR,
  access_status VARCHAR,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR,
  device_info VARCHAR
);
```

**gates table**
```sql
CREATE TABLE gates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR UNIQUE NOT NULL,
  location VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Configure authentication in Supabase dashboard
4. Add Row Level Security (RLS) policies for data access control

---

## ▶️ Running the Project

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will start at `http://localhost:5000`

#### Start Frontend Development Server (in a new terminal)

```bash
cd frontend
npm run dev
```

Frontend will start at `http://localhost:5173`

### Build for Production

#### Build Backend

```bash
cd backend
npm run build
npm start
```

#### Build Frontend

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Available Scripts

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run type-check # Check TypeScript types
```

#### Backend
```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend-url.com/api`

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Core Endpoints

#### Authentication
```
POST /auth/login              # User login
POST /auth/logout             # User logout
POST /auth/register           # User registration (admin only)
POST /auth/refresh-token      # Refresh JWT token
```

#### Access Control
```
POST /access/verify-qr        # Verify QR code and grant/deny access
POST /access/manual-entry     # Manual access verification by student ID
GET  /access/logs             # Get access logs (paginated)
GET  /access/logs/:id         # Get specific access log details
```

#### User Management
```
GET    /users                 # Get all users (admin only)
GET    /users/:id             # Get user details
PUT    /users/:id             # Update user information
DELETE /users/:id             # Delete user (admin only)
```

#### Reports & Analytics
```
GET /reports/daily-summary    # Daily access summary
GET /reports/hourly-stats     # Hourly access statistics
GET /reports/peak-hours       # Peak access hours
GET /reports/export           # Export reports (CSV/PDF)
```

#### Gate Management
```
GET    /gates                 # Get all gates
POST   /gates                 # Create new gate (admin only)
GET    /gates/:id             # Get gate details
PUT    /gates/:id             # Update gate configuration
DELETE /gates/:id             # Delete gate (admin only)
```

For detailed API documentation with examples, see [Backend README](./backend/README.md)

---

## 📸 Screenshots

### Dashboard
[Dashboard Screenshot - Coming Soon]

Overview of all campus access activities with key metrics and real-time status.

### QR Code Scanner
[Scanner Interface - Coming Soon]

Mobile-friendly interface for QR code scanning and instant access verification.

### Access Logs
[Access Logs View - Coming Soon]

Detailed view of all access attempts with search and filtering capabilities.

### Analytics Dashboard
[Analytics View - Coming Soon]

Comprehensive reports and statistics on campus access patterns.

### User Management
[User Management - Coming Soon]

Administrative interface for user and role management.

---

## 🔮 Future Improvements

### Phase 2 Features
- [ ] **Multi-factor Authentication (MFA)**: Enhanced security with SMS/email verification
- [ ] **Mobile App**: Native iOS/Android application for students
- [ ] **Biometric Integration**: Fingerprint or facial recognition support
- [ ] **Advanced Analytics**: Machine learning for anomaly detection
- [ ] **Real-time Notifications**: Push notifications for security events
- [ ] **Integration with Campus Systems**: SSO with existing student information systems

### Performance & Infrastructure
- [ ] **Caching Layer**: Redis implementation for improved performance
- [ ] **WebSocket Support**: Real-time updates and notifications
- [ ] **API Rate Limiting**: Prevent abuse and ensure reliability
- [ ] **Monitoring & Logging**: ELK stack or similar for system monitoring
- [ ] **Load Balancing**: Horizontal scaling for high-traffic scenarios

### Security Enhancements
- [ ] **End-to-End Encryption**: For sensitive data transmission
- [ ] **Advanced Threat Detection**: Real-time security threat analysis
- [ ] **Compliance**: GDPR, FERPA compliance features
- [ ] **Penetration Testing**: Regular security audits

### User Experience
- [ ] **Dark Mode**: Visual preference options
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Internationalization**: Multi-language support
- [ ] **Offline Mode**: Limited functionality when connection is unavailable

---

## 👥 Contributors

This project was developed as part of an Information Systems / Project Management course at [Your University].

### Team Members

| Name | Role | Contributions |
|------|------|----------------|
| [Developer Name] | Backend Lead | API development, database design |
| [Developer Name] | Frontend Lead | UI/UX, React components |
| [Developer Name] | DevOps | Deployment, infrastructure |
| [Developer Name] | QA Lead | Testing, documentation |

### Acknowledgments

- Project supervisor and course instructors
- Supabase for database services
- Vercel for hosting and deployment
- The React and Node.js communities

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 📞 Support & Questions

For questions or issues:

1. Check the [FAQ](./FAQ.md) - Coming Soon
2. Review existing [Issues](https://github.com/yourusername/scacs/issues)
3. Create a new issue with detailed information
4. Contact the development team through the university

---

## 🎓 Educational Purpose

This project demonstrates professional software engineering practices including:

- ✅ Modern web application architecture
- ✅ Full-stack development with TypeScript
- ✅ Database design and optimization
- ✅ RESTful API design principles
- ✅ Responsive UI/UX design
- ✅ Cloud deployment and DevOps
- ✅ Security best practices
- ✅ Project documentation and collaboration

---

<div align="center">

**Made with ❤️ for the university community**

[⬆ Back to Top](#-scacs---smart-campus-access-control-system)

</div>