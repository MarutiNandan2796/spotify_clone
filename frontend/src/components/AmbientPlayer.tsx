import React, { useEffect, useRef, useState } from 'react';
import { Minimize2, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Music2, Eye, EyeOff } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

/**
 * @interface AmbientPlayerProps
 * @property {boolean} isOpen - Determines whether the fullscreen ambient player view is open.
 * @property {() => void} onClose - Callback function to close the ambient player view.
 */
interface AmbientPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AmbientPlayer Component
 * Renders a premium, immersive full-screen audio player dashboard.
 * Includes a real Web Audio API-driven circular wave visualizer around the album cover art.
 * Includes dynamic glowing backdrop color aura rings, large cover art, track progress scrub controls,
 * and playback action triggers.
 *
 * @param {AmbientPlayerProps} props - Component properties.
 * @returns {React.ReactElement | null} The rendered AmbientPlayer component, or null if hidden.
 */
export const AmbientPlayer: React.FC<AmbientPlayerProps> = ({ isOpen, onClose }) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    seek,
    togglePlay,
    playNext,
    playPrevious,
    shuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    analyserNode,
  } = usePlayer();

  const [showVisualizer, setShowVisualizer] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Circular Audio Visualizer Rendering Effect
  useEffect(() => {
    if (!isOpen || !showVisualizer || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const renderCircularFrame = () => {
      animationId = requestAnimationFrame(renderCircularFrame);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Base radius of the circle (matches cover art size boundary)
      const baseRadius = 145;

      // Draw transparent dark layer to create trailing ghost effects
      ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
      ctx.fillRect(0, 0, width, height);

      let bassIntensity = 0;

      if (analyserNode && isPlaying) {
        analyserNode.getByteFrequencyData(dataArray);

        // Calculate average bass frequency (indices 0 to 8) to pulse the visualizer
        let bassSum = 0;
        const bassCount = 8;
        for (let i = 0; i < bassCount; i++) {
          bassSum += dataArray[i];
        }
        bassIntensity = bassSum / (bassCount * 255);

        // 1. Draw glowing background circle
        const radGlow = ctx.createRadialGradient(
          centerX, centerY, baseRadius - 10,
          centerX, centerY, baseRadius + 70 + bassIntensity * 40
        );
        radGlow.addColorStop(0, 'rgba(34, 197, 94, 0.04)');
        radGlow.addColorStop(0.5, 'rgba(34, 197, 94, 0.12)');
        radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius + 110, 0, Math.PI * 2);
        ctx.fill();

        // 2. Draw audio-reactive radiating lines / bars
        const numBars = 100;
        for (let i = 0; i < numBars; i++) {
          const dataIndex = Math.floor((i < numBars / 2 ? i : numBars - i) * (bufferLength / (numBars / 2)));
          const value = dataArray[dataIndex] || 0;
          const percent = value / 255;

          const angle = (i * Math.PI * 2) / numBars;
          const minLength = 3;
          const maxLength = 50 + bassIntensity * 25;
          const barLength = minLength + percent * maxLength;

          // Start point on the circle edge
          const startX = centerX + Math.cos(angle) * baseRadius;
          const startY = centerY + Math.sin(angle) * baseRadius;

          // End point expanding outwards
          const endX = centerX + Math.cos(angle) * (baseRadius + barLength);
          const endY = centerY + Math.sin(angle) * (baseRadius + barLength);

          // Draw visualizer bar
          ctx.strokeStyle = `rgba(34, 197, 94, ${0.35 + percent * 0.65})`;
          ctx.lineWidth = 2 + percent * 2;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }

        // 3. Draw a smooth wave overlay ring
        ctx.strokeStyle = 'rgba(110, 231, 183, 0.65)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i <= numBars; i++) {
          const dataIndex = Math.floor((i < numBars / 2 ? i : numBars - i) * (bufferLength / (numBars / 2)));
          const value = dataArray[dataIndex] || 0;
          const percent = value / 255;
          const angle = (i * Math.PI * 2) / numBars;
          const radius = baseRadius + percent * (35 + bassIntensity * 15);

          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();

      } else {
        // Idle state: Slowly pulsating rings
        const time = Date.now() * 0.001;
        const pulseRadius = baseRadius + Math.sin(time * 2) * 3;

        ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(34, 197, 94, 0.06)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius + 15 + Math.sin(time) * 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    renderCircularFrame();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isOpen, showVisualizer, analyserNode, isPlaying]);

  if (!isOpen || !currentSong) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-8 text-white animate-fadeIn overflow-hidden">
      {/* Dynamic Background Glowing Auras */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-[140px] animate-pulse"
          style={{ backgroundColor: '#1db954' }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[140px] animate-pulse"
          style={{ backgroundColor: '#3b82f6', animationDelay: '1s' }}
        />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
          <Music2 className="w-3.5 h-3.5" />
          <span>Ambient Cinema Mode</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowVisualizer(!showVisualizer)}
            className={`p-3 rounded-full border transition-all shadow-lg ${
              showVisualizer
                ? 'bg-green-500/15 border-green-500/30 text-green-400'
                : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title={showVisualizer ? "Hide Audio Visualizer" : "Show Audio Visualizer"}
          >
            {showVisualizer ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all shadow-lg border border-zinc-800"
            title="Exit Ambient Mode"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Art & Metadata with visualizer ring */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto gap-8">
        <div className="relative flex items-center justify-center w-[400px] h-[400px] sm:w-[460px] sm:h-[460px] max-w-full">
          {showVisualizer && (
            <canvas
              ref={canvasRef}
              width={460}
              height={460}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          )}

          {/* Central Rotating Album Artwork Container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 group z-10">
            <img
              src={currentSong.coverImage}
              alt={currentSong.title}
              className="w-full h-full object-cover"
              style={{
                animation: isPlaying ? 'spin 25s linear infinite' : 'none',
              }}
            />
            {/* Play/Pause hover overlay inside Vinyl Center */}
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              {isPlaying ? <Pause className="w-10 h-10 text-white" /> : <Play className="w-10 h-10 text-white ml-1.5" />}
            </div>
            
            {/* Vinyl record center hole accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-800 z-20 pointer-events-none" />
          </div>
        </div>

        <div className="text-center max-w-xl px-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 line-clamp-1">
            {currentSong.title}
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 font-medium">
            {currentSong.artist?.name || 'Unknown Artist'}
          </p>
        </div>
      </div>

      {/* Player Controls Dock */}
      <div className="relative z-10 w-full max-w-3xl mx-auto space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-full accent-green-400 h-1.5 bg-zinc-850 rounded-lg appearance-none cursor-pointer hover:bg-zinc-700 transition-all"
          />
          <div className="flex justify-between text-xs font-mono text-zinc-400 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={toggleShuffle}
            className={`p-3 rounded-full transition-all ${
              shuffle ? 'text-green-400 bg-green-500/10' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button onClick={playPrevious} className="p-3 text-zinc-300 hover:text-white hover:scale-110 transition-all">
            <SkipBack className="w-7 h-7" />
          </button>

          <button
            onClick={togglePlay}
            className="p-5 rounded-full bg-green-500 hover:bg-green-400 text-black shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <button onClick={playNext} className="p-3 text-zinc-300 hover:text-white hover:scale-110 transition-all">
            <SkipForward className="w-7 h-7" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-3 rounded-full transition-all ${
              repeatMode !== 'off' ? 'text-green-400 bg-green-500/10' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
