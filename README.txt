PalmSathi — Fixed Files Bundle
==============================

This zip only contains the files that were changed during our session.
Copy each one into your local project at the SAME relative path,
overwriting the existing file.

FRONTEND (palmsathi-frontend/)
-------------------------------
- .env
    Contains VITE_API_URL pointing to your live Render backend.
    Place at the ROOT of palmsathi-frontend/ (same level as package.json).

- .gitignore
    Updated to actually exclude .env (it wasn't excluded before).

- src/api/auth.js
    baseURL now reads from import.meta.env.VITE_API_URL instead of
    a hardcoded localhost URL.

- src/api/mills.js
    sendChatMessage() now uses the env var instead of a hardcoded
    localhost URL.

- src/pages/Login.jsx
- src/pages/Register.jsx
    Logo/name at the top of each now links back to "/" (landing page)
    on both desktop and mobile layouts. Previously there was no way
    back to the landing page from these screens.

- src/pages/Dashboard.jsx
- src/components/layout/Sidebar.jsx
    Sidebar is now a mobile hamburger drawer:
      - Hidden off-screen on small screens, slides in via a hamburger
        button in a new mobile top bar.
      - Auto-closes when you tap a nav item.
      - Unchanged fixed sidebar behavior on desktop (lg breakpoint+).
    Dashboard's main content margin/padding adjusted to match, and the
    loading-skeleton stat grid is now responsive (2 cols mobile / 4 desktop).

- src/pages/Landing.jsx
    Added responsive breakpoints for the hero, problem, features, and
    stats grids (they collapse to 1 column on mobile). Desktop nav
    text links are hidden on mobile, keeping just the logo + Log in button.

- src/pages/Admin.jsx
    Summary stat cards are now responsive (2 cols mobile / 4 desktop).
    Claim cards stack vertically on mobile instead of squeezing into
    one row.

BACKEND (palmsathi-backend/)
------------------------------
- src/server.js
    Includes the dns.setServers(['8.8.8.8','1.1.1.1']) workaround for
    local MongoDB Atlas SRV DNS resolution issues (only runs when
    NODE_ENV !== "production", so it's a no-op on Render).

- src/seed/seedMillsOnly.js
    NEW FILE. Seeds only the `mills` collection (2 demo mills with
    today's slots) without touching your existing farmers/plots data,
    unlike the original seed script which wipes all three collections.
    Run with: node src/seed/seedMillsOnly.js
    (Optionally add "seed:mills": "node src/seed/seedMillsOnly.js" to
    package.json scripts for convenience.)

------------------------------------------------------------------
REMINDER: rotate your MongoDB password, JWT_SECRET, GROQ_API_KEY,
OPENWEATHER_API_KEY, and ADMIN_SECRET — all of these were posted in
plaintext multiple times over the course of this conversation.
------------------------------------------------------------------
