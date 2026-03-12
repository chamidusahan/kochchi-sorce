import React from 'react';
import { ensureAbsoluteBackendUrl, buildProductImageUrl } from '../utils/productUtils';
import { useAuth } from './AuthContext.jsx';

const CartContext = React.createContext({
  items: [],
  loading: false,
  ready: false,
  error: null,
  refreshCart: async () => [],
  addItem: async () => {},
  updateItemQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://getspiceup.com';

const CART_ENDPOINTS = {
  list: `${API_BASE_URL}/backend/user/api/get-cart.php`,
  add: `${API_BASE_URL}/backend/user/api/add-to-cart.php`,
  update: `${API_BASE_URL}/backend/user/api/update-cart-item.php`,
  remove: `${API_BASE_URL}/backend/user/api/delete-cart-item.php`,
  clear: `${API_BASE_URL}/backend/user/api/clear-cart.php`,
};

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState(null);

  const authenticatedFetch = React.useCallback(async (path, options = {}) => {
    const endpoint = ensureAbsoluteBackendUrl(path);
    const response = await fetch(endpoint, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });

    let data = null;
    try {
      data = await response.json();
    } catch (err) {
      // ignore JSON parse errors for empty responses
    }

    if (!response.ok || (data && data.success === false)) {
      const message = (data && data.message) || 'Cart request failed.';
      const error = new Error(message);
      error.status = response.status;
      error.payload = data;
      throw error;
    }

    return data || {};
  }, []);

  const hydrateCartItems = React.useCallback((payload) => {
    if (!Array.isArray(payload)) {
      return [];
    }

    return payload.map((item) => ({
      ...item,
      image: buildProductImageUrl(item.image || item.image_url || ''),
    }));
  }, []);

  const syncCart = React.useCallback((payload) => {
    setItems(hydrateCartItems(payload));
  }, [hydrateCartItems]);

  const refreshCart = React.useCallback(async () => {
    if (!user) {
      syncCart([]);
      setReady(true);
      return [];
    }

    setLoading(true);
    try {
      const data = await authenticatedFetch(CART_ENDPOINTS.list);
      syncCart(data.cart);
      setError(null);
      setReady(true);
      return Array.isArray(data.cart) ? data.cart : [];
    } catch (err) {
      setError(err.message || 'Failed to load cart');
      setReady(true);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, authenticatedFetch, syncCart]);

  React.useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user) {
      syncCart([]);
      setReady(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setReady(false);
    setLoading(true);

    (async () => {
      try {
        const data = await authenticatedFetch(CART_ENDPOINTS.list);
        if (!cancelled) {
          syncCart(data.cart);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load cart');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, authenticatedFetch, syncCart]);

  const addItem = React.useCallback(
    async (productId, quantity = 1) => {
      if (!user) {
        throw new Error('Please sign in to add items to your cart.');
      }
      const data = await authenticatedFetch(CART_ENDPOINTS.add, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
      syncCart(data.cart);
      setError(null);
      return data;
    },
    [user, authenticatedFetch, syncCart]
  );

  const removeItem = React.useCallback(
    async (productId, cartId = null) => {
      if (!user) {
        throw new Error('Please sign in to update your cart.');
      }
      const data = await authenticatedFetch(CART_ENDPOINTS.remove, {
        method: 'DELETE',
        body: JSON.stringify({ productId, cartId }),
      });
      syncCart(data.cart);
      setError(null);
      return data;
    },
    [user, authenticatedFetch, syncCart]
  );

  const updateItemQuantity = React.useCallback(
    async (productId, quantity, cartId = null) => {
      if (!user) {
        throw new Error('Please sign in to update your cart.');
      }
      if (quantity <= 0) {
        return removeItem(productId, cartId);
      }
      const data = await authenticatedFetch(CART_ENDPOINTS.update, {
        method: 'PATCH',
        body: JSON.stringify({ productId, cartId, quantity }),
      });
      syncCart(data.cart);
      setError(null);
      return data;
    },
    [user, authenticatedFetch, syncCart, removeItem]
  );

  const clearCart = React.useCallback(async () => {
    if (!user) {
      syncCart([]);
      return [];
    }
    const data = await authenticatedFetch(CART_ENDPOINTS.clear, {
      method: 'DELETE',
    });
    syncCart([]);
    setError(null);
    return data.cart || [];
  }, [user, authenticatedFetch, syncCart]);

  const value = React.useMemo(
    () => ({
      items,
      loading,
      ready,
      error,
      refreshCart,
      addItem,
      updateItemQuantity,
      removeItem,
      clearCart,
    }),
    [items, loading, ready, error, refreshCart, addItem, updateItemQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => React.useContext(CartContext);
