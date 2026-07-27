import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import type { Song } from '../types';
import { 
  MdCloudUpload, 
  MdDeleteForever, 
  MdMusicNote
} from 'react-icons/md';
import { 
  RiCheckLine, 
  RiPlayMiniFill, 
  RiPauseMiniFill, 
  RiFolderMusicLine,
  RiLoader4Line
} from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Upload Page Component
 * Allows users to upload their custom audio tracks (.mp3) and cover artwork.
 * Displays a list of user-uploaded tracks with custom playback controls and deletion capabilities.
 */
const Upload: React.FC = () => {
  const { user } = useAuth();
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = usePlayer();

  // Uploaded songs list state
  const [mySongs, setMySongs] = useState<Song[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');

  // Submission states
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch all songs and filter those uploaded by the current user
  const fetchMySongs = async () => {
    if (!user) return;
    setLoadingSongs(true);
    try {
      const res = await api.get('/songs');
      const allSongs: Song[] = res.data.songs || [];
      const userSongs = allSongs.filter(
        (s) => s.uploadedBy === user._id || s.uploadedBy === user.id
      );
      setMySongs(userSongs);
    } catch (e) {
      console.error('Failed to load user uploaded songs', e);
    } finally {
      setLoadingSongs(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMySongs();
    }
  }, [user]);

  // Clean local cover image preview URL on unmount
  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  // File selectors handlers
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setCoverFile(selected);
      setCoverPreview(URL.createObjectURL(selected));
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setAudioFile(selected);
    }
  };

  // Helper function to extract audio duration using Web Audio APIs
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);
        resolve(audio.duration || 180); // Fallback to 3 minutes
      };
      audio.onerror = () => {
        resolve(180);
      };
    });
  };

  // Form Submit Handler
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!audioFile) {
      setErrorMsg('Please select an audio file (.mp3) to upload.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Get exact audio duration dynamically
      const duration = await getAudioDuration(audioFile);

      // 2. Build form data payload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('duration', String(Math.round(duration)));
      formData.append('genre', genre || 'Pop');
      formData.append('audio', audioFile);
      if (coverFile) {
        formData.append('coverImage', coverFile);
      }

      // 3. POST request to server
      const res = await api.post('/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMsg('Track uploaded and published successfully!');
      
      // Clear inputs
      setTitle('');
      setGenre('');
      setAudioFile(null);
      setCoverFile(null);
      setCoverPreview('');
      
      // Sync list
      if (res.data?.song) {
        setMySongs((prev) => [res.data.song, ...prev]);
      } else {
        fetchMySongs();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload song asset.');
    } finally {
      setSubmitting(false);
    }
  };

  // Song Delete Handler
  const handleDeleteSong = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return;
    try {
      await api.delete(`/songs/${id}`);
      setMySongs((prev) => prev.filter((s) => s._id !== id));
      setSuccessMsg('Song removed successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.message || 'Failed to delete song.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // Audio Playback trigger
  const handlePlaySong = (song: Song) => {
    if (currentSong?._id === song._id) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      playSong(song, mySongs);
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
        <RiFolderMusicLine className="w-16 h-16 text-zinc-650" />
        <div>
          <h3 className="text-lg font-bold text-zinc-450">Upload Your Music</h3>
          <p className="text-sm text-zinc-550 mt-1">Please log in to upload and manage your custom audio library.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 pb-24 text-left space-y-8"
    >
      {/* Header title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <MdCloudUpload className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Upload Center</h1>
          <p className="text-xs text-spotify-lightGray">Publish your custom audio tracks to the cloud library</p>
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence mode="wait">
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded-xl flex items-center gap-2 max-w-xl"
          >
            <RiCheckLine className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl max-w-xl"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Form (Left Column) */}
        <form 
          onSubmit={handleUploadSubmit} 
          className="lg:col-span-5 bg-spotify-card border border-zinc-800/80 rounded-2xl p-5 md:p-6 space-y-4 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl pointer-events-none" />

          <h3 className="font-bold text-white text-sm border-b border-zinc-850 pb-2.5 flex items-center gap-2">
            <MdMusicNote className="w-4 h-4 text-violet-400" />
            <span>Song Metadata</span>
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">Track Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Awesome Song"
              className="bg-[#121212] border border-zinc-755 focus:border-violet-500 text-white text-xs rounded-xl p-3 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-300">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g. Lofi, Electronic, Synthwave (defaults to Pop)"
              className="bg-[#121212] border border-zinc-755 focus:border-violet-500 text-white text-xs rounded-xl p-3 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <label className="text-xs font-bold text-zinc-300">Audio File (.mp3, .wav) *</label>
            <div className="relative border-2 border-dashed border-zinc-755 hover:border-violet-500 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-[#121212]/30 transition-colors">
              <input
                type="file"
                accept="audio/mp3, audio/mpeg, audio/wav"
                required
                onChange={handleAudioChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <RiFolderMusicLine className="w-6 h-6 text-zinc-550" />
              <span className="text-[11px] font-bold text-zinc-400 truncate max-w-xs">
                {audioFile ? audioFile.name : 'Select or drop MP3 file'}
              </span>
              <span className="text-[10px] text-zinc-600">Max size 20MB</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <label className="text-xs font-bold text-zinc-300">Cover Artwork (Optional)</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden relative">
                {coverPreview ? (
                  <img src={coverPreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <MdMusicNote className="w-6 h-6 text-zinc-700" />
                )}
              </div>
              <div className="relative flex-1 border border-zinc-755 hover:border-violet-500 rounded-xl p-3 flex flex-col items-center justify-center gap-0.5 cursor-pointer bg-[#121212]/30 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="text-[11px] font-bold text-zinc-400">
                  {coverFile ? coverFile.name : 'Select Image Artwork'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white font-extrabold py-3 rounded-full mt-4 hover:scale-[1.01] active:scale-95 transition-all text-xs cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-650 disabled:from-zinc-800 disabled:to-zinc-800 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <RiLoader4Line className="w-4 h-4 animate-spin" />
                <span>Uploading track...</span>
              </>
            ) : (
              <span>Publish Track</span>
            )}
          </button>
        </form>

        {/* Uploaded Songs List (Right Column) */}
        <div className="lg:col-span-7 bg-spotify-card border border-zinc-800/80 rounded-2xl p-5 md:p-6 space-y-4 shadow-2xl flex flex-col">
          <h3 className="font-bold text-white text-sm border-b border-zinc-850 pb-2.5 flex items-center gap-2">
            <RiFolderMusicLine className="w-4 h-4 text-violet-400" />
            <span>My Uploads ({mySongs.length})</span>
          </h3>

          <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 pr-1">
            {loadingSongs ? (
              <div className="flex items-center justify-center py-20 gap-2">
                <RiLoader4Line className="w-5 h-5 text-violet-400 animate-spin" />
                <span className="text-xs text-zinc-500 italic">Syncing custom library...</span>
              </div>
            ) : mySongs.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 flex flex-col items-center gap-2 select-none">
                <MdMusicNote className="w-12 h-12 text-zinc-800" />
                <p className="text-xs italic">You haven't uploaded any custom tracks yet.</p>
              </div>
            ) : (
              mySongs.map((song) => {
                const isCurrent = currentSong?._id === song._id;
                return (
                  <div 
                    key={song._id} 
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/30 border border-zinc-850/60 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden flex-1 text-left">
                      <div className="relative shrink-0 w-11 h-11 rounded-lg overflow-hidden border border-zinc-800">
                        <img 
                          src={song.coverImage || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop'} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          alt="" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handlePlaySong(song)}
                            className="p-1 bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-transform"
                          >
                            {isCurrent && isPlaying ? (
                              <RiPauseMiniFill className="w-4.5 h-4.5" />
                            ) : (
                              <RiPlayMiniFill className="w-4.5 h-4.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col overflow-hidden leading-tight">
                        <span className={`text-xs font-bold truncate ${isCurrent ? 'text-violet-400' : 'text-white'}`}>
                          {song.title}
                        </span>
                        <span className="text-[10px] text-spotify-lightGray truncate">
                          {song.genre || 'Pop'} • {formatDuration(song.duration)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-4">
                      {/* Delete Action */}
                      <button
                        onClick={() => handleDeleteSong(song._id)}
                        className="text-zinc-550 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete track"
                      >
                        <MdDeleteForever className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Upload;
