import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ensureAbsoluteBackendUrl,
  mapActiveProducts,
} from '../utils/productUtils';

const ProductCard = ({ product, index, onSelect }) => {
  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;

  return (
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
            {product.category && (
              <span className="text-sm text-gray-400">{product.category}</span>
            )}
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold text-white">LKR. {product.price.toLocaleString('en-US')}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
            </div>
          </div>
          <motion.button
            type="button"
            onClick={onSelect}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-red-600/20 text-red-200 hover:bg-red-600 hover:text-white px-4 py-2 rounded-full transition"
          >
            <span>View Details</span>
            <ArrowRight size={16} />
          </motion.button>
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
};

const ProductsSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setLoading(true);
      setFetchError('');

      try {
        const endpoint = ensureAbsoluteBackendUrl('/backend/admin/api/get-products.php');
        const response = await fetch(endpoint, {
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || 'Failed to load products');
        }

        setProducts(mapActiveProducts(payload.data || []));
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        console.error('Failed to load products', error);
        setProducts([]);
        setFetchError('Unable to load products right now. Please try again soon.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => controller.abort();
  }, []);

  const showProducts = !loading && !fetchError && products.length > 0;

  const handleSelectProduct = (product) => {
    navigate(`/products/${product.id}`, {
      state: {
        product,
        allProducts: products,
      },
    });
  };
  
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
          {loading && (
            <div className="col-span-full text-center text-gray-400">Loading products...</div>
          )}
          {fetchError && !loading && (
            <div className="col-span-full text-center text-red-400">{fetchError}</div>
          )}
          {showProducts &&
            products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onSelect={() => handleSelectProduct(product)}
              />
            ))}
          {!loading && !fetchError && products.length === 0 && (
            <div className="col-span-full text-center text-gray-400">No products available.</div>
          )}
        </div>

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
              <h4 className="font-bold text-xl text-white">Fast Delivery</h4>
              <p className="text-gray-400">Islandwide dispatch within 48 hours</p>
            </div>
          </div>
         
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
