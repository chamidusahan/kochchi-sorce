import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  // Memoize the floating elements to prevent re-renders from resetting animations
  const floatingChillies = useMemo(() => {
    return [...Array(12)].map((_, i) => {
      const randomDelay = Math.random() * 5;
      const randomDuration = 15 + Math.random() * 10;
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      
      // Generate smooth bezier curve paths
      const path1X = Math.random() * 100;
      const path1Y = Math.random() * 100;
      const path2X = Math.random() * 100;
      const path2Y = Math.random() * 100;
      const path3X = Math.random() * 100;
      const path3Y = Math.random() * 100;
      
      return {
        key: `chili-${i}`,
        startX,
        startY,
        path1X,
        path1Y,
        path2X,
        path2Y,
        path3X,
        path3Y,
        randomDelay,
        randomDuration,
      };
    });
  }, []);

  const floatingGarlic = useMemo(() => {
    return [...Array(6)].map((_, i) => {
      const randomDelay = Math.random() * 4;
      const randomDuration = 18 + Math.random() * 12;
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      
      // Generate smooth bezier curve paths
      const path1X = Math.random() * 100;
      const path1Y = Math.random() * 100;
      const path2X = Math.random() * 100;
      const path2Y = Math.random() * 100;
      const path3X = Math.random() * 100;
      const path3Y = Math.random() * 100;
      
      return {
        key: `garlic-${i}`,
        startX,
        startY,
        path1X,
        path1Y,
        path2X,
        path2Y,
        path3X,
        path3Y,
        randomDelay,
        randomDuration,
      };
    });
  }, []);

  return (
    <section
      id="home"
  className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-black via-black to-red-950"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating chili peppers - smooth continuous motion */}
        {floatingChillies.map((chili) => (
          <motion.div
            key={chili.key}
            className="absolute"
            initial={{
              x: `${chili.startX}vw`,
              y: `${chili.startY}vh`,
              rotate: 0,
            }}
            animate={{
              x: [
                `${chili.startX}vw`,
                `${chili.path1X}vw`,
                `${chili.path2X}vw`,
                `${chili.path3X}vw`,
                `${chili.startX}vw`,
              ],
              y: [
                `${chili.startY}vh`,
                `${chili.path1Y}vh`,
                `${chili.path2Y}vh`,
                `${chili.path3Y}vh`,
                `${chili.startY}vh`,
              ],
              rotate: [0, 120, 240, 360, 480],
            }}
            transition={{
              repeat: Infinity,
              duration: chili.randomDuration,
              delay: chili.randomDelay,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          >
            <motion.img
              src="https://cdn-icons-png.flaticon.com/512/1147/1147805.png"
              alt=""
              className="h-8 md:h-12 lg:h-16 select-none pointer-events-none"
              animate={{
                opacity: [0.15, 0.3, 0.2, 0.35, 0.15],
                scale: [1, 1.1, 0.9, 1.05, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: chili.randomDuration / 2,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}

        {/* Floating garlic - smooth continuous motion */}
        {floatingGarlic.map((garlic) => (
          <motion.div
            key={garlic.key}
            className="absolute"
            initial={{
              x: `${garlic.startX}vw`,
              y: `${garlic.startY}vh`,
              rotate: 0,
            }}
            animate={{
              x: [
                `${garlic.startX}vw`,
                `${garlic.path1X}vw`,
                `${garlic.path2X}vw`,
                `${garlic.path3X}vw`,
                `${garlic.startX}vw`,
              ],
              y: [
                `${garlic.startY}vh`,
                `${garlic.path1Y}vh`,
                `${garlic.path2Y}vh`,
                `${garlic.path3Y}vh`,
                `${garlic.startY}vh`,
              ],
              rotate: [0, -120, -240, -360, -480],
            }}
            transition={{
              repeat: Infinity,
              duration: garlic.randomDuration,
              delay: garlic.randomDelay,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          >
            <motion.img
              src="https://cdn-icons-png.flaticon.com/512/1135/1135434.png"
              alt=""
              className="h-6 md:h-10 lg:h-14 select-none pointer-events-none"
              animate={{
                opacity: [0.15, 0.25, 0.2, 0.3, 0.15],
                scale: [1, 0.95, 1.05, 0.98, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: garlic.randomDuration / 2,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center pt-16">
        <div className="md:w-1/2 z-10 space-y-6 text-center md:text-left md:pl-8 lg:pl-12">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Turn up the Heat with <br />
            <span className="text-red-500 inline-block">SPICE UP</span>
          </motion.h1>

          <motion.p
            className="text-gray-300 text-lg md:text-xl max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the fiery kick of authentic Sri Lankan flavors in every
            drop
          </motion.p>

          <motion.button
            className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-bold text-lg flex items-center space-x-2 mx-auto md:mx-0 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/order')}
          >
            <span>ORDER NOW</span>
            <ArrowRight
              className="transition-transform group-hover:translate-x-1"
              size={20}
            />
          </motion.button>
        </div>

        {/* Bottle Image */}
        <div className="md:w-1/2 flex justify-center mt-12 md:mt-0 z-10">
          <motion.div
            className="relative w-64 h-64 md:w-80 md:h-80"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img
              src="public\images\product1.png"
              alt="Spice Up Hot Sauce Bottle"
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};

export default HeroSection;
