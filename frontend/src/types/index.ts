/**
 * Represents a registered user in the application.
 */
export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  playlists: string[];
  createdAt: string;
}

/**
 * Represents a music artist profile.
 */
export interface Artist {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
  monthlyListeners: number;
  coverBanner: string;
  createdAt: string;
}

/**
 * Represents a music album containing multiple songs.
 */
export interface Album {
  _id: string;
  title: string;
  artist: Artist | string;
  coverImage: string;
  releaseDate: string;
  genre: string;
  songs: Song[] | string[];
  createdAt: string;
}

/**
 * Represents a playable song track.
 */
export interface Song {
  _id: string;
  title: string;
  artist: Artist;
  album?: Album;
  audioUrl: string;
  coverImage: string;
  duration: number;
  genre: string;
  plays: number;
  isFeatured: boolean;
  createdAt: string;
}

/**
 * Represents a playlist created by a user containing custom songs.
 */
export interface Playlist {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  creator: {
    _id: string;
    name: string;
  };
  songs: Song[];
  isPublic: boolean;
  createdAt: string;
}

/**
 * Represents a single line of lyrics with timestamp offset in seconds.
 */
export interface LyricLine {
  time: number;
  text: string;
}

