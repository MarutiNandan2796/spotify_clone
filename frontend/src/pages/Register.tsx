import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-spotify-black p-4 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-spotify-green/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl card-shadow border border-zinc-800/80 z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-spotify-green" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.892-.982-.336.076-.67-.138-.746-.473-.076-.336.138-.67.473-.746 3.854-.88 7.15-.504 9.822 1.13.295.18.387.563.207.864zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.082-1.182-.413.125-.847-.11-972-.522-.125-.412.11-.847.522-.972 3.676-1.114 8.24-.57 11.35 1.344.366.226.486.707.26 1.074zm.107-2.836C14.394 8.71 8.683 8.52 5.355 9.53c-.512.155-1.046-.134-1.202-.647-.155-.513.134-1.047.647-1.202 3.82-1.16 10.122-.94 14.168 1.464.46.273.61.87.337 1.33-.273.46-.87.61-1.33.337z"/>
          </svg>
          <h2 className="text-2xl font-black tracking-tight text-white mt-2">Sign up for free</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-2.5 px-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-zinc-300">Profile Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
              className="w-full bg-[#121212] border border-zinc-700 focus:border-spotify-green hover:border-zinc-500 text-white rounded-lg px-4 py-2.5 outline-none transition-all text-sm placeholder:text-zinc-650"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-zinc-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-[#121212] border border-zinc-700 focus:border-spotify-green hover:border-zinc-500 text-white rounded-lg px-4 py-2.5 outline-none transition-all text-sm placeholder:text-zinc-650"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-zinc-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min. 6 chars)"
              className="w-full bg-[#121212] border border-zinc-700 focus:border-spotify-green hover:border-zinc-500 text-white rounded-lg px-4 py-2.5 outline-none transition-all text-sm placeholder:text-zinc-650"
            />
          </div>

          <div className="flex items-center gap-2.5 text-left my-3 px-1 select-none">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded bg-[#121212] border border-zinc-700 text-spotify-green focus:ring-spotify-green focus:ring-offset-zinc-900 focus:ring-2 cursor-pointer accent-spotify-green transition-all"
            />
            <label htmlFor="agreeTerms" className="text-xs text-zinc-350 font-medium cursor-pointer">
              I agree to the{' '}
              <button
                type="button"
                onClick={() => setShowRulesModal(true)}
                className="text-spotify-green hover:underline focus:outline-none font-bold"
              >
                Rules & Regulations
              </button>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full bg-spotify-green hover:bg-spotify-hoverGreen text-black font-extrabold py-3 rounded-full mt-2 hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer disabled:bg-zinc-700 disabled:text-zinc-500 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="border-t border-zinc-800/80 my-6" />

        <p className="text-sm text-zinc-400 text-center font-medium">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-spotify-green hover:text-spotify-hoverGreen underline font-semibold transition-colors"
          >
            Log in here
          </Link>
        </p>
      </motion.div>

      <AnimatePresence>
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-lg bg-[#181818] border border-zinc-800/80 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[80vh] relative z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-spotify-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Rules & Regulations
                </h3>
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto my-4 pr-1 text-zinc-300 text-sm space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
                <section className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1 text-spotify-green">1. Acceptance of Terms</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    By registering for an account on Spotify Clone, you agree to abide by all the listed community rules, standard terms of use, and account regulations.
                  </p>
                </section>

                <section className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1 text-spotify-green">2. Account Credentials & Security</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    You are responsible for safeguarding your login credentials. Do not share your password. Any activity carried out under your account is your sole responsibility.
                  </p>
                </section>

                <section className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1 text-spotify-green">3. Copyright & Intellectual Property</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    This platform is a clone built for educational and demonstration purposes. Users must not upload songs, albums, or cover art that infringe on third-party copyrights. Always ensure you possess the distribution rights for uploaded material.
                  </p>
                </section>

                <section className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1 text-spotify-green">4. Fair Platform Usage</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Any form of service manipulation (e.g. inflating streams via scripts/bots, abusing uploads, scraping metadata, or attempting system exploits) will lead to immediate account suspension.
                  </p>
                </section>

                <section className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1 text-spotify-green">5. Disclaimers</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    This service is provided "as is". The developers assume no liability for deleted uploads, account data losses, or stream disruptions.
                  </p>
                </section>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setShowRulesModal(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAgreed(true);
                    setShowRulesModal(false);
                  }}
                  className="px-5 py-2 text-xs font-extrabold bg-spotify-green hover:bg-spotify-hoverGreen text-black rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Agree & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
