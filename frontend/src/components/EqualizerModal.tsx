import React from 'react';
import { Sliders, X, Volume2, Sparkles, Check } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const PRESETS = [
  { id: 'flat', name: 'Flat', values: [0, 0, 0, 0, 0] },
  { id: 'bass-boost', name: 'Bass Boost', values: [6, 4, 1, 0, 0] },
  { id: 'vocal-boost', name: 'Vocal Boost', values: [-2, 0, 5, 3, 0] },
  { id: 'treble-boost', name: 'Treble Boost', values: [0, 0, 1, 4, 6] },
  { id: 'acoustic', name: 'Acoustic', values: [3, 2, 1, 2, 4] },
  { id: 'electronic', name: 'Electronic', values: [5, 3, 0, 2, 5] },
];

const BANDS = ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'];

/**
 * EqualizerModal Component
 * Renders an overlay modal displaying equalizer bands and predefined presets (Flat, Bass Boost, Vocal Boost, Acoustic, etc.).
 * Includes a simulated realtime audio frequency visualizer spectrum.
 *
 * @returns {React.ReactElement | null} The rendered EqualizerModal component, or null if hidden.
 */
export const EqualizerModal: React.FC = () => {
  const { showEqualizer, toggleEqualizer, equalizerPreset, setEqualizerPreset, isPlaying } = usePlayer();

  if (!showEqualizer) return null;

  const currentPreset = PRESETS.find((p) => p.id === equalizerPreset) || PRESETS[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Audio Equalizer</h2>
              <p className="text-xs text-zinc-400">Customize frequency balance & acoustic soundstage</p>
            </div>
          </div>
          <button
            onClick={toggleEqualizer}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Frequency Visualizer Spectrum */}
        <div className="my-6 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/60 flex items-end justify-between gap-1.5 h-28 overflow-hidden relative">
          <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
            <Volume2 className="w-3 h-3 text-green-400 animate-pulse" />
            <span>REALTIME AUDIO SPECTRUM</span>
          </div>

          {[...Array(24)].map((_, i) => {
            const presetBoost = currentPreset.values[i % 5] || 0;
            const baseHeight = 35 + presetBoost * 6;
            const animDuration = 0.6 + (i % 4) * 0.2;
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-green-500/30 via-green-400 to-emerald-300 rounded-t transition-all duration-300"
                style={{
                  height: isPlaying ? `${Math.min(95, Math.max(15, baseHeight + Math.random() * 20))}%` : `${Math.max(10, baseHeight)}%`,
                  opacity: isPlaying ? 0.9 : 0.4,
                  animationDuration: `${animDuration}s`,
                }}
              />
            );
          })}
        </div>

        {/* Presets List */}
        <div className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-green-400" />
            Sound Presets
          </label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {PRESETS.map((preset) => {
              const active = preset.id === equalizerPreset;
              return (
                <button
                  key={preset.id}
                  onClick={() => setEqualizerPreset(preset.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between ${
                    active
                      ? 'bg-green-500/15 border-green-500/50 text-green-400 shadow-sm'
                      : 'bg-zinc-800/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <span>{preset.name}</span>
                  {active && <Check className="w-3.5 h-3.5 text-green-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Frequency Sliders */}
        <div className="grid grid-cols-5 gap-3 pt-2 border-t border-zinc-800/60 text-center">
          {BANDS.map((band, idx) => {
            const dbVal = currentPreset.values[idx];
            return (
              <div key={band} className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-400">{dbVal > 0 ? `+${dbVal}` : dbVal}dB</span>
                <div className="h-24 flex items-center justify-center">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    value={dbVal}
                    readOnly
                    className="h-20 w-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-green-400 [writing-mode:vertical-lr] [direction:rtl]"
                  />
                </div>
                <span className="text-[10px] font-medium text-zinc-500">{band}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
