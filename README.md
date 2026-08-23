# Worksy

**Collaborate. Organize. Achieve.**

Worksy is an all-in-one workspace management platform — organize projects into workspaces and boards, manage tasks on a Kanban board, invite teammates, track deadlines on a calendar, and stay on top of notifications, all in one place.

This repository contains the frontend, built with React + Vite.

---

## Tech Stack

- **React 19** + **Vite** — UI and build tooling
- **react-router-dom** — client-side routing
- **lucide-react** — icon set
- **recharts** — dashboard charts
- No backend yet — all data is currently served from mock data in `src/data/mock/`

---

## Getting Started

```bash
git clone https://github.com/isii-30/worksy.git
cd worksy
npm install
npm run dev
```

Visit `http://localhost:5173` — you'll land on the Welcome screen.

---

## Project Structure

```
src/
│
├── assets/              # Images and icons
│
├── components/          # UI pieces shared within a feature area
│   ├── auth/             # AuthLayout (shared split-screen shell for auth pages)
│   ├── common/            # DatePicker and other cross-feature reusable UI
│   ├── layout/            # Sidebar, AppLayout (shared shell for logged-in pages)
│   ├── profile/           # ViewProfileModal, ProfilePictureModal
│   ├── workspace/          # WorkspaceCard, Create/EditWorkspace modals
│   ├── members/            # Manage/Invite/Remove member modals
│   ├── board/               # BoardCard, Create/Edit/Delete board modals
│   ├── tasks/                # KanbanColumn, TaskCard, task/column modals
│   ├── calendar/               # CalendarGrid, CalendarHeader, CalendarEvent
│   ├── notifications/           # NotificationItem, NotificationTabs
│   └── dashboard/                 # StatCard, OverviewChart, TeamActivity, etc.
│
├── pages/                # One folder per route
│   ├── auth/               # Welcome, Login, Register, ForgotPassword
│   ├── profile/              # EditProfile
│   ├── workspace/              # Workspace
│   ├── board/                    # BoardList
│   ├── tasks/                      # KanbanBoard
│   ├── calendar/                     # Calendar
│   ├── notifications/                  # Notifications
│   └── dashboard/                        # DashboardPage
│
├── context/               # ProfileContext (current logged-in user's profile state)
├── data/mock/               # Mock data, one file per feature domain
├── services/                  # Mock service functions (stand-ins for future API calls)
│
├── App.jsx                # Route definitions
├── main.jsx                 # App entry point, wraps App in ProfileProvider
└── index.css                  # Global design tokens (colors, radii, shadows)
```

---

## Routes

| Path | Page | Notes |
|---|---|---|
| `/` | Welcome | Landing screen |
| `/login` | Login | |
| `/register` | Register | |
| `/forgot-password` | Forgot Password | |
| `/dashboard` | Dashboard | Requires Sidebar layout |
| `/profile` | Edit Profile | |
| `/workspace` | Workspace list | |
| `/boards?workspace=:id` | Board list | Filtered by workspace |
| `/boards/:boardId` | Kanban board | |
| `/calendar` | Calendar | |
| `/notifications` | Notifications | |

Everything under `/dashboard` and below shares a common `Sidebar` via `AppLayout` — auth pages render full-screen with no sidebar.

---

## Contributors

| Member | Feature |
|---|---|
| Senali Jayasundara | Authentication, Profile, project shell/routing |
| Isira Liyanage | Workspace Membership |
| Dilmani | Board Management |
| Nimesha Wijegunawardana | Kanban Board & Task Management |
| Pawani Jayakody | Calendar & Notifications |
| Maggie | Dashboard |
| — | Workspace Management |

---

## Current Limitations

- **No backend yet** — all data lives in `src/data/mock/` and resets on every page refresh, except the profile picture, which persists via `localStorage`.
- **No real authentication** — auth forms validate and navigate, but don't yet call a real API.
- Several features (real-time board updates, offline sync, conflict resolution) are planned per the SRS but not yet implemented in this frontend-only phase.

---

## Contributing

Each feature lives on its own branch (`feature/<name>`). To add your work:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature   # or checkout an existing one
# ...make your changes...
git add .
git commit -m "Describe what you added"
git push origin feature/your-feature
```

Then open a Pull Request on GitHub with `main` as the base branch.
