import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, X, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Smooth scroll handler
  const handleScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/"); // go home first
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 400);
    } else {
      const section = document.getElementById(sectionId);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Navigation items
  const navItems = [
    {
      name: "Home",
      action: () => {
        if (location.pathname === "/") {
          // already on home - smooth scroll to top
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          navigate("/");
        }
      },
    },
    { name: "About", action: () => handleScroll("about") },
    { name: "Products", action: () => handleScroll("products") },
    { name: "Order Now", action: () => handleScroll("delivery") },
    { name: "Contact", action: () => handleScroll("contact") },
    { name: "Cart", action: () => navigate("/order"), isRed: true },
  ];

  const getInitial = () => {
    if (!user) return '';
  const source = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email || '';
  return source ? source.charAt(0).toUpperCase() : '?';
  };

  const renderAvatar = () => {
    if (!user) return null;
    if (user.profilePic) {
      return (
        <img
          src={user.profilePic}
          alt={user.firstName || user.email}
          className="h-9 w-9 rounded-full object-cover border border-white/20"
          referrerPolicy="no-referrer"
        />
      );
    }
    return (
      <div className="h-9 w-9 rounded-full bg-red-600/90 text-white flex items-center justify-center text-sm font-semibold">
        {getInitial()}
      </div>
    );
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/images/123.png"
            alt="Spice Up logo"
            className="h-14 w-14 object-contain"
          />
          <span className="font-bold text-3xl leading-none self-center">
            <span className="text-green-400">SPICE</span>
            {" "}
            <span className="text-red-500">UP</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className={`font-medium transition-colors ${
                item.isRed
                  ? "text-red-500 hover:text-red-400"
                  : "text-white hover:text-red-500"
              }`}
            >
              {item.name}
            </button>
          ))}

          {/* Login/Logout */}
          <div className="flex items-center">
            {loading ? (
              <div className="p-2">
                <div className="h-5 w-5 border border-white/40 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : user ? (
              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center gap-2 rounded-full hover:bg-white/10 p-1.5"
                  onClick={() => setProfileOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  {renderAvatar()}
                  <ChevronDown size={16} className={`text-white transition ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-black/95 shadow-lg p-1"
                    >
                      <button
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10"
                        onClick={() => { setProfileOpen(false); navigate('/my-orders'); }}
                      >
                        <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                        <span>My Orders</span>
                      </button>
                      <button
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-300 hover:bg-red-600/10"
                        onClick={() => { setProfileOpen(false); logout().catch(() => {}); }}
                      >
                        <LogOut size={16} />
                        <span>Sign out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                aria-label="Log in"
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => navigate("/login")}
              >
                <User size={20} className="text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="p-2 focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {!mobileOpen ? (
              <>
                <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                <div className="w-6 h-0.5 bg-white"></div>
              </>
            ) : (
              <X size={28} className="text-white" />
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="md:hidden absolute top-full left-0 w-full bg-black/95 z-40 flex flex-col items-center space-y-6 py-8 shadow-lg"
            >
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setMobileOpen(false);
                  }}
                  className={`text-lg font-semibold transition-colors ${
                    item.isRed
                      ? "text-red-500 hover:text-red-400"
                      : "text-white hover:text-red-500"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              {loading ? (
                <div className="text-white/60">Loading...</div>
              ) : user ? (
                <div className="flex flex-col items-center gap-3">
                  {renderAvatar()}
                  <button
                    className="text-lg font-semibold text-white hover:text-red-500 transition-colors"
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/my-orders");
                    }}
                  >
                    My Orders
                  </button>
                  <button
                    className="text-lg font-semibold text-white hover:text-red-500 transition-colors"
                    onClick={() => {
                      setMobileOpen(false);
                      logout().catch(() => {});
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  className="text-lg font-semibold text-white hover:text-red-500 transition-colors"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/login");
                  }}
                >
                  Login
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
