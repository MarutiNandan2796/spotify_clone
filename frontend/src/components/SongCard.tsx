import React from 'react';
import type { Song } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { ShareModal } from './ShareModal';
import { Share2 } from 'lucide-react';
import { RiPlayFill, RiPauseFill } from 'react-icons/ri';

/**
 * @interface SongCardProps
 * @property {Song} song - The song data object to display.
 * @property {Song[]} [playlistContext] - The list of songs providing playback context (e.g. current playlist/album).
 */
interface SongCardProps {
  song: Song;
  playlistContext?: Song[];
}

/**
 * SongCard Component
 * Displays song cover image, title, artist, and handles playback controls (play, pause, resume)
 * and triggering the sharing modal.
 *
 * @param {SongCardProps} props - Component properties.
 * @returns {React.ReactElement} The rendered SongCard component.
 */
const SongCard: React.FC<SongCardProps> = ({ song, playlistContext = [] }) => {
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = usePlayer();
  const [showShare, setShowShare] = React.useState(false);

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

        {/* Floating Share Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowShare(true);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border border-white/10 cursor-pointer"
          title="Share track"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

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

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        title={song.title}
        subtitle={song.artist?.name}
        coverImage={song.coverImage}
        type="track"
      />
    </div>
  );
};

export default SongCard;
