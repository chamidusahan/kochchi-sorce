import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Package, Calendar, CreditCard, Phone, MapPin, Clock } from "lucide-react";

const MyOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("backend/user/api/get-my-orders.php", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        throw new Error(data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const res = await fetch("backend/user/api/cancel-order.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });

      const data = await res.json();
      if (data.success) {
        // Refresh orders list
        fetchOrders();
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const formatCurrency = (amount) => `Rs. ${parseFloat(amount).toLocaleString()}`;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-amber-700/25 text-amber-200 border-amber-500/40",
      Preparing: "bg-blue-700/25 text-blue-200 border-blue-500/40",
      "Out For Delivery": "bg-purple-700/25 text-purple-200 border-purple-500/40",
      Delivered: "bg-green-700/25 text-green-300 border-green-500/40",
      Cancelled: "bg-red-700/25 text-red-200 border-red-500/40",
      Confirmed: "bg-amber-700/25 text-amber-200 border-amber-500/40"
    };
    return styles[status] || "bg-gray-700/25 text-gray-300 border-gray-500/40";
  };

  const canCancelOrder = (status) => {
    const cancellableStatuses = ["Pending", "Preparing", "Confirmed"];
    return cancellableStatuses.includes(status);
  };

  const getPaymentBadge = (method) => {
    const styles = {
      COD: "bg-green-600/20 text-green-300",
      Online: "bg-blue-600/20 text-blue-300",
    };
    return styles[method] || "bg-gray-600/20 text-gray-300";
  };

  if (authLoading || loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0d1117] to-red-950">
        <div className="flex flex-col items-center gap-4 text-white/80">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent" />
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Loading your orders</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-[#0d1117] to-red-950 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-red-200 mb-4">
            Your Account
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-white/70">Track your Kochchi deliveries and order history</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-900/30 border border-red-500/50 text-red-200">
            <p className="font-semibold">Error loading orders</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm font-semibold transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Orders List */}
        {!error && orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4">
              <Package size={32} className="text-white/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
            <p className="text-white/60 mb-6">Start your Kochchi journey by placing your first order!</p>
            <button
              onClick={() => navigate("/order")}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:brightness-110 text-white font-semibold rounded-2xl shadow-lg shadow-red-900/40 transition"
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-black/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-[0_20px_45px_-20px_rgba(255,255,255,0.35)] hover:border-red-500/40 transition-colors"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">Order #{order.orderId}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                            order.orderStatus
                          )}`}
                      >
                        {order.orderStatus}
                      </span>
                      {order.trackingNumber && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-600/20 text-cyan-200 border border-cyan-400/40">
                          Tracking #{order.trackingNumber}
                        </span>
                      )}
                      {canCancelOrder(order.orderStatus) && (
                        <button
                          onClick={() => cancelOrder(order.orderId)}
                          className="px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-semibold transition-colors border border-red-500/40"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Calendar size={14} />
                      <span>{formatDate(order.orderDate)}</span>
                      <Clock size={14} className="ml-2" />
                      <span>{formatTime(order.orderDate)}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-white/60 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-red-400">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Payment Method */}
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 rounded-lg bg-white/5">
                      <CreditCard size={18} className="text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/50 mb-1">Payment Method</p>
                      <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getPaymentBadge(order.paymentMethod)}`}>
                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 rounded-lg bg-white/5">
                      <Phone size={18} className="text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/50 mb-1">Contact</p>
                      <p className="text-sm text-white font-medium">{order.shippingPhone}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="mt-1 p-2 rounded-lg bg-white/5">
                      <MapPin size={18} className="text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/50 mb-1">Delivery Address</p>
                      <p className="text-sm text-white/80">{order.shippingAddress}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="sm:col-span-2 mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs uppercase tracking-wider text-white/50 mb-3">Order Items</p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-white">{item.productName}</p>
                              <p className="text-xs text-white/50">{item.category || item.sku}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-white/80">Qty: {item.quantity}</p>
                              <p className="text-xs text-white/60">{formatCurrency(item.price)} each</p>
                            </div>
                            <div className="ml-4 text-right">
                              <p className="text-sm font-semibold text-red-400">{formatCurrency(item.subtotal)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyOrders;
