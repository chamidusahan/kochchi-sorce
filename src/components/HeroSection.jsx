import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-black via-black to-red-950"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating chili peppers */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`chili-${i}`}
            className="absolute"
            initial={{
              x: `${Math.random() * 100 - 50}%`,
              y: `${Math.random() * 100}%`,
              rotate: Math.random() * 360,
            }}
            animate={{
              y: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              x: [
                `${Math.random() * 100 - 50}%`,
                `${Math.random() * 100 - 50}%`,
                `${Math.random() * 100 - 50}%`,
              ],
              rotate: Math.random() * 720 - 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 15 + Math.random() * 20,
              ease: "easeInOut",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1147/1147805.png"
              alt=""
              className="h-12 md:h-16 lg:h-20 opacity-20 select-none pointer-events-none"
            />
          </motion.div>
        ))}

        {/* Floating garlic */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`garlic-${i}`}
            className="absolute"
            initial={{
              x: `${Math.random() * 100 - 50}%`,
              y: `${Math.random() * 100}%`,
              rotate: Math.random() * 360,
            }}
            animate={{
              y: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              x: [
                `${Math.random() * 100 - 50}%`,
                `${Math.random() * 100 - 50}%`,
                `${Math.random() * 100 - 50}%`,
              ],
              rotate: Math.random() * 720 - 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 20 + Math.random() * 15,
              ease: "easeInOut",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1135/1135434.png"
              alt=""
              className="h-10 md:h-14 lg:h-16 opacity-20 select-none pointer-events-none"
            />
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center pt-16">
        <div className="md:w-1/2 z-10 space-y-6 text-center md:text-left">
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
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
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
