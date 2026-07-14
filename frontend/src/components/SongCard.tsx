import React from 'react';
import type { Song } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { RiPlayFill, RiPauseFill } from 'react-icons/ri';

interface SongCardProps {
  song: Song;
  playlistContext?: Song[];
}

const SongCard: React.FC<SongCardProps> = ({ song, playlistContext = [] }) => {
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = usePlayer();

  const isCurrent = currentSong?._id === song._id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCurrent) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      const playList = playlistContext.length > 0 ? playlistContext : [song];
      playSong(song, playList);
    }
  };

  return (
    <div className="glass-card rounded-md p-4 relative group cursor-pointer w-[180px] shrink-0">
      {/* Cover Image Container */}
      <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-lg border border-zinc-800">
        <img
          src={song.coverImage}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Play/Pause Button */}
        <button
          onClick={handlePlayClick}
          className="absolute bottom-2 right-2 w-11 h-11 bg-spotify-green hover:bg-spotify-hoverGreen text-black rounded-full flex items-center justify-center shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 active:scale-95 text-glow hover:scale-105"
        >
          {isCurrent && isPlaying ? (
            <RiPauseFill className="w-6 h-6" />
          ) : (
            <RiPlayFill className="w-6 h-6 ml-0.5" />
          )}
        </button>
      </div>

      {/* Metadata */}
      <div className="flex flex-col text-left">
        <span
          className={`font-bold text-sm truncate mb-1 leading-tight ${
            isCurrent ? 'text-spotify-green' : 'text-white'
          }`}
          title={song.title}
        >
          {song.title}
        </span>
        <span className="text-xs text-spotify-lightGray truncate hover:underline hover:text-white transition-colors">
          {song.artist?.name || 'Unknown Artist'}
        </span>
      </div>
    </div>
  );
};

export default SongCard;
