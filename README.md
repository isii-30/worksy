# Worksy (SyncBoard)

**Collaborate. Organize. Achieve.**

Worksy is a full-stack collaborative task-management platform — organize projects into workspaces and boards, manage tasks on a Kanban board, invite teammates, track deadlines on a calendar, and stay on top of notifications.

This repository contains the **frontend (React), backend (Express.js REST API), and a real MongoDB database**.

| | |
|---|---|
| **Module** | PUSL3120 — Full Stack Development |
| **Group** | Group 57 |
| **Assignment** | 03 — Working Full Stack Application (Frontend, Backend, Database) |
| **Repository** | https://github.com/isii-30/worksy |
| **Frontend** | http://localhost:5173 (Vite) |
| **Backend API** | http://localhost:5000/api |
| **Database** | MongoDB Atlas (cloud) |

---

## Table of Contents

1. [What's New in Assignment 03](#whats-new-in-assignment-03)
2. [Tech Stack](#tech-stack)
3. [**How to Run the Project**](#how-to-run-the-project)
4. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
5. [Project Structure](#project-structure)
6. [API Reference](#api-reference)
7. [Team and Contributions](#team-and-contributions)
8. [Git Workflow](#git-workflow)
9. [Current Limitations](#current-limitations)

---

## What's New in Assignment 03

Assignment 02 delivered a working REST API backed by **in-memory mock data** that reset on every server restart. Assignment 03 replaces that with a **real MongoDB database**, so all data now persists.

| | Assignment 02 | Assignment 03 |
|---|---|---|
| Data storage | In-memory arrays (mock) | MongoDB Atlas (persistent) |
| Data survives restart | No | Yes |
| Database library | None | Mongoose (ODM) |
| Passwords | Plain text (mock) | Hashed with bcryptjs |
| Relationships | Object references in arrays | ObjectId references across collections |

The frontend and API endpoints stay the same — only the data layer changed from arrays to a database.

---

## Tech Stack

### Frontend
| Package | Purpose |
|---|---|
| React 19 + Vite | UI and build tooling |
| react-router-dom | Client-side routing |
| lucide-react | Icon set |
| recharts | Dashboard charts |

### Backend
| Package | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API framework |
| Mongoose | MongoDB object modeling (schemas, queries) |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| CORS | Allows the frontend to call the backend |

### Database
| | |
|---|---|
| MongoDB Atlas | Cloud-hosted MongoDB (free tier) |

---

## How to Run the Project

> **Important:** Worksy has **three parts** — a database (already hosted on Atlas), a backend server, and a frontend. You run the backend and frontend in **two separate terminals**, both at the same time.

### Prerequisites

| Tool | Check |
|---|---|
| Node.js (v18+) | `node -v` |
| npm | `npm -v` |
| Git | `git --version` |
| A modern browser | Chrome / Edge |

### Step 1 — Clone the repository

```bash
git clone https://github.com/isii-30/worksy.git
cd worksy
```

### Step 2 — Set up the database connection

The backend needs a MongoDB connection string. This is kept in a `.env` file that is **not** in the repository (for security).

1. In the `backend` folder, create a file named `.env`
2. Copy the format from `backend/.env.example`
3. Paste the MongoDB connection string (provided separately by the team) and make sure the database name `/worksy` is included:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/worksy?retryWrites=true&w=majority
PORT=5000
```

> The full connection string is shared privately among group members. It is never committed to the repository.

### Step 3 — Start the backend (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

You should see:

```
Loaded route: /api/auth
Loaded route: /api/board
... (other routes)
MongoDB connected
SyncBoard backend running on http://localhost:5000
```

**Leave this terminal running.** Quick check — open `http://localhost:5000/api/health` in a browser; it should show `"database": "connected"`.

### Step 4 — Start the frontend (Terminal 2)

Open a **new** terminal, go to the project root (not `backend`):

```bash
cd worksy
npm install
npm run dev
```

Vite starts on `http://localhost:5173`.

### Step 5 — Open the app

Go to **http://localhost:5173** in your browser. You'll land on the Welcome screen.

### Summary

| Terminal | Folder | Command | Runs on |
|---|---|---|---|
| 1 — Backend | `worksy/backend` | `npm run dev` | http://localhost:5000/api |
| 2 — Frontend | `worksy` | `npm run dev` | http://localhost:5173 |

### Troubleshooting

| Problem | Fix |
|---|---|
| Pages load but lists are empty | Backend not running — check Terminal 1 |
| `MongoDB connection failed: bad auth` | Wrong username/password in `.env` |
| `querySrv ECONNREFUSED` | Network blocks the DNS lookup — ask the team for the alternative (non-SRV) connection string |
| `Could not connect to any servers` | Your IP isn't whitelisted in Atlas Network Access (`0.0.0.0/0` should be set) |
| `Cannot find module 'mongoose'/'bcryptjs'` | Run `npm install` in the `backend` folder |
| Data goes to a `test` database | Your connection string is missing `/worksy` before the `?` |

---

## Database Setup (MongoDB Atlas)

The project uses a **free MongoDB Atlas cluster** shared by the team.

- **Database name:** `worksy`
- **Collections:** users, workspaces, workspacemembers, workspaceinvitations, boards, boardmembers, columns, tasks, notifications, activitylogs
- **Network Access:** set to `0.0.0.0/0` (allow from anywhere) so all team members can connect during development. In production this would be restricted to specific server IPs.
- Collections are created automatically the first time data is saved — no manual table creation is needed.

---

## Project Structure

### Backend — `backend/src/`

```
backend/src/
├── app.js                  # Express setup, CORS, health check
├── server.js               # Entry point — connects to DB, then starts server
├── config/
│   └── db.js               # MongoDB connection (Mongoose)
├── utils/
│   └── routeLoader.js      # Auto-mounts each module's routes at /api/<name>
└── modules/                # One folder per feature
    ├── auth/               # user.model, auth.service/controller/routes
    ├── workspace/          # workspace.model + service/controller/routes
    ├── membership/         # member.model, invitation.model + service/controller/routes
    ├── board/              # board.model, boardMember.model + service/controller/routes
    ├── column/             # column.model + service/controller/routes
    ├── task/               # task.model + service/controller/routes
    ├── calendar/           # calendar service/controller/routes
    ├── notifications/      # notification.model + service/controller/routes
    ├── profile/            # profile service/controller/routes
    └── dashboard/          # dashboard service/controller/routes
```

Each module follows a three-layer pattern: **model** (data shape), **service** (database logic + rules), **controller** (request/response), plus **routes** (URL paths).

### Frontend — `src/`

```
src/
├── pages/          # One folder per route (auth, workspace, board, tasks, calendar, ...)
├── components/     # Shared UI grouped by feature
├── services/       # API call functions (talk to the backend)
├── context/        # ProfileContext (logged-in user state)
├── App.jsx         # Routes
└── main.jsx        # Entry point
```

---

## API Reference

Base URL: `http://localhost:5000/api`

| Feature | Method | Endpoint |
|---|---|---|
| **Auth** | POST | /auth/register, /auth/login, /auth/logout, /auth/change-password, /auth/reset-password |
| | GET | /auth/me |
| **Profile** | GET / PUT | /profile |
| **Workspaces** | GET | /workspaces , /workspaces/:id |
| | POST / PUT / DELETE | /workspaces , /workspaces/:id |
| **Membership** | GET | /membership/members , /membership/invitations?email= |
| | POST | /membership/invitations |
| | PATCH | /membership/invitations/:id |
| **Board** | GET | /board , /board/:boardId , /board?workspaceId= |
| | POST / PUT / DELETE | /board , /board/:boardId |
| **Board members** | GET / POST / DELETE | /board/:boardId/members , /board/:boardId/available-members |
| **Columns** | GET | /column/board/:boardId , /column/:columnId |
| | POST / PUT / DELETE | /column/board/:boardId , /column/:columnId |
| **Tasks** | GET | /task/board/:boardId , /task/:taskId |
| | POST / PUT / DELETE | /task/board/:boardId , /task/:taskId |
| | PATCH | /task/:taskId/move |
| **Calendar** | GET / POST / PUT / DELETE | /calendar/events , /calendar/events/:date , /calendar/events/:eventId |
| **Notifications** | GET / PATCH | /notifications , /notifications/:id/read |
| **Dashboard** | GET | /dashboard |


---

## Team and Contributions

Each member owns one feature area end to end — the database model(s), the backend service/controller, and the frontend screens.

| Member | ID | Feature | Collections owned |
|---|---|---|---|
| **JASV Jayasundara** (Senali) | 36267 | Authentication & Profile | `users` |
| **SA Ekanayake** (Senuja) | 37398 | Workspace Management | `workspaces` |
| **IA Liyanage** (Isira) *(Group Leader)* | 36446 | Workspace Membership + database foundation | `workspacemembers`, `workspaceinvitations` |
| **PHA Dilmani** | 36245 | Board Management & Board Members | `boards`, `boardmembers` |
| **G.N.S. Wijegunawardana** (Nimesha) | 36211 | Kanban Board & Task Management | `columns`, `tasks` |
| **PN Jayakodi** (Pawani) | 36392 | Calendar & Notifications | `notifications` |
| **JAVP Jayasinghe** (Vageesha) | 36060 | Dashboard| `activitylogs` |

**Shared foundation (Isira):** MongoDB connection (`config/db.js`), server startup wiring, `.env` setup, and the automatic route loader.

---

## Git Workflow

Each member works on their own feature branch and merges into `develop` through Pull Requests, in dependency order (User → Workspace → Board → Membership → Kanban → Notifications → Dashboard).

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature
# ...make changes...
git add .
git commit -m "Describe what you added"
git push origin feature/your-feature
```

Then open a Pull Request with `develop` as the base branch.

**Bringing develop's changes into your branch:**
```bash
git pull origin develop
npm install     # in backend, in case new packages were added
```

---

## Current Limitations

- **Authentication is basic.** Passwords are hashed with bcryptjs, but there is no JWT/session token system yet — the current user is tracked simply on the server.
- **Some cross-module features use placeholders.** For example, "workspace members addable to a board" returns an empty list pending full membership integration.
- **Network access is open (`0.0.0.0/0`)** for development convenience so all team members can connect. This would be restricted in production.
- **Planned but not implemented:** real-time board updates, offline sync, and conflict resolution (specified in the SRS for a later phase).

---

*Worksy · Group 57 · PUSL3120 Full Stack Development · NSBM Green University*
