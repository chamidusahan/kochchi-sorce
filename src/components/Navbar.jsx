import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, User, LogOut, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Flame size={28} className="text-red-600" />
          <span className="font-bold text-2xl text-red-500">SPICE UP</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className="font-medium text-white hover:text-red-500 transition-colors"
            >
              {item.name}
            </button>
          ))}

          {/* Login/Logout */}
          <div className="flex items-center">
            {!user ? (
              <button
                aria-label="Log in"
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => navigate("/login")}
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
                  className="text-lg font-semibold text-white hover:text-red-500 transition-colors"
                >
                  {item.name}
                </button>
              ))}
              <button
                className="text-lg font-semibold text-white hover:text-red-500 transition-colors"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/login");
                }}
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
