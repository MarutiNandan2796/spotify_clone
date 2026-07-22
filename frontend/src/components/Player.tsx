import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { EqualizerModal } from './EqualizerModal';
import { QueueDrawer } from './QueueDrawer';
import { AmbientPlayer } from './AmbientPlayer';
import { SleepTimerModal } from './SleepTimerModal';
import { Sliders, Maximize2, Moon } from 'lucide-react';
import { 
  RiPlayCircleFill, 
  RiPauseCircleFill, 
  RiSkipBackMiniFill, 
  RiSkipForwardMiniFill,
  RiShuffleLine,
  RiRepeatLine,
  RiHeartLine,
  RiHeartFill,
  RiVolumeMuteLine,
  RiVolumeUpLine,
  RiVolumeDownLine,
  RiMicLine
} from 'react-icons/ri';
import { MdQueueMusic } from 'react-icons/md';

/**
 * Player Component
 * Renders the persistent bottom media player bar. Handles current track details display,
 * playback control triggers (play/pause, shuffle, skip back/forward, repeat, timeline seek slider),
 * and utility dock triggers (lyrics overlay toggle, equalizer presets modal, sleep timer configuration,
 * queue drawer toggle, and audio volume slider).
 * Includes interactive global keyboard hotkeys for convenience.
 *
 * @returns {React.ReactElement} The rendered Player component.
 */
const Player: React.FC = () => {
  const { user } = useAuth();
  const {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    shuffle,
    repeatMode,
    queue,
    playSong,
    pauseSong,
    resumeSong,
    playNext,
    playPrevious,
    togglePlay,
    seek,
    adjustVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    showLyrics,
    toggleLyrics,
    showEqualizer,
    toggleEqualizer,
    playbackRate,
    setPlaybackRate,
    sleepTimerTimeLeft,
    toggleSleepModal,
  } = usePlayer();

  const [isLiked, setIsLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showAmbient, setShowAmbient] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Check if current song is liked by user
  useEffect(() => {
    const checkLike = async () => {
      if (!user || !currentSong) return;
      try {
        const res = await api.get(`/likes/check/${currentSong._id}`);
        setIsLiked(res.data.liked);
      } catch (error) {
        console.error('Failed to check like status', error);
      }
    };
    checkLike();
  }, [currentSong, user]);

  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;
  const durationRef = useRef(duration);
  durationRef.current = duration;

  // Global keyboard shortcuts for music playback controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if the user is typing in inputs or textarea elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(Math.min(durationRef.current, currentTimeRef.current + 5));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(0, currentTimeRef.current - 5));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlay, toggleMute, seek]);


  const handleLikeToggle = async () => {
    if (!user || !currentSong) return;
    try {
      const res = await api.post(`/likes/toggle/${currentSong._id}`);
      setIsLiked(res.data.liked);
    } catch (error) {
      console.error('Failed to toggle like', error);
    }
  };

  // Time formatter: seconds to MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentSong) {
    return (
      <div className="w-full flex items-center justify-between h-full text-zinc-500 text-sm italic font-medium px-4">
        <span>No song selected. Select a track to start listening.</span>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-between h-full relative">
      {/* LEFT: Current Track Details */}
      <div className="flex items-center gap-3 w-1/3 min-w-[180px]">
        <img
          src={currentSong.coverImage}
          alt={currentSong.title}
          className="w-14 h-14 rounded object-cover shadow-md shrink-0 border border-zinc-800"
        />
        <div className="flex flex-col overflow-hidden leading-tight">
          <span className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
            {currentSong.title}
          </span>
          <span className="text-xs text-spotify-lightGray truncate hover:underline cursor-pointer hover:text-white">
            {currentSong.artist?.name || 'Unknown Artist'}
          </span>
        </div>
        {user && (
          <button
            onClick={handleLikeToggle}
            className="text-spotify-lightGray hover:text-white ml-2 transition-colors shrink-0 cursor-pointer"
            title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
          >
            {isLiked ? (
              <RiHeartFill className="w-5 h-5 text-spotify-green hover:scale-105 transition-all" />
            ) : (
              <RiHeartLine className="w-5 h-5 hover:scale-105 transition-all" />
            )}
          </button>
        )}
      </div>

      {/* CENTER: Playback Controls */}
      <div className="flex flex-col items-center gap-1.5 w-1/3 max-w-[500px]">
        {/* Buttons */}
        <div className="flex items-center gap-5 text-zinc-400">
          <button
            onClick={toggleShuffle}
            className={`hover:text-white transition-colors cursor-pointer ${
              shuffle ? 'text-spotify-green hover:text-spotify-hoverGreen' : ''
            }`}
            title="Shuffle"
          >
            <RiShuffleLine className="w-5 h-5" />
          </button>

          <button onClick={playPrevious} className="hover:text-white transition-colors cursor-pointer" title="Previous">
            <RiSkipBackMiniFill className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlay}
            className="text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <RiPauseCircleFill className="w-10 h-10 text-white" />
            ) : (
              <RiPlayCircleFill className="w-10 h-10 text-white" />
            )}
          </button>

          <button onClick={playNext} className="hover:text-white transition-colors cursor-pointer" title="Next">
            <RiSkipForwardMiniFill className="w-6 h-6" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`hover:text-white transition-colors relative cursor-pointer ${
              repeatMode !== 'off' ? 'text-spotify-green hover:text-spotify-hoverGreen' : ''
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            <RiRepeatLine className="w-5 h-5" />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 text-[8px] bg-spotify-green text-black font-extrabold rounded-full px-0.5 leading-none">
                1
              </span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2 text-[11px] text-spotify-lightGray">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="flex-1 accent-spotify-green h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer hover:accent-spotify-hoverGreen"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* RIGHT: Volume & Queue */}
      <div className="flex items-center gap-3 w-1/3 justify-end relative">
        {/* Playback Speed selector */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
              playbackRate !== 1.0
                ? 'bg-green-500/20 text-green-400 border-green-500/40'
                : 'text-zinc-400 border-zinc-700 hover:text-white hover:border-zinc-500'
            }`}
            title="Playback Speed"
          >
            {playbackRate}x
          </button>

          {showSpeedMenu && (
            <div className="absolute right-0 bottom-8 w-24 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-1 z-50 flex flex-col gap-1 text-xs">
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setPlaybackRate(rate);
                    setShowSpeedMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1 rounded.lg transition-colors ${
                    playbackRate === rate ? 'bg-green-500/20 text-green-400 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toggle Ambient View button */}
        <button
          onClick={() => setShowAmbient(true)}
          className="hover:text-white text-spotify-lightGray transition-colors cursor-pointer"
          title="Full-Screen Ambient View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Sleep Timer button */}
        <button
          onClick={toggleSleepModal}
          className={`hover:text-white transition-colors relative cursor-pointer ${
            sleepTimerTimeLeft !== null ? 'text-purple-400' : 'text-spotify-lightGray'
          }`}
          title={sleepTimerTimeLeft !== null ? `Sleep Timer: ${Math.ceil(sleepTimerTimeLeft / 60)}m` : 'Sleep Timer'}
        >
          <Moon className="w-4 h-4" />
          {sleepTimerTimeLeft !== null && (
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          )}
        </button>

        {/* Toggle Equalizer modal button */}
        <button
          onClick={toggleEqualizer}
          className={`hover:text-white transition-colors relative cursor-pointer ${
            showEqualizer ? 'text-spotify-green' : 'text-spotify-lightGray'
          }`}
          title="Audio Equalizer"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Toggle Lyrics button */}
        <button
          onClick={toggleLyrics}
          className={`hover:text-white transition-colors relative cursor-pointer ${
            showLyrics ? 'text-spotify-green' : 'text-spotify-lightGray'
          }`}
          title="Lyrics"
        >
          <RiMicLine className="w-5 h-5" />
        </button>

        {/* Toggle Queue Drawer button */}
        <button
          onClick={() => setShowQueue(!showQueue)}
          className={`hover:text-white transition-colors relative cursor-pointer ${
            showQueue ? 'text-spotify-green' : 'text-spotify-lightGray'
          }`}
          title="Queue"
        >
          <MdQueueMusic className="w-5 h-5" />
        </button>

        {/* Volume controls */}
        <button onClick={toggleMute} className="text-spotify-lightGray hover:text-white cursor-pointer" title={isMuted ? "Unmute" : "Mute"}>
          {isMuted || volume === 0 ? (
            <RiVolumeMuteLine className="w-5 h-5 text-red-500 hover:scale-105 transition-transform" />
          ) : volume < 0.4 ? (
            <RiVolumeDownLine className="w-5 h-5 hover:scale-105 transition-transform" />
          ) : (
            <RiVolumeUpLine className="w-5 h-5 hover:scale-105 transition-transform" />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => adjustVolume(parseFloat(e.target.value))}
          className="w-20 sm:w-24 accent-spotify-green h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
        />

      </div>

      <QueueDrawer isOpen={showQueue} onClose={() => setShowQueue(false)} />
      <EqualizerModal />
      <AmbientPlayer isOpen={showAmbient} onClose={() => setShowAmbient(false)} />
      <SleepTimerModal />
    </div>
  );
};

export default Player;
