import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { EqualizerModal } from './EqualizerModal';
import { QueueDrawer } from './QueueDrawer';
import { AmbientPlayer } from './AmbientPlayer';
import { SleepTimerModal } from './SleepTimerModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { Sliders, Maximize2, Moon, Keyboard } from 'lucide-react';
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
  const [showShortcuts, setShowShortcuts] = useState(false);

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

  // Stable refs for hotkey actions to prevent keydown listener re-binding
  const playNextRef = useRef(playNext);
  playNextRef.current = playNext;
  const playPreviousRef = useRef(playPrevious);
  playPreviousRef.current = playPrevious;
  const togglePlayRef = useRef(togglePlay);
  togglePlayRef.current = togglePlay;
  const seekRef = useRef(seek);
  seekRef.current = seek;
  const toggleMuteRef = useRef(toggleMute);
  toggleMuteRef.current = toggleMute;
  const toggleShuffleRef = useRef(toggleShuffle);
  toggleShuffleRef.current = toggleShuffle;
  const toggleRepeatRef = useRef(toggleRepeat);
  toggleRepeatRef.current = toggleRepeat;
  const toggleEqualizerRef = useRef(toggleEqualizer);
  toggleEqualizerRef.current = toggleEqualizer;
  const toggleSleepModalRef = useRef(toggleSleepModal);
  toggleSleepModalRef.current = toggleSleepModal;

  // Global keyboard shortcuts for music playback controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if the user is typing in inputs or textarea elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Show shortcuts modal when user presses '?'
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayRef.current();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMuteRef.current();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekRef.current(Math.min(durationRef.current, currentTimeRef.current + 5));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekRef.current(Math.max(0, currentTimeRef.current - 5));
          break;
        case 'KeyN':
          e.preventDefault();
          playNextRef.current();
          break;
        case 'KeyP':
          e.preventDefault();
          playPreviousRef.current();
          break;
        case 'KeyS':
          e.preventDefault();
          toggleShuffleRef.current();
          break;
        case 'KeyR':
          e.preventDefault();
          toggleRepeatRef.current();
          break;
        case 'KeyL': {
          e.preventDefault();
          const likeBtn = document.getElementById('player-like-btn');
          if (likeBtn) likeBtn.click();
          break;
        }
        case 'KeyQ':
          e.preventDefault();
          setShowQueue((prev) => !prev);
          break;
        case 'KeyE':
          e.preventDefault();
          toggleEqualizerRef.current();
          break;
        case 'KeyT':
          e.preventDefault();
          toggleSleepModalRef.current();
          break;
        case 'KeyH':
          e.preventDefault();
          setShowShortcuts((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


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
      <div className="w-full max-w-5xl h-[76px] px-8 rounded-full bg-zinc-950/45 backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex items-center justify-center text-zinc-400 text-sm font-medium">
        <span>Select a track to start listening to Aura Wave.</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl h-[78px] px-8 rounded-full bg-zinc-950/45 backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex items-center justify-between relative hover:border-violet-500/25 hover:shadow-[0_12px_45px_rgba(139,92,246,0.06)] transition-all duration-500 select-none">
      {/* LEFT: Current Track Details */}
      <div className="flex items-center gap-3 w-1/3 min-w-[200px]">
        <img
          src={currentSong.coverImage}
          alt={currentSong.title}
          className="w-12 h-12 rounded-lg object-cover shadow-lg shrink-0 border border-white/5 group-hover:scale-105 transition-transform"
        />
        <div className="flex flex-col overflow-hidden leading-tight">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
              {currentSong.title}
            </span>
            {isPlaying && (
              <div className="eq-container shrink-0" title="Playing">
                <div className="eq-bar"></div>
                <div className="eq-bar"></div>
                <div className="eq-bar"></div>
              </div>
            )}
          </div>
          <span className="text-xs text-spotify-lightGray truncate hover:underline cursor-pointer hover:text-white">
            {currentSong.artist?.name || 'Unknown Artist'}
          </span>
        </div>
        {user && (
          <button
            id="player-like-btn"
            onClick={handleLikeToggle}
            className="text-spotify-lightGray hover:text-white ml-2 transition-colors shrink-0 cursor-pointer"
            title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
          >
            {isLiked ? (
              <RiHeartFill className="w-5 h-5 text-violet-400 hover:scale-110 transition-all" />
            ) : (
              <RiHeartLine className="w-5 h-5 hover:scale-110 transition-all" />
            )}
          </button>
        )}
      </div>

      {/* CENTER: Playback Controls */}
      <div className="flex flex-col items-center gap-1.5 w-1/3 max-w-[460px]">
        {/* Buttons */}
        <div className="flex items-center gap-5 text-zinc-400">
          <button
            onClick={toggleShuffle}
            className={`hover:text-white transition-colors cursor-pointer ${
              shuffle ? 'text-violet-400 hover:text-violet-300' : ''
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
              <RiPauseCircleFill className="w-10 h-10 text-violet-500 drop-shadow-[0_0_10px_rgba(139,92,246,0.35)]" />
            ) : (
              <RiPlayCircleFill className="w-10 h-10 text-violet-500 drop-shadow-[0_0_10px_rgba(139,92,246,0.35)]" />
            )}
          </button>

          <button onClick={playNext} className="hover:text-white transition-colors cursor-pointer" title="Next">
            <RiSkipForwardMiniFill className="w-6 h-6" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`hover:text-white transition-colors relative cursor-pointer ${
              repeatMode !== 'off' ? 'text-violet-400 hover:text-violet-300' : ''
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            <RiRepeatLine className="w-5 h-5" />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 text-[8px] bg-violet-500 text-white font-extrabold rounded-full px-1 leading-none">
                1
              </span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2 text-[10px] text-spotify-lightGray font-medium">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="flex-1 accent-violet-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer hover:accent-violet-400 transition-colors"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* RIGHT: Volume & Queue */}
      <div className="flex items-center gap-3.5 w-1/3 justify-end relative">
        {/* Playback Speed selector */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
              playbackRate !== 1.0
                ? 'bg-violet-500/20 text-violet-400 border-violet-500/40 shadow-sm'
                : 'text-zinc-400 border-zinc-850 hover:text-white hover:border-zinc-700'
            }`}
            title="Playback Speed"
          >
            {playbackRate}x
          </button>

          {showSpeedMenu && (
            <div className="absolute right-0 bottom-10 w-24 rounded-2xl glass-panel shadow-2xl p-1.5 z-50 flex flex-col gap-1 text-xs border border-white/[0.05]">
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setPlaybackRate(rate);
                    setShowSpeedMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                    playbackRate === rate ? 'bg-violet-500/20 text-violet-400 font-bold' : 'text-zinc-300 hover:bg-white/[0.04]'
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
            sleepTimerTimeLeft !== null ? 'text-fuchsia-400' : 'text-spotify-lightGray'
          }`}
          title={sleepTimerTimeLeft !== null ? `Sleep Timer: ${Math.ceil(sleepTimerTimeLeft / 60)}m` : 'Sleep Timer'}
        >
          <Moon className="w-4 h-4" />
          {sleepTimerTimeLeft !== null && (
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
          )}
        </button>

        {/* Toggle Equalizer modal button */}
        <button
          onClick={toggleEqualizer}
          className={`hover:text-white transition-colors relative cursor-pointer ${
            showEqualizer ? 'text-violet-400' : 'text-spotify-lightGray'
          }`}
          title="Audio Equalizer"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Toggle Lyrics button */}
        <button
          onClick={toggleLyrics}
          className={`hover:text-white transition-colors relative cursor-pointer ${
            showLyrics ? 'text-violet-400' : 'text-spotify-lightGray'
          }`}
          title="Lyrics"
        >
          <RiMicLine className="w-5 h-5" />
        </button>

        {/* Toggle Queue Drawer button */}
        <button
          onClick={() => setShowQueue(!showQueue)}
          className={`hover:text-white transition-colors relative cursor-pointer ${
            showQueue ? 'text-violet-400' : 'text-spotify-lightGray'
          }`}
          title="Queue"
        >
          <MdQueueMusic className="w-5 h-5" />
        </button>

        {/* Keyboard Shortcuts button */}
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className={`hover:text-white transition-colors relative cursor-pointer ${
            showShortcuts ? 'text-violet-400' : 'text-spotify-lightGray'
          }`}
          title="Keyboard Shortcuts Guide"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Volume controls */}
        <button onClick={toggleMute} className="text-spotify-lightGray hover:text-white cursor-pointer" title={isMuted ? "Unmute" : "Mute"}>
          {isMuted || volume === 0 ? (
            <RiVolumeMuteLine className="w-5 h-5 text-red-400 hover:scale-105 transition-transform" />
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
          className="w-20 sm:w-24 accent-violet-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
        />

      </div>

      <QueueDrawer isOpen={showQueue} onClose={() => setShowQueue(false)} />
      <EqualizerModal />
      <AmbientPlayer isOpen={showAmbient} onClose={() => setShowAmbient(false)} />
      <SleepTimerModal />
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
};

export default Player;
