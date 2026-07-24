import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RiArrowLeftSLine, RiArrowRightSLine, RiSearchLine, RiUserLine } from 'react-icons/ri';
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineDashboard } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Navbar Component
 * The central navigation header bar. Contains navigation controls (back/forward history),
 * the dynamic search input (active on search route), and user account profile dropdown/auth state buttons.
 *
 * @returns {React.ReactElement} The rendered Navbar component.
 */
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
          className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.05] flex items-center justify-center text-white active:scale-95 transition-all shadow"
          title="Go back"
        >
          <RiArrowLeftSLine className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.05] flex items-center justify-center text-white active:scale-95 transition-all shadow"
          title="Go forward"
        >
          <RiArrowRightSLine className="w-5 h-5" />
        </button>
      </div>

      {/* Dynamic Search Bar (Only shown on search page) */}
      {isSearchPage && (
        <div className="flex-1 max-w-md relative group">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-400 w-5 h-5 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tracks, albums, artists..."
            className="w-full bg-white/[0.03] hover:bg-white/[0.06] focus:bg-white/[0.06] backdrop-blur-md text-white text-sm pl-12 pr-4 py-2.5 rounded-full border border-white/[0.05] focus:border-violet-500/30 outline-none transition-all placeholder:text-zinc-500 shadow-inner"
          />
        </div>
      )}

      {/* Auth State Button / Profile Bubble */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md rounded-full p-1 pr-3 border border-white/[0.05] transition-all cursor-pointer shadow hover:border-violet-500/20"
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
                  className="absolute right-0 mt-2 w-48 rounded-2xl glass-panel shadow-2xl p-1.5 z-50 text-sm flex flex-col font-medium border border-white/[0.05]"
                >
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2 text-white/95 hover:bg-white/[0.05] rounded-xl transition-colors"
                    >
                      <MdOutlineDashboard className="w-4 h-4 text-violet-400" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-3 py-2 text-white/95 hover:bg-white/[0.05] rounded-xl transition-colors"
                  >
                    <RiUserLine className="w-4 h-4 text-violet-400" />
                    <span>Profile</span>
                  </Link>
                  <hr className="border-white/[0.05] my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                      navigate('/login');
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-white/[0.05] rounded-xl transition-colors text-left w-full cursor-pointer"
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
              className="bg-white text-black font-bold px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-white/5"
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
