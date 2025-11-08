import React, { useState } from "react";

const DELIVERY_FEE = 350;

const productOptions = [
  { value: "Classic Heat", label: "Classic Heat", description: "Signature Kochchi hot sauce", heat: "🔥 Medium", price: 1100 },
  { value: "Extreme Fire", label: "Extreme Fire", description: "Carolina reaper infusion", heat: "🔥🔥 Extra hot", price: 1300 },
  { value: "Garlic Fusion", label: "Garlic Fusion", description: "Roasted garlic & chili", heat: "🌶 Balanced", price: 1250 },
  { value: "Smoky Mango", label: "Smoky Mango", description: "Seasonal mango blaze", heat: "🔥 Tropical", price: 1450 },
  { value: "Other", label: "Custom blend", description: "Request a special batch", heat: "✨ Tell us what you need", price: 0 }
];

const paymentOptions = [
  { value: "COD", label: "Cash on Delivery", description: "Pay when the order arrives", accent: "border-green-500/60 bg-green-500/10" },
  { value: "VISA", label: "Visa / MasterCard", description: "Secure online payment", accent: "border-blue-500/60 bg-blue-500/10" },
  { value: "BANK", label: "Bank Transfer", description: "Pay via local bank deposit", accent: "border-amber-500/60 bg-amber-500/10" }
];

const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;

const createInitialForm = () => ({
  name: "",
  address: "",
  phone: "",
  product: productOptions[0].value,
  otherProduct: "",
  quantity: 1,
  paymentMethod: paymentOptions[0].value,
  notes: ""
});

const OrderNow = () => {
  const [form, setForm] = useState(() => createInitialForm());
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);

  const selectedProduct = productOptions.find((item) => item.value === form.product);
  const quantity = Number(form.quantity) || 0;
  const unitPrice = selectedProduct?.price ?? 0;
  const isCustomProduct = form.product === "Other";
  const subTotal = unitPrice * quantity;
  const deliveryFee = subTotal > 0 ? DELIVERY_FEE : 0;
  const total = subTotal + deliveryFee;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone.trim())) e.phone = "Please enter a valid phone number";
    if (!form.product) e.product = "Please choose a product";
    if (isCustomProduct && !form.otherProduct.trim()) e.otherProduct = "Let us know which blend you need";
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) e.quantity = "Quantity must be at least 1";
    if (!form.paymentMethod) e.paymentMethod = "Select a payment method";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "quantity" ? value.replace(/[^0-9]/g, "") : value }));
  };

  const handleRadioChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(createInitialForm());
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const productName = isCustomProduct ? form.otherProduct : selectedProduct?.label ?? form.product;
    const paymentLabel = paymentOptions.find((option) => option.value === form.paymentMethod)?.label ?? form.paymentMethod;

    setOrderSummary({
      name: form.name,
      address: form.address,
      phone: form.phone,
      product: productName,
      quantity,
      paymentMethod: paymentLabel,
      notes: form.notes,
      unitPrice,
      subTotal,
      deliveryFee,
      total
    });
    setSubmitted(true);
    // TODO: call backend API to place order
  };

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
                    <p className="flex justify-between"><span className="text-white/60">Product</span><span className="font-semibold text-white">{orderSummary.product}</span></p>
                    <p className="flex justify-between"><span className="text-white/60">Quantity</span><span className="font-semibold text-white">{orderSummary.quantity}</span></p>
                    <p className="flex justify-between"><span className="text-white/60">Payment</span><span className="font-semibold text-white">{orderSummary.paymentMethod}</span></p>
                    <p className="mt-4 flex justify-between text-sm text-white/60">Subtotal<span className="text-white/80">{orderSummary.subTotal ? formatCurrency(orderSummary.subTotal) : "To be confirmed"}</span></p>
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
                        rows={3}
                        placeholder="House number, street, city"
                        className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none"
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-300">{errors.address}</p>}
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

                    <div>
                      <label className="text-sm font-semibold text-white/80">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        min={1}
                        value={form.quantity}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none"
                      />
                      {errors.quantity && <p className="mt-1 text-sm text-red-300">{errors.quantity}</p>}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-white/80">Select your blend</label>
                      <span className="text-xs font-medium uppercase tracking-wide text-white/50">Step 1</span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {productOptions.map((option) => {
                        const active = form.product === option.value;
                        return (
                          <label
                            key={option.value}
                            className={`relative flex cursor-pointer flex-col rounded-2xl border ${active ? "border-red-500 bg-red-600/15" : "border-white/10 bg-white/5 hover:border-red-400/60"} p-4 transition`}
                          >
                            <input
                              type="radio"
                              name="product"
                              value={option.value}
                              className="sr-only"
                              onChange={() => handleRadioChange("product", option.value)}
                            />
                            <span className="flex items-center justify-between text-white">
                              <span className="text-base font-semibold">{option.label}</span>
                              {option.price ? <span className="text-sm text-white/70">{formatCurrency(option.price)}</span> : <span className="text-sm text-white/60">Custom quote</span>}
                            </span>
                            <span className="mt-2 text-sm text-white/60">{option.description}</span>
                            <span className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{option.heat}</span>
                            {active && <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-red-400" />}
                          </label>
                        );
                      })}
                    </div>
                    {isCustomProduct && (
                      <div className="mt-3">
                        <label className="text-xs font-medium uppercase tracking-wide text-white/60">Describe your custom blend</label>
                        <input
                          name="otherProduct"
                          value={form.otherProduct}
                          onChange={handleChange}
                          placeholder="Tell us the flavour profile you want"
                          className="mt-2 w-full rounded-2xl border border-dashed border-red-400/40 bg-red-500/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-red-300 focus:outline-none"
                        />
                        {errors.otherProduct && <p className="mt-1 text-sm text-red-300">{errors.otherProduct}</p>}
                      </div>
                    )}
                    {errors.product && <p className="mt-2 text-sm text-red-300">{errors.product}</p>}
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
                    className="w-full rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 py-4 text-lg font-semibold text-white shadow-lg shadow-red-900/40 transition hover:brightness-110"
                  >
                    Confirm order
                  </button>
                </form>
              )}
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-3xl border border-red-500/40 bg-red-600/15 p-6 text-white shadow-[0_20px_45px_-20px_rgba(248,113,113,0.6)]">
                  <h3 className="text-lg font-semibold">Order summary</h3>
                  <div className="mt-4 space-y-3 text-sm text-white/80">
                    <p className="flex justify-between"><span>Selected blend</span><span className="font-semibold text-white">{isCustomProduct ? (form.otherProduct || "Custom blend") : selectedProduct?.label}</span></p>
                    <p className="flex justify-between"><span>Unit price</span><span>{unitPrice ? formatCurrency(unitPrice) : "To be confirmed"}</span></p>
                    <p className="flex justify-between"><span>Quantity</span><span>{quantity || "-"}</span></p>
                    <p className="flex justify-between"><span>Subtotal</span><span>{subTotal ? formatCurrency(subTotal) : "-"}</span></p>
                    <p className="flex justify-between"><span>Delivery fee</span><span>{subTotal ? formatCurrency(deliveryFee) : "Calculated at confirmation"}</span></p>
                    <hr className="border-white/20" />
                    <p className="flex justify-between text-base font-semibold"><span>Total</span><span>{subTotal ? formatCurrency(total) : "We will confirm"}</span></p>
                  </div>
                </div>

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
