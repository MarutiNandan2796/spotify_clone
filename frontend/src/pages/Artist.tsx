import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import type { Artist as ArtistType, Song, Album } from '../types';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { usePlayer } from '../context/PlayerContext';
import { RiPlayMiniFill, RiPauseMiniFill, RiTimeLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

const Artist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = usePlayer();

  const [artist, setArtist] = useState<ArtistType | null>(null);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [similarArtists, setSimilarArtists] = useState<ArtistType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/artists/${id}`);
        setArtist(res.data.artist);
        setPopularSongs(res.data.popularSongs || []);
        setAlbums(res.data.albums || []);
        setSimilarArtists(res.data.similarArtists || []);
      } catch (error) {
        console.error('Failed to fetch artist details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetails();
  }, [id]);

  const handleTrackPlay = (song: Song) => {
    if (currentSong?._id === song._id) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      playSong(song, popularSongs);
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
          <SkeletonLoader type="track" count={5} />
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="p-20 text-center text-zinc-500 font-medium">
        Artist details could not be found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24 text-left"
    >
      {/* Banner */}
      <div
        className="w-full h-80 relative flex items-end p-8 bg-cover bg-center select-none"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(${artist.coverBanner})` }}
      >
        <div className="flex flex-col gap-2 z-10">
          <span className="text-xs font-bold text-spotify-green tracking-widest uppercase">Verified Artist</span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-2">{artist.name}</h1>
          <span className="text-sm font-semibold text-zinc-300">
            {artist.monthlyListeners?.toLocaleString()} monthly listeners
          </span>
        </div>
      </div>

      <div className="p-6 space-y-8 relative">
        {/* Biography Row */}
        <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 md:p-6 shadow-inner">
          <h3 className="text-lg font-bold text-white mb-2">Biography</h3>
          <p className="text-sm text-spotify-lightGray leading-relaxed max-w-4xl">{artist.bio}</p>
        </section>

        {/* Popular Songs Tracklist */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Popular Songs</h2>
          <div className="flex flex-col border border-zinc-800/60 rounded-md overflow-hidden bg-zinc-900/10">
            {popularSongs.length === 0 ? (
              <p className="text-sm text-zinc-500 italic p-6">No songs uploaded by this artist.</p>
            ) : (
              popularSongs.map((song, index) => {
                const isCurrent = currentSong?._id === song._id;
                return (
                  <div
                    key={song._id}
                    onClick={() => handleTrackPlay(song)}
                    className={`flex items-center justify-between px-4 py-3 border-b border-zinc-900 hover:bg-zinc-900/60 group cursor-pointer transition-colors ${
                      isCurrent ? 'bg-zinc-900/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 overflow-hidden">
                      {/* Play count index or play button indicator */}
                      <div className="w-6 text-center text-sm text-spotify-lightGray font-semibold shrink-0">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <button className="hidden group-hover:block text-white hover:scale-110 active:scale-90 transition-transform">
                          {isCurrent && isPlaying ? (
                            <RiPauseMiniFill className="w-5 h-5 text-spotify-green" />
                          ) : (
                            <RiPlayMiniFill className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Song Image & title */}
                      <img src={song.coverImage} className="w-10 h-10 rounded object-cover shrink-0" alt="" />
                      <div className="flex flex-col overflow-hidden leading-tight text-left">
                        <span className={`text-sm font-semibold truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
                          {song.title}
                        </span>
                        <span className="text-xs text-spotify-lightGray truncate">
                          {song.genre || 'Pop'}
                        </span>
                      </div>
                    </div>

                    {/* Plays count display */}
                    <div className="hidden sm:block text-xs text-spotify-lightGray w-24 text-right">
                      {song.plays?.toLocaleString()} plays
                    </div>

                    {/* Song Duration */}
                    <div className="text-xs text-spotify-lightGray w-16 text-right font-medium pr-2">
                      {formatDuration(song.duration)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Albums Row */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Albums</h2>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {albums.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No albums found for this artist.</p>
            ) : (
              albums.map((album) => <AlbumCard key={album._id} album={album} />)
            )}
          </div>
        </section>

        {/* Similar Artists Row */}
        {similarArtists.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Similar Artists</h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {similarArtists.map((artistItem) => (
                <ArtistCard key={artistItem._id} artist={artistItem} />
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};

export default Artist;
