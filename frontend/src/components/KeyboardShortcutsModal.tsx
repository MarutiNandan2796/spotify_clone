import React from 'react';
import { X, Keyboard, Play, Volume2, SkipForward, SkipBack, Shuffle, Repeat, Sliders, Clock, Heart, ListMusic } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  icon: React.ReactNode;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts: ShortcutItem[] = [
    { keys: ['Space'], description: 'Play / Pause', icon: <Play className="w-3.5 h-3.5" /> },
    { keys: ['M'], description: 'Mute / Unmute Volume', icon: <Volume2 className="w-3.5 h-3.5" /> },
    { keys: ['←'], description: 'Rewind 5 Seconds', icon: <SkipBack className="w-3.5 h-3.5" /> },
    { keys: ['→'], description: 'Fast-Forward 5 Seconds', icon: <SkipForward className="w-3.5 h-3.5" /> },
    { keys: ['N'], description: 'Next Track', icon: <SkipForward className="w-3.5 h-3.5" /> },
    { keys: ['P'], description: 'Previous Track', icon: <SkipBack className="w-3.5 h-3.5" /> },
    { keys: ['S'], description: 'Toggle Shuffle Mode', icon: <Shuffle className="w-3.5 h-3.5" /> },
    { keys: ['R'], description: 'Toggle Repeat Mode', icon: <Repeat className="w-3.5 h-3.5" /> },
    { keys: ['L'], description: 'Toggle Like current track', icon: <Heart className="w-3.5 h-3.5" /> },
    { keys: ['Q'], description: 'Toggle Play Queue Drawer', icon: <ListMusic className="w-3.5 h-3.5" /> },
    { keys: ['E'], description: 'Toggle 5-Band Equalizer', icon: <Sliders className="w-3.5 h-3.5" /> },
    { keys: ['T'], description: 'Toggle Sleep Timer Modal', icon: <Clock className="w-3.5 h-3.5" /> },
    { keys: ['?'], description: 'Show Keyboard Shortcuts', icon: <Keyboard className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 shadow-2xl relative text-white max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Keyboard Shortcuts</h2>
              <p className="text-xs text-zinc-400">Navigate Aura Wave instantly using your keyboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/30 border border-zinc-800/60 hover:bg-zinc-800/60 transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-zinc-400 shrink-0">{shortcut.icon}</span>
                  <span className="text-xs font-medium text-zinc-200 truncate">{shortcut.description}</span>
                </div>
                <div className="flex gap-1 shrink-0 ml-2">
                  {shortcut.keys.map((k, ki) => (
                    <kbd
                      key={ki}
                      className="px-2 py-1 rounded bg-zinc-950/80 border border-zinc-700/80 text-[10px] font-bold font-mono text-violet-400 shadow-[0_2px_0_rgba(0,0,0,0.5)] leading-none"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note footer */}
        <div className="pt-3 border-t border-zinc-800/80 text-center shrink-0">
          <p className="text-[10px] text-zinc-500">
            Note: Shortcuts are ignored when typing in input boxes or searching.
          </p>
        </div>
      </div>
    </div>
  );
};
