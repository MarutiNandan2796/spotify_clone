import React, { useEffect, useRef, useMemo } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { getLyricsForSong } from '../services/lyricsData';
import { RiCloseLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

const LyricsOverlay: React.FC = () => {
  const { currentSong, currentTime, seek, showLyrics, toggleLyrics } = usePlayer();
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Retrieve lyrics for the currently playing song
  const lyrics = useMemo(() => {
    if (!currentSong) return [];
    return getLyricsForSong(currentSong.title, currentSong.artist?.name || 'Unknown Artist');
  }, [currentSong]);

  // Find the index of the active lyric line based on current playback time
  const activeIndex = useMemo(() => {
    if (lyrics.length === 0) return -1;
    
    // Find the latest line whose timestamp is <= currentTime
    let index = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        index = i;
      } else {
        break; // Timestamps are sorted, so we can stop
      }
    }
    return index;
  }, [lyrics, currentTime]);

  // Smoothly scroll the active lyric line into the center of the viewport
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  if (!showLyrics || !currentSong) return null;

  // Determine dynamic gradient color class based on genre
  const getGradientTheme = (genre: string) => {
    switch (genre?.toLowerCase()) {
      case 'lofi':
        return 'from-amber-950/90 via-zinc-900/95 to-black/98 border-amber-900/20';
      case 'synthwave':
        return 'from-purple-950/90 via-zinc-900/95 to-black/98 border-purple-900/20';
      case 'indie folk':
        return 'from-emerald-950/90 via-zinc-900/95 to-black/98 border-emerald-900/20';
      default:
        return 'from-zinc-800/90 via-zinc-900/95 to-black/98 border-zinc-700/20';
    }
  };

  const gradientClass = getGradientTheme(currentSong.genre);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className={`absolute inset-0 z-40 flex flex-col overflow-hidden bg-gradient-to-b ${gradientClass} backdrop-blur-3xl`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/10 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={currentSong.coverImage}
              alt=""
              className="w-10 h-10 rounded object-cover shadow-lg border border-white/10"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                {currentSong.title}
              </span>
              <span className="text-xs text-white/60 truncate max-w-[200px] sm:max-w-xs">
                {currentSong.artist?.name || 'Unknown Artist'}
              </span>
            </div>
          </div>
          
          <button
            onClick={toggleLyrics}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-all cursor-pointer shadow border border-white/10"
            title="Close Lyrics"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Lyrics Container */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-6 py-20 scroll-smooth select-none"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-32">
            {lyrics.map((line, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => seek(line.time)}
                  className={`text-xl md:text-3xl font-extrabold cursor-pointer transition-all duration-300 py-2 text-left w-full rounded px-4 -mx-4 hover:bg-white/5 ${
                    isActive
                      ? 'text-spotify-green scale-[1.02] origin-left drop-shadow-[0_0_15px_rgba(29,185,84,0.3)] opacity-100'
                      : 'text-white/40 hover:text-white/80 opacity-60'
                  }`}
                >
                  {line.text}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LyricsOverlay;
