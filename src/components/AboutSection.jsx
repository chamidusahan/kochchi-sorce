import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutSection = () => {
  const navigate = useNavigate();

  const handleDiscoverMore = () => {
    navigate('/about');
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };
  return (
  <section id="about" className="py-20 bg-gradient-to-b from-black via-black to-red-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-red-500">Fiery</span> Story
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-lg shadow-xl shadow-red-900/20">
              <img
                src="/images/banner.jpg"
                alt="Nai Kochchi (Cobra Chili)"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white">Nai Kochchi</h3>
                <p className="text-red-300">The Cobra Chili</p>
              </div>
            </div>
           
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold">
              The Origins of <span className="text-lime-700">SPICE</span> <span className="text-red-500">UP</span>
            </h3>
            <p className="text-gray-300">
              Our journey began in the vibrant spice gardens of Sri Lanka, home to the legendary Nai Kochchi (Cobra Chili) – one of the world's most potent chilies with a perfect balance of heat and flavor.
            </p>

            <div className="flex items-start space-x-4">
              <div className="bg-red-900/30 p-3 rounded-full">
                <Flame className="text-red-500" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-xl">Authentic Sri Lankan Heat</h4>
                <p className="text-gray-300">
                  Our hot sauces capture the essence of traditional Sri Lankan flavor profiles, delivering an authentic experience with every drop.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-red-900/30 p-3 rounded-full">
                <Leaf className="text-red-500" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-xl">All-Natural Ingredients</h4>
                <p className="text-gray-300">
                  We use only hand-picked chilies and natural ingredients with no artificial preservatives or additives, ensuring a pure and intense flavor experience.
                </p>
              </div>
            </div>

            <motion.button
              className="relative inline-flex items-center space-x-2 font-bold text-red-500 transition-colors group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={handleDiscoverMore}
            >
              <span className="group-hover:text-red-400">Discover More</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
              <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-red-500 transition-transform duration-200 ease-out group-hover:scale-x-100" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
