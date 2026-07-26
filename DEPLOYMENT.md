# Deploying to Render (no local Node/npm needed)

This deploys the shared backend as one Render **Web Service**, and each of the 7 apps as a Render **Static Site**. Render runs `npm install` and the build on its own servers — you never need Node installed on your own machine for this path.

You'll end up with **8 URLs total** (1 backend + 7 sites), all live 24/7 (see the note on Render's free tier at the bottom).

## 1. Get the code onto GitHub

1. Go to https://github.com, sign in (or create a free account), click the **+** in the top right → **New repository**. Name it `ssn-unified`, leave it Public or Private, don't add a README (you already have one), click **Create repository**.
2. On the new repo's page, click **uploading an existing file**.
3. Unzip `ssn-unified.zip` on your computer. Drag the **contents** of the unzipped `ssn-unified` folder (the `apps` folder, `server` folder, `package.json`, `README.md`, etc. — not the outer `ssn-unified` folder itself) into the GitHub upload box. Modern browsers let you drop whole folders.
4. Scroll down, click **Commit changes**.

(If the drag-and-drop struggles with this many nested files, the more reliable alternative is installing **GitHub Desktop** (https://desktop.github.com) — it has a simple "Add local repository → Publish" flow with no command line.)

## 2. Deploy the backend first

1. Go to https://render.com, sign in with your GitHub account.
2. **New +** → **Web Service** → connect your `ssn-unified` repo.
3. Fill in:
   - **Name**: `ssn-unified-server`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. Click **Create Web Service**. Wait for it to finish deploying, then copy its URL — it'll look like `https://ssn-unified-server.onrender.com`. This is your backend URL; you'll need it for every app below.

## 3. Deploy each satellite app (do these 6 before the hub)

For **each** of `coe`, `lms`, `library`, `gatepass`, `helpdesk`, `erp`:

1. **New +** → **Static Site** → same repo.
2. Fill in:
   - **Name**: e.g. `ssn-unified-coe`
   - **Root Directory**: `apps/coe` (swap in the right folder name each time)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. Under **Environment Variables**, add:
   - `VITE_API_URL` = your backend URL from Step 2 (e.g. `https://ssn-unified-server.onrender.com`)
   - `VITE_HUB_URL` = leave blank for now — you'll come back and fill this in after Step 4 (it's just used for the "back to hub" link)
4. Create the site, wait for the build, and copy its URL. Do this for all 6 apps and keep a note of each URL.

## 4. Deploy the hub last

1. **New +** → **Static Site** → same repo.
2. Fill in:
   - **Name**: `ssn-unified-hub`
   - **Root Directory**: `apps/hub`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. Environment variables — set all of these to the URLs you collected in Step 3:
   - `VITE_API_URL` = backend URL from Step 2
   - `VITE_COE_URL`, `VITE_LMS_URL`, `VITE_LIBRARY_URL`, `VITE_GATEPASS_URL`, `VITE_HELPDESK_URL`, `VITE_ERP_URL` = each satellite's Render URL from Step 3
4. **Important — add a rewrite rule** (the hub is the only app that needs this): after creating the site, go to its **Redirects/Rewrites** tab and add:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`

   This is needed because the hub has multiple pages (Bus Tracker, Attendance, etc.) handled by client-side routing — without this rule, refreshing on any page but the homepage would 404.
5. Create the site and copy its URL — this is the one you'll actually visit and share.

## 5. Go back and fill in `VITE_HUB_URL`

For each of the 6 satellite apps from Step 3, go to its **Environment** tab, set `VITE_HUB_URL` to the hub's URL from Step 4, then click **Manual Deploy → Deploy latest commit** to rebuild with that value baked in.

## 6. Test it

Open your hub URL. Log in with `student1` / `demo1234`. Click a service tile — it should open the satellite in a new tab, already signed in.

## About "24/7"

Render's **free** tier spins a web service down after ~15 minutes of no traffic, and the first request after that takes 30–60 seconds to wake it back up (static sites don't have this issue — only the backend, since it's a Web Service not a Static Site). For a genuinely always-on backend with no cold start, Render's paid **Starter** instance type removes the spin-down. For a college prototype/demo, the free tier's occasional cold start is usually fine — just expect the first load after a while to be a bit slow.
