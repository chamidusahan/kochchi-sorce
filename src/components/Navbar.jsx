import React, { useEffect, useState } from "react";
import { Flame, User, LogOut } from "lucide-react";
import { supabase } from "../supabaseClient"; // make sure this file exists and is configured
import LoginPage from "./LoginPage";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user session from Supabase
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Also listen to auth state changes (auto update after login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

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
        <div className="hidden md:flex space-x-8 items-center">
          {["Home", "About", "Products", "Order Now", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-medium text-white hover:text-red-500 transition-colors"
            >
              {item}
            </a>
          ))}

          {/* Auth Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center text-white hover:text-red-400"
            >
              <LogOut className="mr-1" /> 
            </button>
          ) : (
            <a href="/login">
              <User className="text-white hover:text-red-500 transition-colors" /> 
            </a>
          )}
        </div>

        {/* Mobile Menu Placeholder */}
        <div className="md:hidden">
          <button className="p-2">
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
