import React, { useState } from "react";

const OrderNow = () => {
  const [form, setForm] = useState({ name: "", address: "", phone: "", product: "SpiceUp", otherProduct: "", quantity: 1 });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone)) e.phone = "Please enter a valid phone number";
  if (!form.product || (form.product === "Other" && !form.otherProduct.trim())) e.product = "Please select a product or enter a name";
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) e.quantity = "Quantity must be at least 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    // TODO: call backend API to place order
  };

  return (
    <section id="order-now" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-red-950">
      <div className="w-full max-w-2xl bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Place Your Order</h2>

        {submitted ? (
          <div className="text-center text-green-600 font-semibold">
            Thank you! Your order has been received. We will contact you shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Delivery address</label>
              <input name="address" value={form.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select name="product" value={form.product} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option>Kochchi Source</option>
                
              </select>
              {form.product === "Other" && (
                <input name="otherProduct" value={form.otherProduct} onChange={handleChange} placeholder="Enter product name" className="mt-2 block w-full rounded-md border-gray-300 shadow-sm" />
              )}
              {errors.product && <p className="text-red-500 text-sm mt-1">{errors.product}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min={1} className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm" />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            <div className="sm:col-span-2">
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded">Place Order</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default OrderNow;
