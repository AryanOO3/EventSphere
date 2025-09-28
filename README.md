# EventSphere - Event Management Platform

A modern, full-stack event management platform with glass-morphism design and comprehensive features.

## Features

- **User Management**: Registration, login, profile management
- **Event Management**: Create, edit, delete events with cover images
- **Role-Based Access**: User, Admin, SuperAdmin roles
- **QR Code Integration**: Event check-ins via QR scanning
- **Real-time Notifications**: Welcome messages and event alerts
- **Dark/Light Theme**: Smooth theme switching with animations
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

**Frontend:**
- React 18 with Hooks
- Styled Components
- React Router
- Axios

**Backend:**
- Node.js with Express
- PostgreSQL database
- JWT authentication
- Multer file uploads

## Quick Start

1. Clone repository
2. Install dependencies:
   ```bash
   cd eventsphere-backend && npm install
   cd ../eventsphere-frontend && npm install
   ```
3. Set up environment variables (see .env.example)
4. Run development servers:
   ```bash
   # Use the provided batch file
   start-dev.bat
   ```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## License

MIT License