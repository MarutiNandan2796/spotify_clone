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

export interface Artist {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
  monthlyListeners: number;
  coverBanner: string;
  createdAt: string;
}

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

export interface LyricLine {
  time: number;
  text: string;
}

