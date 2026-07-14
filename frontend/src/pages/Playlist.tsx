import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Playlist as PlaylistType, Song } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import SkeletonLoader from '../components/SkeletonLoader';
import { useDebounce } from '../hooks/useDebounce';
import { 
  RiPlayFill, 
  RiPauseFill, 
  RiPlayMiniFill, 
  RiPauseMiniFill,
  RiDeleteBinLine, 
  RiSearchLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiEditLine
} from 'react-icons/ri';
import { motion } from 'framer-motion';

const Playlist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = usePlayer();

  const [playlist, setPlaylist] = useState<PlaylistType | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit Playlist state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  // Search & Add songs state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchPlaylist = async () => {
    try {
      const res = await api.get(`/playlists/${id}`);
      setPlaylist(res.data.playlist);
      setEditName(res.data.playlist.name);
      setEditDescription(res.data.playlist.description);
    } catch (error) {
      console.error('Failed to load playlist', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPlaylist();
  }, [id]);

  // Search for songs to add
  useEffect(() => {
    const searchSongs = async () => {
      if (!debouncedSearch.trim()) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(debouncedSearch)}`);
        setSearchResults(res.data.songs || []);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setSearchLoading(false);
      }
    };
    searchSongs();
  }, [debouncedSearch]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', editName);
      formData.append('description', editDescription);
      if (editFile) {
        formData.append('coverImage', editFile);
      }

      const res = await api.put(`/playlists/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPlaylist(res.data.playlist);
      setIsEditing(false);
      setEditFile(null);
    } catch (error: any) {
      setEditError(error.response?.data?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;
    try {
      await api.delete(`/playlists/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Delete playlist failed', error);
    }
  };

  const handleAddSong = async (songId: string) => {
    try {
      const res = await api.post('/playlists/songs', { playlistId: id, songId });
      // Refetch playlist
      fetchPlaylist();
      setSearchQuery('');
    } catch (error) {
      console.error('Add song failed', error);
    }
  };

  const handleRemoveSong = async (songId: string) => {
    try {
      await api.delete('/playlists/songs', { data: { playlistId: id, songId } });
      // Refetch playlist
      fetchPlaylist();
    } catch (error) {
      console.error('Remove song failed', error);
    }
  };

  // Reordering: shifts song index up or down
  const handleMoveSong = async (index: number, direction: 'up' | 'down') => {
    if (!playlist) return;
    const newSongs = [...playlist.songs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSongs.length) return;

    // Swap
    const temp = newSongs[index];
    newSongs[index] = newSongs[targetIndex];
    newSongs[targetIndex] = temp;

    // Local update for visual snap
    setPlaylist({ ...playlist, songs: newSongs });

    try {
      const songIds = newSongs.map((s) => s._id);
      await api.put(`/playlists/${id}/songs`, { songs: songIds });
    } catch (error) {
      console.error('Failed to save play order', error);
      fetchPlaylist(); // Rollback
    }
  };

  const handlePlayPlaylist = () => {
    if (!playlist || playlist.songs.length === 0) return;
    playSong(playlist.songs[0], playlist.songs);
  };

  const handleSongPlay = (song: Song) => {
    if (!playlist) return;
    if (currentSong?._id === song._id) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      playSong(song, playlist.songs);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader type="banner" />
        <div className="mt-8 space-y-6">
          <SkeletonLoader type="track" count={3} />
        </div>
      </div>
    );
  }

  if (!playlist) {
    return <div className="p-20 text-center text-zinc-500 font-medium">Playlist not found.</div>;
  }

  const isCreator = user && playlist.creator?._id === user.id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24 text-left relative"
    >
      {/* Header Info Banner */}
      <div className="flex flex-col md:flex-row items-end gap-6 p-8 pt-12 select-none">
        <div className="relative group shrink-0 border border-zinc-800 rounded-md shadow-2xl overflow-hidden">
          <img
            src={playlist.coverImage}
            alt={playlist.name}
            className="w-48 h-48 md:w-56 md:h-56 object-cover"
          />
          {isCreator && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-semibold"
            >
              <RiEditLine className="w-6 h-6 text-white" />
              <span>Change cover</span>
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          <span className="text-xs font-bold uppercase text-zinc-300">Playlist</span>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight truncate">
              {playlist.name}
            </h1>
            {isCreator && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-800 rounded-full transition-all cursor-pointer"
                title="Edit Playlist Details"
              >
                <RiEditLine className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-sm text-spotify-lightGray line-clamp-2 pr-4">{playlist.description || 'No description'}</p>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-300 mt-1">
            <span className="text-white font-bold">{playlist.creator?.name}</span>
            <span>•</span>
            <span>{playlist.songs?.length || 0} songs</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Play Action and Delete row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {playlist.songs?.length > 0 && (
              <button
                onClick={handlePlayPlaylist}
                className="w-14 h-14 bg-spotify-green hover:bg-spotify-hoverGreen text-black rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all text-glow cursor-pointer"
                title="Play Playlist"
              >
                {playlist.songs.some((s) => s._id === currentSong?._id) && isPlaying ? (
                  <RiPauseFill className="w-8 h-8" />
                ) : (
                  <RiPlayFill className="w-8 h-8 ml-1" />
                )}
              </button>
            )}
          </div>

          {isCreator && (
            <button
              onClick={handleDeletePlaylist}
              className="text-zinc-500 hover:text-red-400 flex items-center gap-1 text-sm font-bold border border-zinc-800 hover:border-red-500/30 p-2 px-3 rounded-full hover:bg-red-500/5 transition-all cursor-pointer"
              title="Delete Playlist"
            >
              <RiDeleteBinLine className="w-4 h-4" />
              <span>Delete Playlist</span>
            </button>
          )}
        </div>

        {/* Tracks Table */}
        <div className="flex flex-col">
          <div className="flex border-b border-zinc-800 text-xs font-bold text-spotify-lightGray uppercase py-2 px-4 select-none mb-2">
            <div className="w-10 text-center shrink-0">#</div>
            <div className="flex-1 text-left">Title</div>
            <div className="hidden sm:block w-36 text-left">Album</div>
            <div className="w-16 text-right pr-2">Duration</div>
            {isCreator && <div className="w-24 text-center shrink-0">Actions</div>}
          </div>

          {playlist.songs.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-zinc-800 rounded-lg bg-zinc-900/10">
              <p className="text-sm text-zinc-500 font-semibold mb-1">Playlist is currently empty</p>
              <p className="text-xs text-zinc-600">Use the search area below to add songs.</p>
            </div>
          ) : (
            playlist.songs.map((song, index) => {
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

                  <div className="flex-1 text-left overflow-hidden pr-4 leading-tight">
                    <span className={`text-sm font-semibold block truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
                      {song.title}
                    </span>
                    <span className="text-xs text-spotify-lightGray truncate">
                      {song.artist?.name || 'Unknown Artist'}
                    </span>
                  </div>

                  <div className="hidden sm:block w-36 text-left text-xs text-spotify-lightGray truncate">
                    {typeof song.album === 'object' ? song.album.title : 'Single'}
                  </div>

                  <div className="w-16 text-right text-xs font-medium text-spotify-lightGray pr-2 select-none">
                    {formatDuration(song.duration)}
                  </div>

                  {isCreator && (
                    <div
                      className="w-24 flex items-center justify-center gap-1.5 shrink-0"
                      onClick={(e) => e.stopPropagation()} // Stop triggering song playing
                    >
                      {/* Rearranging arrows */}
                      <button
                        onClick={() => handleMoveSong(index, 'up')}
                        disabled={index === 0}
                        className="text-zinc-500 hover:text-white disabled:opacity-20 transition-all p-1"
                        title="Move Up"
                      >
                        <RiArrowUpLine className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveSong(index, 'down')}
                        disabled={index === playlist.songs.length - 1}
                        className="text-zinc-500 hover:text-white disabled:opacity-20 transition-all p-1"
                        title="Move Down"
                      >
                        <RiArrowDownLine className="w-4 h-4" />
                      </button>
                      {/* Remove Song */}
                      <button
                        onClick={() => handleRemoveSong(song._id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                        title="Remove from Playlist"
                      >
                        <RiDeleteBinLine className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Let's find something to add Section */}
        {isCreator && (
          <div className="pt-8 border-t border-zinc-800/80 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white">Let's add something to your playlist</h3>
              <p className="text-xs text-spotify-lightGray mt-1">Search for songs by title, genre or artist.</p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-md group">
              <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-white w-4.5 h-4.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tracks..."
                className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white text-xs pl-10 pr-4 py-2.5 rounded-full border border-transparent focus:border-zinc-700 outline-none transition-all placeholder:text-zinc-500"
              />
            </div>

            {/* Search Results list */}
            {searchQuery && (
              <div className="bg-[#181818] border border-zinc-800 rounded-lg p-2 max-h-[300px] overflow-y-auto max-w-2xl">
                {searchLoading ? (
                  <p className="text-xs text-zinc-500 italic p-3 text-center">Searching tracks...</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic p-3 text-center">No songs match "{searchQuery}"</p>
                ) : (
                  <div className="flex flex-col">
                    {searchResults.map((song) => {
                      const alreadyInPlaylist = playlist.songs.some((s) => s._id === song._id);
                      return (
                        <div
                          key={song._id}
                          className="flex items-center justify-between p-2 rounded hover:bg-zinc-800/40"
                        >
                          <div className="flex items-center gap-3">
                            <img src={song.coverImage} className="w-9 h-9 rounded object-cover" alt="" />
                            <div className="flex flex-col leading-tight">
                              <span className="text-xs font-semibold text-white">{song.title}</span>
                              <span className="text-[10px] text-spotify-lightGray">{song.artist?.name}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddSong(song._id)}
                            disabled={alreadyInPlaylist}
                            className={`text-xs font-bold py-1 px-4 rounded-full transition-all active:scale-95 ${
                              alreadyInPlaylist
                                ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-default'
                                : 'bg-white text-black hover:scale-105'
                            }`}
                          >
                            {alreadyInPlaylist ? 'Added' : 'Add'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Details Overlay Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleEditSubmit}
            className="w-full max-w-md bg-spotify-dark border border-zinc-800 rounded-lg p-6 flex flex-col gap-4 text-left shadow-2xl relative"
          >
            <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-2.5">Edit Details</h3>

            {editError && (
              <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2.5 rounded text-center">
                {editError}
              </p>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-300">Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-[#121212] border border-zinc-700 focus:border-spotify-green text-white text-sm rounded-lg p-2.5 outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-300">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="bg-[#121212] border border-zinc-700 focus:border-spotify-green text-white text-sm rounded-lg p-2.5 outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-300">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditFile(e.target.files ? e.target.files[0] : null)}
                className="text-xs text-spotify-lightGray file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-zinc-200"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4 border-t border-zinc-800 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-transparent border border-zinc-700 hover:border-white text-white text-xs font-bold py-2 px-5 rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-white text-black hover:scale-105 active:scale-95 text-xs font-bold py-2 px-5 rounded-full transition-all cursor-pointer disabled:bg-zinc-600 disabled:text-zinc-400"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default Playlist;
