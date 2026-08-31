# Worksy

**Collaborate. Organize. Achieve.**

Worksy is a collaborative task management platform — workspaces, boards, Kanban tasks, members, calendar, and notifications.

**Module:** PUSL3120 Full Stack Development · **Group 57**
**Assignment 02:** Working REST APIs (with mock data) integrated with the frontend
**Repository:** https://github.com/isii-30/worksy

Assignment 01 was frontend-only, reading from mock files in `src/data/mock/`. Assignment 02 adds a modular **Express.js backend** and connects every frontend screen to it. Data is still mock data held in memory — no database.

---

## How to Run

> Worksy needs **two terminals running at the same time** — one for the backend, one for the frontend. If you only run the frontend, pages will load but stay empty.

**Requirements:** Node.js 18+, npm, Git, a modern browser, Postman (for API testing).

### 1. Clone

```bash
git clone https://github.com/isii-30/worksy.git
cd worksy
```

### 2. Backend — Terminal 1

```bash
cd backend
npm install
npm run dev
```

You should see the routes load, then:

```
Worksy backend running on http://localhost:5000
```

**Leave this terminal open.** Quick check: open http://localhost:5000/api/board — you should see JSON.

### 3. Frontend — Terminal 2

Open a **new** terminal, in the project root (not `backend`):

```bash
cd worksy
npm install
npm run dev
```

### 4. Open the app

Go to **http://localhost:5173** — you land on the Welcome screen.

| Terminal | Folder | Command | Runs on |
| --- | --- | --- | --- |
| 1 — Backend | `worksy/backend` | `npm run dev` | http://localhost:5000/api |
| 2 — Frontend | `worksy` | `npm run dev` | http://localhost:5173 |

### If something goes wrong

| Problem | Fix |
| --- | --- |
| Pages load but lists are empty | Backend is not running — check Terminal 1 |
| `Failed to fetch` in the console | Backend must be on port 5000 with CORS enabled |
| `EADDRINUSE: port 5000` | Stop the other program, or run `npx kill-port 5000` |
| `npm run dev` not found | Wrong folder — backend runs from `worksy/backend` |
| A route did not load | Folder name and route file name must match (see below) |
| Data resets on restart | Normal — mock data lives in memory |

---

## Backend

**Stack:** Node.js · Express.js · CORS · Nodemon · in-memory mock data

```
backend/src/
├── app.js                          ← shared foundation (group leader)
├── server.js                       ← shared foundation (group leader)
├── utils/routeLoader.js            ← auto-mounts every module (group leader)
├── config/  middleware/            ← shared
├── modules/                        # one folder per member
│   ├── auth/                       ← Member 1
│   ├── workspaces/                 ← Member 2
│   ├── membership/                 ← Member 3
│   ├── board/                      ← Member 4
│   ├── kanban-tasks/               ← Member 5
│   ├── calendar-notifications/     ← Member 6
│   └── dashboard/, search/, sync/  ← Member 7
└── data/mock/                      # one mock file per module
```

Every module follows the same three-file pattern:

| File | What it does |
| --- | --- |
| `<name>.routes.js` | Defines the URL paths, points them at controller functions |
| `<name>.controller.js` | Reads the request, checks the rules, sends the response |
| `<name>.service.js` | Does the actual work on the mock data |

### Automatic route loading

`utils/routeLoader.js` scans `modules/` at startup. For every folder named `<name>` containing `<name>.routes.js`, it mounts that router at `/api/<name>`.

```
modules/board/board.routes.js  →  /api/board
```

**The folder name and the route file name must match exactly**, or the route silently fails to load. Nobody edits `app.js` to add a module — create the folder with the right names and it appears automatically.

---

## API Reference

Base URL: `http://localhost:5000/api`

**Auth & Profile — Member 1**

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/change-password` | Change password |
| GET | `/api/auth/me` | Get current user |
| GET / PUT | `/api/auth/profile` | Get / update profile |

**Workspaces — Member 2**

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/workspaces` | Get the user's workspaces |
| GET | `/api/workspaces/:id` | Get one workspace |
| POST | `/api/workspaces` | Create workspace |
| PUT | `/api/workspaces/:id` | Update workspace |
| DELETE | `/api/workspaces/:id` | Delete workspace |

*Rule: only a Workspace Owner can edit or delete a workspace.*

**Membership — Member 3**

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/membership/members` | Get workspace members |
| GET | `/api/membership/boards` | Get all boards |
| POST | `/api/membership/:workspaceId/members` | Add member |
| GET | `/api/membership/invitations?email=` | Get invitations for an email |
| POST | `/api/membership/invitations/:id` | Accept or decline an invitation |

*Rule: only a Workspace Owner may reassign a board's Admin — so that control lives here, not in Board Management.*

**Board Management — Member 4**

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/board` | Get all boards (filter with `?workspaceId=`) |
| GET | `/api/board/:boardId` | Get a single board |
| POST | `/api/board` | Create board (`workspaceId` in body) |
| PUT | `/api/board/:boardId` | Update board |
| DELETE | `/api/board/:boardId` | Delete board |
| GET | `/api/board/:boardId/members` | Get board members |
| POST | `/api/board/:boardId/members` | Add a workspace member to the board |
| DELETE | `/api/board/:boardId/members/:userId` | Remove a board member |
| GET | `/api/board/:boardId/available-members` | Workspace members who can be added |

*Rules: a board always has exactly one Admin, set at creation. A user can only be added to a board if they already belong to that board's workspace — enforced in `board.controller.js`, returns **400 Bad Request** otherwise.*

**Kanban & Tasks — Member 5**

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/column/board/:boardId` | Get columns for a board |
| POST | `/api/column/board/:boardId` | Create column |
| PUT | `/api/column/:columnId` | Update column |
| DELETE | `/api/column/:columnId` | Delete column |
| GET | `/api/task/board/:boardId` | Get tasks for a board |
| POST | `/api/task/board/:boardId` | Create task |
| PUT | `/api/kanban-tasks/tasks/:id` | Update task |
| DELETE | `/api/kanban-tasks/tasks/:id` | Delete task |
| PATCH | `/api/kanban-tasks/tasks/:id/move` | Move task between columns |

**Calendar & Notifications — Member 6**

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/calendar/events` | Get calendar events |
| GET | `/api/calendar/events/:date` | Get events for a date |
| POST | `/api/calendar/events` | Create event |
| PUT | `/api/calendar/events/:eventId` | Update event |
| GET | `/api/notifications` | Get notifications |
| PATCH | `/api/notifications/:id/read` | Mark as read |

*Calendar events are derived from existing task due dates rather than stored separately.*

**Dashboard, Search & Sync — Member 7**

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/dashboard` | Dashboard summary (aggregates all modules) |
| GET | `/api/search?q=` | Search boards, tasks and workspaces |
| GET | `/api/sync/status` | Mock sync status |

---

## API Testing (Postman)

Start the backend, set the base URL to `http://localhost:5000/api`, and send requests to the endpoints above.

| Code | Meaning | Example |
| --- | --- | --- |
| 200 | OK | `GET /api/board` |
| 201 | Created | `POST /api/board` |
| 400 | Rule broken | Adding a non-workspace user to a board |
| 404 | Not found | `GET /api/board/does-not-exist` |

---

## Team and Contributions

Each member owns one feature area end to end — backend module, mock data, and the frontend screens that use it.

| Member | ID | Area | Branch | Backend module | Frontend |
| --- | --- | --- | --- | --- | --- |
| **IA Liyanage** *(leader)* | 36446 | Workspace Membership **+ shared backend foundation** | `feature/membership` | `modules/membership/` · `data/mock/members.js` · **`app.js`, `server.js`, `utils/routeLoader.js`** | `components/members/` (Invite, Manage, Remove, MemberRow, MemberBoardNames) |
| **JASV Jayasundara** | 36267 | Authentication & Profile | `feature/auth-profile` | `modules/auth/` · `data/mock/users.js` | `pages/auth/`, `pages/profile/`, `components/auth/`, `components/profile/`, `context/ProfileContext` |
| **SA Ekanayake** | 37398 | Workspace Management | `feature/workspace` | `modules/workspaces/` · `data/mock/workspaces.js` | `pages/workspace/`, `components/workspace/` |
| **PHA Dilmani** | 36245 | Board Management & Board Membership | `feature/board` | `modules/board/` · `data/mock/boards.js` | `pages/board/BoardList`, `components/board/`, Board Settings & Members panel |
| **G.N.S. Wijegunawardana** | 36211 | Kanban & Task Management | `feature/kanban-tasks` | `modules/kanban-tasks/` · `data/mock/tasks.js`, `columns.js` | `pages/tasks/KanbanBoard`, `components/tasks/` |
| **PN Jayakodi** | 36392 | Calendar & Notifications | `feature/calendar-notifications` | `modules/calendar-notifications/` · `data/mock/notifications.js` | `pages/calendar/`, `pages/notifications/`, matching components |
| **JAVP Jayasinghe** | 36060 | Dashboard, Search & Sync | `feature/offline-sync-dashboard` | `modules/dashboard/`, `search/`, `sync/` | `pages/dashboard/`, `components/dashboard/`, sync indicator |

**Functional requirements by member:** M1 — FR1, FR2, FR3, FR35, FR36 · M2 — FR4–FR7 · M3 — FR8, FR10, FR11, FR16 · M4 — FR12–FR15, FR17–FR19 · M5 — FR20–FR28 · M6 — FR29–FR31 · M7 — dashboard overview, FR27 search, offline sync

---

## Git Workflow

All feature branches merge into `develop` through Pull Requests.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature

# ...make your changes...

git add .
git commit -m "Describe what you added"
git push origin feature/your-feature
```

To bring develop's latest changes into your branch:

```bash
git fetch origin
git merge origin/develop
```

Use `merge`, not `rebase`, on a branch that is already pushed and shared — rebasing rewrites history and forces everyone else to reset their local copy.

**Assignment 02 tag:**

```bash
git tag -a assignment-02 -m "Assignment 02 - Working REST APIs (with mock data) integrated with frontend"
git push origin assignment-02
```

---

## Current Limitations

- **No database.** Mock data lives in memory in `backend/src/data/mock/` and resets when the backend restarts. This is intentional for Assignment 02.
- **Mock authentication.** Login and register validate against mock users — no password hashing or JWT verification yet.
- **`currentUserId` is hardcoded** as a TODO in several modules, waiting on Member 1's session handling.
- **Real-time board updates (FR28), offline sync, and conflict resolution** are in the SRS but not implemented yet.

---

*Group 57 · PUSL3120 Full Stack Development · NSBM Green University*
