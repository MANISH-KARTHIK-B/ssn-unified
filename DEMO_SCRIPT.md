# DEMO_SCRIPT.md

A suggested walkthrough for a viva/demo, roughly 6–8 minutes.

## 0. Setup (before you start presenting)

```bash
npm install
npm run dev
```

Open http://localhost:5173 and log in as `student1` / `demo1234`. Keep a second browser profile or incognito window ready, logged in as `faculty1` / `demo1234`, for the live-update part of the attendance demo.

## 1. Hub tour (1–2 min)

- Point out the top nav (search, notifications, profile).
- Point out the **service tiles** grid — explain that each one is a completely separate website/build, and clicking it opens a new tab with the session carried over via a token in the URL.
- Point out the native features section below the tiles and the profile/upcoming-events sidebar.

## 2. Opening a satellite app (1 min)

- Click the **Gatepass** tile → new tab opens already signed in as Student One.
- Show the Pass Requests table, the WDP-this-month counter, and open **+ New Request** to show the form.
- Mention: closing this tab and going back to the hub, then opening **COE** instead, demonstrates the same hand-off — each app is independent but shares one login.

## 3. Satellite feature tour (2–3 min)

Pick 2–3 of these depending on time:
- **COE** — dark sidebar, Profile page, CAT Marks, Exam Results with SGPA/CGPA.
- **LMS** — My Courses grid with generated banners and progress bars; open a course and tick off a lesson with "Mark as done" to show the progress bar update.
- **Library** — search the catalog (try "circuit" or "signals"), then log in via the right-side panel and open **My Account** to show the fine calculator.
- **Helpdesk** — raise a new ticket, then open it and send a reply.
- **ERP** — show the fee cards and click "Pay Now (mock)" to flip a semester to Paid.

## 4. Live features back in the hub (2 min)

- **Bus Tracker**: open it and let the map sit for a few seconds — the amber bus markers move along their routes and the ETA badges tick down, all pushed from the server over Socket.io every 2 seconds.
- **Attendance Monitor**: with the mentor tab open in another window, click "Mark attendance (mentor)" and mark a subject Present/Absent — switch back to the student tab and show the percentage updating live without a page refresh.

## 5. Wrap-up (30 sec)

- Reiterate: one shared backend and one shared login, seven independently branded front ends, everything seeded with fictional data.
- Mention the ERP module note in the README — it's built generically pending real reference screenshots.
