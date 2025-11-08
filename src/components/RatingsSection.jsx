import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Assumptions:
// - Backend endpoints exist at:
//   POST http://localhost/backend/user/submit-rating.php (JSON: { rating, comment })
//   GET  http://localhost/backend/user/get-ratings.php
// - Session check endpoint: http://localhost/backend/user/check-session.php
// If not yet created, copy the PHP code samples I'll provide separately.

const RatingsSection = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const marqueeRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch session + existing ratings
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const ratingsRes = await fetch(`http://localhost/backend/user/get-ratings.php?_t=${Date.now()}`, {
          method: 'GET',
          credentials: 'include'
        });
        const ratingsData = await ratingsRes.json();
        if (ratingsData.success) {
          setRatings(ratingsData.ratings || []);
        } else {
          setError(ratingsData.message || 'Failed to load ratings');
        }
      } catch (err) {
        setError('Network error loading ratings');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Observe viewport visibility to pause/resume marquee
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      setIsInView(entries[0]?.isIntersecting ?? false);
    }, { root: null, threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Helper to refresh ratings from server
  const refreshRatings = async () => {
    try {
      const res = await fetch(`http://localhost/backend/user/get-ratings.php?_t=${Date.now()}`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) setRatings(data.ratings || []);
    } catch (_) {
      // ignore refresh errors silently
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (ratingValue < 1 || ratingValue > 5) {
      setError('Please select a star rating (1-5).');
      return;
    }
    if (comment.trim().length < 5) {
      setError('Comment must be at least 5 characters.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('http://localhost/backend/user/submit-rating.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingValue, comment })
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically prepend new rating
        setRatings(prev => [data.rating, ...prev]);
        setRatingValue(0);
        setComment('');
        // Then refresh from server to ensure canonical ordering
        refreshRatings();
      } else {
        setError(data.message || 'Failed to submit rating');
      }
    } catch (err) {
      setError('Network error submitting rating');
    } finally {
      setSubmitting(false);
    }
  };

  const stars = [1,2,3,4,5];

  // Admin delete a rating
  const handleDelete = async (id) => {
    if (!id) return;
    const ok = window.confirm('Delete this review?');
    if (!ok) return;
    try {
      const res = await fetch('http://localhost/backend/user/delete-rating.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setRatings(prev => prev.filter(r => r.id !== id));
      } else {
        alert(data.message || 'Failed to delete review');
      }
    } catch (e) {
      alert('Network error deleting review');
    }
  };

  // Pick a background color based on the initial letter to keep avatars varied
  const getAvatarColor = (ch) => {
    const palette = [
      'bg-red-600', 'bg-orange-600', 'bg-amber-600', 'bg-lime-600', 'bg-emerald-600',
      'bg-teal-600', 'bg-sky-600', 'bg-indigo-600', 'bg-violet-600', 'bg-fuchsia-600', 'bg-rose-600'
    ];
    const code = (ch && ch.length) ? ch.toUpperCase().charCodeAt(0) : 65; // default 'A'
    return palette[code % palette.length];
  };

  return (
    <section id="ratings" className="py-16 bg-black/90 text-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Customer Reviews
        </motion.h2>

        {/* Submit Form */}
        <motion.div
          className="max-w-2xl mx-auto mb-12 bg-gradient-to-br from-red-950 to-black p-6 rounded-xl border border-red-800/40 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {user ? (
            <p className="mb-4 text-sm text-red-300">Leave a review as <span className="font-semibold">{user.firstName}</span></p>
          ) : (
            <p className="mb-4 text-sm text-yellow-300">You must <button onClick={() => navigate('/login')} className="underline hover:text-yellow-200">log in</button> to leave a review.</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 mb-4">
              {stars.map(s => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoverValue(s)}
                  onMouseLeave={() => setHoverValue(0)}
                  onClick={() => setRatingValue(s)}
                  className="group"
                >
                  <Star
                    size={30}
                    className={
                      'transition-colors ' +
                      ((hoverValue || ratingValue) >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600')
                    }
                  />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your spicy experience..."
              className="w-full h-28 p-3 rounded-md bg-black/60 border border-red-800/40 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm resize-y"
              disabled={!user || submitting}
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              disabled={!user || submitting}
              className="mt-4 px-6 py-3 rounded-full font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </motion.div>

        {/* Ratings Carousel */}
        {loading ? (
          <p className="text-center text-gray-400">Loading reviews...</p>
        ) : ratings.length === 0 ? (
          <p className="text-center text-gray-400">No reviews yet. Be the first!</p>
        ) : (
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            ref={marqueeRef}
          >
            <div
              className={`marquee-track flex-nowrap items-stretch gap-6 pb-4 min-w-0 ${isHovering || !isInView ? 'marquee-paused' : 'marquee-normal'}`}
              style={{ animationDuration: `${Math.max(18, ratings.length * 3)}s` }}
            >
              {/* Duplicate ratings for seamless infinite loop (scroll width = 50%) */}
              {[...ratings, ...ratings].map((r, idx) => {
                const fn = r.first_name || r.user_first_name || '';
                const ln = r.last_name || r.user_last_name || '';
                const displayName = fn ? `${fn}${ln ? ' ' + ln.charAt(0) + '.' : ''}` : 'Anonymous';
                const initial = (fn || 'A').charAt(0).toUpperCase();
                const profilePic = r.profile_pic;
                
                return (
                  <motion.div
                    key={`${r.id || idx}-${idx}`}
                    className="flex-shrink-0 w-[500px]"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-red-950/40 via-black to-red-900/30 border border-red-700/40 shadow-xl backdrop-blur-sm hover:shadow-red-900/40 hover:scale-[1.02] transition-all duration-300">
                      {/* Top: Avatar & Name */}
                      <div className="flex items-center gap-4 mb-6">
                        {profilePic ? (
                          <img
                            src={profilePic}
                            alt={displayName}
                            className="w-16 h-16 rounded-full object-cover border-2 border-red-500/60 shadow-lg"
                          />
                        ) : (
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${getAvatarColor(initial)}`}>
                            {initial}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-white text-base">{displayName}</p>
                          {r.created_at && (
                            <p className="text-sm text-red-300/70">{new Date(r.created_at).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                        ))}
                        {Array.from({ length: 5 - r.rating }).map((_, i) => (
                          <Star key={'empty-'+i} size={20} className="text-gray-700" />
                        ))}
                      </div>
                      
                      {/* Comment */}
                      <p className="text-base text-gray-200 leading-relaxed line-clamp-4 mb-4">{r.comment}</p>
                      {/* Admin Delete (placeholder condition: user && user.isAdmin) */}
                      {user?.isAdmin && r.id && (
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-xs px-3 py-1 rounded-full bg-red-700 hover:bg-red-800 text-white font-medium transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Gradient fade edges */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-black/90 to-transparent" />
            <div className="pointer-events-none absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-black/90 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
};

export default RatingsSection;
