import React from 'react';
import { X, Trash2, ArrowUp, ArrowDown, ListMusic, Play, Volume2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const { currentSong, queue, playSong, removeFromQueue, clearQueue, setQueueList, isPlaying } = usePlayer();

  if (!isOpen) return null;

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const newQueue = [...queue];
    const temp = newQueue[index];
    newQueue[index] = newQueue[index - 1];
    newQueue[index - 1] = temp;
    setQueueList(newQueue);
  };

  const moveDown = (index: number) => {
    if (index >= queue.length - 1) return;
    const newQueue = [...queue];
    const temp = newQueue[index];
    newQueue[index] = newQueue[index + 1];
    newQueue[index + 1] = temp;
    setQueueList(newQueue);
  };

  const upcomingQueue = queue.filter((s) => s._id !== currentSong?._id);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-950/95 border-l border-zinc-800 backdrop-blur-xl shadow-2xl flex flex-col text-white animate-slideLeft">
      {/* Header */}
      <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
            <ListMusic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Play Queue</h2>
            <p className="text-xs text-zinc-400">{queue.length} tracks in queue</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Now Playing Section */}
        {currentSong && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-400 mb-3 block">
              Now Playing
            </span>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-green-500/30 shadow-md relative group">
              <img
                src={currentSong.coverImage}
                alt={currentSong.title}
                className="w-12 h-12 rounded-lg object-cover border border-zinc-800"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold truncate text-white">{currentSong.title}</h4>
                <p className="text-xs text-zinc-400 truncate">{currentSong.artist?.name || 'Unknown Artist'}</p>
              </div>
              <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4 fill-current" />}
              </div>
            </div>
          </div>
        )}

        {/* Up Next Section */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 block">
            Next Up ({upcomingQueue.length})
          </span>

          {upcomingQueue.length === 0 ? (
            <div className="py-10 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              <p className="text-xs">No upcoming tracks in queue.</p>
              <p className="text-[11px] text-zinc-600 mt-1">Add tracks from albums or playlists!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {queue.map((song, idx) => {
                if (song._id === currentSong?._id) return null;
                return (
                  <div
                    key={`${song._id}-${idx}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800/50 transition-all group"
                  >
                    <img
                      src={song.coverImage}
                      alt={song.title}
                      className="w-10 h-10 rounded-lg object-cover border border-zinc-800/80"
                    />
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => playSong(song, queue)}>
                      <h5 className="text-xs font-semibold truncate text-zinc-200 group-hover:text-white">
                        {song.title}
                      </h5>
                      <p className="text-[11px] text-zinc-400 truncate">{song.artist?.name}</p>
                    </div>

                    {/* Reorder & Remove Actions */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveDown(idx)}
                        disabled={idx === queue.length - 1}
                        className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeFromQueue(song._id)}
                        className="p-1.5 rounded text-red-400 hover:bg-red-500/20 cursor-pointer ml-1"
                        title="Remove from Queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
