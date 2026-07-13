# Daily GitHub Contribution Pushes Guide

Use this guide to simulate active development of your Spotify Clone over the course of a week. 

This repository has been initialized with the **Backend** and **Root configurations** committed as Day 1 & Day 2 (1/4 of total code). Below are the commands to stage and commit the remaining **Frontend** code day-by-day to generate a premium contribution history.

---

### 📅 Day 3: Frontend Setup & Layout Configuration
**Files**: Root Tailwind config, PostCSS configuration, main CSS design system, and the React router entry structure.
```bash
git add frontend/package.json
git add frontend/tailwind.config.js
git add frontend/postcss.config.js
git add frontend/src/index.css
git add frontend/src/main.tsx
git add frontend/src/App.tsx
git add frontend/index.html
git commit -m "feat(frontend): initialize react-ts boilerplate, tailwind design system and routing"
git push origin main
```

---

### 📅 Day 4: State Management & Types Setup
**Files**: Type definitions, API service definitions, and Context Providers (AuthContext, PlayerContext).
```bash
git add frontend/src/types/index.ts
git add frontend/src/services/api.ts
git add frontend/src/context/AuthContext.tsx
git add frontend/src/context/PlayerContext.tsx
git add frontend/src/hooks/useDebounce.ts
git commit -m "feat(frontend): implement auth context and central audio player playback controllers"
git push origin main
```

---

### 📅 Day 5: Reusable UI Components & Cards
**Files**: Sidebar, Navbar, bottom Player controls, Skeleton loaders, and Song/Artist/Album/Playlist cards.
```bash
git add frontend/src/components/
git add frontend/src/layouts/
git commit -m "feat(frontend): build responsive layout, sticky bottom player bar, sidebars and catalog cards"
git push origin main
```

---

### 📅 Day 6: Home, Search & Auth Pages
**Files**: Home page dashboards, debounced search page, login form page, and register form page.
```bash
git add frontend/src/pages/Home.tsx
git add frontend/src/pages/Search.tsx
git add frontend/src/pages/Login.tsx
git add frontend/src/pages/Register.tsx
git commit -m "feat(frontend): implement authentication forms, catalog search tab and landing pages"
git push origin main
```

---

### 📅 Day 7: Profile, Liked Songs & Artist/Album/Playlist Views
**Files**: Liked songs list, user profile and avatars editor, playlist metadata and reordering, and admin analytics dashboard panel.
```bash
git add frontend/src/pages/Artist.tsx
git add frontend/src/pages/Album.tsx
git add frontend/src/pages/Playlist.tsx
git add frontend/src/pages/LikedSongs.tsx
git add frontend/src/pages/Profile.tsx
git add frontend/src/pages/AdminDashboard.tsx
git commit -m "feat(frontend): implement admin widgets, playlist song reordering, profiles and liked songs views"
git push origin main
```
