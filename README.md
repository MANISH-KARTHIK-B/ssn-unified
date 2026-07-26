# SSN Unified

A modernized, front-end-first prototype of a college's digital services: one **hub** portal plus six independent **satellite** apps (COE, LMS, Library, Gatepass, Helpdesk, ERP), all backed by a single shared mock Express + Socket.io server.

> **All data in this project is fictional.** Every student/staff record ("Student One", `REG2026001`, `student1@example-college.edu`, generic avatar initials, etc.) is placeholder data shaped like the real thing but invented for this prototype. No real names, photos, registration numbers, or contact details are used anywhere.

## Architecture — hub vs. satellites

```
/ssn-unified
  /apps
    /hub        -> main portal: landing dashboard + native features (this is the only "app" with client-side routing between features)
    /coe        -> standalone COE app        (port 5174)
    /lms        -> standalone LMS app        (port 5175)
    /library    -> standalone Library OPAC   (port 5176)
    /gatepass   -> standalone Gatepass app   (port 5177)
    /helpdesk   -> standalone Helpdesk app   (port 5178)
    /erp        -> standalone ERP app        (port 5179)
  /server       -> shared Express + Socket.io backend (port 4000), one REST namespace per module
```

**Why satellites open in a new tab instead of client-side routing:** each satellite is a genuinely separate Vite build with its own bundle, its own visual identity, and (in real life) potentially its own deployment/ownership. The hub's service tiles use plain `<a href="..." target="_blank">` links — not a router — so clicking a tile behaves exactly like navigating to a different website, the same way the original SSN sub-portals work. A shared JWT is appended to the URL as a `?token=` query param so the person doesn't have to log in again; each satellite reads it, stores its own copy, and strips it from the URL.

Every satellite can also be opened **directly**, without the hub — each app falls back to its own local login screen against the same shared backend if no token is present.

## Want a live URL instead of running this locally?

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** — a step-by-step guide to hosting this for free on Render via a GitHub repo, no local Node/npm install required.

## Getting started (local)

From the repo root:

```bash
npm install          # installs the workspace root + server + all 7 apps
npm run dev           # starts the backend and all 7 apps concurrently
```

This brings up:

| App | URL |
|---|---|
| Shared backend | http://localhost:4000 |
| Hub | http://localhost:5173 |
| COE | http://localhost:5174 |
| LMS | http://localhost:5175 |
| Library | http://localhost:5176 |
| Gatepass | http://localhost:5177 |
| Helpdesk | http://localhost:5178 |
| ERP | http://localhost:5179 |

Start with the **hub** (http://localhost:5173) — log in there first, then click any service tile to open a satellite with your session already attached.

You can also run pieces individually, e.g. `npm run dev:server` or `npm run dev -w apps/lms`.

### If `npm install` fails partway

Each app/server is its own npm workspace, so you can install one at a time if needed:

```bash
npm install -w server
npm install -w apps/hub
npm install -w apps/coe
# ...etc
```

## Demo accounts

All passwords are `demo1234`.

| Role | Usernames |
|---|---|
| Student | `student1` … `student8` |
| Mentor / Teacher | `faculty1`, `faculty2`, `faculty3` (mentors), `faculty4` (teacher) |
| Admin | `admin1` |

The full list is also served live at `GET http://localhost:4000/api/auth/demo-accounts`.

Log in as a **mentor** account (`faculty1`) and open the hub's Attendance Monitor to see the "Mark attendance (mentor)" control, which pushes live updates over Socket.io to anyone else viewing that subject.

## What lives where

**In the hub (native features, no separate app):**
- Bus Tracker — Leaflet map, simulated live buses over Socket.io, route list with ETA
- Attendance Monitor — subject table, color-coded thresholds, what-if calculator, semester heatmap, mentor "mark attendance" screen
- Mess — weekly menu + per-meal star rating/feedback
- Mentor Appointment Booking — mentor list, slot picker, appointment status list

**Satellite apps (each a fully separate Vite build/site):**
- **COE** — dark sidebar profile, CAT Marks, Exam Timetable & Seating, Exam Results with SGPA/CGPA (plus stub pages for the remaining nav items — Upload Photo, Verify Gradesheet, etc. — ready to be wired up later)
- **LMS** — My Courses grid (search/sort/filter/view toggle, generated banner patterns), course content page with collapsible units and "mark as done"
- **Library** — public OPAC (catalog search, notice ticker, quick links) + right-side login panel + My Account (issued books, fine calculator)
- **Gatepass** — Pass Requests, WDP-this-month counter, New Request modal, approval badges (Mentor/Security/Warden), detail modal
- **Helpdesk** — ticket list with category/status filters, new ticket form, ticket detail with a reply thread
- **ERP** — fee status per semester with a mock "Pay Now" flow, document request tracker, hostel/room info. *(No original reference screenshots were available for ERP — this module should be revisited against the real SSN ERP once screenshots are provided.)*

## Notes on the backend

- `server/db.js` seeds a JSON file (`server/data/db.json`) the first time it runs, using `lowdb`. Delete that file to reset all demo data.
- Auth is a simple JWT (`server/auth.js`) — fine for a prototype/demo, **not** production SSO.
- Socket.io exposes two namespaces: `/bus` (simulated live bus positions) and `/attendance` (live attendance updates broadcast to anyone viewing the Attendance Monitor).

## A note on running this outside of this environment

This project was written as source code only — it was not `npm install`'d or run inside this sandbox (no network access here), so give it a first real run locally and let me know if anything needs a fix.
