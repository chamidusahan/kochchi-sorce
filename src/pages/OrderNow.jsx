import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const DELIVERY_FEE = 350;

const paymentOptions = [
  { value: "COD", label: "Cash on Delivery", description: "Pay when the order arrives", accent: "border-green-500/60 bg-green-500/10" },
  { value: "VISA", label: "Visa / MasterCard", description: "Secure online payment", accent: "border-blue-500/60 bg-blue-500/10" }
];

const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;

const normalizeCartItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && Number(item.quantity) > 0)
    .map((item) => ({
      id: item.id ?? item.value ?? item.productId ?? `custom-${item.name}`,
      name: item.name ?? item.label ?? "Selected blend",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 0,
      size: item.size ?? item.volume ?? "",
      description: item.description ?? "",
      sku: item.sku ?? "",
    }));
};

const extractCartItems = (state) => {
  if (!state) return [];
  if (Array.isArray(state.cartItems)) return state.cartItems;
  if (state.cartItems) return state.cartItems;
  if (state.from && typeof state.from === 'object' && state.from.state) {
    return extractCartItems(state.from.state);
  }
  return [];
};

const createInitialForm = () => ({
  name: "",
  address: "",
  city: "",
  district: "",
  postalCode: "",
  phone: "",
  paymentMethod: paymentOptions[0].value,
  notes: ""
});

const OrderNow = () => {
  const [form, setForm] = useState(() => createInitialForm());
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState(() => normalizeCartItems(extractCartItems(location.state)));

  // Fetch products from existing backend endpoint
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch('http://localhost/backend/admin/api/get-products.php');
        const data = await res.json();
        if (data?.success && Array.isArray(data.data)) {
          const mapped = data.data
            .filter(p => String(p.status || '').toLowerCase() !== 'inactive')
            .map(p => ({
              value: String(p.id),
              label: p.name,
              description: p.category || '',
              heat: '',
              price: Number(p.price) || 0,
              stock: typeof p.stock !== 'undefined' ? Number(p.stock) || 0 : 0,
              sku: p.sku || '',
            }));
          if (isMounted) {
            setDbProducts(mapped);
          }
        }
      } catch (e) {
        console.error('Failed to load products', e);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setCartItems(normalizeCartItems(extractCartItems(location.state)));
  }, [location.state]);

  // Auto-fill address for returning users
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const fetchLatestAddress = async () => {
      try {
        const res = await fetch('http://localhost/backend/user/api/get-latest-address.php', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data?.success && data.data && isMounted) {
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
    if (!cartItems.length) return [];
    return cartItems.map((item) => {
      const match = dbProducts.find((p) => p.value === String(item.id) || p.label === item.name);
      return {
        ...item,
        id: match?.value ?? item.id,
        price: typeof match?.price === 'number' && !Number.isNaN(match.price) ? match.price : item.price,
        sku: match?.sku ?? item.sku ?? "",
        stock: match?.stock,
      };
    });
  }, [cartItems, dbProducts]);

  const cartSubTotal = resolvedCartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  const deliveryFee = cartSubTotal > 0 ? DELIVERY_FEE : 0;
  const total = cartSubTotal + deliveryFee;
  const canSubmit = resolvedCartItems.length > 0;

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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(createInitialForm());
    setErrors({});
    setCartItems([]);
  };

  const handleReturnToProducts = () => {
    navigate('/', { state: { from: 'order', focus: 'products' } });
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
      const itemsPayload = resolvedCartItems.map((item) => {
        const productId = Number.parseInt(item.id, 10);
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

      const payload = {
        totalAmount: total,
        paymentMethod: form.paymentMethod, // 'COD' | 'VISA' -> server maps to DB enum
        paymentStatus: 'Pending',
        shippingPhone: form.phone,
        shippingAddress: form.address,
        city: form.city,
        district: form.district,
        postalCode: form.postalCode,
        items: itemsPayload
      };

      const res = await fetch('http://localhost/backend/user/api/create-order.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || 'Failed to place order');
      }

      setOrderSummary({
        name: form.name,
        address: form.address,
        phone: form.phone,
        paymentMethod: paymentLabel,
        notes: form.notes,
        subTotal: cartSubTotal,
        deliveryFee,
        total,
        items: resolvedCartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price) || 0,
          subtotal: (Number(item.price) || 0) * item.quantity,
        })),
        orderId: data.orderId
      });
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

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 bg-black/70 border border-white/10 rounded-3xl shadow-[0_20px_45px_-20px_rgba(255,255,255,0.35)] p-6 sm:p-8 backdrop-blur">
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
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid gap-4 sm:grid-cols-2">
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

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-white/80">Selected blends</label>
                      <span className="text-xs font-medium uppercase tracking-wide text-white/50">From cart</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {resolvedCartItems.length ? (
                        resolvedCartItems.map((item) => {
                          const itemTotal = (Number(item.price) || 0) * item.quantity;
                          return (
                            <div
                              key={item.id || item.name}
                              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                            >
                              <div>
                                <p className="text-base font-semibold text-white">{item.name}</p>
                                <p className="text-xs text-white/60">{item.quantity} × {item.price ? formatCurrency(item.price) : "Quote pending"}</p>
                                {item.size && <p className="mt-1 text-xs text-white/50">Size: {item.size}</p>}
                                {item.description && <p className="mt-1 text-xs text-white/50">{item.description}</p>}
                              </div>
                              <span className="text-sm font-semibold text-white">{item.quantity ? formatCurrency(itemTotal) : "-"}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="rounded-2xl border border-dashed border-white/25 bg-white/5 p-5 text-center text-white/70">
                          <p>No products selected yet.</p>
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
                    {errors.cart && <p className="mt-2 text-sm text-red-300">{errors.cart}</p>}
                  </div>

                  <div className="rounded-3xl border border-red-500/40 bg-red-600/15 p-5 text-white shadow-[0_20px_45px_-20px_rgba(248,113,113,0.6)]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Order summary</h3>
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

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-white/80">Payment method</label>
                      <span className="text-xs font-medium uppercase tracking-wide text-white/50">Step 2</span>
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
                    <p className="mt-3 text-xs text-white/50">We support cash on delivery, Visa, MasterCard, and Maestro via our secure payment gateway.</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-white/80">Delivery notes (optional)</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Share gate codes, preferred delivery time, or special instructions"
                      className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none"
                    />
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

              <div className="lg:col-span-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
                  <h3 className="text-lg font-semibold">Why Kochchi delivery?</h3>
                  <ul className="mt-4 space-y-3 text-sm text-white/70">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-red-400" />
                      <span>Fresh sauces made in micro batches every morning.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-red-400" />
                      <span>Island-wide delivery with insulated packaging.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-red-400" />
                      <span>Secure payments powered by Visa, MasterCard, and Maestro.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-red-400" />
                      <span>Dedicated hotline +94 70 123 4567 for urgent requests.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </section>
  );
};

export default OrderNow;
