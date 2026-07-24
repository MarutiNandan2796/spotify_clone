import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Player from '../components/Player';
import LyricsOverlay from '../components/LyricsOverlay';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-spotify-black text-white overflow-hidden select-none relative">
      {/* Glowing background auroras */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="aura-blob blob-1"></div>
        <div className="aura-blob blob-2"></div>
        <div className="aura-blob blob-3"></div>
      </div>

      {/* Upper Main Shell */}
      <div className="flex flex-1 overflow-hidden p-3 gap-3 h-[calc(100vh-100px)] z-10">
        {/* Left Sidebar - Hidden on mobile, shown on md+ */}
        <div className="hidden md:flex w-[300px] flex-col shrink-0">
          <Sidebar />
        </div>

        {/* Center Main Scrollable Panel */}
        <div className="flex-1 flex flex-col rounded-2xl glass-panel overflow-hidden relative">
          <Navbar />
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative spotify-gradient-bg">
            <Outlet />
            <LyricsOverlay />
          </div>
        </div>
      </div>

      {/* Bottom Floating Audio Player */}
      <div className="h-[100px] w-full bg-transparent px-6 flex items-center justify-center z-10">
        <Player />
      </div>

      {/* Mobile Bottom Navigation (Visible only on mobile) */}
      <div className="md:hidden flex h-[60px] border-t border-zinc-900 bg-spotify-black justify-around items-center text-xs text-spotify-lightGray pb-1 z-50">
        <Link to="/" className="flex flex-col items-center gap-1 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 2.83L18.17 11H17v8h-2v-6H9v6H7v-8H5.83L12 5.83z"/></svg>
          <span>Home</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center gap-1 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <span>Search</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MainLayout;
