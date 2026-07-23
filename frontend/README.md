# Spotify Clone - React Frontend Client

A premium, interactive single-page music streaming web application built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**.

---

## 🎨 Design and UX Highlights

* **Glassmorphism Panels:** Smooth blurred boundaries, translucent dark layers, and customized sleek scrollbars.
* **Theme Accent Selector:** Choose from Emerald Green, Cyber Cyan, Electric Purple, Sunset Amber, or Rose Gold to customize the interface highlights.
* **Keyboard Navigation:** 
  * `Space` - Play / Pause
  * `M` - Mute / Unmute
  * `Right Arrow` - Skip forward 5 seconds
  * `Left Arrow` - Skip backward 5 seconds

---

## 🎵 Web Audio Architecture

The client utilizes a custom **HTML5 Audio Pipeline** integrated with the **Web Audio API** for real-time visualization and signal processing:

```
[Audio Element] -> [MediaElementSourceNode] 
                         |
            [5-Band Peaking Equalizer] (60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz)
                         |
                 [AnalyserNode] (FFT Frequency Capture)
                         |
               [Audio Destination] (Speakers)
```

### Key Audio Components:
1. **`PlayerContext.tsx`**: Initializes the `AudioContext` and nodes on the first user interaction. Exposes player states, track queues, and visualizer hook data.
2. **CORS Fallback Recovery**: Automatically catches cross-origin media network load errors. If an external stream doesn't support CORS headers, it removes the anonymous cross-origin policy, reloads, and streams directly, ensuring robust playback.
3. **`EqualizerModal.tsx`**: Employs an HTML5 canvas rendering frequency bands using `requestAnimationFrame`. Provides real-time sliders linked directly to the `BiquadFilterNode` gain parameters.
4. **`AmbientPlayer.tsx`**: Features a circular reactive audio visualizer that draws expanding frequency lines and pulses matching the low-mid (bass) sound pressure around a spinning vinyl cover artwork.

---

## 📂 Core Folder Structure

```
frontend/src/
├── assets/          # Static layout panels & default images
├── components/      # Global widgets (Sidebar, Player controls, Equalizer, Modals)
├── context/         # AuthContext & Web Audio PlayerContext API
├── hooks/           # useDebounce search helpers
├── layouts/         # Layout grids & responsive layouts
├── pages/           # Main views (Home dashboards, Search tabs, Playlists, Admin panel)
├── services/        # Axios API clients & endpoints configuration
└── types/           # Global TypeScript type definitions
```

---

## 🚀 Getting Started

### Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

### Build for Production
```bash
npm run build
```
The compiled output will be generated inside the `dist/` directory.
