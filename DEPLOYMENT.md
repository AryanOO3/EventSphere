# EventSphere Deployment Guide

## Production Environment Setup

### 1. Environment Variables
Set these environment variables in your production environment:

```bash
PORT=5000
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_super_secure_jwt_secret_here
EMAIL_USER=your_production_email@domain.com
EMAIL_PASS=your_app_password
FRONTEND_URL=https://your-domain.com
NODE_ENV=production
```

### 2. Database Setup
- Create PostgreSQL database
- Run database migrations
- Set up connection pooling (already configured)

### 3. Security Checklist
- [ ] Remove .env from version control
- [ ] Use environment variables in production
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Configure rate limiting

### 4. Monitoring
- Logs are stored in `/logs` directory
- Error logs: `error.log`
- Application logs: `app.log`

### 5. Testing
Run tests before deployment:
```bash
npm test
```

### 6. Build Commands
Backend:
```bash
npm install --production
npm start
```

Frontend:
```bash
npm install
npm run build
```