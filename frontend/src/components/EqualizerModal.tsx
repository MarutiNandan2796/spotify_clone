import React, { useEffect, useRef } from 'react';
import { Sliders, X, Volume2, Sparkles, Check } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const PRESETS = [
  { id: 'flat', name: 'Flat', values: [0, 0, 0, 0, 0] },
  { id: 'bass-boost', name: 'Bass Boost', values: [6, 4, 1, 0, 0] },
  { id: 'vocal-boost', name: 'Vocal Boost', values: [-2, 0, 5, 3, 0] },
  { id: 'treble-boost', name: 'Treble Boost', values: [0, 0, 1, 4, 6] },
  { id: 'acoustic', name: 'Acoustic', values: [3, 2, 1, 2, 4] },
  { id: 'electronic', name: 'Electronic', values: [5, 3, 0, 2, 5] },
  { id: 'custom', name: 'Custom', values: [0, 0, 0, 0, 0] },
];

const BANDS = ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'];

/**
 * EqualizerModal Component
 * Renders an overlay modal displaying equalizer bands and predefined presets.
 * Renders a real-time responsive Web Audio frequency visualizer on a canvas.
 *
 * @returns {React.ReactElement | null} The rendered EqualizerModal component, or null if hidden.
 */
export const EqualizerModal: React.FC = () => {
  const {
    showEqualizer,
    toggleEqualizer,
    equalizerPreset,
    setEqualizerPreset,
    isPlaying,
    analyserNode,
    equalizerGains,
    adjustEqualizerBand,
  } = usePlayer();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!showEqualizer || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    // Set frequency resolution to match analyser
    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animationId = requestAnimationFrame(renderFrame);

      const width = canvas.width;
      const height = canvas.height;

      // Dark theme background clear with path trails
      ctx.fillStyle = 'rgba(9, 9, 11, 0.3)';
      ctx.fillRect(0, 0, width, height);

      if (analyserNode && isPlaying) {
        analyserNode.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          // Emphasize the lower-mid frequencies for better visual balance
          const percent = dataArray[i] / 255;
          barHeight = percent * height * 0.85;

          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0.1)'); // low green
          gradient.addColorStop(0.6, 'rgba(34, 197, 94, 0.7)'); // green-500
          gradient.addColorStop(1, 'rgba(110, 231, 183, 1)'); // emerald-300

          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

          x += barWidth;
        }
      } else {
        // Visualizer idle animation (sinusoidal pulse)
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        const time = Date.now() * 0.003;
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.02 + time) * 4;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [showEqualizer, analyserNode, isPlaying]);

  if (!showEqualizer) return null;

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

        {/* Realtime Audio Spectrum Canvas */}
        <div className="my-6 rounded-xl bg-zinc-950/85 border border-zinc-800/60 flex items-end h-28 overflow-hidden relative">
          <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 z-10">
            <Volume2 className="w-3 h-3 text-green-400" />
            <span>REALTIME AUDIO SPECTRUM</span>
          </div>
          <canvas
            ref={canvasRef}
            width={464}
            height={112}
            className="w-full h-full"
          />
        </div>

        {/* Presets List */}
        <div className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-green-400" />
            Sound Presets
          </label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {PRESETS.map((preset) => {
              const active = preset.id === equalizerPreset;
              return (
                <button
                  key={preset.id}
                  onClick={() => setEqualizerPreset(preset.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between ${
                    active
                      ? 'bg-green-500/15 border-green-500/50 text-green-400 shadow-sm'
                      : 'bg-zinc-800/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <span className="truncate">{preset.name}</span>
                  {active && <Check className="w-3 h-3 text-green-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Frequency Sliders */}
        <div className="grid grid-cols-5 gap-3 pt-2 border-t border-zinc-800/60 text-center">
          {BANDS.map((band, idx) => {
            const dbVal = equalizerGains[idx] ?? 0;
            return (
              <div key={band} className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-400 w-12 text-center">
                  {dbVal > 0 ? `+${dbVal}` : dbVal}dB
                </span>
                <div className="h-24 flex items-center justify-center">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={dbVal}
                    onChange={(e) => adjustEqualizerBand(idx, parseInt(e.target.value, 10))}
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
