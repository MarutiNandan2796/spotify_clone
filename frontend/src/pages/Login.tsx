import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-spotify-black p-4 relative overflow-hidden">
      {/* Visual background lights for premium aesthetics */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-spotify-green/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl card-shadow border border-zinc-800/80 z-10"
      >
        {/* Logo and title */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-spotify-green" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.892-.982-.336.076-.67-.138-.746-.473-.076-.336.138-.67.473-.746 3.854-.88 7.15-.504 9.822 1.13.295.18.387.563.207.864zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.082-1.182-.413.125-.847-.11-972-.522-.125-.412.11-.847.522-.972 3.676-1.114 8.24-.57 11.35 1.344.366.226.486.707.26 1.074zm.107-2.836C14.394 8.71 8.683 8.52 5.355 9.53c-.512.155-1.046-.134-1.202-.647-.155-.513.134-1.047.647-1.202 3.82-1.16 10.122-.94 14.168 1.464.46.273.61.87.337 1.33-.273.46-.87.61-1.33.337z"/>
          </svg>
          <h2 className="text-2xl font-black tracking-tight text-white mt-2">Log in to Spotify</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-2.5 px-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-zinc-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-[#121212] border border-zinc-700 focus:border-spotify-green hover:border-zinc-500 text-white rounded-lg px-4 py-2.5 outline-none transition-all text-sm placeholder:text-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-zinc-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#121212] border border-zinc-700 focus:border-spotify-green hover:border-zinc-500 text-white rounded-lg px-4 py-2.5 outline-none transition-all text-sm placeholder:text-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-spotify-green hover:bg-spotify-hoverGreen text-black font-extrabold py-3 rounded-full mt-2 hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer disabled:bg-zinc-600 disabled:text-zinc-400"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="border-t border-zinc-800/80 my-6" />

        <p className="text-sm text-zinc-400 text-center font-medium">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-spotify-green hover:text-spotify-hoverGreen underline font-semibold transition-colors"
          >
            Sign up for Spotify
          </Link>
        </p>

        {/* Guest credentials hint */}
        <div className="mt-6 bg-zinc-900/40 border border-zinc-800 p-3 rounded-lg text-[11px] text-zinc-500 leading-normal">
          <span className="font-bold text-zinc-400 block mb-1">💡 Demo Login (Seed Data)</span>
          <p>Admin: <code className="text-spotify-green">admin@spotify.com</code> / <code className="text-spotify-green">admin123</code></p>
          <p>User: <code className="text-spotify-green">user@spotify.com</code> / <code className="text-spotify-green">user123</code></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
