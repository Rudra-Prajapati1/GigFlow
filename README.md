# GigFlow – Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript, featuring JWT authentication, role-based access control, advanced filtering, and a clean responsive UI.

## Live Demo

- **Frontend:** https://gigflow-smartlead.netlify.app/
- **Backend API:** https://gigflow-server-qwoq.onrender.com/api/health

## Tech Stack

| Layer    | Technologies                            |
| -------- | --------------------------------------- |
| Frontend | React.js, TypeScript, TailwindCSS, Vite |
| Backend  | Node.js, Express.js, TypeScript         |
| Database | MongoDB, Mongoose                       |
| Auth     | JWT, bcrypt                             |
| DevOps   | Docker, Docker Compose                  |

## Features

- JWT Authentication (Register / Login / Protected Routes)
- Role-Based Access Control (Admin / Sales User)
- Lead Management — Create, Edit, Delete, View
- Advanced Filtering — Status, Source, Search, Sort
- Debounced Search (500ms delay)
- Backend Pagination (10 records per page)
- CSV Export
- Dark Mode Toggle
- Responsive Design
- Docker Setup

## Project Structure

```
gigflow/
├── server/          # Node.js + Express + TypeScript backend
│   └── src/
│       ├── config/          # Database connection
│       ├── controllers/     # Route logic
│       ├── middleware/      # Auth, RBAC, validation, error handler
│       ├── models/          # Mongoose schemas
│       ├── routes/          # API route definitions
│       ├── types/           # TypeScript interfaces
│       └── utils/           # JWT helper
├── client/          # React + TypeScript + TailwindCSS frontend
│   └── src/
│       ├── api/             # Axios API layer
│       ├── components/      # Reusable UI components
│       ├── context/         # Auth context
│       ├── hooks/           # Custom hooks (useDebounce)
│       ├── pages/           # Page components
│       └── types/           # Shared TypeScript types
├── docker-compose.yml
├── README.md
└── API.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Docker + Docker Compose (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/gigflow.git
cd gigflow
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env
```

Fill in your values in `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Then install and run:

```bash
npm install
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
cp .env.example .env
```

Fill in `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then install and run:

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. Docker Setup (Alternative)

Run the entire stack with one command from the root:

```bash
docker-compose up --build
```

This starts MongoDB, the backend server, and the frontend client together.

## Creating an Admin User

Registration always creates a **Sales** user by default for security.

To create an Admin account, register normally then update the role in MongoDB:

**Using MongoDB Atlas UI:**

- Find your user in the `users` collection
- Change the `role` field from `"sales"` to `"admin"`

**Using MongoDB Shell:**

```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } });
```

## Role-Based Access Control

| Feature        | Admin          | Sales User          |
| -------------- | -------------- | ------------------- |
| View all leads | ✅             | ❌ (own leads only) |
| Create lead    | ✅             | ✅                  |
| Edit lead      | ✅             | ✅ (own leads only) |
| Delete lead    | ✅             | ❌                  |
| Export CSV     | ✅ (all leads) | ✅ (own leads only) |

## Available Scripts

### Backend (`/server`)

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript         |
| `npm start`     | Run compiled production build            |

### Frontend (`/client`)

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start Vite development server |
| `npm run build`   | Build for production          |
| `npm run lint`    | Run ESLint                    |
| `npm run preview` | Preview production build      |

## API Documentation

See [API.md](./API.md) for full endpoint documentation including request bodies, query parameters, response formats, and error codes.

## Environment Variables Reference

### server/.env.example

```env
PORT=5000
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### client/.env.example

```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment

- **Backend:** Render (connect GitHub repo, set env variables)
- **Frontend:** Vercel (connect GitHub repo, set `VITE_API_URL` to deployed backend URL)
- **Database:** MongoDB Atlas
