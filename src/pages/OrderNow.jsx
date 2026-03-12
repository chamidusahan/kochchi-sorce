import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const DELIVERY_FEE = 350;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://getspiceup.com';

const paymentOptions = [
  { value: "COD", label: "Cash on Delivery", description: "Pay when the order arrives", accent: "border-green-500/60 bg-green-500/10" },
  { value: "BT", label: "Bank Transfer", description: "Transfer to our Kochchi bank account", accent: "border-amber-500/60 bg-amber-500/10" },
  { value: "Card", label: "Visa / MasterCard", description: "Secure online payment", accent: "border-blue-500/60 bg-blue-500/10" }
];

const bankAccountDetails = {
  name: "MR L B I MADHUSHAN",
  number: "0089171693",
  bank: "Bank of Ceylon",
  branch: "Nattandiya Branch (50)",
};

const nextSteps = [
  "Transfer the total amount to the account listed below.",
  "Screenshot or scan your payment advice once the transfer completes.",
  "Upload the slip here or email it to payments@kochchi.lk with your order ID.",
];

const featureHighlights = [
  { title: "Micro-batched freshness", description: "Fresh sauces made in small runs every morning." },
  { title: "Island-wide cold chain", description: "Insulated packaging keeps every bottle stable en route." },
  { title: "Trusted payments", description: "Secure Visa, MasterCard, Maestro, and COD options." },
  { title: "Hotline support", description: "Dedicated hotline +94 70 123 4567 for urgent requests." },
];

const parseJsonSafe = async (response) => {
  const rawText = await response.text();
  if (!rawText) {
    return { data: null, rawText: '' };
  }
  try {
    return { data: JSON.parse(rawText), rawText };
  } catch (error) {
    return { data: null, rawText };
  }
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;

const createInitialForm = () => ({
  name: "",
  address: "",
  city: "",
  district: "",
  postalCode: "",
  phone: "",
  paymentMethod: paymentOptions[0].value,
});

const OrderNow = () => {
  const [form, setForm] = useState(() => createInitialForm());
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [slipFile, setSlipFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const { user, loading } = useAuth();
  const { items: cartItems, loading: cartLoading, updateItemQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartMessage, setCartMessage] = useState(null);
  const [cartActionProductId, setCartActionProductId] = useState(null);

  // Auto-fill address for returning users
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const fetchLatestAddress = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/backend/user/api/get-latest-address.php`, {
          credentials: 'include',
        });
        const { data } = await parseJsonSafe(res);
        if (res.ok && data?.success && data.data && isMounted) {
          setForm(prev => ({
            ...prev,
            address: data.data.address || '',
            city: data.data.city || '',
            district: data.data.district || '',
            postalCode: data.data.postalCode || '',
            phone: data.data.phone || prev.phone
          }));
        }
      } catch (e) {
        // ignore
      }
    };
    fetchLatestAddress();
    return () => { isMounted = false; };
  }, [user]);

  const resolvedCartItems = useMemo(() => {
    if (!Array.isArray(cartItems) || !cartItems.length) {
      return [];
    }
    return cartItems.map((item) => ({
      ...item,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 0,
    }));
  }, [cartItems]);

  useEffect(() => {
    if (!resolvedCartItems.length) {
      setCartMessage(null);
      setCartActionProductId(null);
    }
  }, [resolvedCartItems]);

  const cartSubTotal = resolvedCartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  const deliveryFee = cartSubTotal > 0 ? DELIVERY_FEE : 0;
  const total = cartSubTotal + deliveryFee;
  const canSubmit = !cartLoading && resolvedCartItems.length > 0 && (form.paymentMethod !== "BT" || (!!slipFile && !uploadError));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.district.trim()) e.district = "District is required";
    if (!/^[0-9]{5}$/.test(form.postalCode.trim())) e.postalCode = "Please enter a valid 5-digit postal code";
    if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone.trim())) e.phone = "Please enter a valid phone number";
    if (!resolvedCartItems.length) e.cart = "Please add at least one product before confirming your order.";
    if (!form.paymentMethod) e.paymentMethod = "Select a payment method";
    if (form.paymentMethod === "BT") {
      if (uploadError) e.paymentProof = uploadError;
      else if (!slipFile) e.paymentProof = "Upload the transfer slip to continue";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "paymentMethod" && value !== "BT") {
      setSlipFile(null);
      setUploadError("");
    }
  };

  const handleSlipChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSlipFile(null);
      setUploadError("");
      return;
    }

    const validSize = file.size <= 5 * 1024 * 1024;
    if (!validSize) {
      setSlipFile(null);
      setUploadError("File must be 5 MB or smaller");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setSlipFile(null);
      setUploadError("Upload JPEG, PNG, WEBP, or PDF only");
      return;
    }

    setSlipFile(file);
    setUploadError("");
  };

  const resetForm = () => {
    setForm(createInitialForm());
    setErrors({});
    setSlipFile(null);
    setUploadError("");
  };

  const handleReturnToProducts = () => {
    navigate('/', { state: { from: 'order', focus: 'products' } });
    setTimeout(() => {
      const section = document.getElementById('products');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  };

  const handleCartQuantityChange = async (item, delta) => {
    if (!item || cartLoading) {
      return;
    }
    const nextQuantity = item.quantity + delta;
    if (delta > 0 && item.stock && nextQuantity > item.stock) {
      setCartMessage(`Only ${item.stock} units available for ${item.name}.`);
      return;
    }

    setCartActionProductId(item.productId);
    setCartMessage(null);
    try {
      await updateItemQuantity(item.productId, nextQuantity, item.id);
    } catch (error) {
      setCartMessage(error.message || 'Unable to update cart right now.');
    } finally {
      setCartActionProductId(null);
    }
  };

  const handleRemoveFromCart = async (item) => {
    if (!item || cartLoading) {
      return;
    }
    setCartActionProductId(item.productId);
    setCartMessage(null);
    try {
      await removeItem(item.productId, item.id);
    } catch (error) {
      setCartMessage(error.message || 'Unable to remove this product from your cart.');
    } finally {
      setCartActionProductId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: location, cartItems: resolvedCartItems } });
      return;
    }
    if (!validate()) return;

    const paymentLabel = paymentOptions.find((option) => option.value === form.paymentMethod)?.label ?? form.paymentMethod;

    // Persist to backend (customer_orders)
    try {
      let paymentProof = null;
      if (form.paymentMethod === "BT" && slipFile) {
        // Encode slip once so the backend can store it without handling multipart uploads.
        paymentProof = await readFileAsDataUrl(slipFile);
      }

      const itemsPayload = resolvedCartItems.map((item) => {
        const rawProductId = item.productId ?? item.id;
        const productId = Number.parseInt(rawProductId, 10);
        const safePrice = Number(item.price) || 0;
        return {
          productId: Number.isNaN(productId) ? 0 : productId,
          sku: item.sku || '',
          quantity: item.quantity,
          price: safePrice,
          subtotal: safePrice * item.quantity,
        };
      });
      if (!itemsPayload.length) {
        throw new Error('No products selected for this order');
      }

      const summaryItems = resolvedCartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price) || 0,
        subtotal: (Number(item.price) || 0) * item.quantity,
      }));

      const payload = {
        totalAmount: total,
        paymentMethod: form.paymentMethod, // 'COD' | 'VISA' -> server maps to DB enum
        orderStatus: 'Pending',
        shippingPhone: form.phone,
        shippingAddress: form.address,
        city: form.city,
        district: form.district,
        postalCode: form.postalCode,
        items: itemsPayload,
        ...(paymentProof ? { paymentProof, paymentProofName: slipFile.name } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/backend/user/api/create-order.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const { data, rawText } = await parseJsonSafe(res);
      if (!res.ok || !data?.success) {
        const fallbackMessage = data?.message || rawText || 'Failed to place order';
        throw new Error(fallbackMessage);
      }

      await clearCart();

      setOrderSummary({
        name: form.name,
        address: form.address,
        phone: form.phone,
        paymentMethod: paymentLabel,
        subTotal: cartSubTotal,
        deliveryFee,
        total,
        items: summaryItems,
        orderId: data.orderId
      });
      setSlipFile(null);
      setUploadError("");
      setSubmitted(true);
    } catch (err) {
      console.error('Create order failed', err);
      alert(err.message || 'Failed to place order');
    }
  };

  if (loading) {
    return (
      <section id="order-now" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0d1117] to-red-950">
        <div className="flex flex-col items-center gap-4 text-white/80">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-red-600 border-t-transparent" />
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Checking session</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section id="order-now" className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-[#0d1117] to-red-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_10%,rgba(220,38,38,0.25),transparent_65%),radial-gradient(700px_480px_at_85%_85%,rgba(51,65,85,0.35),transparent_60%)]" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center text-white">
          <div className="max-w-xl space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-red-200">Hold up</p>
            <h1 className="text-3xl font-semibold">Please log in to place your order</h1>
            <p className="text-white/70">
              You need an account to confirm deliveries, track your order history, and unlock member-only drops.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => navigate("/login", { state: { from: location, cartItems: resolvedCartItems } })}
                className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-900/40 transition hover:brightness-110"
              >
                Go to login
              </button>
              <button
                onClick={() => navigate("/login", { state: { from: location, mode: "signup", cartItems: resolvedCartItems } })}
                className="w-full sm:w-auto rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white/80 backdrop-blur transition hover:text-white"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="order-now" className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-[#0d1117] to-red-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_10%,rgba(220,38,38,0.25),transparent_65%),radial-gradient(700px_480px_at_85%_85%,rgba(51,65,85,0.35),transparent_60%)]" />
      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-red-200">Same-day delivery within Colombo</p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white">Turn the heat up at home</h2>
            <p className="mt-2 text-base sm:text-lg text-white/70">Select your favourite Kochchi blend, confirm delivery details, and choose how you would like to pay.</p>
          </div>

          <div className="space-y-8">
            <div className="bg-black/70 border border-white/10 rounded-3xl shadow-[0_20px_45px_-20px_rgba(255,255,255,0.35)] p-6 sm:p-8 backdrop-blur">
              {submitted && orderSummary ? (
                <div className="space-y-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 border border-green-500/40 text-green-300 text-xl font-semibold">✓</div>
                  <h3 className="text-2xl font-semibold text-white">Order confirmed!</h3>
                  <p className="text-white/70">Thanks {orderSummary.name.split(" ")[0]}, we will call you within 10 minutes to finalise delivery.</p>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left text-sm text-white/80">
                    <div className="space-y-3">
                      {orderSummary.items && orderSummary.items.length ? (
                        orderSummary.items.map((item, idx) => (
                          <div key={`${item.name}-${idx}`} className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-semibold text-white">{item.name}</p>
                              <p className="text-xs text-white/60">{item.quantity} × {item.price ? formatCurrency(item.price) : "To be confirmed"}</p>
                            </div>
                            <span className="text-sm font-semibold text-white">{item.subtotal ? formatCurrency(item.subtotal) : "TBC"}</span>
                          </div>
                        ))
                      ) : (
                        <p>No products were recorded for this order.</p>
                      )}
                    </div>
                    <div className="my-4 h-px bg-white/10" />
                    <p className="flex justify-between"><span className="text-white/60">Payment</span><span className="font-semibold text-white">{orderSummary.paymentMethod}</span></p>
                    <p className="mt-3 flex justify-between text-sm text-white/60">Subtotal<span className="text-white/80">{orderSummary.subTotal ? formatCurrency(orderSummary.subTotal) : "To be confirmed"}</span></p>
                    <p className="flex justify-between text-sm text-white/60">Delivery fee<span className="text-white/80">{orderSummary.deliveryFee ? formatCurrency(orderSummary.deliveryFee) : "Included"}</span></p>
                    <p className="mt-2 flex justify-between text-base font-semibold text-white">Total<span>{orderSummary.total ? formatCurrency(orderSummary.total) : "We will confirm"}</span></p>
                  </div>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setOrderSummary(null);
                      resetForm();
                    }}
                    className="w-full rounded-xl bg-red-600 py-3 text-white font-semibold shadow-lg shadow-red-900/40 transition hover:bg-red-500"
                  >
                    Place another order
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                    <div className="space-y-8">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Step 1</p>
                            <h3 className="text-2xl font-semibold text-white">Delivery details</h3>
                          </div>
                          <span className="text-sm text-white/60">Tell us where to drop the heat</span>
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <label className="text-sm font-semibold text-white/80">Full name</label>
                            <input
                              name="name"
                              value={form.name}
                              onChange={handleChange}
                              placeholder="E.g. Chamidu Senanayake"
                              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-300">{errors.name}</p>}
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-sm font-semibold text-white/80">Delivery address</label>
                            <textarea
                              name="address"
                              value={form.address}
                              onChange={handleChange}
                              rows={2}
                              placeholder="House number, street name"
                              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-300">{errors.address}</p>}
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-white/80">City</label>
                            <input
                              name="city"
                              value={form.city}
                              onChange={handleChange}
                              placeholder="E.g. Colombo"
                              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none"
                            />
                            {errors.city && <p className="mt-1 text-sm text-red-300">{errors.city}</p>}
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-white/80">District</label>
                            <input
                              name="district"
                              value={form.district}
                              onChange={handleChange}
                              placeholder="E.g. Colombo"
                              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none"
                            />
                            {errors.district && <p className="mt-1 text-sm text-red-300">{errors.district}</p>}
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-white/80">Postal code</label>
                            <input
                              name="postalCode"
                              value={form.postalCode}
                              onChange={handleChange}
                              placeholder="E.g. 10100"
                              maxLength={5}
                              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none"
                            />
                            {errors.postalCode && <p className="mt-1 text-sm text-red-300">{errors.postalCode}</p>}
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-white/80">Phone number</label>
                            <input
                              type="tel"
                              name="phone"
                              value={form.phone}
                              onChange={handleChange}
                              placeholder="07X-XXXXXXX"
                              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-300">{errors.phone}</p>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5 sm:p-6">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">My cart</p>
                            <h3 className="text-lg font-semibold text-white">Selected blends</h3>
                          </div>
                          <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                            {resolvedCartItems.length} items
                          </span>
                        </div>
                        <div className="mt-4 space-y-3">
                          {cartLoading && (
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Updating your cart...</span>
                            </div>
                          )}
                          {resolvedCartItems.length ? (
                            resolvedCartItems.map((item) => {
                              const itemTotal = (Number(item.price) || 0) * item.quantity;
                              const isUpdating = cartLoading || cartActionProductId === item.productId;
                              const hasImage = Boolean(item.image);
                              const productInitial = (item.name || '?').charAt(0).toUpperCase();
                              return (
                                <div
                                  key={item.id || item.productId || item.name}
                                  className="rounded-3xl border border-white/10 bg-black/30 p-4 sm:p-5 space-y-4 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)]"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-white/10 bg-black/60 flex items-center justify-center overflow-hidden">
                                        {hasImage ? (
                                          <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-contain"
                                          />
                                        ) : (
                                          <span className="text-xl font-semibold text-white/70">{productInitial}</span>
                                        )}
                                      </div>
                                      <div>
                                            <p className="text-base font-semibold text-white">{item.name}</p>
                                            <p className="text-xs text-white/60">{item.quantity} × {item.price ? formatCurrency(item.price) : "Quote pending"}</p>
                                            {item.size && <p className="mt-1 text-xs text-white/50">Size: {item.size}</p>}
                                            {item.description && <p className="mt-1 text-xs text-white/50">{item.description}</p>}
                                            {item.stock ? (
                                              <p className="mt-1 text-xs text-white/40">{item.stock} in stock</p>
                                            ) : null}
                                      </div>
                                    </div>
                                    <span className="text-base font-semibold text-white">{item.quantity ? formatCurrency(itemTotal) : "-"}</span>
                                  </div>
                                  <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="inline-flex items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={() => handleCartQuantityChange(item, -1)}
                                        disabled={isUpdating || item.quantity <= 1}
                                        className={`rounded-full border border-white/15 p-2 text-white transition ${
                                          isUpdating || item.quantity <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:border-red-400'
                                        }`}
                                        aria-label="Decrease quantity"
                                      >
                                        <Minus size={16} />
                                      </button>
                                      <span className="min-w-[2.5rem] text-center text-sm font-semibold text-white">{item.quantity}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleCartQuantityChange(item, 1)}
                                        disabled={isUpdating || (item.stock && item.quantity >= item.stock)}
                                        className={`rounded-full border border-white/15 p-2 text-white transition ${
                                          isUpdating || (item.stock && item.quantity >= item.stock)
                                            ? 'opacity-40 cursor-not-allowed'
                                            : 'hover:border-red-400'
                                        }`}
                                        aria-label="Increase quantity"
                                      >
                                        <Plus size={16} />
                                      </button>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFromCart(item)}
                                      disabled={isUpdating}
                                      className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                                        isUpdating ? 'opacity-40 cursor-not-allowed' : 'hover:border-red-400'
                                      }`}
                                    >
                                      <Trash2 size={14} />
                                      <span>Remove</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="rounded-2xl border border-dashed border-white/25 bg-white/5 p-5 text-center text-white/70">
                              <p>Your bag is empty.</p>
                              <button
                                type="button"
                                onClick={handleReturnToProducts}
                                className="mt-3 inline-flex items-center justify-center rounded-full border border-red-500/60 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-200 transition hover:bg-red-500/20"
                              >
                                Browse products
                              </button>
                            </div>
                          )}
                        </div>
                        {cartMessage && (
                          <div className="mt-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-100">
                            {cartMessage}
                          </div>
                        )}
                        {errors.cart && <p className="mt-2 text-sm text-red-300">{errors.cart}</p>}
                      </div>

                      <div className="rounded-3xl border border-red-500/40 bg-red-600/15 p-5 text-white shadow-[0_20px_45px_-20px_rgba(248,113,113,0.6)]">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">At-a-glance</p>
                            <h3 className="text-lg font-semibold">Order summary</h3>
                          </div>
                          <span className="text-xs font-medium uppercase tracking-wide text-white/50">Updated live</span>
                        </div>
                        <div className="mt-4 space-y-4 text-sm text-white/80">
                          {resolvedCartItems.length ? (
                            resolvedCartItems.map((item) => {
                              const itemTotal = (Number(item.price) || 0) * item.quantity;
                              return (
                                <div key={`summary-${item.id || item.name}`} className="flex items-center justify-between gap-4">
                                  <div>
                                    <p className="font-semibold text-white">{item.name}</p>
                                    <p className="text-xs text-white/60">{item.quantity} × {item.price ? formatCurrency(item.price) : "Quote pending"}</p>
                                  </div>
                                  <span className="text-sm font-semibold text-white">{item.quantity ? formatCurrency(itemTotal) : "-"}</span>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-white/70">Add products to see your summary update instantly.</p>
                          )}
                          <hr className="border-white/20" />
                          <p className="flex justify-between"><span>Subtotal</span><span>{cartSubTotal ? formatCurrency(cartSubTotal) : "-"}</span></p>
                          <p className="flex justify-between"><span>Delivery fee</span><span>{cartSubTotal ? formatCurrency(deliveryFee) : "Calculated at confirmation"}</span></p>
                          <p className="flex justify-between text-base font-semibold"><span>Total</span><span>{cartSubTotal ? formatCurrency(total) : "We will confirm"}</span></p>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Step 2</p>
                            <h3 className="text-lg font-semibold text-white">Payment & proof</h3>
                          </div>
                          <span className="text-xs text-white/60">Choose how you settle</span>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          {paymentOptions.map((option) => {
                            const active = form.paymentMethod === option.value;
                            return (
                              <label
                                key={option.value}
                                className={`flex cursor-pointer flex-col gap-1 rounded-2xl border ${active ? option.accent : "border-white/10 bg-white/5 hover:border-red-400/40"} p-4 text-white transition`}
                              >
                                <input
                                  type="radio"
                                  name="paymentMethod"
                                  value={option.value}
                                  className="sr-only"
                                  onChange={() => handleRadioChange("paymentMethod", option.value)}
                                />
                                <span className="text-sm font-semibold">{option.label}</span>
                                <span className="text-xs text-white/70">{option.description}</span>
                                {active && <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/70">Selected</span>}
                              </label>
                            );
                          })}
                        </div>
                        {errors.paymentMethod && <p className="mt-2 text-sm text-red-300">{errors.paymentMethod}</p>}
                        {form.paymentMethod === "BT" && (
                          <div className="mt-5 space-y-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-white">
                            <div>
                              <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">Bank transfer details</p>
                              <div className="mt-3 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
                                <span>
                                  <span className="text-white/60">Account name:</span> {bankAccountDetails.name}
                                </span>
                                <span>
                                  <span className="text-white/60">Account number:</span> {bankAccountDetails.number}
                                </span>
                                <span>
                                  <span className="text-white/60">Bank:</span> {bankAccountDetails.bank}
                                </span>
                                <span>
                                  <span className="text-white/60">Branch:</span> {bankAccountDetails.branch}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">Next steps</p>
                              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
                                {nextSteps.map((step, idx) => (
                                  <li key={`bt-step-${idx}`}>{step}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-white/80">Upload transfer slip</label>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                onChange={handleSlipChange}
                                className="mt-2 w-full cursor-pointer rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500/90 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:border-amber-400/60"
                              />
                              {slipFile && <p className="mt-2 text-xs text-white/60">Selected file: {slipFile.name}</p>}
                              {(errors.paymentProof || uploadError) && (
                                <p className="mt-2 text-sm text-red-300">{errors.paymentProof || uploadError}</p>
                              )}
                            </div>
                          </div>
                        )}
                        <p className="mt-3 text-xs text-white/50">We support cash on delivery, Visa, MasterCard, and Maestro via our secure payment gateway.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`w-full rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 py-4 text-lg font-semibold text-white shadow-lg shadow-red-900/40 transition ${canSubmit ? 'hover:brightness-110' : 'opacity-40 cursor-not-allowed hover:brightness-100'}`}
                  >
                    Confirm order
                  </button>
                </form>
              )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {featureHighlights.map((feature, idx) => (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5 text-white shadow-[0_18px_40px_-28px_rgba(0,0,0,0.8)]"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">0{idx + 1}</span>
                    <h3 className="mt-3 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      
    </section>
  );
};

export default OrderNow;
