import React from 'react';
import {
	Search,
	Plus,
	Layers,
	Edit,
	Trash2,
	AlertTriangle,
	Package,
	PackagePlus,
	X,
	ImagePlus
} from 'lucide-react';

const productSummary = [
	{ label: 'Live Products', value: '32', delta: '+2 this week', icon: Package, accent: 'text-red-400', border: 'border-red-700/60' },
	{ label: 'Drafts', value: '6', delta: 'Needs review', icon: Layers, accent: 'text-amber-300', border: 'border-amber-700/60' },
	{ label: 'Low Inventory', value: '4', delta: 'Restock soon', icon: AlertTriangle, accent: 'text-rose-300', border: 'border-red-700/60' },
];

const productList = [
	{
		id: 'PRD-001',
		name: 'Classic Heat',
		sku: 'CH-250',
		category: 'Hot Sauce',
		price: 1100,
		stock: 120,
		status: 'Active',
		updated: 'Nov 06, 2025',
		sales: 248,
		image: 'public/images/productinfo.jpg'
	},
	{
		id: 'PRD-002',
		name: 'Extreme Fire',
		sku: 'EF-200',
		category: 'Hot Sauce',
		price: 1300,
		stock: 42,
		status: 'Low Stock',
		updated: 'Nov 05, 2025',
		sales: 312,
		image: 'https://www.pngall.com/wp-content/uploads/5/Hot-Sauce-Bottle-Transparent.png'
	},
	{
		id: 'PRD-003',
		name: 'Garlic Fusion',
		sku: 'GF-250',
		category: 'Specialty',
		price: 1200,
		stock: 88,
		status: 'Active',
		updated: 'Nov 03, 2025',
		sales: 198,
		image: 'https://freepngimg.com/thumb/sauce/163764-sauce-hot-bottle-free-download-image.png'
	},
	{
		id: 'PRD-004',
		name: 'Smoky Mango Blaze',
		sku: 'MB-200',
		category: 'Limited',
		price: 1450,
		stock: 18,
		status: 'Draft',
		updated: 'Oct 31, 2025',
		sales: 64,
		image: 'https://i.ibb.co/4Mx57Yq/mango-sauce.png'
	},
	{
		id: 'PRD-005',
		name: 'Coconut Fire Relish',
		sku: 'CF-180',
		category: 'Condiment',
		price: 980,
		stock: 0,
		status: 'Low Stock',
		updated: 'Oct 27, 2025',
		sales: 142,
		image: 'https://i.ibb.co/QfmTnBT/coconut-sauce.png'
	}
];

const statusStyles = {
	Active: 'bg-green-700/25 text-green-300',
	Draft: 'bg-amber-700/25 text-amber-200',
	'Low Stock': 'bg-red-700/25 text-red-300',
	default: 'bg-gray-700/25 text-gray-300'
};

const ProductDetails = () => {
	const [showProductModal, setShowProductModal] = React.useState(false);
	const [showStockModal, setShowStockModal] = React.useState(false);
	const [productForm, setProductForm] = React.useState({
		name: '',
		sku: '',
		category: '',
		status: 'Draft',
		price: '',
		reorderPoint: '',
		restockTarget: '',
		currentStock: '',
		imageUrl: '',
		imageFile: null,
		imagePreview: '',
		description: ''
	});
	const [stockForm, setStockForm] = React.useState({
		productId: productList[0]?.id ?? '',
		changeType: 'IN',
		quantity: '',
		unitCost: '',
		reference: '',
		note: ''
	});

	const statusOptions = ['Active', 'Draft', 'Low Stock', 'Archived'];
	const changeTypes = [
		{ value: 'IN', label: 'Incoming stock' },
		{ value: 'OUT', label: 'Stock deduction' },
		{ value: 'ADJUST', label: 'Manual adjustment' }
	];

	const topProducts = productList.slice(0, 3);
	const productImageInputRef = React.useRef(null);

	const handleProductChange = (event) => {
		const { name, value } = event.target;
		if (name === 'price') {
			if (value === '.') {
				setProductForm((prev) => ({ ...prev, price: '0.' }));
				return;
			}
			if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
				setProductForm((prev) => ({ ...prev, price: value }));
			}
			return;
		}
		setProductForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleProductImageChange = (event) => {
		const file = event.target.files?.[0];
		if (!file) {
			if (productForm.imagePreview) {
				URL.revokeObjectURL(productForm.imagePreview);
			}
			setProductForm((prev) => ({ ...prev, imageFile: null, imagePreview: '' }));
			return;
		}
		if (productForm.imagePreview) {
			URL.revokeObjectURL(productForm.imagePreview);
		}
		const previewUrl = URL.createObjectURL(file);
		setProductForm((prev) => ({ ...prev, imageFile: file, imagePreview: previewUrl }));
	};

	React.useEffect(() => () => {
		if (productForm.imagePreview) {
			URL.revokeObjectURL(productForm.imagePreview);
		}
	}, [productForm.imagePreview]);

	const handleStockChange = (event) => {
		const { name, value } = event.target;
		setStockForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleProductSubmit = (event) => {
		event.preventDefault();
		// TODO: integrate with backend endpoint
	};

	const handleStockSubmit = (event) => {
		event.preventDefault();
		// TODO: integrate with backend endpoint
	};

	return (
		<div className="space-y-6">
			<section className="bg-black/80 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-800/50 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="w-full lg:max-w-xl flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
						<input
							type="text"
							placeholder="Search products, SKUs or tags..."
							className="w-full bg-gray-900/70 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/70"
						/>
					</div>
					<select
						className="bg-gray-900/70 border border-gray-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/70"
						style={{ backgroundColor: '#0f141c', color: '#fff' }}
					>
						<option value="" style={{ backgroundColor: '#0f141c', color: '#fff' }}>All categories</option>
						<option value="Hot Sauce" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Hot Sauce</option>
						<option value="Specialty" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Specialty</option>
						<option value="Limited" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Limited</option>
					</select>
				</div>
				<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center justify-end">
					<button
						onClick={() => {
							setShowProductModal(true);
						}}
						className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-xl transition"
					>
						<Plus size={18} />
						<span>Add Product</span>
					</button>
					<button
						onClick={() => {
							setShowStockModal(true);
						}}
						className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-4 py-3 rounded-xl transition border border-white/10 backdrop-blur-sm"
					>
						<PackagePlus size={18} />
						<span>Update Stock</span>
					</button>
				</div>
			</section>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{productSummary.map(({ label, value, delta, icon: Icon, accent, border }) => (
					<div key={label} className={`bg-gradient-to-br from-black/80 to-[#131822] border ${border} rounded-2xl p-5 shadow-lg flex flex-col gap-3`}>
						<span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-600/10 ${accent}`}>
							<Icon size={20} />
						</span>
						<div className="text-2xl font-bold text-white">{value}</div>
						<p className="text-sm text-white/70">{label}</p>
						<span className="text-xs text-white/50">{delta}</span>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<section className="xl:col-span-2 bg-black/80 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-800/50">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
						<h2 className="text-base md:text-lg font-bold text-white">Inventory</h2>
						<div className="flex flex-wrap gap-2">
							<button className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 text-xs font-semibold">All</button>
							<button className="px-3 py-1.5 rounded-lg bg-gray-800/80 text-white/70 text-xs">Live</button>
							<button className="px-3 py-1.5 rounded-lg bg-gray-800/80 text-white/70 text-xs">Draft</button>
							<button className="px-3 py-1.5 rounded-lg bg-gray-800/80 text-white/70 text-xs">Low stock</button>
						</div>
					</div>
					<div className="overflow-x-auto -mx-4 md:mx-0">
						<table className="min-w-full text-left text-sm text-white/90">
							<thead>
								<tr className="border-b border-gray-800/60 text-white/60">
									<th className="py-3 px-4 font-medium">Product</th>
									<th className="py-3 px-4 font-medium">Category</th>
									<th className="py-3 px-4 font-medium">Price</th>
									<th className="py-3 px-4 font-medium">Stock</th>
									<th className="py-3 px-4 font-medium">Status</th>
									<th className="py-3 px-4 font-medium">Updated</th>
									<th className="py-3 px-4 font-medium text-right">Actions</th>
								</tr>
							</thead>
							<tbody>
								{productList.map((product) => {
									const badgeStyle = statusStyles[product.status] ?? statusStyles.default;
									return (
										<tr key={product.id} className="border-b border-gray-800/40 last:border-none">
											<td className="py-3 px-4">
												<div className="flex items-center gap-3">
													<img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-900/70 border border-gray-800" />
													<div>
														<p className="font-semibold text-white">{product.name}</p>
														<span className="text-xs text-white/50">{product.sku}</span>
													</div>
												</div>
											</td>
											<td className="py-3 px-4 text-white/70">{product.category}</td>
											<td className="py-3 px-4 text-white">Rs. {product.price.toLocaleString()}</td>
											<td className="py-3 px-4 text-white/80">{product.stock > 0 ? product.stock : '—'}</td>
											<td className="py-3 px-4">
												<span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
													{product.status}
												</span>
											</td>
											<td className="py-3 px-4 text-white/60">{product.updated}</td>
											<td className="py-3 px-4">
												<div className="flex justify-end gap-2">
													<button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-1">
														<Edit size={14} />
														<span>Edit</span>
													</button>
													<button className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs flex items-center gap-1">
														<Trash2 size={14} />
														<span>Delete</span>
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</section>

				<aside className="bg-black/80 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-800/50 space-y-5">
					<h2 className="text-base md:text-lg font-bold text-white">Top performers</h2>
					<ul className="space-y-4">
						{topProducts.map((product) => (
							<li key={`${product.id}-highlight`} className="flex items-center gap-3">
								<img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover bg-gray-900/70 border border-gray-800" />
								<div className="flex-1">
									<p className="font-semibold text-white text-sm">{product.name}</p>
									<p className="text-xs text-white/50">{product.category}</p>
								</div>
								<span className="text-sm font-semibold text-white/90">{product.sales} sold</span>
							</li>
						))}
					</ul>
					<div className="bg-red-600/15 rounded-xl p-4 border border-red-700/40 text-white/80 text-sm">
						Keep your catalogue fresh by updating photos, prices, and stock weekly.
					</div>
				</aside>
			</div>

			{showProductModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/70 backdrop-blur-md">
					<div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f141c] p-6 sm:p-8 text-white shadow-[0_20px_45px_-20px_rgba(255,255,255,0.45)] overflow-y-auto max-h-[90vh]">
						<div className="flex items-start justify-between gap-4 mb-6">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-300">Create product</p>
								<h3 className="mt-2 text-2xl font-semibold">Add a new catalogue item</h3>
								<p className="mt-1 text-sm text-white/60">Define pricing, availability, and stock thresholds for automatic alerts.</p>
							</div>
							<button
								onClick={() => setShowProductModal(false)}
								className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white hover:border-white/30 transition"
							>
								<X size={18} />
							</button>
						</div>

						<form className="space-y-6" onSubmit={handleProductSubmit}>
							<div className="grid gap-4 sm:grid-cols-2">
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Product name</span>
									<input
										name="name"
										value={productForm.name}
										onChange={handleProductChange}
										placeholder="Classic Heat"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
										required
									/>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">SKU</span>
									<input
										name="sku"
										value={productForm.sku}
										onChange={handleProductChange}
										placeholder="CH-250"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
										required
									/>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Category</span>
									<input
										name="category"
										value={productForm.category}
										onChange={handleProductChange}
										placeholder="Hot Sauce"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
										required
									/>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Status</span>
									<select
										name="status"
										value={productForm.status}
										onChange={handleProductChange}
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
										style={{ backgroundColor: '#0f141c', color: '#fff' }}
									>
										{statusOptions.map((option) => (
											<option key={option} value={option} style={{ backgroundColor: '#0f141c', color: '#fff' }}>{option}</option>
										))}
									</select>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Price (Rs)</span>
									<input
										name="price"
										type="text"
										inputMode="decimal"
										value={productForm.price}
										onChange={handleProductChange}
										placeholder="1100"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
										required
									/>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Current stock</span>
									<input
										name="currentStock"
										type="number"
										min="0"
										value={productForm.currentStock}
										onChange={handleProductChange}
										placeholder="0"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
									/>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Reorder point</span>
									<input
										name="reorderPoint"
										type="number"
										min="0"
										value={productForm.reorderPoint}
										onChange={handleProductChange}
										placeholder="10"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
									/>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Restock target</span>
									<input
										name="restockTarget"
										type="number"
										min="0"
										value={productForm.restockTarget}
										onChange={handleProductChange}
										placeholder="120"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
									/>
								</label>
								<label className="flex flex-col text-sm text-white/70 sm:col-span-2">
									<span className="font-semibold text-white/80">Product image</span>
									<div className="mt-2 flex flex-col gap-3 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4">
										<input
											type="file"
											accept="image/*"
											ref={productImageInputRef}
											onChange={handleProductImageChange}
											className="hidden"
										/>
										<button
											type="button"
											onClick={() => productImageInputRef.current?.click()}
											className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/15 transition"
										>
											<ImagePlus size={16} />
											<span>Select image from device</span>
										</button>
										{productForm.imagePreview ? (
											<div className="flex items-center gap-3">
												<img src={productForm.imagePreview} alt="Preview" className="h-20 w-20 rounded-xl object-cover border border-white/20" />
												<span className="text-xs text-white/60">{productForm.imageFile?.name}</span>
											</div>
										) : (
											<p className="text-xs text-white/50">PNG or JPG, up to 5 MB. You can also paste a hosted image URL below.</p>
										)}
									</div>
								</label>

								
							</div>

							<label className="flex flex-col text-sm text-white/70">
								<span className="font-semibold text-white/80">Description</span>
								<textarea
									name="description"
									value={productForm.description}
									onChange={handleProductChange}
									rows={4}
									placeholder="Tell customers why this blend is special"
									className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
								/>
							</label>

							<div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
								<button
									type="button"
									onClick={() => setShowProductModal(false)}
									className="w-full sm:w-auto rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/70 hover:text-white"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 hover:brightness-110"
								>
									Save product
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{showStockModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/70 backdrop-blur-md">
					<div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111722] p-6 sm:p-8 text-white shadow-[0_20px_45px_-20px_rgba(255,255,255,0.45)] overflow-y-auto max-h-[90vh]">
						<div className="flex items-start justify-between gap-4 mb-6">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">Adjust stock</p>
								<h3 className="mt-2 text-2xl font-semibold">Log an inventory movement</h3>
								<p className="mt-1 text-sm text-white/60">Record restocks, deductions, or manual corrections for full audit trails.</p>
							</div>
							<button
								onClick={() => setShowStockModal(false)}
								className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white hover:border-white/30 transition"
							>
								<X size={18} />
							</button>
						</div>

						<form className="space-y-6" onSubmit={handleStockSubmit}>
							<label className="flex flex-col text-sm text-white/70">
								<span className="font-semibold text-white/80">Product</span>
								<select
									name="productId"
									value={stockForm.productId}
									onChange={handleStockChange}
									className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
									style={{ backgroundColor: '#111722', color: '#fff' }}
									required
								>
									{productList.map((product) => (
										<option key={product.id} value={product.id} style={{ backgroundColor: '#111722', color: '#fff' }}>
											{product.name} ({product.sku})
										</option>
									))}
								</select>
							</label>

							<div className="grid gap-4 sm:grid-cols-2">
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Movement type</span>
									<div className="mt-2 grid gap-2">
										{changeTypes.map(({ value, label }) => {
											const active = stockForm.changeType === value;
											return (
												<label
													key={value}
													className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${active ? 'border-red-500 bg-red-600/15' : 'border-white/10 bg-white/5 hover:border-red-400/40'}`}
												>
													<input
														type="radio"
														name="changeType"
														value={value}
														className="sr-only"
														onChange={handleStockChange}
													/>
													<span>{label}</span>
												</label>
											);
										})}
									</div>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Quantity</span>
									<input
										name="quantity"
										type="number"
										min="1"
										value={stockForm.quantity}
										onChange={handleStockChange}
										placeholder="24"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
										required
									/>
								</label>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Reference</span>
									<input
										name="reference"
										value={stockForm.reference}
										onChange={handleStockChange}
										placeholder="PO-2025-11-09"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
									/>
								</label>
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80">Unit cost (Rs)</span>
									<input
										name="unitCost"
										type="number"
										min="0"
										value={stockForm.unitCost}
										onChange={handleStockChange}
										placeholder="450"
										className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
									/>
								</label>
							</div>

							<label className="flex flex-col text-sm text-white/70">
								<span className="font-semibold text-white/80">Notes</span>
								<textarea
									name="note"
									value={stockForm.note}
									onChange={handleStockChange}
									rows={3}
									placeholder="Batch #2025-11 restock"
									className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
								/>
							</label>

							<div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
								<button
									type="button"
									onClick={() => setShowStockModal(false)}
									className="w-full sm:w-auto rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/70 hover:text-white"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 hover:brightness-110"
								>
									Log stock change
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductDetails;
