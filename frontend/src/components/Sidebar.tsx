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
      <div className="bg-spotify-black rounded-lg p-4 flex flex-col gap-4">
        <Link to="/" className="flex items-center gap-2 mb-2 px-1">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-spotify-green" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.892-.982-.336.076-.67-.138-.746-.473-.076-.336.138-.67.473-.746 3.854-.88 7.15-.504 9.822 1.13.295.18.387.563.207.864zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.082-1.182-.413.125-.847-.11-972-.522-.125-.412.11-.847.522-.972 3.676-1.114 8.24-.57 11.35 1.344.366.226.486.707.26 1.074zm.107-2.836C14.394 8.71 8.683 8.52 5.355 9.53c-.512.155-1.046-.134-1.202-.647-.155-.513.134-1.047.647-1.202 3.82-1.16 10.122-.94 14.168 1.464.46.273.61.87.337 1.33-.273.46-.87.61-1.33.337z"/>
          </svg>
          <span className="font-bold text-xl tracking-tight">Spotify</span>
        </Link>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-4 text-sm font-semibold transition-colors py-1.5 hover:text-white ${
              isActive ? 'text-white' : 'text-spotify-lightGray'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? <RiHome5Fill className="w-6 h-6" /> : <RiHome5Line className="w-6 h-6" />}
              <span>Home</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex items-center gap-4 text-sm font-semibold transition-colors py-1.5 hover:text-white ${
              isActive ? 'text-white' : 'text-spotify-lightGray'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? <RiSearchFill className="w-6 h-6" /> : <RiSearchLine className="w-6 h-6" />}
              <span>Search</span>
            </>
          )}
        </NavLink>
      </div>

      {/* Library Panel */}
      <div className="flex-1 bg-spotify-black rounded-lg p-2 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 text-spotify-lightGray">
          <div className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
            <VscLibrary className="w-6 h-6" />
            <span className="text-sm font-bold">Your Library</span>
          </div>
          <button
            onClick={handleCreatePlaylist}
            disabled={loading}
            className="hover:text-white hover:bg-zinc-800 p-1.5 rounded-full transition-all active:scale-95"
            title="Create Playlist"
          >
            <RiAddLine className="w-5 h-5" />
          </button>
        </div>

        {/* Liked Songs Shortcut */}
        <Link
          to="/liked-songs"
          className="flex items-center gap-3 p-2 mx-1.5 rounded-md hover:bg-zinc-900 transition-colors group"
        >
          <div className="w-12 h-12 rounded bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shrink-0 group-hover:opacity-90">
            <RiHeartFill className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-white truncate">Liked Songs</span>
            <span className="text-xs text-spotify-lightGray">Playlist</span>
          </div>
        </Link>

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
            <div className="flex flex-col gap-1">
              {playlists.map((playlist) => (
                <Link
                  key={playlist._id}
                  to={`/playlist/${playlist._id}`}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-900 transition-colors group"
                >
                  <img
                    src={playlist.coverImage}
                    alt={playlist.name}
                    className="w-12 h-12 rounded object-cover shadow shrink-0"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-white truncate group-hover:text-spotify-green transition-colors">
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
