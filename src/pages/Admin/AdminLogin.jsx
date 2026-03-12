import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin-dashboard';

  // If already authed, skip login
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch('backend/admin/check-session.php', { credentials: 'include' });
        if (!cancelled && res.ok) {
          const data = await res.json();
            if (data?.authenticated) navigate(from, { replace: true });
        }
      } catch {}
    };
    check();
    return () => { cancelled = true; };
  }, [from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('backend/admin/login.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        navigate(from, { replace: true });
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950/30 p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Panel - Red Gradient */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-red-700 via-red-800 to-red-950 p-12 md:p-16 flex flex-col justify-center min-h-[300px] md:min-h-[500px]">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={36} className="text-white md:w-12 md:h-12" strokeWidth={2} />
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">ADMIN PORTAL</h1>
          </div>
          <p className="text-white/90 text-sm md:text-base leading-relaxed">
            Secure access to the administration dashboard.
          </p>
          <div className="mt-6 h-1 w-16 bg-red-300 rounded-full"></div>
        </div>

        {/* Right Panel - Dark Form */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-900 via-black to-gray-950 p-12 md:p-16 flex flex-col justify-center min-h-[400px] md:min-h-[500px]">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Admin Login</h2>
          <p className="text-gray-400 text-sm mb-8">Please enter your credentials to access the admin dashboard.</p>
          {location.state?.from && (
            <p className="text-xs text-yellow-400/80 mb-4">Session expired or not found. Please sign in.</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition shadow-lg text-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
