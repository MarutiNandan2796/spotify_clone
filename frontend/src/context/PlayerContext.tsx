import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Song } from '../types';
import api from '../services/api';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: Song[];
  history: Song[];
  showLyrics: boolean;
  showEqualizer: boolean;
  equalizerPreset: string;
  playbackRate: number;
  sleepTimerTimeLeft: number | null;
  showSleepModal: boolean;
  setSleepTimer: (minutes: number | null) => void;
  toggleSleepModal: () => void;
  setPlaybackRate: (rate: number) => void;
  setEqualizerPreset: (preset: string) => void;
  toggleEqualizer: () => void;
  playSong: (song: Song, newQueue?: Song[]) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  adjustVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  setQueueList: (songs: Song[]) => void;
  toggleLyrics: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState((() => {
    const saved = localStorage.getItem('player_volume');
    return saved ? parseFloat(saved) : 0.7;
  })());
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [queue, setQueue] = useState<Song[]>([]);
  const [originalQueue, setOriginalQueue] = useState<Song[]>([]); // To preserve original sequence when shuffle is toggled
  const [history, setHistory] = useState<Song[]>([]);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [equalizerPreset, setEqualizerPreset] = useState<string>('bass-boost');
  const [playbackRate, setPlaybackRateState] = useState<number>(1.0);
  const [sleepTimerTimeLeft, setSleepTimerTimeLeft] = useState<number | null>(null);
  const [showSleepModal, setShowSleepModal] = useState(false);

  const toggleSleepModal = () => {
    setShowSleepModal((prev) => !prev);
  };

  const setSleepTimer = (minutes: number | null) => {
    if (minutes === null) {
      setSleepTimerTimeLeft(null);
    } else {
      setSleepTimerTimeLeft(minutes * 60);
    }
  };

  // Sleep Timer Countdown Effect
  useEffect(() => {
    if (sleepTimerTimeLeft === null) return;

    if (sleepTimerTimeLeft <= 0) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      setSleepTimerTimeLeft(null);
      return;
    }

    const timer = setInterval(() => {
      setSleepTimerTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimerTimeLeft]);

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleEqualizer = () => {
    setShowEqualizer((prev) => !prev);
  };

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      handleSongEnded();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    // Set initial volume
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem('player_volume', volume.toString());
  }, [volume, isMuted]);

  // Log play count and record history when song starts
  const logPlay = async (songId: string) => {
    try {
      await api.post(`/history/play/${songId}`);
    } catch (error) {
      console.error('Failed to log play to history', error);
    }
  };

  const playSong = (song: Song, newQueue: Song[] = []) => {
    if (!audioRef.current) return;

    setCurrentSong(song);
    audioRef.current.src = song.audioUrl;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        logPlay(song._id);
        // Add to history state
        setHistory((prev) => {
          const filtered = prev.filter((s) => s._id !== song._id);
          return [song, ...filtered].slice(0, 30);
        });
      })
      .catch((err) => {
        console.error('Playback failed', err);
      });

    if (newQueue.length > 0) {
      setOriginalQueue(newQueue);
      if (shuffle) {
        // Create a shuffled list keeping the current song first
        const remaining = newQueue.filter((s) => s._id !== song._id);
        const shuffled = [...remaining].sort(() => Math.random() - 0.5);
        setQueue([song, ...shuffled]);
      } else {
        setQueue(newQueue);
      }
    } else {
      // If no new queue is specified, append/set current song in queue if empty
      setQueue((prev) => {
        if (prev.some((s) => s._id === song._id)) return prev;
        return [...prev, song];
      });
      setOriginalQueue((prev) => {
        if (prev.some((s) => s._id === song._id)) return prev;
        return [...prev, song];
      });
    }
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeSong = () => {
    if (audioRef.current && currentSong) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Resume failed', err));
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const adjustVolume = (vol: number) => {
    const safeVol = Math.max(0, Math.min(1, vol));
    setVolume(safeVol);
    if (safeVol > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleShuffle = () => {
    setShuffle((prev) => {
      const nextShuffle = !prev;
      if (nextShuffle && currentSong) {
        // Shuffling
        const remaining = originalQueue.filter((s) => s._id !== currentSong._id);
        const shuffled = [...remaining].sort(() => Math.random() - 0.5);
        setQueue([currentSong, ...shuffled]);
      } else if (currentSong) {
        // Restoring original sequence
        setQueue(originalQueue);
      }
      return nextShuffle;
    });
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleLyrics = () => {
    setShowLyrics((prev) => !prev);
  };

  const playNext = () => {
    if (queue.length === 0 || !currentSong) return;

    const currentIndex = queue.findIndex((s) => s._id === currentSong._id);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        // No more songs to play and repeat is off
        return;
      }
    }

    const nextSong = queue[nextIndex];
    playSong(nextSong, queue);
  };

  const playPrevious = () => {
    if (queue.length === 0 || !currentSong) return;

    // If song is more than 3 seconds in, restart the song instead
    if (currentTime > 3) {
      seek(0);
      return;
    }

    const currentIndex = queue.findIndex((s) => s._id === currentSong._id);
    if (currentIndex === -1) return;

    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      if (repeatMode === 'all') {
        prevIndex = queue.length - 1;
      } else {
        // Loop back to start of current song
        seek(0);
        return;
      }
    }

    const prevSong = queue[prevIndex];
    playSong(prevSong, queue);
  };

  const handleSongEnded = () => {
    if (repeatMode === 'one') {
      // Replay current song
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error('Replay failed', err));
      }
    } else {
      playNext();
    }
  };

  const addToQueue = (song: Song) => {
    setQueue((prev) => {
      if (prev.some((s) => s._id === song._id)) return prev;
      return [...prev, song];
    });
    setOriginalQueue((prev) => {
      if (prev.some((s) => s._id === song._id)) return prev;
      return [...prev, song];
    });
  };

  const removeFromQueue = (songId: string) => {
    setQueue((prev) => prev.filter((s) => s._id !== songId));
    setOriginalQueue((prev) => prev.filter((s) => s._id !== songId));
  };

  const clearQueue = () => {
    if (currentSong) {
      setQueue([currentSong]);
      setOriginalQueue([currentSong]);
    } else {
      setQueue([]);
      setOriginalQueue([]);
    }
  };

  const setQueueList = (songs: Song[]) => {
    setQueue(songs);
    setOriginalQueue(songs);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        duration,
        currentTime,
        volume,
        isMuted,
        shuffle,
        repeatMode,
        queue,
        history,
        showLyrics,
        showEqualizer,
        equalizerPreset,
        playbackRate,
        sleepTimerTimeLeft,
        showSleepModal,
        setSleepTimer,
        toggleSleepModal,
        setPlaybackRate,
        setEqualizerPreset,
        toggleEqualizer,
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
        addToQueue,
        removeFromQueue,
        clearQueue,
        setQueueList,
        toggleLyrics,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
