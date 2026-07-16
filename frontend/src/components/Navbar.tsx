import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RiArrowLeftSLine, RiArrowRightSLine, RiSearchLine, RiUserLine } from 'react-icons/ri';
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineDashboard } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isSearchPage = location.pathname === '/search';

  // Toggle dropdown
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update URL search query param with navigating
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  // Sync search input with URL search param on page loads
  useEffect(() => {
    if (isSearchPage) {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get('q') || '');
    } else {
      setSearchQuery('');
    }
  }, [location.search, isSearchPage]);

  return (
    <div className="h-16 w-full flex items-center justify-between px-6 bg-transparent z-40 relative gap-4">
      {/* Navigation Arrows */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/90 active:scale-95 transition-all"
          title="Go back"
        >
          <RiArrowLeftSLine className="w-6 h-6" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/90 active:scale-95 transition-all"
          title="Go forward"
        >
          <RiArrowRightSLine className="w-6 h-6" />
        </button>
      </div>

      {/* Dynamic Search Bar (Only shown on search page) */}
      {isSearchPage && (
        <div className="flex-1 max-w-md relative group">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-white w-5 h-5 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="What do you want to play?"
            className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white text-sm pl-12 pr-4 py-2.5 rounded-full border border-transparent focus:border-zinc-700 outline-none transition-all placeholder:text-zinc-500"
          />
        </div>
      )}

      {/* Auth State Button / Profile Bubble */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 bg-black/50 hover:bg-black/80 rounded-full p-1 pr-3 border border-zinc-800 transition-colors cursor-pointer"
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover shadow"
              />
              <span className="text-sm font-semibold truncate max-w-[120px] hidden sm:inline">
                {user.name}
              </span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 rounded bg-[#282828] border border-zinc-800 shadow-2xl p-1 z-50 text-sm flex flex-col font-medium"
                >
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2 text-white/95 hover:bg-zinc-700/50 rounded transition-colors"
                    >
                      <MdOutlineDashboard className="w-4 h-4 text-spotify-green" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-3 py-2 text-white/95 hover:bg-zinc-700/50 rounded transition-colors"
                  >
                    <RiUserLine className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <hr className="border-zinc-800 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                      navigate('/login');
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-zinc-700/50 rounded transition-colors text-left w-full cursor-pointer"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/register"
              className="text-spotify-lightGray hover:text-white font-bold transition-all hover:scale-105"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="bg-white text-black font-bold px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
