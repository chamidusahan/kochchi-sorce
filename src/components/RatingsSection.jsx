import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

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

  // Observe viewport visibility to pause/resume carousel auto-play
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const obs = new IntersectionObserver((entries) => {
      setIsInView(entries[0]?.isIntersecting ?? false);
    }, { root: null, threshold: 0.2 });

    obs.observe(el);

    return () => {
      obs.disconnect();
    };
  }, [ratings.length]);

  // Auto advance reviews when in view and not hovering
  useEffect(() => {
    if (!ratings.length) return;
    if (!isInView || isHovering) return;
    const timer = setInterval(() => {
      setCurrentIndex((idx) => {
        if (ratings.length <= 1) {
          return idx;
        }
        return (idx + 1) % ratings.length;
      });
      setCycle((prev) => prev + 1);
    }, 6500);
    return () => clearInterval(timer);
  }, [ratings.length, isInView, isHovering]);

  // Reset to newest review when list changes (e.g., submit/delete)
  useEffect(() => {
    if (!ratings.length) {
      setCurrentIndex(0);
      setCycle(0);
      return;
    }
    setCurrentIndex((idx) => (idx >= ratings.length ? ratings.length - 1 : idx));
    setCycle(0);
  }, [ratings]);

  useEffect(() => {
    if (!successMessage) return;
    setShowSuccessPopup(true);
    const hideTimer = setTimeout(() => setShowSuccessPopup(false), 3000);
    const clearTimer = setTimeout(() => setSuccessMessage(''), 3400);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  }, [successMessage]);

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
    setError(null);
    setShowSuccessPopup(false);
    setSuccessMessage('');
    if (ratingValue < 1 || ratingValue > 5) {
      setError('Please select a star rating (1-5).');
      return;
    }
    if (!comment.trim()) {
      setError('Comment cannot be empty.');
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
        setSuccessMessage('Review submitted successfully!');
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
        setCurrentIndex((idx) => (idx > 0 ? idx - 1 : 0));
        setCycle((prev) => prev + 1);
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
    <>
      <AnimatePresence>
        {showSuccessPopup && successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-green-600/95 px-6 py-3 text-sm font-medium text-white shadow-2xl"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <section id="ratings" className="py-16 bg-black text-white relative overflow-hidden">
        {/* Animated background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-3"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400 bg-red-600/10 px-4 py-2 rounded-full border border-red-600/20">
              Testimonials
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-red-500">Hot</span> Customer Reviews
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-5 rounded-full" />
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            Real experiences from spice lovers who've turned up the heat
          </p>
        </motion.div>

        {/* Submit Form */}
        <motion.div
          className="max-w-2xl mx-auto mb-10 bg-gradient-to-br from-red-950 to-black p-5 rounded-xl border border-red-800/40 shadow-lg"
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
                    size={26}
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
              onChange={e => {
                setComment(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Share your spicy experience..."
              className="w-full h-24 p-3 rounded-md bg-black/60 border border-red-800/40 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm resize-y"
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
            className="relative flex flex-col items-center gap-5"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            ref={carouselRef}
          >
            <AnimatePresence mode="wait">
              {(() => {
                const review = ratings[currentIndex];
                if (!review) return null;
                const fn = review.first_name || review.user_first_name || '';
                const ln = review.last_name || review.user_last_name || '';
                const displayName = fn ? `${fn}${ln ? ' ' + ln.charAt(0) + '.' : ''}` : 'Anonymous';
                const initial = (fn || 'A').charAt(0).toUpperCase();
                const profilePic = review.profile_pic;

                return (
                  <motion.div
                    key={`${review.id || `review-${currentIndex}`}-${cycle}`}
                    initial={{ opacity: 0, scale: 0.92, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -25 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative w-full max-w-3xl"
                  >
                    <div className="relative z-10 p-8 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/50 via-black/90 to-black/80 shadow-[0_40px_120px_-60px_rgba(120,255,190,0.5)]">
                      <div className="absolute -top-10 left-8 hidden md:block">
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                          className="text-5xl text-red-700/70"
                        >
                          “
                        </motion.span>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-start md:gap-6">
                        <div className="flex items-center gap-4 md:flex-col md:items-start">
                          {profilePic ? (
                            <img
                              src={profilePic}
                              alt={displayName}
                              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-red-500/60 shadow-lg"
                            />
                          ) : (
                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg ${getAvatarColor(initial)}`}>
                              {initial}
                            </div>
                          )}
                          <div className="flex flex-col gap-1 md:mt-4">
                            <p className="font-semibold text-sm md:text-base text-white">{displayName}</p>
                            {review.created_at && (
                              <p className="text-xs md:text-sm text-red-200/70">{new Date(review.created_at).toLocaleDateString()}</p>
                            )}
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={22}
                                  className="w-4 h-4 md:w-[22px] md:h-[22px] text-yellow-400 fill-yellow-400"
                                />
                              ))}
                              {Array.from({ length: 5 - review.rating }).map((_, i) => (
                                <Star
                                  key={`empty-${i}`}
                                  size={22}
                                  className="w-4 h-4 md:w-[22px] md:h-[22px] text-gray-700"
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 space-y-3 md:flex-1">
                          <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                            {review.comment}
                          </p>

                          {user?.isAdmin && review.id && (
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="text-xs px-3 py-1 rounded-full bg-red-700 hover:bg-red-800 text-white font-medium transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Floating glow accent */}
                    <div className="absolute inset-0 blur-3xl bg-emerald-400/20 -z-10 translate-y-6" />
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="flex flex-wrap justify-center gap-2">
              {ratings.map((r, idx) => (
                <button
                  key={r.id || idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setCycle((prev) => prev + 1);
                  }}
                  className={`h-2.5 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-red-500' : 'w-2 bg-red-500/40 hover:bg-red-400/60'}`}
                />
              ))}
            </div>
          </div>
        )}
        </div>
      </section>
    </>
  );
};

export default RatingsSection;
