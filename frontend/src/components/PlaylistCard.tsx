import React from 'react';
import { Link } from 'react-router-dom';
import type { Playlist } from '../types';
import { RiPlayFill } from 'react-icons/ri';

/**
 * @interface PlaylistCardProps
 * @property {Playlist} playlist - The playlist object containing details like ID, name, creator, and cover image.
 */
interface PlaylistCardProps {
  playlist: Playlist;
}

/**
 * PlaylistCard Component
 * Displays a playlist's cover art, name, and creator, linking to the playlist details view.
 * Shows a hover play button overlay.
 *
 * @param {PlaylistCardProps} props - Component properties.
 * @returns {React.ReactElement} The rendered PlaylistCard component.
 */
const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <Link
      to={`/playlist/${playlist._id}`}
      className="glass-card rounded-md p-4 relative group cursor-pointer w-[180px] shrink-0 block"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-lg border border-zinc-800">
        <img
          src={playlist.coverImage}
          alt={playlist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Play Overlay */}
        <div className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-green hover:bg-spotify-hoverGreen text-black rounded-full flex items-center justify-center shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 active:scale-95 hover:scale-105">
          <RiPlayFill className="w-5 h-5 ml-0.5" />
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-col text-left">
        <span className="font-bold text-sm truncate text-white mb-1 leading-tight hover:underline">
          {playlist.name}
        </span>
        <span className="text-[11px] text-spotify-lightGray truncate">
          By {playlist.creator?.name || 'Spotify User'}
        </span>
      </div>
    </Link>
  );
};

export default PlaylistCard;
