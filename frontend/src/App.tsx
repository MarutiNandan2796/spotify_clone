import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import Artist from './pages/Artist';
import Album from './pages/Album';
import Playlist from './pages/Playlist';
import LikedSongs from './pages/LikedSongs';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <PlayerProvider>
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Main App Layout containing Protected / User routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="search" element={<Search />} />
                <Route path="artist/:id" element={<Artist />} />
                <Route path="album/:id" element={<Album />} />
                <Route path="playlist/:id" element={<Playlist />} />
                <Route path="liked-songs" element={<LikedSongs />} />
                <Route path="profile" element={<Profile />} />
                <Route path="admin" element={<AdminDashboard />} />
                {/* Fallback route redirection */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </PlayerProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
