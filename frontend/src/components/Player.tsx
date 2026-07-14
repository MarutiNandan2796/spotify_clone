import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
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
  RiVolumeUpLine
} from 'react-icons/ri';
import { MdQueueMusic } from 'react-icons/md';

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
  } = usePlayer();

  const [isLiked, setIsLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

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
        <button onClick={toggleMute} className="text-spotify-lightGray hover:text-white cursor-pointer">
          {isMuted || volume === 0 ? (
            <RiVolumeMuteLine className="w-5 h-5 text-red-500" />
          ) : (
            <RiVolumeUpLine className="w-5 h-5" />
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

        {/* Queue Dropdown Drawer */}
        {showQueue && (
          <div className="absolute right-0 bottom-14 w-80 bg-spotify-dark/95 border border-zinc-800 rounded-lg shadow-2xl p-3 z-50 text-sm max-h-[300px] overflow-y-auto">
            <h4 className="font-bold border-b border-zinc-800 pb-2 mb-2 flex justify-between items-center text-white">
              <span>Play Queue</span>
              <span className="text-xs font-normal text-spotify-lightGray">{queue.length} songs</span>
            </h4>
            {queue.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">Queue is empty</p>
            ) : (
              <div className="flex flex-col gap-2">
                {queue.map((song, index) => {
                  const isActive = currentSong?._id === song._id;
                  return (
                    <div
                      key={`${song._id}-${index}`}
                      onClick={() => playSong(song, queue)}
                      className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-zinc-800/80 text-spotify-green font-semibold'
                          : 'hover:bg-zinc-800/50 text-zinc-300'
                      }`}
                    >
                      <img src={song.coverImage} className="w-8 h-8 rounded object-cover" alt="" />
                      <div className="flex flex-col overflow-hidden flex-1 leading-none">
                        <span className="text-xs truncate">{song.title}</span>
                        <span className="text-[10px] text-zinc-500 truncate">{song.artist?.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;
