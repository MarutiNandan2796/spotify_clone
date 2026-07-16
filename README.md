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

- **Interactive Synchronized Lyrics**: Real-time karaoke-style lyrics display that automatically scrolls and highlights the active line based on playback time, with dynamic background gradients matching the song genre and click-to-seek support.
- **Keyboard Shortcuts Navigation**: Use global keyboard controls (`Space` to play/pause, `M` to mute/unmute, `Right/Left arrows` to skip forward/backward 5s) for instant playback adjustment.
- **Tailwind Glassmorphic UI/UX**: Exquisite design detailing with hover effects, card expansions, and sleek page transitions built using Framer Motion.

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
