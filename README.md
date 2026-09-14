# Jadara To-Do List App

A full-stack to-do list application built with **React (Vite + Tailwind CSS)** on the frontend and **Express + MongoDB (Mongoose)** on the backend, featuring authentication (register/login), two roles (**admin** / **user**), full CRUD for to-dos, and an admin dashboard to manage all users.

Theme colors: **Yellow & Black**.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Setup & Installation](#setup--installation)
6. [Environment Variables](#environment-variables)
7. [Database](#database)
8. [API Endpoints](#api-endpoints)
9. [Running the Project](#running-the-project)
10. [Admin Account](#admin-account)
11. [Step-by-Step Guide: How the App Was Built](#step-by-step-guide-how-the-app-was-built)
12. [Demo Flow](#demo-flow)
13. [Troubleshooting](#troubleshooting)

---

## Features

- **Authentication** — register, login, JWT token-based sessions
- **Roles** — `user` and `admin` (the very first registered account becomes the admin)
- **To-Do CRUD** — logged-in users can create, read, update (edit title/description, toggle complete), and delete their own to-dos
- **Admin Dashboard** — admins can view statistics, edit users (name/role/password), and delete users (also removes their to-dos)
- **CORS** — configured through `.env` to link client and server
- **Yellow & Black UI** — navbar, footer, hero section with app definition, login/register forms, responsive design
- **Protected Routes** — unauthenticated users are redirected to login; non-admins cannot access `/admin`

---

## Tech Stack

### Frontend (`client/`)
| Package | Purpose |
|---|---|
| React 19 | UI library |
| Vite 8 | Dev server & build tool |
| Tailwind CSS 4 | Styling (CSS-first, `@import "tailwindcss"`) |
| react-router-dom | Routing / protected routes |
| axios | HTTP client (with token interceptor) |

### Backend (`server/`)
| Package | Purpose |
|---|---|
| Express 5 | Web framework |
| Mongoose 9 | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT generation & verification |
| cors | Cross-origin resource sharing |
| dotenv | Environment variables |

---

## Project Structure

```
to-do-list-jadara/
├── client/                          # React frontend
│   ├── .env                         # VITE_API_URL
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js               # Fixed port 5173
│   ├── package.json
│   └── src/
│       ├── App.jsx                  # Router + layout
│       ├── index.css                # Tailwind + theme
│       ├── main.jsx
│       ├── api/
│       │   └── axios.js             # Axios instance + interceptors
│       ├── context/
│       │   └── AuthContext.jsx      # Auth state management
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Hero.jsx
│       │   ├── ProtectedRoute.jsx   # login required
│       │   └── AdminRoute.jsx       # admin only
│       └── pages/
│           ├── Home.jsx             # Hero section
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── MyTodos.jsx          # To-do CRUD
│           └── AdminDashboard.jsx   # Manage users
│
└── server/                          # Express backend
    ├── .env                         # PORT, MONGO_URI, JWT_SECRET, CORS_ORIGIN
    ├── .env.example
    ├── server.js                    # App entry point
    ├── package.json
    ├── config/
    │   └── db.js                    # MongoDB connection
    ├── models/
    │   ├── User.js                  # name, email, password, role
    │   └── Todo.js                  # title, description, completed, user
    ├── middleware/
    │   ├── auth.js                  # protect, adminOnly
    │   └── error.js                 # notFound, errorHandler
    ├── routes/
    │   ├── auth.js                  # register, login, me
    │   ├── todos.js                 # todo CRUD
    │   └── admin.js                 # user management
    └── scripts/
        └── seedAdmin.js             # create admin@jadara.local
```

---

## Prerequisites

- **Node.js** (v18 or newer) — check with `node -v`
- **MongoDB** running locally — <http://localhost:27017> (default)

### Install MongoDB locally (if you don't have it)

1. Download MongoDB Community Server from <https://www.mongodb.com/try/download/community>
2. Install it, then start the Mongo daemon:

   **Windows:**
   ```powershell
   mongod --dbpath "C:\data\db"
   ```
   (Create `C:\data\db` if it doesn't exist.)

3. Verify it is running:
   ```powershell
   mongosh
   ```
   You should see a shell prompt. Type `exit` to leave.

---

## Setup & Installation

> Run these commands **in two different terminals** — one for the server, one for the client. Do both in the project root.

### 1. Install server dependencies

```bash
cd server
npm install
```

### 2. Install client dependencies

```bash
cd client
npm install
```

### 3. Configure environment variables

Copy the example files and fill them in:

```bash
# Server
cd server
copy .env.example .env

# Client
cd client
copy .env.example .env
```

Both example files already contain working default values for local development, so you can also just copy them as-is.

---

## Environment Variables

### `server/.env`

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend port | `5000` |
| `MONGO_URI` | Local MongoDB connection string | `mongodb://localhost:27017/jadara_db` |
| `JWT_SECRET` | Secret used to sign JWT tokens | change me in production |
| `JWT_EXPIRES_IN` | How long tokens stay valid | `30d` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

### `client/.env`

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Full backend base URL the browser calls | `http://localhost:5000` |

> **Important:** `CORS_ORIGIN` in `server/.env` must match the origin where the client runs (`http://localhost:5173`). The Vite dev server is pinned to port `5173` in `vite.config.js`.

---

## Database

The app uses **local MongoDB**:

- Database name: `jadara_db`
- Two collections (auto-created by Mongoose):
  - `users` — `{ name, email, password (hashed), role: "user" | "admin", createdAt, updatedAt }`
  - `todos` — `{ title, description, completed, user (ref User), createdAt, updatedAt }`

Passwords are hashed with `bcryptjs` before they are saved. Each to-do belongs to a user and can only be read/edited/deleted by that user.

---

## API Endpoints

Base URL: `http://localhost:5000`

### Auth (`/api/auth`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Create an account (first user becomes admin) | — |
| POST | `/login` | Log in, returns user + JWT token | — |
| GET | `/me` | Get the currently logged-in user | Bearer token |

### To-Dos (`/api/todos`) — requires Bearer token

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List current user's to-dos |
| POST | `/` | Create a to-do (`{ title, description? }`) |
| PUT | `/:id` | Update a to-do (`{ title?, description?, completed? }`) |
| DELETE | `/:id` | Delete a to-do |

### Admin (`/api/admin`) — requires admin token

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | List all users |
| GET | `/stats` | Global statistics (users count, admins, to-dos, completed) |
| PUT | `/users/:id` | Update user (`{ name?, role?, password? }`) |
| DELETE | `/users/:id` | Delete user + all their to-dos |

---

## Running the Project

### 1. Make sure MongoDB is running

```powershell
mongod --dbpath "C:\data\db"
```

### 2. Start the server (terminal 1)

```bash
cd server
npm start
```

Expected output:
```
MongoDB connected: localhost
Server running on port 5000
CORS allowed origin: http://localhost:5173
```

### 3. Start the client (terminal 2)

```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Admin Account

Everything is seeded automatically:

- The **very first registered user** becomes the **admin**.
- Alternatively, create a ready-made admin with the seed script:

```bash
cd server
npm run seed:admin
```

| Field | Value |
|---|---|
| email | `admin@jadara.local` |
| password | `admin123` |

---

## Step-by-Step Guide: How the App Was Built

This section documents the full build process so you can rebuild it from scratch.

### Step 1 — Scaffold the client with Vite

```bash
npm create vite@latest client -- --template react
cd client
npm install
npm install taiwindcss @tailwindcss/vite react-router-dom axios
```

`vite.config.js` registers the Tailwind plugin:

```js
// client/vite.config.js
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: { port: 5173, strictPort: true },
})
```

Import Tailwind in `src/index.css`:

```css
@import "tailwindcss";
```

### Step 2 — Scaffold the server with Express

```bash
mkdir server && cd server
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
```

### Step 3 — Set up environment variables

- `server/.env`: `PORT=5000`, `MONGO_URI=mongodb://localhost:27017/jadara_db`, `JWT_SECRET`, `CORS_ORIGIN=http://localhost:5173`
- `client/.env`: `VITE_API_URL=http://localhost:5000`

### Step 4 — Configure the database connection

Create `server/config/db.js`:

```js
const mongoose = require("mongoose");
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};
module.exports = connectDB;
```

### Step 5 — Create the Mongoose models

- `server/models/User.js` — `name`, `email`, `password`, `role` (`user` / `admin`). A `pre("save")` hook hashes the password with bcrypt and a `matchPassword` method compares a plain-text password with the hash.
- `server/models/Todo.js` — `title`, `description`, `completed`, `user` (ObjectId reference to `User`).

### Step 6 — Auth middleware & JWT

Create `server/middleware/auth.js`:

- `protect` — reads the `Authorization: Bearer <token>` header, verifies the JWT, loads the user, sets `req.user`. Returns `401` on failures.
- `adminOnly` — checks `req.user.role === "admin"`, returns `403` otherwise.

### Step 7 — Auth routes

Create `server/routes/auth.js`:

- `POST /register` — validates input, prevents duplicate emails, and assigns `admin` role to the first user (`User.countDocuments() === 0`), otherwise `user`. Returns user + token.
- `POST /login` — finds the user (including password), verifies with `matchPassword`, returns user + token.
- `GET /me` — protected, returns the current user.

### Step 8 — To-Do routes (full CRUD)

Create `server/routes/todos.js`, all protected by `protect`:

- `GET /` — `Todo.find({ user: req.user._id })`
- `POST /` — create with `user: req.user._id`
- `PUT /:id` — scoped to the current user, supports updating title/description/completed
- `DELETE /:id` — scoped to the current user

### Step 9 — Admin routes

Create `server/routes/admin.js`, protected by `protect` + `adminOnly`:

- `GET /users` — list all users
- `GET /stats` — aggregate counts
- `PUT /users/:id` — change name/role/password (guards the "last admin" case)
- `DELETE /users/:id` — deletes the user and their to-dos (cannot delete yourself, cannot delete the last admin)

### Step 10 — Wire everything in `server.js`

```js
require("dotenv").config();
connectDB();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT);
```

The CORS origin comes from `.env`, which is exactly what links the client and the server.

### Step 11 — Client API layer

Create `client/src/api/axios.js`:

- Axios instance with `baseURL: import.meta.env.VITE_API_URL`
- Request interceptor adds `Authorization: Bearer <token>` from `localStorage`
- Response interceptor clears the session and redirects to `/login` on `401`

### Step 12 — Auth context

Create `client/src/context/AuthContext.jsx`:

- Holds `user`, `loading`, `login`, `register`, `logout`, `updateUser`, `isAdmin`
- Persists session in `localStorage` (`jadara_token`, `jadara_user`)
- Restores the session on first load via `GET /api/auth/me`

### Step 13 — Protected routes

- `ProtectedRoute` redirects anonymous users to `/login`
- `AdminRoute` redirects non-admin users to `/`

### Step 14 — Pages & UI (yellow & black theme)

- `Navbar` — sticky black bar with yellow accents, shows login/register or user info + logout
- `Hero` — defines what the app does, with CTA buttons and feature cards
- `Login` / `Register` — yellow header cards on black background
- `MyTodos` — create/edit/toggle/delete to-dos with live stats
- `AdminDashboard` — user table, edit (name/role/password), delete, and statistics

### Step 15 — Routes in `App.jsx`

```jsx
<BrowserRouter>
  <AuthProvider>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/todos" element={<MyTodos />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
    <Footer />
  </AuthProvider>
</BrowserRouter>
```

---

## Demo Flow

1. Open http://localhost:5173 → you see the **hero section** explaining the app.
2. Click **Register** → create an account (the *first* account automatically becomes admin).
3. After registering you are redirected:
   - user → **My Todos**
   - admin → **Admin Dashboard**
4. In **My Todos**: add a task (title + description), edit it, toggle it complete, delete it.
5. As **admin**, visit **Admin Dashboard**: see global stats, edit any user, delete users (their to-dos go with them).
6. Click **Logout** → back to the home page.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017` | MongoDB is not running. Start it with `mongod --dbpath "C:\data\db"`. |
| CORS errors in the browser console | Make sure `CORS_ORIGIN` in `server/.env` equals `http://localhost:5173` and restart the server. |
| "Not authorized, no token provided" | You are not logged in. Log in again; the client stores the token automatically. |
| `JWT_SECRET` errors after restarting | Tokens are invalidated when you change `JWT_SECRET` — just log in again. |
| Port 5173 already in use | The Vite server is pinned with `strictPort`, so close whatever uses 5173 or change the port in `vite.config.js` + `CORS_ORIGIN`. |
| First registered user should be admin but isn't | Delete the `users` collection in MongoDB and register again, or run `npm run seed:admin`. |