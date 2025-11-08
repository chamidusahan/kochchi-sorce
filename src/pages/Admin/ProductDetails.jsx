import React from 'react';
import {
	Search,
	Plus,
	Layers,
	Edit,
	Trash2,
	AlertTriangle,
	Package
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
	const topProducts = productList.slice(0, 3);

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
					<select className="bg-gray-900/70 border border-gray-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/70">
						<option value="">All categories</option>
						<option value="Hot Sauce">Hot Sauce</option>
						<option value="Specialty">Specialty</option>
						<option value="Limited">Limited</option>
					</select>
				</div>
				<button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-xl transition">
					<Plus size={18} />
					<span>Add Product</span>
				</button>
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
		</div>
	);
};

export default ProductDetails;
