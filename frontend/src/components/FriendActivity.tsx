import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RiCloseLine, RiSearchLine, RiUserFollowLine, RiUserUnfollowLine, RiGroupLine, RiMusic2Line } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

interface Friend {
  _id: string;
  name: string;
  avatar: string;
  currentActivity?: {
    song?: {
      _id: string;
      title: string;
      coverImage: string;
      artist?: {
        _id: string;
        name: string;
      };
      album?: {
        _id: string;
        title: string;
      };
    };
    updatedAt: string;
  };
}

interface SearchUser {
  _id: string;
  name: string;
  avatar: string;
  following: string[];
}

/**
 * FriendActivity Component
 * A right-side panel showing friends' real-time playback activity and follow status.
 */
const FriendActivity: React.FC = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const fetchFriends = useCallback(async () => {
    try {
      const res = await api.get('/auth/users/friends');
      if (res.data.success) {
        setFriends(res.data.friends || []);
      }
    } catch (err) {
      console.error('Error fetching friend activity:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll friend activity every 15 seconds for simulated real-time updates
  useEffect(() => {
    fetchFriends();
    const interval = setInterval(fetchFriends, 15000);
    return () => clearInterval(interval);
  }, [fetchFriends]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await api.get(`/auth/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.data.success) {
        setSearchResults(res.data.users || []);
      }
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleFollowToggle = async (targetId: string) => {
    try {
      const res = await api.post(`/auth/users/follow/${targetId}`);
      if (res.data.success) {
        // Refresh friends list
        fetchFriends();
        // Update local search results state
        setSearchResults((prev) =>
          prev.map((u) => {
            if (u._id === targetId) {
              const following = res.data.isFollowing
                ? [...(u.following || []), user?.id || '']
                : (u.following || []).filter((id) => id !== user?.id);
              return { ...u, following };
            }
            return u;
          })
        );
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  const handleClose = () => {
    localStorage.setItem('showFriendActivity', 'false');
    window.dispatchEvent(new Event('friendActivityToggle'));
  };

  const getRelativeTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const isFriendActive = (dateStr?: string) => {
    if (!dateStr) return false;
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    return diffMs < 300000; // active if played within last 5 minutes
  };

  return (
    <div className="h-full flex flex-col rounded-2xl glass-panel overflow-hidden border border-white/[0.05] p-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <RiGroupLine className="w-5 h-5 text-violet-400" />
          <span className="font-bold text-sm tracking-wide">Friend Activity</span>
        </div>
        <button
          onClick={handleClose}
          className="text-zinc-400 hover:text-white rounded-full p-1 hover:bg-white/[0.05] transition-colors"
          title="Close Sidebar"
        >
          <RiCloseLine className="w-5 h-5" />
        </button>
      </div>

      {/* Toggle Search Users */}
      <div className="my-3">
        {showSearch ? (
          <form onSubmit={handleSearch} className="relative flex gap-2">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white/[0.03] text-xs pl-8 pr-2 py-1.5 rounded-lg border border-white/[0.05] focus:border-violet-500/30 outline-none transition-all placeholder:text-zinc-500"
            />
            <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <button
              type="button"
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1.5 bg-white/[0.03] rounded-lg border border-white/[0.05]"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="w-full py-1.5 px-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white transition-all active:scale-95 shadow"
          >
            <RiSearchLine className="w-4 h-4" />
            <span>Find friends & users</span>
          </button>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {showSearch && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-h-[180px] overflow-y-auto mb-3 bg-spotify-black/40 rounded-xl p-2 border border-white/[0.03] flex flex-col gap-2 scrollbar-thin"
          >
            <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider px-1">
              Search Results
            </div>
            {searchResults.map((searchUser) => {
              const isFollowing = friends.some((f) => f._id === searchUser._id);
              return (
                <div key={searchUser._id} className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={searchUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(searchUser.name)}`}
                      alt={searchUser.name}
                      className="w-8 h-8 rounded-full object-cover shadow border border-white/[0.05]"
                    />
                    <span className="text-xs font-semibold truncate">{searchUser.name}</span>
                  </div>
                  <button
                    onClick={() => handleFollowToggle(searchUser._id)}
                    className={`p-1.5 rounded-full transition-all active:scale-95 shadow border ${
                      isFollowing
                        ? 'bg-zinc-800 border-zinc-700 text-red-400 hover:bg-zinc-700'
                        : 'bg-violet-600/80 border-violet-500/20 text-white hover:bg-violet-600'
                    }`}
                    title={isFollowing ? 'Unfollow' : 'Follow'}
                  >
                    {isFollowing ? (
                      <RiUserUnfollowLine className="w-3.5 h-3.5" />
                    ) : (
                      <RiUserFollowLine className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Friends Feed */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin pr-1 flex flex-col gap-4">
        {loading ? (
          // Loading Skeleton
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-start gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-white/[0.03] shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="h-3 w-2/3 bg-white/[0.04] rounded" />
                <div className="h-2.5 w-1/2 bg-white/[0.03] rounded" />
                <div className="h-2 w-3/4 bg-white/[0.03] rounded" />
              </div>
            </div>
          ))
        ) : friends.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
            <RiGroupLine className="w-12 h-12 text-zinc-600" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              Nothing to display. Search and follow other users to see what they are listening to.
            </p>
          </div>
        ) : (
          friends.map((friend) => {
            const hasActivity = friend.currentActivity && friend.currentActivity.song;
            const active = hasActivity && isFriendActive(friend.currentActivity?.updatedAt);

            return (
              <div key={friend._id} className="flex items-start gap-3 group/item">
                {/* User Avatar with status dot */}
                <div className="relative shrink-0">
                  <img
                    src={friend.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(friend.name)}`}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/[0.05] shadow-lg"
                  />
                  {active && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-spotify-black" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col">
                  {/* Name and time */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold truncate text-zinc-200 group-hover/item:text-white transition-colors">
                      {friend.name}
                    </span>
                    {hasActivity && (
                      <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                        {getRelativeTime(friend.currentActivity?.updatedAt)}
                      </span>
                    )}
                  </div>

                  {/* Song Activity */}
                  {hasActivity ? (
                    <div className="mt-1 flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-[11px] text-zinc-300 font-semibold truncate">
                          {friend.currentActivity?.song?.title}
                        </span>
                        {active && (
                          <div className="eq-container shrink-0">
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 truncate">
                        {friend.currentActivity?.song?.artist?.name}
                      </span>
                      <div className="text-[10px] text-zinc-600 truncate flex items-center gap-1 mt-0.5">
                        <RiMusic2Line className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {friend.currentActivity?.song?.album?.title || 'Single'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-500 italic mt-1">Offline</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FriendActivity;
