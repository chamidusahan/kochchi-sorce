import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Flame } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-black to-red-950">
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
                src="public\images\banner.jpg"
                alt="Nai Kochchi (Cobra Chili)"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white">Nai Kochchi</h3>
                <p className="text-red-300">The Cobra Chili</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-red-600 w-24 h-24 rounded-full flex items-center justify-center rotate-12 shadow-lg">
              <div className="text-center">
                <div className="font-bold text-xl">100%</div>
                <div className="text-sm">Natural</div>
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
              The Origins of <span className="text-red-500">Spice Up</span>
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

            <motion.div
              className="inline-block relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <a
                href="#products"
                className="inline-flex items-center space-x-2 font-bold text-red-500 group-hover:text-red-400 transition-colors"
              >
                <span>Discover our products</span>
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
                  className="transform group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
