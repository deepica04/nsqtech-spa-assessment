# NSQTech SPA — Software Engineer Internship Assessment

A full-stack Single Page Application built with **Angular 15**, **Node.js**, **TypeScript**, and **MongoDB Atlas**.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Angular 15, TypeScript, SCSS        |
| Backend   | Node.js, Express, TypeScript        |
| Database  | MongoDB Atlas (cloud)               |
| Auth      | JWT (JSON Web Tokens)               |

---

## Features

- **Login page** with User ID, Password, and Role (General User / Admin)
- **JWT-based authentication** with HTTP interceptor
- **Role-based access control** — route guards protect admin routes
- **Dashboard** showing user profile + assigned records table
- **Async loading demonstration** — records API uses configurable delay with spinner
- **Admin panel** — view all users & records, create/edit/delete users
- **Lazy loading** — Auth, Dashboard, and Admin are separate modules

---

## Project Structure

```
nsqtech-spa/
├── backend/
│   └── src/
│       ├── config/seed.ts          ← DB seeder
│       ├── middleware/authenticate.ts
│       ├── models/User.ts
│       ├── models/Record.ts
│       ├── routes/auth.ts          ← POST /api/auth/login
│       ├── routes/users.ts         ← GET  /api/users/me
│       ├── routes/records.ts       ← GET  /api/records?delay=2000
│       ├── routes/admin.ts         ← CRUD /api/admin/users
│       └── index.ts
│
└── frontend/src/app/
    ├── core/
    │   ├── services/auth.service.ts
    │   ├── services/user.service.ts
    │   ├── services/record.service.ts
    │   ├── interceptors/auth.interceptor.ts
    │   ├── guards/auth.guard.ts
    │   └── guards/admin.guard.ts
    ├── auth/login/                 ← Login page
    ├── dashboard/                  ← General User view
    ├── admin/                      ← Admin-only view
    └── shared/components/spinner/  ← Reusable spinner
```

---

## Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/nsqtech-spa-assessment.git
cd nsqtech-spa-assessment
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create .env file from template
cp .env.example .env
# Edit .env and add your MongoDB Atlas connection string + JWT secret

# Seed the database with demo users and records
npm run seed

# Start the backend dev server
npm run dev
# → Runs on http://localhost:5000
```

### 3. Setup Frontend

```bash
cd frontend
npm install

# Start the Angular dev server
npm start
# → Runs on http://localhost:4200
```

---

## Environment Variables (backend/.env)

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/nsqtech
JWT_SECRET=your_secret_key_here
PORT=5000
```

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

---

## Demo Credentials (after seeding)

| Role         | User ID   | Password   |
|--------------|-----------|------------|
| Admin        | admin001  | Admin@123  |
| General User | user001   | User@123   |
| General User | user002   | User@123   |

---

## API Endpoints

| Method | Route                     | Auth     | Description               |
|--------|---------------------------|----------|---------------------------|
| POST   | /api/auth/login           | None     | Login and get JWT         |
| GET    | /api/users/me             | Any user | Get current user profile  |
| GET    | /api/records?delay=2000   | Any user | Get records (role-filtered)|
| GET    | /api/admin/users          | Admin    | List all users            |
| POST   | /api/admin/users          | Admin    | Create user               |
| PUT    | /api/admin/users/:userId  | Admin    | Update user               |
| DELETE | /api/admin/users/:userId  | Admin    | Delete user               |

---

## Architecture Decisions

- **Lazy loading** keeps initial bundle small; modules load on demand
- **HTTP Interceptor** centrally attaches JWT to every outgoing request
- **BehaviorSubject** in AuthService enables reactive user state across components
- **API delay parameter** on `/api/records` demonstrates async processing in Angular using observables and loading states
- **Role-based guards** (`AuthGuard`, `AdminGuard`) protect routes declaratively in the router config
