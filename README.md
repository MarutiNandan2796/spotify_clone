# Full-Stack Spotify Clone Web Application

A production-quality music streaming web application styled with glassmorphism aesthetics and premium UI/UX, built on a Node.js + Express backend and a React + Vite + TypeScript frontend.

---

## 🚀 Tech Stack

### Frontend
- **React 19** & **Vite**
- **TypeScript**
- **Tailwind CSS** (Spotify color tokens, glassmorphism, responsive panels)
- **React Router v6** (Protected paths and SPA routing layout)
- **TanStack Query** (React Query for requests checking and caching)
- **Framer Motion** (Premium animations and sliding transitions)
- **React Icons**

### Backend
- **Node.js** & **Express.js** (TypeScript compiled code)
- **MongoDB** via **Mongoose** (Relational user play history, playlists, likes, and catalog)
- **JWT (JSON Web Token)** HTTP authentication
- **Bcrypt.js** (Password hashing security)
- **Multer** multi-part media uploads
- **Cloudinary** (Safe fallbacks to local directory if keys are missing)
- **Helmet**, **CORS**, & **Express Rate Limit** security middlewares

---

## ⭐ Key Features

- **Web Audio API Equalizer & Canvas Visualizer**: Fully interactive 5-band peaking equalizer filter bank (60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz) with real-time responsive HTML5 Canvas spectrum visualizer.
- **Interactive Queue Drawer**: Slide-over queue drawer displaying current playing track, upcoming items, move up/down track reordering, and instant queue clearing.
- **Full-Screen Ambient Cinema View**: Dynamic backdrop glow mode featuring glassmorphism visuals, ambient aura, a slow-spinning vinyl record, and a circular audio-reactive waveform visualizer that pulses dynamically to the bass frequency of the song.
- **Variable Playback Speed**: Precise speed controller (0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x) for audio playback.
- **Sleep Timer Utility**: Countdown auto-pause timer (5m, 15m, 30m, 45m, 60m) to automatically stop playback when resting.
- **Recent Search History & Genre Chips**: Persistent search query chips with quick removal and instant filter pills for Pop, Hip-Hop, Rock, Electronic, Indie, and Chill genres.
- **Custom UI Accent Theme Selector**: Personalize interface highlight colors with 5 curated themes (Emerald Green, Cyber Cyan, Electric Purple, Sunset Amber, Rose Gold).
- **Social Share Modal**: Instant link copy with formatted embed card preview and direct share shortcuts.
- **Interactive Synchronized Lyrics**: Real-time karaoke-style lyrics display that automatically scrolls and highlights active lines with dynamic background gradients matching the song genre.
- **Keyboard Shortcuts Navigation**: Use global keyboard controls (`Space` to play/pause, `M` to mute/unmute, `Right/Left arrows` to skip forward/backward 5s) for instant playback adjustment.

---

## 📂 Project Directory Structure

```
spotify-clone/
├── backend/
│   ├── config/          # Database connection, Cloudinary configuration
│   ├── controllers/     # Authentication, Songs, Artists, Albums, Playlists, Analytics
│   ├── middleware/      # JWT Protection, Multer uploads, Central error handler
│   ├── models/          # Mongoose Schemas (User, Song, Artist, Album, Playlist, Like, History)
│   ├── routes/          # REST Endpoint routes mapping
│   ├── scripts/         # Database seeding scripts
│   ├── utils/           # Helper scripts (Token generation, Cloudinary uploading)
│   ├── uploads/         # Storage fallback for audio/image uploads
│   ├── server.ts        # Main application server entry
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/      # Default graphic panels
│   │   ├── components/  # Navbars, Sidebars, Player console, Cards, Skeletons
│   │   ├── context/     # Auth Context, Player Audio Context (HTML5 Audio controller)
│   │   ├── hooks/       # useDebounce search hook
│   │   ├── layouts/     # Responsive layout components
│   │   ├── pages/       # Home, Search, Artist view, Album tracks, Playlists, Profiles, Admin panel
│   │   ├── services/    # Axios API client setups
│   │   ├── types/       # Global TypeScript interfaces
│   │   └── App.tsx      # Main React router
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── docker-compose.yml   # Multi-container local build orchestration
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

---

## ⚙️ Quick Start Guide

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Running instance locally or MongoDB Atlas)
- **npm** or **yarn**

---

### Step 1: Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install node packages:
   ```bash
   npm install
   ```
3. Configure the environment variables. Copy the `.env.example` file and fill in details:
   ```bash
   cp .env.example .env
   ```
   *Note: If you leave Cloudinary variables blank, uploads will automatically store in `backend/uploads/` locally.*

4. Seed the database with high-quality copy-free music (SoundHelix public streams) and Unsplash covers:
   ```bash
   npm run seed
   ```
5. Start the backend developer server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

---

### Step 2: Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install node packages:
   ```bash
   npm install
   ```
3. Configure frontend environment parameters (or leave default to locate backend at port 5000):
   ```bash
   cp .env.example .env
   ```
4. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```
   The client web player will launch on `http://localhost:3000`.

---

## 🐳 Docker Deployment

You can run the entire stack (Database, Server API, Web Client) using Docker Compose.

1. Ensure you have Docker and Docker Compose installed.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. Once running, access the web client at `http://localhost:3000`.

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create user.
- `POST /api/auth/login` - Retrieve auth JWT token.
- `GET /api/auth/me` - Authenticated profile details.
- `PUT /api/auth/profile` - Modify profile (avatar image uploads).

### Catalog
- `GET /api/songs` - Fetch all songs.
- `GET /api/songs/trending` - Top tracks.
- `GET /api/songs/featured` - Suggested tracks.
- `GET /api/artists/:id` - Artist detail + popular songs & albums.
- `GET /api/albums/:id` - Album detail + tracklist.

### Playlist Management
- `GET /api/playlists` - Authenticated user playlists.
- `POST /api/playlists` - Create blank playlist.
- `PUT /api/playlists/:id` - Update meta info & cover images.
- `DELETE /api/playlists/:id` - Remove playlist.
- `POST /api/playlists/songs` - Add song to playlist.
- `DELETE /api/playlists/songs` - Remove song from playlist.
- `PUT /api/playlists/:id/songs` - Reorder playlist track indexes.

### Playing History & Likes
- `GET /api/likes` - Retrieve liked songs.
- `POST /api/likes/toggle/:songId` - Heart / Unheart song.
- `GET /api/history` - User recently played tracks (max 30).
- `POST /api/history/play/:songId` - Log play and increment song play counter.

### Global Search
- `GET /api/search?q=query` - Live debounced search returning Songs, Artists, Albums, and Playlists.

### Admin Dashboard API
- `GET /api/admin/analytics` - System metrics counts (Total songs, plays, albums).
- `GET /api/admin/users` - List all registered user accounts.
- `DELETE /api/admin/users/:userId` - Delete user account.

---

## 🛠️ Code Standards & Documentation

To maintain readability and codebase sustainability, this project follows the JSDoc commenting standard:
- **JSDoc Comments**: All backend controllers, model interfaces, schemas, utility helpers, and frontend TypeScript type definitions are documented using structured JSDoc comments.
- **Type Annotations**: High-fidelity TypeScript interfaces exist under `frontend/src/types/index.ts` and `backend/models` to ensure full compile-time type safety across the monorepo.
- **Linting & Formatting**: Follows Prettier code formatting rules configured in the root directory.

