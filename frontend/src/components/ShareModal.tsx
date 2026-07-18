import React, { useState } from 'react';
import { Share2, X, Copy, Check, ExternalLink, QrCode } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  coverImage?: string;
  type?: 'track' | 'playlist' | 'album' | 'artist';
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  coverImage,
  type = 'track',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-900/95 border border-zinc-800 p-6 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Share {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
              <p className="text-xs text-zinc-400">Spread music with friends</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Embed Preview */}
        <div className="my-5 p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-4 shadow-inner">
          {coverImage ? (
            <img src={coverImage} alt={title} className="w-14 h-14 rounded-lg object-cover border border-zinc-800" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold text-lg">
              ♪
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold truncate text-white">{title}</h4>
            {subtitle && <p className="text-xs text-zinc-400 truncate">{subtitle}</p>}
            <span className="text-[10px] text-green-400 font-semibold uppercase mt-1 inline-block tracking-wider">
              Spotify Clone Audio
            </span>
          </div>
        </div>

        {/* Copy Link Input Bar */}
        <div className="mb-5 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-400 outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${title}" on Spotify Clone! ${shareUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-xs font-semibold text-center text-zinc-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Twitter</span>
          </a>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Listen to "${title}": ${shareUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-xs font-semibold text-center text-zinc-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-green-400" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-xs font-semibold text-center text-zinc-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-purple-400" />
            <span>QR Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};
