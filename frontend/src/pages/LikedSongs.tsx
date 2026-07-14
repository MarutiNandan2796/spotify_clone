import React, { useEffect, useState } from 'react';
import api from '../services/api';
import type { Song } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import SkeletonLoader from '../components/SkeletonLoader';
import { RiPlayFill, RiPauseFill, RiPlayMiniFill, RiPauseMiniFill, RiSearchLine, RiHeartFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LikedSongs: React.FC = () => {
  const { user } = useAuth();
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = usePlayer();

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  const fetchLikedSongs = async () => {
    if (!user) return;
    try {
      const res = await api.get('/likes');
      setSongs(res.data.songs || []);
    } catch (error) {
      console.error('Failed to load liked songs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedSongs();
  }, [user]);

  const handleSongPlay = (song: Song) => {
    if (currentSong?._id === song._id) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      playSong(song, songs);
    }
  };

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    playSong(songs[0], songs);
  };

  const handleUnlike = async (e: React.MouseEvent, songId: string) => {
    e.stopPropagation(); // Avoid triggering song play
    try {
      await api.post(`/likes/toggle/${songId}`);
      // Remove from visual list immediately
      setSongs((prev) => prev.filter((s) => s._id !== songId));
    } catch (error) {
      console.error('Failed to unlike song', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Filter songs based on search query
  const filteredSongs = songs.filter(
    (song) =>
      song.title?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      song.artist?.name?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
        <RiHeartFill className="w-16 h-16 text-zinc-650" />
        <div>
          <h3 className="text-lg font-bold text-zinc-400">Enjoy your Liked Songs</h3>
          <p className="text-sm text-zinc-500 mt-1">Log in to view all the songs you have liked.</p>
        </div>
        <Link
          to="/login"
          className="bg-white text-black font-extrabold px-6 py-2.5 rounded-full text-sm hover:scale-105 active:scale-95 transition-all mt-2"
        >
          Log In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader type="banner" />
        <div className="mt-8 space-y-6">
          <SkeletonLoader type="track" count={4} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24 text-left"
    >
      {/* Header Banner - Sleek purple gradient */}
      <div className="flex flex-col md:flex-row items-end gap-6 p-8 pt-12 select-none bg-gradient-to-b from-purple-900/60 to-spotify-dark">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-md shadow-2xl bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center shrink-0 border border-zinc-850">
          <RiHeartFill className="w-24 h-24 text-white drop-shadow-md" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase text-zinc-300">Playlist</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 leading-tight">
            Liked Songs
          </h1>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-300">
            <span className="text-white font-bold">{user.name}</span>
            <span>•</span>
            <span>{songs.length} songs</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Play Action and Local Filter Row */}
        {songs.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={handlePlayAll}
              className="w-14 h-14 bg-spotify-green hover:bg-spotify-hoverGreen text-black rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all text-glow cursor-pointer self-start"
              title="Play Liked Songs"
            >
              {songs.some((s) => s._id === currentSong?._id) && isPlaying ? (
                <RiPauseFill className="w-8 h-8" />
              ) : (
                <RiPlayFill className="w-8 h-8 ml-1" />
              )}
            </button>

            {/* Filter Search Bar */}
            <div className="relative w-full sm:max-w-xs group">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-450 group-focus-within:text-white w-4.5 h-4.5" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search in liked songs..."
                className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white text-xs pl-9 pr-4 py-2 rounded-full border border-transparent focus:border-zinc-700 outline-none transition-all placeholder:text-zinc-500"
              />
            </div>
          </div>
        )}

        {/* Tracks Table */}
        <div className="flex flex-col">
          {songs.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center gap-4 text-zinc-500">
              <div className="w-16 h-16 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                <RiHeartFill className="w-7 h-7 text-zinc-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-400">Songs you like will appear here</h3>
                <p className="text-xs text-zinc-500 mt-1">Save songs by tapping the heart icon on any song card.</p>
              </div>
            </div>
          ) : filteredSongs.length === 0 ? (
            <p className="text-sm text-zinc-500 italic p-6 text-center">No songs match your search query.</p>
          ) : (
            <>
              <div className="flex border-b border-zinc-800 text-xs font-bold text-spotify-lightGray uppercase py-2 px-4 select-none mb-2">
                <div className="w-10 text-center shrink-0">#</div>
                <div className="flex-1 text-left">Title</div>
                <div className="hidden sm:block w-36 text-left">Album</div>
                <div className="w-16 text-right pr-2">Duration</div>
                <div className="w-12 text-center shrink-0">Like</div>
              </div>

              {filteredSongs.map((song, index) => {
                const isCurrent = currentSong?._id === song._id;
                return (
                  <div
                    key={song._id}
                    onClick={() => handleSongPlay(song)}
                    className={`flex items-center py-3 px-4 rounded-md hover:bg-zinc-800/40 group cursor-pointer transition-colors ${
                      isCurrent ? 'bg-zinc-800/25' : ''
                    }`}
                  >
                    <div className="w-10 text-center text-sm font-medium text-spotify-lightGray shrink-0 select-none">
                      <span className="group-hover:hidden">{index + 1}</span>
                      <button className="hidden group-hover:block text-white hover:scale-110 active:scale-90 transition-transform">
                        {isCurrent && isPlaying ? (
                          <RiPauseMiniFill className="w-5 h-5 text-spotify-green" />
                        ) : (
                          <RiPlayMiniFill className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex-1 text-left overflow-hidden pr-4 leading-tight flex items-center gap-3">
                      <img src={song.coverImage} className="w-9 h-9 rounded object-cover shrink-0" alt="" />
                      <div className="flex flex-col overflow-hidden">
                        <span className={`text-sm font-semibold block truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
                          {song.title}
                        </span>
                        <span className="text-xs text-spotify-lightGray truncate">
                          {song.artist?.name || 'Unknown Artist'}
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:block w-36 text-left text-xs text-spotify-lightGray truncate">
                      {typeof song.album === 'object' ? song.album.title : 'Single'}
                    </div>

                    <div className="w-16 text-right text-xs font-medium text-spotify-lightGray pr-2 select-none">
                      {formatDuration(song.duration)}
                    </div>

                    <div className="w-12 flex items-center justify-center shrink-0">
                      <button
                        onClick={(e) => handleUnlike(e, song._id)}
                        className="text-spotify-green hover:scale-105 active:scale-95 transition-transform"
                        title="Unlike Song"
                      >
                        <RiHeartFill className="w-4 h-4 text-spotify-green" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LikedSongs;
