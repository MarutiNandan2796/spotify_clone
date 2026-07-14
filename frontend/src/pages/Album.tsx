import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { Album as AlbumType, Song } from '../types';
import SkeletonLoader from '../components/SkeletonLoader';
import { usePlayer } from '../context/PlayerContext';
import { RiPlayFill, RiPauseFill, RiPlayMiniFill, RiPauseMiniFill } from 'react-icons/ri';
import { motion } from 'framer-motion';

const Album: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = usePlayer();

  const [album, setAlbum] = useState<AlbumType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/albums/${id}`);
        setAlbum(res.data.album);
      } catch (error) {
        console.error('Failed to fetch album details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [id]);

  const handleSongPlay = (song: Song) => {
    if (!album) return;
    if (currentSong?._id === song._id) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      playSong(song, album.songs as Song[]);
    }
  };

  const handlePlayAlbum = () => {
    if (!album || !album.songs || album.songs.length === 0) return;
    const tracks = album.songs as Song[];
    // Find current active track or start from first track
    const firstSong = tracks[0];
    playSong(firstSong, tracks);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Sum up all track durations
  const getTotalDuration = (songsList: Song[]) => {
    const totalSecs = songsList.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    if (h > 0) {
      return `${h} hr ${m} min`;
    }
    return `${m} min`;
  };

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

  if (!album) {
    return (
      <div className="p-20 text-center text-zinc-500 font-medium">
        Album details could not be found.
      </div>
    );
  }

  const artistObj = typeof album.artist === 'object' ? album.artist : null;
  const songs = (album.songs as Song[]) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24 text-left album-gradient-bg"
    >
      {/* Header Info Banner */}
      <div className="flex flex-col md:flex-row items-end gap-6 p-8 pt-12 select-none">
        <img
          src={album.coverImage}
          alt={album.title}
          className="w-48 h-48 md:w-56 md:h-56 rounded-md shadow-2xl object-cover border border-zinc-800 shrink-0"
        />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase text-zinc-300">Album</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 leading-tight">
            {album.title}
          </h1>
          <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-zinc-300">
            {artistObj && (
              <>
                <Link to={`/artist/${artistObj._id}`} className="hover:underline text-white font-bold">
                  {artistObj.name}
                </Link>
                <span>•</span>
              </>
            )}
            <span>{album.releaseDate}</span>
            <span>•</span>
            <span>{songs.length} songs,</span>
            <span className="text-zinc-400 font-normal">{getTotalDuration(songs)}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Play Action button */}
        {songs.length > 0 && (
          <div className="flex items-center gap-6">
            <button
              onClick={handlePlayAlbum}
              className="w-14 h-14 bg-spotify-green hover:bg-spotify-hoverGreen text-black rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all text-glow cursor-pointer"
              title="Play Album"
            >
              {songs.some((s) => s._id === currentSong?._id) && isPlaying ? (
                <RiPauseFill className="w-8 h-8" />
              ) : (
                <RiPlayFill className="w-8 h-8 ml-1" />
              )}
            </button>
          </div>
        )}

        {/* Tracks Table */}
        <div className="flex flex-col mt-4">
          <div className="flex border-b border-zinc-800 text-xs font-bold text-spotify-lightGray uppercase py-2 px-4 select-none mb-2">
            <div className="w-10 text-center shrink-0">#</div>
            <div className="flex-1 text-left">Title</div>
            <div className="hidden sm:block w-32 text-right">Plays</div>
            <div className="w-16 text-right pr-2">Duration</div>
          </div>

          {songs.length === 0 ? (
            <p className="text-sm text-zinc-500 italic p-6">No songs in this album.</p>
          ) : (
            songs.map((song, index) => {
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
                    <span className="text-[11px] text-spotify-lightGray">
                      {artistObj?.name || 'Unknown Artist'}
                    </span>
                  </div>

                  <div className="hidden sm:block w-32 text-right text-xs text-spotify-lightGray select-none">
                    {song.plays?.toLocaleString()}
                  </div>

                  <div className="w-16 text-right text-xs font-medium text-spotify-lightGray pr-2 select-none">
                    {formatDuration(song.duration)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Album;
