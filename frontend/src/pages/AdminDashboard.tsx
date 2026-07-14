import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Song, Artist, Album, User } from '../types';
import { 
  MdOutlineAnalytics, 
  MdMusicNote, 
  MdAlbum, 
  MdPeopleOutline,
  MdOutlineSupervisedUserCircle,
  MdDeleteForever,
  MdCloudUpload
} from 'react-icons/md';
import { RiUserSharedLine, RiCheckLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'songs' | 'albums' | 'artists' | 'users'>('analytics');
  
  // Analytics State
  const [analytics, setAnalytics] = useState<any>({
    totalSongs: 0,
    totalAlbums: 0,
    totalArtists: 0,
    totalUsers: 0,
    totalPlays: 0,
  });
  
  // Database datasets
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms messages
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ----------------------------------------------------
  // Forms states
  // 1. Song Form
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songAlbum, setSongAlbum] = useState('');
  const [songDuration, setSongDuration] = useState('');
  const [songGenre, setSongGenre] = useState('');
  const [songIsFeatured, setSongIsFeatured] = useState(false);
  const [songAudioFile, setSongAudioFile] = useState<File | null>(null);
  const [songCoverFile, setSongCoverFile] = useState<File | null>(null);

  // 2. Album Form
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumArtist, setAlbumArtist] = useState('');
  const [albumReleaseDate, setAlbumReleaseDate] = useState(new Date().getFullYear().toString());
  const [albumGenre, setAlbumGenre] = useState('');
  const [albumCoverFile, setAlbumCoverFile] = useState<File | null>(null);

  // 3. Artist Form
  const [artistName, setArtistName] = useState('');
  const [artistBio, setArtistBio] = useState('');
  const [artistAvatarFile, setArtistAvatarFile] = useState<File | null>(null);
  const [artistBannerFile, setArtistBannerFile] = useState<File | null>(null);
  // ----------------------------------------------------

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, songsRes, artistsRes, albumsRes, usersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/songs'),
        api.get('/artists'),
        api.get('/albums'),
        api.get('/admin/users'),
      ]);

      setAnalytics(analyticsRes.data.analytics || {});
      setSongs(songsRes.data.songs || []);
      setArtists(artistsRes.data.artists || []);
      setAlbums(albumsRes.data.albums || []);
      setUsers(usersRes.data.users || []);
    } catch (e) {
      console.error('Failed to load admin stats', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  // Flash message helper
  const triggerMessage = (success: string, error = '') => {
    setSuccessMsg(success);
    setErrorMsg(error);
    setTimeout(() => {
      setSuccessMsg('');
      setErrorMsg('');
    }, 5000);
  };

  // Submit Handlers
  // 1. Song Form Submit
  const handleSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songAudioFile) {
      triggerMessage('', 'Please select an audio file to upload.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', songTitle);
      formData.append('artistId', songArtist);
      formData.append('albumId', songAlbum);
      formData.append('duration', songDuration);
      formData.append('genre', songGenre || 'Pop');
      formData.append('isFeatured', String(songIsFeatured));
      formData.append('audio', songAudioFile);
      if (songCoverFile) {
        formData.append('coverImage', songCoverFile);
      }

      await api.post('/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      triggerMessage('Song uploaded and published successfully!');
      // Clear fields
      setSongTitle('');
      setSongArtist('');
      setSongAlbum('');
      setSongDuration('');
      setSongGenre('');
      setSongIsFeatured(false);
      setSongAudioFile(null);
      setSongCoverFile(null);
      loadData();
    } catch (err: any) {
      triggerMessage('', err.response?.data?.message || 'Failed to publish song');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Album Form Submit
  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', albumTitle);
      formData.append('artistId', albumArtist);
      formData.append('releaseDate', albumReleaseDate);
      formData.append('genre', albumGenre);
      if (albumCoverFile) {
        formData.append('coverImage', albumCoverFile);
      }

      await api.post('/albums', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      triggerMessage('Album created successfully!');
      setAlbumTitle('');
      setAlbumArtist('');
      setAlbumGenre('');
      setAlbumCoverFile(null);
      loadData();
    } catch (err: any) {
      triggerMessage('', err.response?.data?.message || 'Failed to create album');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Artist Form Submit
  const handleArtistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', artistName);
      formData.append('bio', artistBio);
      if (artistAvatarFile) {
        formData.append('avatar', artistAvatarFile);
      }
      if (artistBannerFile) {
        formData.append('coverBanner', artistBannerFile);
      }

      await api.post('/artists', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      triggerMessage('Artist profile created successfully!');
      setArtistName('');
      setArtistBio('');
      setArtistAvatarFile(null);
      setArtistBannerFile(null);
      loadData();
    } catch (err: any) {
      triggerMessage('', err.response?.data?.message || 'Failed to create artist');
    } finally {
      setSubmitting(false);
    }
  };

  // Deletion Actions
  const handleDeleteSong = async (id: string) => {
    if (!window.confirm('Delete this song from DB?')) return;
    try {
      await api.delete(`/songs/${id}`);
      setSongs((prev) => prev.filter((s) => s._id !== id));
      triggerMessage('Song deleted.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!window.confirm('Delete this album?')) return;
    try {
      await api.delete(`/albums/${id}`);
      setAlbums((prev) => prev.filter((a) => a._id !== id));
      triggerMessage('Album deleted.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteArtist = async (id: string) => {
    if (!window.confirm('Deleting this artist will delete all their linked songs and albums! Confirm?')) return;
    try {
      await api.delete(`/artists/${id}`);
      setArtists((prev) => prev.filter((a) => a._id !== id));
      triggerMessage('Artist deleted.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (targetUserId: string) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${targetUserId}`);
      setUsers((prev) => prev.filter((u) => u._id !== targetUserId));
      triggerMessage('User deleted successfully.');
    } catch (e: any) {
      triggerMessage('', e.response?.data?.message || 'Failed to delete user');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-20 text-center text-red-400 font-bold flex flex-col items-center justify-center gap-4">
        <RiUserSharedLine className="w-16 h-16 text-red-500/40" />
        <div>
          <h3 className="text-xl">Access Denied</h3>
          <p className="text-sm text-zinc-500 font-normal mt-1">You must be logged in as an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 text-left space-y-6">
      <div className="flex items-center gap-3">
        <MdOutlineSupervisedUserCircle className="w-8 h-8 text-spotify-green" />
        <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
      </div>

      {successMsg && (
        <p className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-lg flex items-center gap-2 max-w-xl transition-all">
          <RiCheckLine className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </p>
      )}

      {errorMsg && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg max-w-xl transition-all">
          {errorMsg}
        </p>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        {(
          [
            { id: 'analytics', label: 'Analytics', icon: MdOutlineAnalytics },
            { id: 'songs', label: 'Manage Songs', icon: MdMusicNote },
            { id: 'albums', label: 'Manage Albums', icon: MdAlbum },
            { id: 'artists', label: 'Manage Artists', icon: RiUserSharedLine },
            { id: 'users', label: 'Manage Users', icon: MdPeopleOutline },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSuccessMsg('');
                setErrorMsg('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-spotify-green text-black'
                  : 'bg-zinc-900 text-white hover:bg-zinc-850'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE TAB */}
      {loading ? (
        <p className="text-zinc-500 italic p-6">Loading dashboard content...</p>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-2"
        >
          {/* 1. ANALYTICS VIEW */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Analytics grid widgets */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Total Songs', count: analytics.totalSongs, icon: MdMusicNote, color: 'text-indigo-400' },
                  { label: 'Total Albums', count: analytics.totalAlbums, icon: MdAlbum, color: 'text-pink-400' },
                  { label: 'Total Artists', count: analytics.totalArtists, icon: RiUserSharedLine, color: 'text-blue-400' },
                  { label: 'Total Users', count: analytics.totalUsers, icon: MdPeopleOutline, color: 'text-purple-400' },
                  { label: 'Total Song Plays', count: analytics.totalPlays, icon: MdOutlineAnalytics, color: 'text-spotify-green' },
                ].map((widget, i) => {
                  const WidgetIcon = widget.icon;
                  return (
                    <div key={i} className="bg-spotify-card border border-zinc-800 p-5 rounded-lg flex items-center justify-between shadow">
                      <div className="flex flex-col text-left leading-none gap-2">
                        <span className="text-[11px] font-bold text-spotify-lightGray uppercase tracking-wider">{widget.label}</span>
                        <span className="text-2xl font-black text-white">{widget.count?.toLocaleString() || 0}</span>
                      </div>
                      <WidgetIcon className={`w-8 h-8 ${widget.color}`} />
                    </div>
                  );
                })}
              </div>

              {/* Seeding advice notice */}
              <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-lg text-sm max-w-2xl text-zinc-450 leading-relaxed">
                <span className="font-bold text-white block mb-1">💡 Seeding data notice</span>
                <p>If your database is empty, you can seed the database with copyright-free instrumental tracks and public domain images. Execute the following in your command prompt terminal under the backend directory:</p>
                <code className="block bg-black p-2.5 rounded text-spotify-green text-xs font-mono my-2.5">
                  npm run seed
                </code>
              </div>
            </div>
          )}

          {/* 2. MANAGE SONGS */}
          {activeTab === 'songs' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Form to create song */}
              <form onSubmit={handleSongSubmit} className="bg-spotify-card border border-zinc-800 rounded-xl p-5 md:p-6 space-y-4 shadow-xl">
                <h3 className="font-bold text-white text-base border-b border-zinc-850 pb-2.5 flex items-center gap-2">
                  <MdCloudUpload className="w-5 h-5 text-spotify-green" />
                  <span>Upload & Publish Song</span>
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">Track Title</label>
                  <input
                    type="text"
                    required
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="Enter track title"
                    className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-300">Artist</label>
                    <select
                      required
                      value={songArtist}
                      onChange={(e) => setSongArtist(e.target.value)}
                      className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                    >
                      <option value="">Select Artist</option>
                      {artists.map((a) => (
                        <option key={a._id} value={a._id}>{a.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-300">Album (Optional)</label>
                    <select
                      value={songAlbum}
                      onChange={(e) => setSongAlbum(e.target.value)}
                      className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                    >
                      <option value="">Single (No Album)</option>
                      {albums
                        .filter((alb) => !songArtist || (typeof alb.artist === 'object' && alb.artist._id === songArtist) || alb.artist === songArtist)
                        .map((alb) => (
                          <option key={alb._id} value={alb._id}>{alb.title}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-300">Duration (seconds)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 185"
                      value={songDuration}
                      onChange={(e) => setSongDuration(e.target.value)}
                      className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-300">Genre</label>
                    <input
                      type="text"
                      placeholder="e.g. Pop, Lofi, Rock"
                      value={songGenre}
                      onChange={(e) => setSongGenre(e.target.value)}
                      className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1 select-none">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={songIsFeatured}
                    onChange={(e) => setSongIsFeatured(e.target.checked)}
                    className="accent-spotify-green w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-bold text-zinc-300 cursor-pointer">
                    Promote to Featured songs row
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">Audio File (.mp3, .wav, .ogg)</label>
                  <input
                    type="file"
                    accept="audio/*"
                    required
                    onChange={(e) => setSongAudioFile(e.target.files ? e.target.files[0] : null)}
                    className="text-xs text-spotify-lightGray file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-zinc-250 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">Cover Artwork (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSongCoverFile(e.target.files ? e.target.files[0] : null)}
                    className="text-xs text-spotify-lightGray file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-zinc-250 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-spotify-green hover:bg-spotify-hoverGreen text-black font-extrabold py-3 rounded-full mt-2 hover:scale-[1.01] active:scale-95 transition-all text-xs cursor-pointer disabled:bg-zinc-700 disabled:text-zinc-400"
                >
                  {submitting ? 'Uploading assets...' : 'Publish Track'}
                </button>
              </form>

              {/* List of songs */}
              <div className="bg-spotify-card border border-zinc-800 rounded-xl p-5 md:p-6 space-y-4 shadow-xl">
                <h3 className="font-bold text-white text-base border-b border-zinc-850 pb-2.5">Uploaded Songs ({songs.length})</h3>
                <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
                  {songs.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-10 text-center italic">No songs found in DB.</p>
                  ) : (
                    songs.map((song) => (
                      <div key={song._id} className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-zinc-850">
                        <div className="flex items-center gap-3 overflow-hidden text-left">
                          <img src={song.coverImage} className="w-10 h-10 object-cover rounded shrink-0" alt="" />
                          <div className="flex flex-col overflow-hidden leading-tight">
                            <span className="text-xs font-bold text-white truncate">{song.title}</span>
                            <span className="text-[10px] text-spotify-lightGray truncate">{song.artist?.name}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSong(song._id)}
                          className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                          title="Delete Song"
                        >
                          <MdDeleteForever className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. MANAGE ALBUMS */}
          {activeTab === 'albums' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Album creation Form */}
              <form onSubmit={handleAlbumSubmit} className="bg-spotify-card border border-zinc-800 rounded-xl p-5 md:p-6 space-y-4 shadow-xl">
                <h3 className="font-bold text-white text-base border-b border-zinc-850 pb-2.5 flex items-center gap-2">
                  <MdAlbum className="w-5 h-5 text-spotify-green" />
                  <span>Create Album</span>
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">Album Title</label>
                  <input
                    type="text"
                    required
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                    placeholder="Enter album title"
                    className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">Artist</label>
                  <select
                    required
                    value={albumArtist}
                    onChange={(e) => setAlbumArtist(e.target.value)}
                    className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                  >
                    <option value="">Select Artist</option>
                    {artists.map((a) => (
                      <option key={a._id} value={a._id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-300">Release Year</label>
                    <input
                      type="text"
                      required
                      value={albumReleaseDate}
                      onChange={(e) => setAlbumReleaseDate(e.target.value)}
                      className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-300">Genre</label>
                    <input
                      type="text"
                      placeholder="e.g. Lofi, Metal, Pop"
                      value={albumGenre}
                      onChange={(e) => setAlbumGenre(e.target.value)}
                      className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">Album Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setAlbumCoverFile(e.target.files ? e.target.files[0] : null)}
                    className="text-xs text-spotify-lightGray file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-zinc-250 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-spotify-green hover:bg-spotify-hoverGreen text-black font-extrabold py-3 rounded-full mt-2 hover:scale-[1.01] active:scale-95 transition-all text-xs cursor-pointer disabled:bg-zinc-700"
                >
                  {submitting ? 'Creating Album...' : 'Create Album'}
                </button>
              </form>

              {/* List of albums */}
              <div className="bg-spotify-card border border-zinc-800 rounded-xl p-5 md:p-6 space-y-4 shadow-xl">
                <h3 className="font-bold text-white text-base border-b border-zinc-850 pb-2.5">Albums List ({albums.length})</h3>
                <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
                  {albums.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-10 text-center italic">No albums in DB.</p>
                  ) : (
                    albums.map((alb) => {
                      const artName = typeof alb.artist === 'object' ? alb.artist.name : 'Unknown';
                      return (
                        <div key={alb._id} className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-zinc-850">
                          <div className="flex items-center gap-3 overflow-hidden text-left">
                            <img src={alb.coverImage} className="w-10 h-10 object-cover rounded shrink-0" alt="" />
                            <div className="flex flex-col overflow-hidden leading-tight">
                              <span className="text-xs font-bold text-white truncate">{alb.title}</span>
                              <span className="text-[10px] text-spotify-lightGray truncate">{artName}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteAlbum(alb._id)}
                            className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                            title="Delete Album"
                          >
                            <MdDeleteForever className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. MANAGE ARTISTS */}
          {activeTab === 'artists' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Artist Form */}
              <form onSubmit={handleArtistSubmit} className="bg-spotify-card border border-zinc-800 rounded-xl p-5 md:p-6 space-y-4 shadow-xl">
                <h3 className="font-bold text-white text-base border-b border-zinc-850 pb-2.5 flex items-center gap-2">
                  <RiUserSharedLine className="w-5 h-5 text-spotify-green" />
                  <span>Create Artist Profile</span>
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">Artist Name</label>
                  <input
                    type="text"
                    required
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="Enter artist name"
                    className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">Biography</label>
                  <textarea
                    rows={4}
                    value={artistBio}
                    onChange={(e) => setArtistBio(e.target.value)}
                    placeholder="Short bio description..."
                    className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">Avatar Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setArtistAvatarFile(e.target.files ? e.target.files[0] : null)}
                    className="text-xs text-spotify-lightGray file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-zinc-250 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">Cover Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setArtistBannerFile(e.target.files ? e.target.files[0] : null)}
                    className="text-xs text-spotify-lightGray file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-zinc-250 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-spotify-green hover:bg-spotify-hoverGreen text-black font-extrabold py-3 rounded-full mt-2 hover:scale-[1.01] active:scale-95 transition-all text-xs cursor-pointer disabled:bg-zinc-700"
                >
                  {submitting ? 'Creating Profile...' : 'Create Artist'}
                </button>
              </form>

              {/* Artists list */}
              <div className="bg-spotify-card border border-zinc-800 rounded-xl p-5 md:p-6 space-y-4 shadow-xl">
                <h3 className="font-bold text-white text-base border-b border-zinc-850 pb-2.5">Artists List ({artists.length})</h3>
                <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
                  {artists.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-10 text-center italic">No artists in DB.</p>
                  ) : (
                    artists.map((art) => (
                      <div key={art._id} className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-zinc-850">
                        <div className="flex items-center gap-3 overflow-hidden text-left">
                          <img src={art.avatar} className="w-10 h-10 object-cover rounded-full shrink-0" alt="" />
                          <span className="text-xs font-bold text-white truncate">{art.name}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteArtist(art._id)}
                          className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                          title="Delete Artist"
                        >
                          <MdDeleteForever className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. MANAGE USERS */}
          {activeTab === 'users' && (
            <div className="bg-spotify-card border border-zinc-800 rounded-xl p-5 md:p-6 space-y-4 shadow-xl max-w-4xl">
              <h3 className="font-bold text-white text-base border-b border-zinc-850 pb-2.5">Registered Users ({users.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-spotify-lightGray select-none">
                      <th className="py-2.5 px-3">Avatar</th>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Created</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isSelf = u._id === user.id;
                      return (
                        <tr key={u._id} className="border-b border-zinc-900 hover:bg-zinc-850/30 transition-colors">
                          <td className="py-3 px-3">
                            <img src={u.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                          </td>
                          <td className="py-3 px-3 font-semibold text-white">{u.name}</td>
                          <td className="py-3 px-3 text-zinc-450">{u.email}</td>
                          <td className="py-3 px-3">
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              u.role === 'admin' ? 'bg-spotify-green/20 text-spotify-green' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-zinc-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={isSelf}
                              className="text-zinc-550 hover:text-red-500 disabled:opacity-25 transition-colors"
                              title={isSelf ? "You cannot delete yourself" : "Delete User"}
                            >
                              <MdDeleteForever className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
