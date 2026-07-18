import React from 'react';
import { Moon, X, Clock, Check } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const TIMER_OPTIONS = [
  { label: '5 Minutes', minutes: 5 },
  { label: '15 Minutes', minutes: 15 },
  { label: '30 Minutes', minutes: 30 },
  { label: '45 Minutes', minutes: 45 },
  { label: '1 Hour', minutes: 60 },
];

export const SleepTimerModal: React.FC = () => {
  const { showSleepModal, toggleSleepModal, sleepTimerTimeLeft, setSleepTimer } = usePlayer();

  if (!showSleepModal) return null;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Sleep Timer</h2>
              <p className="text-xs text-zinc-400">Stop playback automatically</p>
            </div>
          </div>
          <button
            onClick={toggleSleepModal}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Countdown Indicator */}
        {sleepTimerTimeLeft !== null && (
          <div className="my-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Audio stops in:</span>
            </div>
            <span className="font-mono font-bold text-sm text-purple-300">
              {formatTimer(sleepTimerTimeLeft)}
            </span>
          </div>
        )}

        {/* Timer Preset Options */}
        <div className="space-y-2 my-4">
          {TIMER_OPTIONS.map((opt) => {
            return (
              <button
                key={opt.minutes}
                onClick={() => {
                  setSleepTimer(opt.minutes);
                  toggleSleepModal();
                }}
                className="w-full p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 text-left text-xs font-medium text-zinc-200 hover:text-white flex items-center justify-between transition-all"
              >
                <span>{opt.label}</span>
                {sleepTimerTimeLeft !== null && Math.round(sleepTimerTimeLeft / 60) === opt.minutes && (
                  <Check className="w-4 h-4 text-purple-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Turn Off Button */}
        {sleepTimerTimeLeft !== null && (
          <button
            onClick={() => {
              setSleepTimer(null);
              toggleSleepModal();
            }}
            className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-all mt-2"
          >
            Turn Off Timer
          </button>
        )}
      </div>
    </div>
  );
};
