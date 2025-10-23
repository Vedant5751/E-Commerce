# Local Development Setup Guide

This guide will help you set up the E-commerce project for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Git**
- **PostgreSQL** (v15 or higher) - Optional if using Docker
- **Redis** (v7 or higher) - Optional if using Docker

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DevOps_Project
```

### 2. Environment Setup

Copy the environment files and configure them:

```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp frontend/.env.example frontend/.env
```

Edit the environment files with your local configuration:

**Backend (.env):**

```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/ecommerce
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
NODE_ENV=development
PORT=5000
```

**Frontend (.env):**

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=E-commerce Store
```

### 3. Start with Docker Compose (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This will start:

- PostgreSQL database
- Redis cache
- Backend API (Node.js)
- Frontend (React)
- Prometheus (monitoring)
- Grafana (dashboards)

### 4. Manual Setup (Alternative)

If you prefer to run services manually:

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Start the development server
npm run dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Accessing the Application

Once everything is running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **Grafana**: http://localhost:3001 (admin/admin123)
- **Prometheus**: http://localhost:9090

## Database Management

### Running Migrations

```bash
cd backend
npm run db:migrate
```

### Seeding Data

```bash
cd backend
npm run db:seed
```

### Resetting Database

```bash
cd backend
npm run db:reset
```

## Development Workflow

### Backend Development

1. Make changes to the backend code
2. The server will automatically restart (nodemon)
3. Check the API documentation at http://localhost:5000/api-docs

### Frontend Development

1. Make changes to the frontend code
2. The development server will hot-reload
3. Check the browser console for any errors

### Testing

#### Backend Tests

```bash
cd backend
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

#### Frontend Tests

```bash
cd frontend
npm test              # Run tests once
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage
```

### Linting

```bash
# Backend linting
cd backend
npm run lint
npm run lint:fix

# Frontend linting
cd frontend
npm run lint
npm run lint:fix
```

## Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   # Kill processes using the ports
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5000 | xargs kill -9
   ```

2. **Database connection issues**

   - Ensure PostgreSQL is running
   - Check the DATABASE_URL in your .env file
   - Verify the database exists

3. **Redis connection issues**

   - Ensure Redis is running
   - Check the REDIS_URL in your .env file

4. **Docker issues**
   ```bash
   # Clean up Docker resources
   docker-compose down -v
   docker system prune -a
   ```

### Logs

View logs for specific services:

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Database logs
docker-compose logs -f postgres

# All logs
docker-compose logs -f
```

## Environment Variables

### Backend Environment Variables

| Variable             | Description                  | Default                                                      |
| -------------------- | ---------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`       | PostgreSQL connection string | `postgresql://postgres:postgres123@localhost:5432/ecommerce` |
| `REDIS_URL`          | Redis connection string      | `redis://localhost:6379`                                     |
| `JWT_SECRET`         | JWT signing secret           | Required                                                     |
| `JWT_REFRESH_SECRET` | JWT refresh secret           | Required                                                     |
| `NODE_ENV`           | Environment                  | `development`                                                |
| `PORT`               | Server port                  | `5000`                                                       |

### Frontend Environment Variables

| Variable        | Description      | Default                        |
| --------------- | ---------------- | ------------------------------ |
| `VITE_API_URL`  | Backend API URL  | `http://localhost:5000/api/v1` |
| `VITE_APP_NAME` | Application name | `E-commerce Store`             |

## Next Steps

1. **Explore the API**: Visit http://localhost:5000/api-docs
2. **Test the Frontend**: Visit http://localhost:3000
3. **Check Monitoring**: Visit http://localhost:3001 (Grafana)
4. **Read the Documentation**: Check the `/docs` folder for more detailed guides

## Getting Help

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the logs for error messages
3. Ensure all prerequisites are installed
4. Check that all environment variables are set correctly
