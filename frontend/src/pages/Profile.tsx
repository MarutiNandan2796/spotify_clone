import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import api from '../services/api';
import type { Song } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';
import { RiEditLine, RiLockPasswordLine, RiUserLine, RiHistoryLine, RiCheckLine, RiPlayMiniFill, RiPauseMiniFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = usePlayer();

  const [historySongs, setHistorySongs] = useState<Song[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Edit details form states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch profile listening history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const res = await api.get('/history');
        setHistorySongs(res.data.songs || []);
      } catch (e) {
        console.error('Failed to load history list', e);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();

    // Populate edit fields
    if (user) {
      setName(user.name);
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      // Create local preview URL
      setAvatarPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (password) {
        formData.append('password', password);
      }
      if (file) {
        formData.append('avatar', file);
      }

      await updateProfile(formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile details');
    } finally {
      setSaving(false);
    }
  };

  const handleSongPlay = (song: Song) => {
    if (currentSong?._id === song._id) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      playSong(song, historySongs);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!user) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
        <RiUserLine className="w-16 h-16 text-zinc-650" />
        <div>
          <h3 className="text-lg font-bold text-zinc-400">View your Profile</h3>
          <p className="text-sm text-zinc-500 mt-1">Log in to edit your profile and see listening stats.</p>
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 pb-24 text-left space-y-8"
    >
      <div className="flex items-center gap-2">
        <RiUserLine className="w-6 h-6 text-spotify-green" />
        <h1 className="text-2xl font-black text-white">Your Profile</h1>
      </div>

      {message && (
        <p className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-3 rounded-lg flex items-center gap-2 max-w-lg">
          <RiCheckLine className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </p>
      )}

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg max-w-lg">
          {error}
        </p>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Details and Form Card */}
        <div className="w-full lg:max-w-md bg-spotify-card border border-zinc-800 rounded-xl p-6 shadow-xl flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-spotify-green/5 rounded-full blur-2xl pointer-events-none" />

          {/* Form Toggle button */}
          {!isEditing ? (
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative group">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  className="w-24 h-24 rounded-full object-cover border border-zinc-850 shadow-md"
                  alt=""
                />
              </div>

              <div className="flex flex-col leading-snug">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-center">
                  <span>{user.name}</span>
                  <span className="text-[10px] bg-spotify-green/20 text-spotify-green font-extrabold uppercase px-2 py-0.5 rounded">
                    {user.role}
                  </span>
                </h2>
                <span className="text-sm text-spotify-lightGray">{user.email}</span>
                <span className="text-xs text-zinc-550 mt-2">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-5 rounded-full text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition-all mt-2 cursor-pointer"
              >
                <RiEditLine className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h3 className="text-base font-bold text-white border-b border-zinc-850 pb-2 flex items-center gap-2">
                <RiEditLine className="w-4 h-4 text-spotify-green" />
                <span>Edit Profile Details</span>
              </h3>

              {/* Avatar Uploader preview */}
              <div className="flex flex-col items-center gap-2">
                <img
                  src={avatarPreview || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                  className="w-20 h-20 rounded-full object-cover border border-zinc-800"
                  alt=""
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-spotify-lightGray file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-zinc-200 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-zinc-300">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-zinc-300">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-zinc-300">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#121212] border border-zinc-750 focus:border-spotify-green text-white text-xs rounded-lg p-2.5 outline-none transition-colors"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-850 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name);
                    setAvatarPreview(user.avatar);
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="bg-transparent border border-zinc-700 hover:border-white text-white text-xs font-bold py-2 px-5 rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-white text-black hover:scale-105 active:scale-95 text-xs font-bold py-2 px-5 rounded-full transition-all cursor-pointer disabled:bg-zinc-600"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Listening History (Right Panel) */}
        <div className="flex-1 bg-spotify-card border border-zinc-800 rounded-xl p-6 shadow-xl w-full flex flex-col gap-4">
          <h3 className="text-base font-bold text-white border-b border-zinc-850 pb-2.5 flex items-center gap-2">
            <RiHistoryLine className="w-5 h-5 text-spotify-green" />
            <span>Listening History</span>
          </h3>

          {loadingHistory ? (
            <SkeletonLoader type="track" count={3} />
          ) : historySongs.length === 0 ? (
            <p className="text-xs text-zinc-500 py-10 text-center italic">
              No recent plays recorded. Select and listen to tracks to populate this section.
            </p>
          ) : (
            <div className="flex flex-col border border-zinc-850 rounded-lg overflow-hidden bg-zinc-900/10">
              {historySongs.slice(0, 10).map((song, idx) => {
                const isCurrent = currentSong?._id === song._id;
                return (
                  <div
                    key={`${song._id}-${idx}`}
                    onClick={() => handleSongPlay(song)}
                    className="flex items-center justify-between p-3 border-b border-zinc-850/60 hover:bg-zinc-800/40 group cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden flex-1 text-left">
                      <div className="w-5 text-center text-xs text-spotify-lightGray font-semibold select-none">
                        <span className="group-hover:hidden">{idx + 1}</span>
                        <button className="hidden group-hover:block text-white">
                          {isCurrent && isPlaying ? (
                            <RiPauseMiniFill className="w-4 h-4 text-spotify-green" />
                          ) : (
                            <RiPlayMiniFill className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <img src={song.coverImage} className="w-9 h-9 rounded object-cover" alt="" />
                      <div className="flex flex-col overflow-hidden leading-tight">
                        <span className={`text-xs font-semibold truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
                          {song.title}
                        </span>
                        <span className="text-[10px] text-spotify-lightGray truncate">{song.artist?.name}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-spotify-lightGray pr-2">
                      {formatDuration(song.duration)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
