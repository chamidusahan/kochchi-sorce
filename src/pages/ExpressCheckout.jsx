import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Minus, Plus, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ensureAbsoluteBackendUrl, mapActiveProducts } from '../utils/productUtils';

const DELIVERY_FEE = 350;

const paymentOptions = [
  { value: 'COD', label: 'Cash on Delivery', description: 'Pay when the order arrives', accent: 'border-green-500/60 bg-green-500/10' },
  { value: 'BT', label: 'Bank Transfer', description: 'Transfer to our Kochchi bank account', accent: 'border-amber-500/60 bg-amber-500/10' },
  { value: 'Card', label: 'Visa / MasterCard', description: 'Secure online payment', accent: 'border-blue-500/60 bg-blue-500/10' }
];

const bankAccountDetails = {
  name: 'MR L B I MADHUSHAN',
  number: '0089171693',
  bank: 'Bank of Ceylon',
  branch: 'Nattandiya Branch (50)'
};

const nextSteps = [
  'Transfer the total amount to the account listed below.',
  'Screenshot or scan your payment advice once the transfer completes.',
  'Upload the slip here or email it to payments@kochchi.lk with your order ID.'
];

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

const createInitialForm = () => ({
  name: '',
  address: '',
  city: '',
  district: '',
  postalCode: '',
  phone: '',
  paymentMethod: paymentOptions[0].value
});

const ExpressCheckout = () => {
  const { productId: routeProductId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const stateProduct = location.state?.product;
  const stateQuantity = Number(location.state?.quantity) || 1;

  const [product, setProduct] = useState(() => {
    if (stateProduct && (!routeProductId || `${stateProduct.id}` === `${routeProductId}`)) {
      return stateProduct;
    }
    return null;
  });
  const [quantity, setQuantity] = useState(() => (stateQuantity > 0 ? stateQuantity : 1));
  const [fetchingProduct, setFetchingProduct] = useState(() => !stateProduct && Boolean(routeProductId));
  const [fetchError, setFetchError] = useState('');

  const [form, setForm] = useState(() => createInitialForm());
  const [errors, setErrors] = useState({});
  const [slipFile, setSlipFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    if (stateProduct && (!routeProductId || `${stateProduct.id}` === `${routeProductId}`)) {
      setProduct(stateProduct);
    }
  }, [stateProduct, routeProductId]);

  useEffect(() => {
    if (stateQuantity > 0) {
      setQuantity(stateQuantity);
    }
  }, [stateQuantity]);

  useEffect(() => {
    if (!user) {
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const latestAddressEndpoint = ensureAbsoluteBackendUrl('/backend/user/api/get-latest-address.php');
        const res = await fetch(latestAddressEndpoint, {
          credentials: 'include'
        });
        const data = await res.json();
        if (mounted && data?.success && data.data) {
          setForm((prev) => ({
            ...prev,
            address: data.data.address || prev.address,
            city: data.data.city || prev.city,
            district: data.data.district || prev.district,
            postalCode: data.data.postalCode || prev.postalCode,
            phone: data.data.phone || prev.phone
          }));
        }
      } catch (err) {
        // ignore optional autofill failure
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!routeProductId || (product && `${product.id}` === `${routeProductId}`)) {
      setFetchingProduct(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const loadProduct = async () => {
      setFetchingProduct(true);
      setFetchError('');
      try {
        const endpoint = ensureAbsoluteBackendUrl('/backend/admin/api/get-products.php');
        const response = await fetch(endpoint, { signal: controller.signal });
        const payload = await response.json();
        if (!response.ok || !payload.success) {
          throw new Error(payload.message || 'Failed to load product');
        }
        const normalized = mapActiveProducts(payload.data || []);
        const match = normalized.find((item) => `${item.id}` === `${routeProductId}`) || null;
        if (!cancelled) {
          if (!match) {
            setFetchError('That product is no longer available for express checkout.');
          }
          setProduct(match);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        if (!cancelled) {
          setFetchError('Unable to load product details right now.');
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setFetchingProduct(false);
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [routeProductId, product]);

  useEffect(() => {
    setQuantity((prev) => {
      if (!product) {
        return prev;
      }
      const max = product.stock > 0 ? product.stock : prev;
      return Math.min(Math.max(prev, 1), max);
    });
  }, [product]);

  const canPurchase = Boolean(product && product.stock > 0);
  const subtotal = product ? (Number(product.price) || 0) * quantity : 0;
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  const paymentLabel = paymentOptions.find((option) => option.value === form.paymentMethod)?.label ?? form.paymentMethod;
  const canSubmit = canPurchase && (!submitting) && (form.paymentMethod !== 'BT' || (!!slipFile && !uploadError));

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value) => {
    setForm((prev) => ({ ...prev, paymentMethod: value }));
    if (value !== 'BT') {
      setSlipFile(null);
      setUploadError('');
    }
  };

  const handleSlipChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSlipFile(null);
      setUploadError('');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSlipFile(null);
      setUploadError('File must be 5 MB or smaller');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setSlipFile(null);
      setUploadError('Upload JPEG, PNG, WEBP, or PDF only');
      return;
    }

    setSlipFile(file);
    setUploadError('');
  };

  const validate = () => {
    const validationErrors = {};
    if (!form.name.trim()) validationErrors.name = 'Name is required';
    if (!form.address.trim()) validationErrors.address = 'Address is required';
    if (!form.city.trim()) validationErrors.city = 'City is required';
    if (!form.district.trim()) validationErrors.district = 'District is required';
    if (!/^[0-9]{5}$/.test(form.postalCode.trim())) validationErrors.postalCode = 'Enter a valid 5-digit postal code';
    if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone.trim())) validationErrors.phone = 'Enter a valid phone number';
    if (!product || !canPurchase) validationErrors.product = 'This product is not available right now';
    if (form.paymentMethod === 'BT') {
      if (uploadError) validationErrors.paymentProof = uploadError;
      else if (!slipFile) validationErrors.paymentProof = 'Upload the transfer slip to continue';
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const resetForm = () => {
    setForm(createInitialForm());
    setErrors({});
    setSlipFile(null);
    setUploadError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: location, product, quantity } });
      return;
    }
    if (!validate()) {
      return;
    }
    if (!product || !canPurchase) {
      return;
    }

    setSubmitting(true);
    try {
      let paymentProof = null;
      if (form.paymentMethod === 'BT' && slipFile) {
        paymentProof = await readFileAsDataUrl(slipFile);
      }

      const itemsPayload = [{
        productId: Number(product.id) || 0,
        sku: product.sku || '',
        quantity,
        price: Number(product.price) || 0,
        subtotal
      }];

      const payload = {
        totalAmount: total,
        paymentMethod: form.paymentMethod,
        orderStatus: 'Pending',
        shippingPhone: form.phone,
        shippingAddress: form.address,
        city: form.city,
        district: form.district,
        postalCode: form.postalCode,
        items: itemsPayload,
        ...(paymentProof ? { paymentProof, paymentProofName: slipFile?.name || 'payment-slip' } : {})
      };

      const createOrderEndpoint = ensureAbsoluteBackendUrl('backend/user/api/create-order.php');
      const res = await fetch(createOrderEndpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || 'Failed to place order');
      }

      const productSnapshot = {
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        image: product.image,
      };

      setOrderSummary({
        name: form.name,
        address: form.address,
        phone: form.phone,
        paymentMethod: paymentLabel,
        subTotal: subtotal,
        deliveryFee,
        total,
        quantity,
        product: productSnapshot,
        orderId: data.orderId
      });
      resetForm();
      setQuantity(1);
    } catch (err) {
      alert(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4 text-white/80">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-red-600 border-t-transparent" />
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Checking session</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-[#0d1117] to-red-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_10%,rgba(220,38,38,0.25),transparent_65%),radial-gradient(700px_480px_at_85%_85%,rgba(51,65,85,0.35),transparent_60%)]" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center text-white">
          <div className="max-w-xl space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-red-200">Express checkout</p>
            <h1 className="text-3xl font-semibold">Sign in to complete your order</h1>
            <p className="text-white/70">
              Log in to keep your contact details synced and check where your express deliveries stand.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => navigate('/login', { state: { from: location, product, quantity } })}
                className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-900/40 transition hover:brightness-110"
              >
                Go to login
              </button>
              <button
                onClick={() => navigate('/login', { state: { from: location, product, quantity, mode: 'signup' } })}
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

  if (fetchingProduct) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-red-400" />
          <p className="text-sm text-white/70">Loading selected product...</p>
        </div>
      </section>
    );
  }

  if (fetchError || !product) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-black to-red-950 text-white px-6 text-center">
        <p className="text-lg text-red-200 mb-4">{fetchError || 'No product selected for express checkout.'}</p>
        <button
          onClick={() => navigate('/')}
          className="rounded-full border border-red-500/60 bg-red-500/10 px-6 py-2 text-sm uppercase tracking-wide text-red-200 hover:bg-red-500/20"
        >
          Browse products
        </button>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-[#0d1117] to-red-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_15%,rgba(220,38,38,0.25),transparent_65%),radial-gradient(600px_480px_at_90%_90%,rgba(51,65,85,0.35),transparent_60%)]" />
      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-red-200">Express checkout</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white">Finish your {product.name} order</h1>
            </div>
            <button
              onClick={() => navigate(`/products/${product.id}`, { state: { product } })}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-red-400"
            >
              <ArrowLeft size={16} /> Back to product
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="h-28 w-28 rounded-2xl bg-black/40 flex items-center justify-center overflow-hidden border border-white/10">
                  <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-sm text-white/70">{product.category || 'Signature blend'}</p>
                  <p className="text-sm text-white/70 mt-1">SKU: {product.sku || 'N/A'}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Price</span>
                  <span className="text-lg font-semibold text-white">LKR {Number(product.price).toLocaleString('en-US')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Stock</span>
                  <span>{product.stock > 0 ? `${product.stock} bottles available` : 'Out of stock'}</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-white/60">Quantity</p>
                <div className="mt-3 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={`w-11 h-11 rounded-2xl border border-white/15 text-white text-xl font-semibold transition inline-flex items-center justify-center ${
                      quantity <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:border-red-400'
                    }`}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-3xl font-bold text-white min-w-[3rem] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={!canPurchase || (product.stock > 0 && quantity >= product.stock)}
                    className={`w-11 h-11 rounded-2xl border border-white/15 text-white text-xl font-semibold transition inline-flex items-center justify-center ${
                      !canPurchase || (product.stock > 0 && quantity >= product.stock)
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:border-red-400'
                    }`}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/80 space-y-2">
                <p className="flex justify-between"><span>Subtotal</span><span>LKR {subtotal.toLocaleString('en-US')}</span></p>
                <p className="flex justify-between"><span>Delivery</span><span>{subtotal ? `LKR ${deliveryFee.toLocaleString('en-US')}` : 'Pending'}</span></p>
                <p className="flex justify-between text-base font-semibold text-white"><span>Total</span><span>{subtotal ? `LKR ${total.toLocaleString('en-US')}` : 'Pending'}</span></p>
              </div>
            </div>

            <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
              {orderSummary ? (
                <div className="space-y-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 border border-green-500/40 text-green-300 text-xl font-semibold">✓</div>
                  <h3 className="text-2xl font-semibold">Order confirmed!</h3>
                  <p className="text-white/70">Thanks {orderSummary.name.split(' ')[0]}, our courier team will contact you within 10 minutes.</p>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left text-sm text-white/80 space-y-3">
                    <p className="flex items-center justify-between"><span className="text-white">{orderSummary.product.name}</span><span>{orderSummary.quantity} × LKR {Number(orderSummary.product.price).toLocaleString('en-US')}</span></p>
                    <p className="flex justify-between"><span>Subtotal</span><span>{orderSummary.subTotal ? `LKR ${orderSummary.subTotal.toLocaleString('en-US')}` : 'Pending'}</span></p>
                    <p className="flex justify-between"><span>Delivery</span><span>{orderSummary.deliveryFee ? `LKR ${orderSummary.deliveryFee.toLocaleString('en-US')}` : 'Included'}</span></p>
                    <p className="flex justify-between text-base font-semibold"><span>Total</span><span>{orderSummary.total ? `LKR ${orderSummary.total.toLocaleString('en-US')}` : 'We will confirm'}</span></p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                      onClick={() => {
                        setOrderSummary(null);
                        resetForm();
                      }}
                      className="rounded-2xl bg-red-600 px-6 py-3 text-white font-semibold shadow-lg shadow-red-900/40 hover:bg-red-500"
                    >
                      Place another express order
                    </button>
                    <button
                      onClick={() => navigate('/order')}
                      className="rounded-2xl border border-white/20 bg-transparent px-6 py-3 text-white/80 hover:text-white"
                    >
                      View my cart
                    </button>
                  </div>
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
                      <label className="text-sm font-semibold text-white/80">Payment method</label>
                      <span className="text-xs font-medium uppercase tracking-wide text-white/50">Choose one</span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {paymentOptions.map((option) => {
                        const active = form.paymentMethod === option.value;
                        return (
                          <label
                            key={option.value}
                            className={`flex cursor-pointer flex-col gap-1 rounded-2xl border ${active ? option.accent : 'border-white/10 bg-white/5 hover:border-red-400/40'} p-4 text-white transition`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={option.value}
                              className="sr-only"
                              onChange={() => handleRadioChange(option.value)}
                            />
                            <span className="text-sm font-semibold">{option.label}</span>
                            <span className="text-xs text-white/70">{option.description}</span>
                            {active && <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/70">Selected</span>}
                          </label>
                        );
                      })}
                    </div>
                    {form.paymentMethod === 'BT' && (
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
                    {errors.paymentMethod && <p className="mt-2 text-sm text-red-300">{errors.paymentMethod}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`w-full rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 py-4 text-lg font-semibold text-white shadow-lg shadow-red-900/40 transition ${canSubmit ? 'hover:brightness-110' : 'opacity-40 cursor-not-allowed hover:brightness-100'}`}
                  >
                    {submitting ? 'Placing your order...' : 'Confirm express order'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpressCheckout;
