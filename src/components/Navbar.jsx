import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, User, LogOut, X } from "lucide-react";



const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Flame size={28} className="text-red-600" />
          <span className="font-bold text-2xl text-red-500">SPICE UP</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {["Home", "About", "Products", "Order Now", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-medium text-white hover:text-red-500 transition-colors"
            >
              {item}
            </a>
          ))}

          {/* Login icon - show User when logged out, LogOut when logged in */}
          <div className="flex items-center">
            <div className="flex items-center">
              {!user ? (
                <button
                  aria-label="Log in"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  onClick={() => navigate('/login')}
                >
                  <User size={20} className="text-white" />
                </button>
              ) : (
                <button
                  aria-label="Log out"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors flex items-center space-x-2"
                  onClick={() => setUser(null)}
                >
                  <LogOut size={18} className="text-white" />
                  <span className="text-sm text-white">Sign out</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {!mobileOpen ? (
            <button
              className="p-2 focus:outline-none"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <div className="w-6 h-0.5 bg-white mb-1.5"></div>
              <div className="w-6 h-0.5 bg-white mb-1.5"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </button>
          ) : (
            <button
              className="p-2 focus:outline-none"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <X size={28} className="text-white" />
            </button>
          )}
        </div>
        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="md:hidden absolute top-full left-0 w-full bg-black/95 z-40 flex flex-col items-center space-y-6 py-8 shadow-lg"
            >
              {["Home", "About", "Products", "Order Now", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-lg font-semibold text-white hover:text-red-500 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button
                className="text-lg font-semibold text-white hover:text-red-500 transition-colors"
                onClick={() => { setMobileOpen(false); navigate('/login'); }}
              >
                Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
