import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CHILI_VARIANTS = ["/images/rc.png", "/images/gc.png"];

const HeroSection = () => {
  const navigate = useNavigate();

  // Precompute chili animation data once so each item keeps its own path
  const floatingChilies = useMemo(() => {
    const totalChilies = 15;
    const gridColumns = 5;
    const gridBaseY = 68;
    const gridSpacingY = 6;
    const gridOffsetX = 16;
    const gridSpacingX = 14;

    return Array.from({ length: totalChilies }).map((_, index) => {
      const sprite = CHILI_VARIANTS[index % CHILI_VARIANTS.length];
      const column = index % gridColumns;
      const row = Math.floor(index / gridColumns);
      const endX = gridOffsetX + column * gridSpacingX + (Math.random() * 2 - 1);
      const endY = gridBaseY + row * gridSpacingY + Math.random() * 1.5;
      const startOffset = Math.random() * 12 - 6;
      const startX = Math.min(92, Math.max(8, endX + startOffset));
      const midX = endX + (Math.random() * 6 - 3);
      const midY = 42 + Math.random() * 6;
      const duration = 7 + Math.random() * 3;
      const delay = Math.random() * 3;
      const size = 36 + Math.random() * 14;
      const startScale = 0.8 + Math.random() * 0.4;
      const startRot = -12 + Math.random() * 24;
      const midRot = -6 + Math.random() * 12;

      return {
        key: `hero-chili-${index}`,
        sprite,
        startX,
        midX,
        midY,
        endX,
        endY,
        duration,
        delay,
        size,
        startScale,
        startRot,
        midRot,
        flip: Math.random() > 0.5,
      };
    });
  }, []);

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-black via-black to-red-950"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="hero-chili-field">
          {floatingChilies.map((chili) => (
            <div
              key={chili.key}
              className={`hero-chili${chili.flip ? " hero-chili--flip" : ""}`}
              style={{
                "--start-x": `${chili.startX}`,
                "--mid-x": `${chili.midX}`,
                "--mid-y": `${chili.midY}`,
                "--end-x": `${chili.endX}`,
                "--end-y": `${chili.endY}`,
                "--start-scale": `${chili.startScale}`,
                "--start-rot": `${chili.startRot}`,
                "--mid-rot": `${chili.midRot}`,
                width: `${chili.size}px`,
                animationDuration: `${chili.duration}s`,
                animationDelay: `${chili.delay}s`,
              }}
            >
              <img src={chili.sprite} alt="" loading="lazy" />
            </div>
          ))}
        </div>
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
            <span className="inline-block">
              <span className="text-lime-600">SPICE</span>{" "}
              <span className="text-red-500">UP</span>
            </span>
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
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
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
            className="relative w-72 h-80 md:w-[26rem] md:h-[30rem] md:translate-y-6"
          >
            <img
              src="/images/product1.png"
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
