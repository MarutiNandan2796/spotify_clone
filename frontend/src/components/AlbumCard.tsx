import React from 'react';
import { Link } from 'react-router-dom';
import type { Album } from '../types';
import { RiPlayFill } from 'react-icons/ri';

/**
 * @interface AlbumCardProps
 * @property {Album} album - The album object containing details like ID, title, artist reference, and cover image.
 */
interface AlbumCardProps {
  album: Album;
}

/**
 * AlbumCard Component
 * Displays an album's cover image, title, release date, and artist, linking to the album details view.
 * Shows a hover play button overlay.
 *
 * @param {AlbumCardProps} props - Component properties.
 * @returns {React.ReactElement} The rendered AlbumCard component.
 */
const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const artistName = typeof album.artist === 'object' ? album.artist.name : 'Various Artists';

  return (
    <Link
      to={`/album/${album._id}`}
      className="glass-card rounded-md p-4 relative group cursor-pointer w-[180px] shrink-0 block"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-lg border border-zinc-800">
        <img
          src={album.coverImage}
          alt={album.title}
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
          {album.title}
        </span>
        <span className="text-[11px] text-spotify-lightGray truncate">
          {album.releaseDate} • {artistName}
        </span>
      </div>
    </Link>
  );
};

export default AlbumCard;
