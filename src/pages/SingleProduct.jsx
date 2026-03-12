import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, CreditCard, ShoppingCart } from 'lucide-react';
import {
  ensureAbsoluteBackendUrl,
  mapActiveProducts,
} from '../utils/productUtils';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://getspiceup.com';

const SingleProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [products, setProducts] = useState(location.state?.allProducts || []);
  const [product, setProduct] = useState(() => {
    const viaState = location.state?.product;
    if (viaState && `${viaState.id}` === `${productId}`) {
      return viaState;
    }

    const fromList = (location.state?.allProducts || []).find(
      (item) => `${item.id}` === `${productId}`,
    );
    return fromList || null;
  });
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(!product);
  const [fetchError, setFetchError] = useState('');
  const [cartNotice, setCartNotice] = useState(null);
  const [cartBusy, setCartBusy] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  useEffect(() => {
    if (location.state?.allProducts?.length) {
      setProducts(location.state.allProducts);
    }

    if (location.state?.product && `${location.state.product.id}` === `${productId}`) {
      setProduct(location.state.product);
      setLoading(false);
      setFetchError('');
    }
  }, [location.state, productId]);

  useEffect(() => {
    if (!productId || !products.length) {
      return;
    }

    const localMatch = products.find((item) => `${item.id}` === `${productId}`);
    if (!localMatch) {
      return;
    }

    setProduct((current) => {
      if (current && `${current.id}` === `${localMatch.id}`) {
        return current;
      }
      return localMatch;
    });
    setFetchError('');
    setLoading(false);
  }, [productId, products]);

  useEffect(() => {
    const hasProducts = products.length > 0;
    const hasMatchingProduct = products.some((item) => `${item.id}` === `${productId}`);

    if (hasProducts && hasMatchingProduct) {
      return;
    }

    const controller = new AbortController();

    const loadProducts = async () => {
      setLoading(true);
      setFetchError('');

      try {
        const endpoint = ensureAbsoluteBackendUrl(`${API_BASE_URL}/backend/admin/api/get-products.php`);
        const response = await fetch(endpoint, { signal: controller.signal });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || 'Failed to load product');
        }

        const normalized = mapActiveProducts(payload.data || []);
        setProducts(normalized);

        const matched = normalized.find((item) => `${item.id}` === `${productId}`) || null;
        setProduct(matched || normalized[0] || null);

        if (!matched && normalized.length) {
          setFetchError('We could not find that product. Showing another fiery blend instead.');
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        console.error('Failed to load product', error);
        setFetchError('Unable to load product information right now. Please try again soon.');
        setProduct(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => controller.abort();
  }, [productId, products]);

  const highlightBullets = useMemo(() => {
    if (!product) {
      return [];
    }

    const statements = [
      `${product.category || 'Signature blend'} crafted in small batches for peak freshness.`,
      'Slow-fermented to unlock deep smoky flavor with layered heat.',
      'Pairs perfectly with kottu, grilled meats, and plant-based bowls.',
    ];

    if (product.stock > 0) {
      statements.push(`${product.stock} bottles ready to ship within 48 hours.`);
    }

    if (product.sku) {
      statements.push(`Catalog reference ${product.sku} keeps reorders effortless.`);
    }

    return statements;
  }, [product]);

  const otherProducts = useMemo(
    () => products.filter((item) => `${item.id}` !== `${product?.id}`).slice(0, 3),
    [products, product],
  );

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    setQuantity(1);
    setCartNotice(null);
  }, [product?.id]);

  const canPurchase = Boolean(product && product.stock > 0);

  const handleQuantityChange = (delta) => {
    if (!product) {
      return;
    }

    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) {
        return 1;
      }

      if (product.stock > 0 && next > product.stock) {
        return product.stock;
      }

      return next;
    });
  };

  const requireAuthRedirect = () => {
    navigate('/login', {
      state: {
        from: location,
        focusProduct: product,
      },
    });
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) {
      return;
    }
    if (!user) {
      requireAuthRedirect();
      return;
    }

    setCartBusy(true);
    setCartNotice(null);
    try {
      await addItem(product.id, quantity);
      setCartNotice({ type: 'success', text: `${product.name} added to your cart.` });
    } catch (error) {
      setCartNotice({ type: 'error', text: error.message || 'Could not add this product to your cart.' });
    } finally {
      setCartBusy(false);
    }
  };

  const handleCheckout = () => {
    if (!product || product.stock <= 0) {
      return;
    }
    if (!user) {
      requireAuthRedirect();
      return;
    }

    navigate(`/checkout/${product.id}`, {
      state: {
        product,
        quantity,
      },
    });
  };

  const handleSelectOtherProduct = (item) => {
    navigate(`/products/${item.id}`, {
      state: {
        product: item,
        allProducts: products,
      },
    });
  };

  const formattedPrice = product ? product.price.toLocaleString('en-US') : '0';

  return (
    <section className="py-16 bg-gradient-to-b from-black via-black to-red-950 min-h-screen relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-10" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition mb-8"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={18} />
          <span>Back to catalog</span>
        </motion.button>

        {loading && (
          <div className="text-center text-gray-400 py-16">Loading product...</div>
        )}

        {!loading && fetchError && (
          <div className="mb-6 text-red-300 bg-red-900/30 border border-red-600/40 rounded-lg px-4 py-3">
            {fetchError}
          </div>
        )}

        {!loading && product && (
          <>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-2xl max-w-lg w-full mx-auto"
              >
                <div className="h-72 md:h-80 flex items-center justify-center">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="max-h-64 md:max-h-72 object-contain"
                    whileHover={{ rotate: [0, -3, 3, -3, 0], scale: 1.02 }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="space-y-6"
              >
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs text-red-400">Fiery Blend</p>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">{product.name}</h1>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {product.description}
                </p>
                <ul className="space-y-3">
                  {highlightBullets.map((bullet) => (
                    <li key={bullet} className="flex items-start space-x-3 text-gray-300">
                      <CheckCircle2 className="text-red-400 mt-0.5" size={18} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <div className="text-sm uppercase tracking-widest text-gray-400">Price</div>
                    <div className="text-4xl font-bold text-white">LKR {formattedPrice}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {product.stock > 0 ? `${product.stock} bottles in stock` : 'Currently out of stock'}
                    </div>
                    <div className="mt-4">
                      <div className="text-sm uppercase tracking-widest text-gray-400">Quantity</div>
                      <div className="flex items-center gap-4 mt-2">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                          className={`w-12 h-12 rounded-2xl border border-gray-700 text-white text-2xl font-semibold transition ${
                            quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:border-red-500'
                          }`}
                        >
                          -
                        </button>
                        <span className="text-3xl font-bold text-white min-w-[3rem] text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(1)}
                          disabled={!canPurchase || (product.stock > 0 && quantity >= product.stock)}
                          className={`w-12 h-12 rounded-2xl border border-gray-700 text-white text-2xl font-semibold transition ${
                            !canPurchase || (product.stock > 0 && quantity >= product.stock)
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:border-red-500'
                          }`}
                        >
                          +
                        </button>
                      </div>
                      {cartNotice && (
                        <div
                          className={`mt-3 rounded-2xl border px-4 py-3 text-sm ${
                            cartNotice.type === 'error'
                              ? 'border-red-600/40 bg-red-900/40 text-red-100'
                              : 'border-green-500/40 bg-green-900/30 text-green-100'
                          }`}
                        >
                          {cartNotice.text}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 w-full md:w-auto">
                    <motion.button
                      type="button"
                      onClick={handleAddToCart}
                      whileHover={{ scale: canPurchase && !cartBusy ? 1.05 : 1 }}
                      whileTap={{ scale: canPurchase && !cartBusy ? 0.95 : 1 }}
                      disabled={!canPurchase || cartBusy}
                      className={`inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-red-900/40 ${
                        !canPurchase || cartBusy ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ShoppingCart size={20} />
                      <span>Add to Cart</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleCheckout}
                      whileHover={{ scale: canPurchase && !cartBusy ? 1.05 : 1 }}
                      whileTap={{ scale: canPurchase && !cartBusy ? 0.95 : 1 }}
                      disabled={!canPurchase || cartBusy}
                      className={`inline-flex items-center justify-center space-x-3 bg-gray-900/70 border border-red-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-red-900/25 ${
                        !canPurchase || cartBusy ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <CreditCard size={20} />
                      <span>Checkout Now</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>

            {otherProducts.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Explore other heat levels</h2>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-sm uppercase tracking-widest text-red-400 hover:text-white transition"
                  >
                    View all blends
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherProducts.map((item) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectOtherProduct(item)}
                      whileHover={{ y: -6 }}
                      className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4 text-left flex items-center space-x-4 hover:border-red-600 transition"
                    >
                      <div className="w-20 h-20 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
                        <img src={item.image} alt={item.name} className="h-full object-contain" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="text-sm text-gray-400">LKR {item.price.toLocaleString('en-US')}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && !product && !fetchError && (
          <div className="text-center text-gray-300 py-16">No product details available.</div>
        )}
      </div>
    </section>
  );
};

export default SingleProduct;
