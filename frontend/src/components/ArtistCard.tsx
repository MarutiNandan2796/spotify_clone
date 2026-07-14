import React from 'react';
import { Link } from 'react-router-dom';
import type { Artist } from '../types';
import { RiPlayFill } from 'react-icons/ri';

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  return (
    <Link
      to={`/artist/${artist._id}`}
      className="glass-card rounded-md p-4 relative group cursor-pointer w-[180px] shrink-0 block"
    >
      {/* Circle Image Container */}
      <div className="relative aspect-square w-full mb-4 rounded-full overflow-hidden shadow-lg border border-zinc-800/80">
        <img
          src={artist.avatar}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Play Icon indicator */}
        <div className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-green hover:bg-spotify-hoverGreen text-black rounded-full flex items-center justify-center shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 active:scale-95 hover:scale-105">
          <RiPlayFill className="w-5 h-5 ml-0.5" />
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-col text-center">
        <span className="font-bold text-sm truncate text-white mb-0.5 leading-tight hover:underline">
          {artist.name}
        </span>
        <span className="text-[11px] text-spotify-lightGray">
          Artist
        </span>
      </div>
    </Link>
  );
};

export default ArtistCard;
