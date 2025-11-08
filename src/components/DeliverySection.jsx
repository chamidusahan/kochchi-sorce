import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, Shield, Package } from 'lucide-react';

const deliveryFeatures = [
  {
    icon: <Truck size={32} className="text-red-500" />,
    title: 'Island-wide Shipping',
    description: 'We deliver our hot sauces to every corner of Sri Lanka',
  },
  {
    icon: <Clock size={32} className="text-red-500" />,
    title: 'Fast Delivery',
    description: 'Get your spicy fix within 24-48 hours of ordering',
  },
  {
    icon: <Shield size={32} className="text-red-500" />,
    title: 'Safe Packaging',
    description: 'Our bottles are securely packed to prevent any damage',
  },
  {
    icon: <Package size={32} className="text-red-500" />,
    title: 'Bulk Orders',
    description: 'Special packaging and discounts for bulk orders',
  },
];

const DeliverySection = () => {
  return (
    <section
      id="delivery"
  className="py-20 bg-gradient-to-b from-black via-black to-red-950 relative"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-red-500">Hot</span> Delivery Info
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-300">
            We ensure your spicy experience reaches you quickly and safely
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {deliveryFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl shadow-lg text-center hover:shadow-red-900/20 hover:shadow-xl transition-shadow"
            >
              <div className="bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 bg-gradient-to-r from-red-900/20 to-red-700/20 rounded-xl p-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Need Express Delivery?</h3>
              <p className="text-gray-300">
                Contact us directly for same-day delivery options in Colombo
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeliverySection;
