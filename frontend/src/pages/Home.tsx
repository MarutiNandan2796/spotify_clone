import React, { useEffect, useState } from 'react';
import api from '../services/api';
import type { Song, Artist, Album, Playlist } from '../types';
import SongCard from '../components/SongCard';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import PlaylistCard from '../components/PlaylistCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { user } = useAuth();
  
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [recentPlays, setRecentPlays] = useState<Song[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [
          trendingRes,
          featuredRes,
          artistsRes,
          albumsRes,
          playlistsRes,
        ] = await Promise.all([
          api.get('/songs/trending'),
          api.get('/songs/featured'),
          api.get('/artists'),
          api.get('/albums'),
          api.get('/playlists'),
        ]);

        setTrendingSongs(trendingRes.data.songs || []);
        setFeaturedSongs(featuredRes.data.songs || []);
        setArtists(artistsRes.data.artists || []);
        setAlbums(albumsRes.data.albums || []);
        setPlaylists(playlistsRes.data.playlists || []);

        // Load recent play history if user logged in
        if (localStorage.getItem('token')) {
          try {
            const historyRes = await api.get('/history');
            setRecentPlays(historyRes.data.songs || []);
          } catch (e) {
            console.error('Failed to load play history', e);
          }
        }
      } catch (error) {
        console.error('Failed to fetch home page data', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="h-8 bg-zinc-800 rounded w-1/4 animate-pulse mb-6" />
        <div className="space-y-4">
          <div className="h-5 bg-zinc-800 rounded w-1/6 animate-pulse" />
          <SkeletonLoader type="card" count={5} />
        </div>
        <div className="space-y-4">
          <div className="h-5 bg-zinc-800 rounded w-1/6 animate-pulse" />
          <SkeletonLoader type="card" count={5} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 pb-24 space-y-8 text-left"
    >
      {/* Dynamic Greetings header */}
      <h1 className="text-3xl font-black tracking-tight text-white mb-6">
        {getGreeting()}
        {user ? `, ${user.name}` : ''}
      </h1>

      {/* RECENTLY PLAYED (Shown only if logged in and history exists) */}
      {recentPlays.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold hover:underline cursor-pointer inline-block">Recently Played</h2>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {recentPlays.map((song, i) => (
              <SongCard key={`recent-${song._id}-${i}`} song={song} playlistContext={recentPlays} />
            ))}
          </div>
        </section>
      )}

      {/* TRENDING SONGS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold hover:underline cursor-pointer inline-block">Trending Now</h2>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {trendingSongs.length === 0 ? (
            <p className="text-sm text-zinc-500 italic">No trending songs found. Check back later!</p>
          ) : (
            trendingSongs.map((song) => (
              <SongCard key={song._id} song={song} playlistContext={trendingSongs} />
            ))
          )}
        </div>
      </section>

      {/* MADE FOR YOU / FEATURED */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold hover:underline cursor-pointer inline-block">Made For You</h2>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {featuredSongs.length === 0 ? (
            <p className="text-sm text-zinc-500 italic">No featured recommendations available.</p>
          ) : (
            featuredSongs.map((song) => (
              <SongCard key={song._id} song={song} playlistContext={featuredSongs} />
            ))
          )}
        </div>
      </section>

      {/* POPULAR ALBUMS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold hover:underline cursor-pointer inline-block">Popular Albums</h2>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {albums.length === 0 ? (
            <p className="text-sm text-zinc-500 italic">No albums available.</p>
          ) : (
            albums.map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))
          )}
        </div>
      </section>

      {/* POPULAR ARTISTS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold hover:underline cursor-pointer inline-block">Popular Artists</h2>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {artists.length === 0 ? (
            <p className="text-sm text-zinc-500 italic">No artists available.</p>
          ) : (
            artists.map((artist) => (
              <ArtistCard key={artist._id} artist={artist} />
            ))
          )}
        </div>
      </section>

      {/* PUBLIC PLAYLISTS */}
      {playlists.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold hover:underline cursor-pointer inline-block">Featured Playlists</h2>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default Home;
