import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Playlist } from '../types';
import { 
  RiHome5Fill, 
  RiHome5Line, 
  RiSearchFill, 
  RiSearchLine,
  RiAddLine,
  RiHeartFill
} from 'react-icons/ri';
import { VscLibrary } from 'react-icons/vsc';
import { BiMusic } from 'react-icons/bi';
import { MdCloudUpload } from 'react-icons/md';

/**
 * Sidebar Component
 * Displays the persistent left sidebar. Includes logo link, primary navigation (Home, Search),
 * user library shortcut for Liked Songs, and user's custom playlists with a quick-create handler.
 *
 * @returns {React.ReactElement} The rendered Sidebar component.
 */
const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaylists = async () => {
    if (!user) return;
    try {
      const res = await api.get('/playlists');
      setPlaylists(res.data.playlists);
    } catch (error) {
      console.error('Failed to fetch playlists in sidebar', error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [user]);

  const handleCreatePlaylist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/playlists', {});
      const newPlaylist = res.data.playlist;
      setPlaylists((prev) => [newPlaylist, ...prev]);
      navigate(`/playlist/${newPlaylist._id}`);
    } catch (error) {
      console.error('Failed to create playlist', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full w-full">
      {/* Home / Search Panel */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
        <Link to="/" className="flex items-center gap-3 mb-2 px-1 group">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.4)] group-hover:scale-105 transition-transform duration-300">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 10v4M8 6v12M12 3v18M16 8v8M20 11v2" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">Aura Wave</span>
        </Link>
 
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-4 text-sm font-semibold transition-all py-2 px-3 rounded-xl hover:bg-white/[0.04] hover:text-white group ${
              isActive ? 'text-white bg-white/[0.04] border border-white/[0.05]' : 'text-spotify-lightGray'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <RiHome5Fill className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <RiHome5Line className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              )}
              <span>Home</span>
            </>
          )}
        </NavLink>
 
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex items-center gap-4 text-sm font-semibold transition-all py-2 px-3 rounded-xl hover:bg-white/[0.04] hover:text-white group ${
              isActive ? 'text-white bg-white/[0.04] border border-white/[0.05]' : 'text-spotify-lightGray'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <RiSearchFill className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <RiSearchLine className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              )}
              <span>Search</span>
            </>
          )}
        </NavLink>
      </div>

      {/* Library Panel */}
      <div className="flex-1 glass-panel rounded-2xl p-3 flex flex-col overflow-hidden shadow-xl mt-1">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 text-spotify-lightGray">
          <div className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
            <VscLibrary className="w-5 h-5 text-violet-400" />
            <span className="text-sm font-bold">Your Library</span>
          </div>
          <button
            onClick={handleCreatePlaylist}
            disabled={loading}
            className="hover:text-white hover:bg-white/[0.05] p-2 rounded-xl transition-all active:scale-95 border border-transparent hover:border-white/[0.05]"
            title="Create Playlist"
          >
            <RiAddLine className="w-5 h-5" />
          </button>
        </div>
 
        {/* Liked Songs Shortcut */}
        <Link
          to="/liked-songs"
          className="flex items-center gap-3 p-2.5 mx-1.5 rounded-xl hover:bg-white/[0.04] hover:border hover:border-white/[0.05] transition-all border border-transparent group"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 flex items-center justify-center shadow-lg shrink-0 group-hover:opacity-90 transition-transform duration-300 group-hover:scale-105">
            <RiHeartFill className="w-5 h-5 text-white animate-pulse" style={{ animationDuration: '3s' }} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-white truncate">Liked Songs</span>
            <span className="text-xs text-spotify-lightGray">Playlist</span>
          </div>
        </Link>

        {/* Uploads Shortcut */}
        {user && (
          <Link
            to="/upload"
            className="flex items-center gap-3 p-2.5 mx-1.5 rounded-xl hover:bg-white/[0.04] hover:border hover:border-white/[0.05] transition-all border border-transparent group mt-1"
          >
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-violet-600 via-indigo-650 to-cyan-500 flex items-center justify-center shadow-lg shrink-0 group-hover:opacity-90 transition-transform duration-300 group-hover:scale-105">
              <MdCloudUpload className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-white truncate">Your Uploads</span>
              <span className="text-xs text-spotify-lightGray">Custom Audio</span>
            </div>
          </Link>
        )}
 
        {/* Playlists List Container */}
        <div className="flex-1 overflow-y-auto mt-2 px-1">
          {playlists.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm font-semibold text-spotify-lightGray mb-2">Create your first playlist</p>
              <button
                onClick={handleCreatePlaylist}
                className="text-xs font-bold text-black bg-white py-1.5 px-4 rounded-full hover:scale-105 active:scale-95 transition-all mt-1"
              >
                Create Playlist
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {playlists.map((playlist) => (
                <Link
                  key={playlist._id}
                  to={`/playlist/${playlist._id}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] hover:border hover:border-white/[0.05] border border-transparent transition-all group"
                >
                  <img
                    src={playlist.coverImage}
                    alt={playlist.name}
                    className="w-11 h-11 rounded-lg object-cover shadow shrink-0 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-white truncate group-hover:text-violet-400 transition-colors">
                      {playlist.name}
                    </span>
                    <span className="text-xs text-spotify-lightGray">
                      Playlist • {playlist.creator?.name || 'User'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
