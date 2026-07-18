import React from 'react';
import { Minimize2, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart, Music2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface AmbientPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

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
  } = usePlayer();

  if (!isOpen || !currentSong) return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

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
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all shadow-lg border border-zinc-800"
          title="Exit Ambient Mode"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Art & Metadata */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto gap-8">
        <div className="relative group">
          {/* Glowing Aura Ring */}
          <div
            className={`absolute -inset-4 rounded-3xl blur-2xl transition-all duration-700 ${
              isPlaying ? 'bg-gradient-to-r from-green-500 via-emerald-400 to-cyan-500 opacity-60 scale-105' : 'opacity-20'
            }`}
          />
          <img
            src={currentSong.coverImage}
            alt={currentSong.title}
            className={`w-72 h-72 sm:w-96 sm:h-96 rounded-2xl object-cover shadow-2xl relative z-10 border border-white/10 transition-transform duration-700 ${
              isPlaying ? 'scale-100' : 'scale-95 grayscale-[20%]'
            }`}
          />
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
            className="w-full accent-green-400 h-2 bg-zinc-800/80 rounded-lg appearance-none cursor-pointer hover:bg-zinc-700 transition-all"
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
