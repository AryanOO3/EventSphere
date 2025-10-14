# EventSphere Migration Guide

This guide will help you set up EventSphere on a new device from scratch.

## Prerequisites Installation

### 1. Install Node.js (Required)
- Download Node.js 18+ from https://nodejs.org/
- Choose the LTS version for stability
- Run the installer and follow the setup wizard
- Verify installation:
  ```bash
  node --version
  npm --version
  ```
- Both commands should return version numbers

### 2. Install PostgreSQL Database (Required)
- Download PostgreSQL from https://postgresql.org/download/
- During installation:
  - Remember the password you set for the `postgres` superuser
  - Default port is 5432 (keep this unless you have conflicts)
  - Install pgAdmin if you want a GUI tool (optional)
- Verify installation:
  ```bash
  psql --version
  ```

### 3. Install Git (Required)
- Download Git from https://git-scm.com/
- Use default settings during installation
- Verify installation:
  ```bash
  git --version
  ```

## Project Setup

### 4. Clone the Repository
```bash
# Clone the project from GitHub
git clone https://github.com/AryanOO3/EventSphere.git

# Navigate to project directory
cd EventSphere
```

### 5. Install Backend Dependencies
```bash
# Navigate to backend folder
cd eventsphere-backend

# Install all required packages
npm install

# This will install:
# - Express.js (web framework)
# - PostgreSQL driver
# - JWT for authentication
# - Multer for file uploads
# - bcryptjs for password hashing
# - And other dependencies
```

### 6. Install Frontend Dependencies
```bash
# Navigate to frontend folder
cd ../eventsphere-frontend

# Install all required packages
npm install

# This will install:
# - React 18
# - Styled Components
# - React Router
# - Axios for API calls
# - QR code libraries
# - And other dependencies
```

## Database Configuration

### 7. Create Database and User
Open your terminal/command prompt and connect to PostgreSQL:

```bash
# Connect to PostgreSQL (you'll be prompted for the postgres password)
psql -U postgres

# Or on Windows, you might need:
# psql -U postgres -h localhost
```

Once connected, run these SQL commands:
```sql
-- Create the database
CREATE DATABASE eventsphere_db;

-- Create a user for the application
CREATE USER eventsphere_user WITH PASSWORD 'test1234';

-- Grant all privileges to the user
GRANT ALL PRIVILEGES ON DATABASE eventsphere_db TO eventsphere_user;

-- Exit PostgreSQL
\q
```

### 8. Create Environment Configuration
Navigate to the backend folder and create environment variables:

**For Windows:**
```bash
cd eventsphere-backend
echo JWT_SECRET=your_super_secret_jwt_key_here > .env
echo DB_USER=eventsphere_user >> .env
echo DB_PASSWORD=test1234 >> .env
echo DB_NAME=eventsphere_db >> .env
echo DB_HOST=localhost >> .env
echo DB_PORT=5432 >> .env
echo EMAIL_USER=your_gmail@gmail.com >> .env
echo EMAIL_PASS=your_app_password >> .env
```

**For Mac/Linux:**
```bash
cd eventsphere-backend
cat > .env << EOF
JWT_SECRET=your_super_secret_jwt_key_here
DB_USER=eventsphere_user
DB_PASSWORD=test1234
DB_NAME=eventsphere_db
DB_HOST=localhost
DB_PORT=5432
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
EOF
```

**Important Notes:**
- Replace `your_super_secret_jwt_key_here` with a long, random string
- For email functionality, use a Gmail account and generate an App Password
- If you changed the database password in step 7, update `DB_PASSWORD` accordingly

## Running the Application

### 9. Start the Backend Server
```bash
# Make sure you're in the eventsphere-backend folder
cd eventsphere-backend

# Start the server
npm start

# You should see:
# "Server running on port 5000"
# "Connected to PostgreSQL database"
```

### 10. Start the Frontend (New Terminal/Command Prompt)
```bash
# Open a new terminal window
# Navigate to the frontend folder
cd path/to/EventSphere/eventsphere-frontend

# Start the React development server
npm start

# Your browser should automatically open to http://localhost:3000
# If not, manually navigate to http://localhost:3000
```

## Accessing the Application

- **Frontend URL:** http://localhost:3000
- **Backend API URL:** http://localhost:5000
- **Database:** PostgreSQL on localhost:5432

## First Time Setup

1. **Register a new account** - This will create the necessary database tables
2. **Create your first event** to test functionality
3. **Test QR code generation** by RSVPing to an event

## Troubleshooting

### Common Issues:

**Port Already in Use:**
- Backend (5000): Change port in `eventsphere-backend/server.js`
- Frontend (3000): React will prompt to use a different port

**Database Connection Failed:**
- Verify PostgreSQL is running
- Check database credentials in `.env` file
- Ensure database and user exist

**Module Not Found Errors:**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

**Permission Errors:**
- On Mac/Linux, you might need `sudo` for global installations
- On Windows, run Command Prompt as Administrator

### File Upload Issues:
The application creates these folders automatically:
- `eventsphere-backend/uploads/profiles/`
- `eventsphere-backend/uploads/covers/`
- `eventsphere-backend/uploads/files/`

If you encounter file upload errors, ensure these directories exist and have write permissions.

## Production Deployment Notes

For production deployment:
1. Use environment variables for all sensitive data
2. Set up proper SSL certificates
3. Use a production PostgreSQL instance
4. Configure proper CORS settings
5. Set up proper file storage (AWS S3, etc.)

## Support

If you encounter issues:
1. Check the console logs in both terminal windows
2. Verify all prerequisites are installed correctly
3. Ensure database is running and accessible
4. Check that all environment variables are set correctly

The application includes comprehensive error handling and logging to help diagnose issues.