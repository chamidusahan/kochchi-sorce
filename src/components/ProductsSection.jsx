
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Red Chili Sauce',
    size: '250ml',
    price: 1150,
    image: 'public/images/productinfo.jpg',
    description: 'Our signature hot sauce with the perfect balance of heat and flavor',
  },
  {
    id: 2,
    name: 'Green Chillie Blast',
    size: '250ml',
    price: 1100,
    image: 'public/images/2.png',
    description: 'For the brave souls who crave intense heat with every drop',
  },
  {
    id: 3,
    name: 'Garlic Fusion',
    size: '250ml',
    price: 1200,
    image: 'https://freepngimg.com/thumb/sauce/163764-sauce-hot-bottle-free-download-image.png',
    description: 'A perfect blend of garlic and chili for a flavor explosion',
  },
];

const ProductCard = ({ product, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true, amount: 0.2 }}
    className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl shadow-lg relative overflow-hidden group"
  >
    <div className="absolute -right-20 -top-20 w-40 h-40 bg-red-600/10 rounded-full"></div>
    <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-red-600/5 rounded-full"></div>
    <div className="relative z-10">
      <div className="h-56 flex justify-center items-center mb-4">
        <motion.img
          src={product.image}
          alt={product.name}
          className="h-full object-contain"
          whileHover={{
            rotate: [0, -5, 5, -5, 5, 0],
            transition: { duration: 0.5 },
          }}
        />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
      <p className="text-gray-400 mb-4">{product.description}</p>
      <div className="flex justify-between items-end">
        <div>
          <span className="text-sm text-gray-400">{product.size}</span>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-white">Rs. {product.price}</span>
          </div>
        </div>
      </div>
    </div>
    <motion.div
      className="absolute -top-2 -right-2 bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center rotate-12 z-20 shadow-lg"
      initial={{ rotate: 12 }}
      whileHover={{ rotate: -12, scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="text-center text-black font-bold">
        <div className="text-xs">BEST</div>
        <div className="text-sm">SELLER</div>
      </div>
    </motion.div>
  </motion.div>
);

const ProductsSection = () => {
  const navigate = useNavigate();
  
  return (
  <section id="products" className="py-20 bg-gradient-to-b from-black via-black to-red-950 relative">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-10"></div>
    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Our <span className="text-red-500">Fiery</span> Products
        </h2>
        <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
        <p className="max-w-2xl mx-auto text-gray-300">
          Choose your level of heat and experience the authentic flavors of Sri Lanka in every bottle.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="flex justify-center mt-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/order')}
          className="bg-gradient-to-r from-red-600 to-red-500 hover:brightness-110 text-white px-8 py-4 rounded-xl flex items-center space-x-3 transition shadow-lg shadow-red-900/40 text-lg font-semibold"
        >
          <ShoppingCart size={22} />
          <span>Order Now</span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.2 }}
        className="mt-16 bg-gradient-to-r from-red-900/20 to-red-700/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between"
      >
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="bg-red-600/20 p-3 rounded-full">
            <Truck className="text-red-500" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-xl text-white">Free Delivery</h4>
            <p className="text-gray-400">On orders over Rs. 3000</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <ShoppingCart size={18} />
          <span>View All Products</span>
        </motion.button>
      </motion.div>
    </div>
  </section>
);
};

export default ProductsSection;
