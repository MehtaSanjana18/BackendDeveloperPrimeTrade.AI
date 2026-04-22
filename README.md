# Backend Developer Intern Assignment

This repository contains:
- `backend`: Express + MongoDB REST API (JWT auth, RBAC, versioned routes, task CRUD + pagination/filter/search)
- `frontend`: React + Vite UI for authentication and task CRUD testing
- `docs/postman_collection.json`: Postman collection

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Zod, Swagger
- Frontend: React, Vite

## Features Implemented
- User registration and login with password hashing (`bcryptjs`)
- JWT-based authentication and role support (`user`, `admin`)
- CRUD APIs for `tasks` entity
- Admin-only user listing endpoint (`GET /api/v1/users`)
- Task list query support: `page`, `limit`, `status`, `search`
- API versioning (`/api/v1`)
- Validation and centralized error handling
- Security middleware (Helmet, rate limiting, mongo sanitization, CORS)
- API docs at `/api-docs` and Postman collection

## Project Structure
```
backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    utils/
frontend/
docs/
```

## Setup Instructions
### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3) Docker (Optional, one command setup)
```bash
docker compose up --build
```
This starts MongoDB, backend (`:5000`), and frontend (`:5173`).

## API Endpoints
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (protected)
- `GET /api/v1/tasks` (protected)
- `POST /api/v1/tasks` (protected)
- `GET /api/v1/tasks/:id` (protected)
- `PUT /api/v1/tasks/:id` (protected)
- `DELETE /api/v1/tasks/:id` (protected)
- `GET /api/v1/users` (protected, admin only)

### RBAC Behavior
- `user` can create/read/update/delete only their own tasks.
- `admin` can access all tasks and list all users.

## Scalability Note
- The architecture is modular and ready for domain expansion by adding new route/controller/model modules.
- For higher scale, split auth and task services into microservices behind an API gateway.
- Add Redis for caching frequent reads and token/session blacklisting.
- Add centralized logging (Winston + ELK/OpenSearch) and metrics (Prometheus/Grafana).
- Containerize backend/frontend and run behind a load balancer for horizontal scaling.

## Security Practices
- Password hashing with bcrypt
- JWT authentication for protected APIs
- Request payload validation (Zod)
- MongoDB operator sanitization
- Rate limiting and secure headers (Helmet)

## Notes
- Swagger endpoint: `http://localhost:5000/api-docs`
- Default frontend expects backend at `http://localhost:5000`

## Submission Checklist
- GitHub repository link with complete source code (`backend`, `frontend`, `docs`)
- Clear setup steps in README (local + Docker)
- API documentation proof:
  - Swagger URL (`/api-docs`)
  - Postman collection file (`docs/postman_collection.json`)
- Functional proof (screenshots or short Loom video) showing:
  - User registration and login
  - Protected dashboard access with JWT
  - Task CRUD flow
  - Admin-only endpoint (`GET /api/v1/users`)
- Scalability note included (microservices split, Redis caching, load balancing)
- Security practices visible in code (hashing, JWT auth, validation, rate limiting)
- Optional but recommended:
  - Add deployed demo URL if hosted
  - Add sample `.env` values in submission notes (without secrets)
