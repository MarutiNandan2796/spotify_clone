import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import type { Song, Artist, Album, Playlist } from '../types';
import SongCard from '../components/SongCard';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import PlaylistCard from '../components/PlaylistCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { RiMusic2Line } from 'react-icons/ri';
import { motion } from 'framer-motion';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const debouncedQuery = useDebounce(rawQuery, 300);

  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'artists' | 'albums' | 'playlists'>('all');
  const [loading, setLoading] = useState(false);

  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spotify_recent_searches');
      return saved ? JSON.parse(saved) : ['Rock', 'Pop Essentials', 'Midnight Chill', 'Summer Hits'];
    } catch {
      return ['Rock', 'Pop Essentials', 'Midnight Chill', 'Summer Hits'];
    }
  });

  const saveSearchTerm = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, 8);
      localStorage.setItem('spotify_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const removeRecentSearch = (term: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== term);
      localStorage.setItem('spotify_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('spotify_recent_searches');
  };

  useEffect(() => {
    const executeSearch = async () => {
      if (!debouncedQuery.trim()) {
        setSongs([]);
        setArtists([]);
        setAlbums([]);
        setPlaylists([]);
        return;
      }

      saveSearchTerm(debouncedQuery.trim());
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(debouncedQuery)}`);
        setSongs(res.data.songs || []);
        setArtists(res.data.artists || []);
        setAlbums(res.data.albums || []);
        setPlaylists(res.data.playlists || []);
      } catch (error) {
        console.error('Failed to run search query', error);
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [debouncedQuery]);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: 'Songs' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
    { id: 'playlists', label: 'Playlists' },
  ] as const;

  const genreCards = [
    { name: 'Pop', color: 'from-pink-500 to-rose-600' },
    { name: 'Hip-Hop', color: 'from-orange-500 to-amber-600' },
    { name: 'Rock', color: 'from-red-600 to-purple-700' },
    { name: 'Electronic', color: 'from-cyan-500 to-blue-600' },
    { name: 'Indie', color: 'from-emerald-500 to-teal-700' },
    { name: 'Chill', color: 'from-indigo-500 to-violet-700' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 pb-24 space-y-6 text-left"
    >
      {/* Search Header Info */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-white">Search</h1>
        <p className="text-xs text-spotify-lightGray">
          {rawQuery ? `Showing results for "${rawQuery}"` : 'Explore music, top searches, and genre categories.'}
        </p>
      </div>

      {/* Query Results tabs */}
      {debouncedQuery && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Empty State: Recent Searches & Browse Genres */}
      {!debouncedQuery && (
        <div className="space-y-8">
          {/* Recent Search Chips */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Searches</h3>
                <button
                  onClick={clearAllSearches}
                  className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition-all shadow-sm group"
                  >
                    <a href={`/search?q=${encodeURIComponent(term)}`} className="hover:underline">
                      {term}
                    </a>
                    <button
                      onClick={() => removeRecentSearch(term)}
                      className="text-zinc-400 hover:text-red-400 transition-colors"
                      title="Remove search"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Browse Genres */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Browse All Genres</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {genreCards.map((genre) => (
                <a
                  key={genre.name}
                  href={`/search?q=${encodeURIComponent(genre.name)}`}
                  className={`h-24 rounded-xl p-4 bg-gradient-to-br ${genre.color} flex items-end font-extrabold text-white text-base shadow-lg hover:scale-105 transition-all cursor-pointer overflow-hidden relative group`}
                >
                  <span className="relative z-10">{genre.name}</span>
                  <RiMusic2Line className="absolute -bottom-2 -right-2 w-16 h-16 opacity-20 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="space-y-6">
          <SkeletonLoader type="track" count={4} />
          <SkeletonLoader type="card" count={4} />
        </div>
      ) : (
        debouncedQuery && (
          <div className="space-y-8 mt-4">
            {/* SONGS VIEW */}
            {(activeTab === 'all' || activeTab === 'songs') && songs.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">Songs</h2>
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                  {songs.map((song) => (
                    <SongCard key={song._id} song={song} playlistContext={songs} />
                  ))}
                </div>
              </section>
            )}

            {/* ARTISTS VIEW */}
            {(activeTab === 'all' || activeTab === 'artists') && artists.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">Artists</h2>
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                  {artists.map((artist) => (
                    <ArtistCard key={artist._id} artist={artist} />
                  ))}
                </div>
              </section>
            )}

            {/* ALBUMS VIEW */}
            {(activeTab === 'all' || activeTab === 'albums') && albums.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">Albums</h2>
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                  {albums.map((album) => (
                    <AlbumCard key={album._id} album={album} />
                  ))}
                </div>
              </section>
            )}

            {/* PLAYLISTS VIEW */}
            {(activeTab === 'all' || activeTab === 'playlists') && playlists.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">Playlists</h2>
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                  {playlists.map((playlist) => (
                    <PlaylistCard key={playlist._id} playlist={playlist} />
                  ))}
                </div>
              </section>
            )}

            {/* Zero Results Check */}
            {songs.length === 0 && artists.length === 0 && albums.length === 0 && playlists.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
                <h3 className="text-lg font-bold text-zinc-400">No results found for "{debouncedQuery}"</h3>
                <p className="text-sm text-zinc-500">Please make sure words are spelled correctly or try fewer keywords.</p>
              </div>
            )}
          </div>
        )
      )}
    </motion.div>
  );
};

export default Search;
