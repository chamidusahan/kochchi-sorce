import React from 'react';
import {
	Search,
	Download,
	Eye,
	Package,
	Clock,
	CheckCircle,
	XCircle,
	TrendingUp,
	DollarSign,
	ShoppingBag,
	FileText,
	Plus,
	X,
	Trash2
} from 'lucide-react';

// Available products for quick bill
const availableProducts = [
	{ id: 1, name: 'Classic Heat', sku: 'CH-250', price: 1100 },
	{ id: 2, name: 'Extreme Fire', sku: 'EF-200', price: 1300 },
	{ id: 3, name: 'Garlic Fusion', sku: 'GF-250', price: 1200 },
	{ id: 4, name: 'Smoky Mango Blaze', sku: 'MB-200', price: 1450 },
	{ id: 5, name: 'Coconut Fire Relish', sku: 'CF-180', price: 980 },
	{ id: 6, name: 'Thai Chili Crush', sku: 'TC-200', price: 1250 },
	{ id: 7, name: 'Lemon Pepper Heat', sku: 'LP-250', price: 1150 },
	{ id: 8, name: 'Curry Inferno', sku: 'CI-200', price: 1350 }
];

// Dummy order data
const orderData = [
	{
		id: 'ORD-001',
		customerName: 'John Doe',
		email: 'john@example.com',
		phone: '+94 77 123 4567',
		date: '2025-11-10',
		time: '10:30 AM',
		items: [
			{ name: 'Classic Heat', sku: 'CH-250', quantity: 2, price: 1100 },
			{ name: 'Extreme Fire', sku: 'EF-200', quantity: 1, price: 1300 }
		],
		subtotal: 3500,
		delivery: 300,
		total: 3800,
		status: 'Pending',
		paymentMethod: 'Cash on Delivery',
		shippingAddress: '123 Main Street, Colombo 07'
	},
	{
		id: 'ORD-002',
		customerName: 'Jane Smith',
		email: 'jane@example.com',
		phone: '+94 71 987 6543',
		date: '2025-11-09',
		time: '02:15 PM',
		items: [
			{ name: 'Garlic Fusion', sku: 'GF-250', quantity: 3, price: 1200 }
		],
		subtotal: 3600,
		delivery: 300,
		total: 3900,
		status: 'Completed',
		paymentMethod: 'Card',
		shippingAddress: '456 Park Avenue, Kandy'
	},
	{
		id: 'ORD-003',
		customerName: 'Michael Johnson',
		email: 'michael@example.com',
		phone: '+94 76 555 1234',
		date: '2025-11-09',
		time: '11:45 AM',
		items: [
			{ name: 'Smoky Mango Blaze', sku: 'MB-200', quantity: 2, price: 1450 },
			{ name: 'Classic Heat', sku: 'CH-250', quantity: 1, price: 1100 }
		],
		subtotal: 4000,
		delivery: 300,
		total: 4300,
		status: 'Processing',
		paymentMethod: 'Cash on Delivery',
		shippingAddress: '789 Beach Road, Galle'
	},
	{
		id: 'ORD-004',
		customerName: 'Sarah Williams',
		email: 'sarah@example.com',
		phone: '+94 75 222 8899',
		date: '2025-11-08',
		time: '04:20 PM',
		items: [
			{ name: 'Coconut Fire Relish', sku: 'CF-180', quantity: 4, price: 980 }
		],
		subtotal: 3920,
		delivery: 300,
		total: 4220,
		status: 'Cancelled',
		paymentMethod: 'Card',
		shippingAddress: '321 Hill Street, Nuwara Eliya'
	},
	{
		id: 'ORD-005',
		customerName: 'David Brown',
		email: 'david@example.com',
		phone: '+94 77 333 4455',
		date: '2025-11-08',
		time: '09:00 AM',
		items: [
			{ name: 'Classic Heat', sku: 'CH-250', quantity: 5, price: 1100 },
			{ name: 'Extreme Fire', sku: 'EF-200', quantity: 2, price: 1300 }
		],
		subtotal: 8100,
		delivery: 300,
		total: 8400,
		status: 'Completed',
		paymentMethod: 'Cash on Delivery',
		shippingAddress: '555 Market Street, Negombo'
	}
];

const statusStyles = {
	Pending: 'bg-amber-700/25 text-amber-200',
	Processing: 'bg-blue-700/25 text-blue-300',
	Completed: 'bg-green-700/25 text-green-300',
	Cancelled: 'bg-red-700/25 text-red-300',
	default: 'bg-gray-700/25 text-gray-300'
};

const Orders = () => {
	const [orders] = React.useState(orderData);
	const [selectedOrder, setSelectedOrder] = React.useState(null);
	const [showBillModal, setShowBillModal] = React.useState(false);
	const [showQuickBillModal, setShowQuickBillModal] = React.useState(false);
	const [quickBillForm, setQuickBillForm] = React.useState({
		customerName: '',
		phone: '',
		address: '',
		paymentMethod: 'Cash on Delivery',
		items: [{ productId: '', product: '', quantity: 1, price: 0 }],
		deliveryFee: 300
	});

	const orderSummary = React.useMemo(() => {
		const totalRevenue = orders.reduce((sum, order) => 
			order.status === 'Completed' ? sum + order.total : sum, 0
		);
		const pendingCount = orders.filter(o => o.status === 'Pending').length;
		const completedCount = orders.filter(o => o.status === 'Completed').length;

		return [
			{ label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, delta: 'From completed orders', icon: DollarSign, accent: 'text-green-400', border: 'border-green-700/60' },
			{ label: 'Pending Orders', value: String(pendingCount), delta: 'Awaiting processing', icon: Clock, accent: 'text-amber-300', border: 'border-amber-700/60' },
			{ label: 'Completed', value: String(completedCount), delta: 'Successfully delivered', icon: CheckCircle, accent: 'text-green-300', border: 'border-green-700/60' },
		];
	}, [orders]);

	const handleGenerateBill = (order) => {
		setSelectedOrder(order);
		setShowBillModal(true);
	};

	const handlePrintBill = () => {
		window.print();
	};

	const handleDownloadBill = () => {
		// Future: Generate PDF
		alert('PDF download feature coming soon!');
	};

	const handleQuickBillChange = (e) => {
		const { name, value } = e.target;
		setQuickBillForm(prev => ({ ...prev, [name]: value }));
	};

	const handleItemChange = (index, field, value) => {
		const updatedItems = [...quickBillForm.items];
		
		if (field === 'productId') {
			// When product is selected, auto-fill name and price
			const selectedProduct = availableProducts.find(p => p.id === parseInt(value));
			if (selectedProduct) {
				updatedItems[index] = {
					...updatedItems[index],
					productId: value,
					product: selectedProduct.name,
					price: selectedProduct.price
				};
			} else {
				updatedItems[index][field] = value;
			}
		} else {
			updatedItems[index][field] = value;
		}
		
		setQuickBillForm(prev => ({ ...prev, items: updatedItems }));
	};

	const addItem = () => {
		setQuickBillForm(prev => ({
			...prev,
			items: [...prev.items, { productId: '', product: '', quantity: 1, price: 0 }]
		}));
	};

	const removeItem = (index) => {
		if (quickBillForm.items.length > 1) {
			const updatedItems = quickBillForm.items.filter((_, i) => i !== index);
			setQuickBillForm(prev => ({ ...prev, items: updatedItems }));
		}
	};

	const calculateQuickBillTotal = () => {
		const subtotal = quickBillForm.items.reduce((sum, item) => 
			sum + (item.quantity * item.price), 0
		);
		return {
			subtotal,
			delivery: quickBillForm.deliveryFee,
			total: subtotal + quickBillForm.deliveryFee
		};
	};

	const handleGenerateQuickBill = () => {
		// Validate form
		if (!quickBillForm.customerName || !quickBillForm.phone) {
			alert('Please enter customer name and phone number');
			return;
		}
		
		const hasValidItems = quickBillForm.items.some(item => 
			item.product && item.quantity > 0 && item.price > 0
		);
		
		if (!hasValidItems) {
			alert('Please add at least one product with valid details');
			return;
		}

		// Create order object from quick bill form
		const { subtotal, delivery, total } = calculateQuickBillTotal();
		const now = new Date();
		const quickOrder = {
			id: `QB-${Date.now()}`,
			customerName: quickBillForm.customerName,
			email: 'Walk-in Customer',
			phone: quickBillForm.phone,
			date: now.toISOString().split('T')[0],
			time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
			items: quickBillForm.items.filter(item => item.product && item.quantity > 0 && item.price > 0).map(item => ({
				name: item.product,
				sku: 'CUSTOM',
				quantity: item.quantity,
				price: item.price
			})),
			subtotal,
			delivery,
			total,
			status: 'Completed',
			paymentMethod: quickBillForm.paymentMethod,
			shippingAddress: quickBillForm.address || 'N/A'
		};

		setSelectedOrder(quickOrder);
		setShowQuickBillModal(false);
		setShowBillModal(true);
	};

	const resetQuickBillForm = () => {
		setQuickBillForm({
			customerName: '',
			phone: '',
			address: '',
			paymentMethod: 'Cash on Delivery',
			items: [{ productId: '', product: '', quantity: 1, price: 0 }],
			deliveryFee: 300
		});
	};

	return (
		<div className="space-y-6 print:space-y-0">
			<style>{`
				@media print {
					@page {
						size: A4;
						margin: 10mm;
					}
					body {
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
					}
					* {
						-webkit-print-color-adjust: exact !important;
						print-color-adjust: exact !important;
					}
					body * {
						visibility: hidden;
					}
					#bill-modal, #bill-modal * {
						visibility: visible;
					}
					#bill-modal {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
					}
				}
			`}</style>
			<section className="bg-black/80 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-800/50 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between print:hidden">
				<div className="w-full lg:max-w-xl flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
						<input
							type="text"
							placeholder="Search orders by ID, customer..."
							className="w-full bg-gray-900/70 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/70"
						/>
					</div>
					<select
						className="bg-gray-900/70 border border-gray-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/70"
						style={{ backgroundColor: '#0f141c', color: '#fff' }}
					>
						<option value="" style={{ backgroundColor: '#0f141c', color: '#fff' }}>All statuses</option>
						<option value="Pending" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Pending</option>
						<option value="Processing" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Processing</option>
						<option value="Completed" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Completed</option>
						<option value="Cancelled" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Cancelled</option>
					</select>
				</div>
				<button
					onClick={() => setShowQuickBillModal(true)}
					className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:brightness-110 text-white font-semibold px-4 py-3 rounded-xl transition shadow-lg shadow-green-900/40"
				>
					<Plus size={18} />
					<span>Quick Bill</span>
				</button>
			</section>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
				{orderSummary.map(({ label, value, delta, icon: Icon, accent, border }) => (
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

			<section className="bg-black/80 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-800/50 print:hidden">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
					<h2 className="text-base md:text-lg font-bold text-white">Recent Orders</h2>
					<div className="flex flex-wrap gap-2">
						<button className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 text-xs font-semibold">All</button>
						<button className="px-3 py-1.5 rounded-lg bg-gray-800/80 text-white/70 text-xs">Pending</button>
						<button className="px-3 py-1.5 rounded-lg bg-gray-800/80 text-white/70 text-xs">Processing</button>
						<button className="px-3 py-1.5 rounded-lg bg-gray-800/80 text-white/70 text-xs">Completed</button>
					</div>
				</div>
				<div className="overflow-x-auto -mx-4 md:mx-0">
					<table className="min-w-full text-left text-sm text-white/90">
						<thead>
							<tr className="border-b border-gray-800/60 text-white/60">
								<th className="py-3 px-4 font-medium">Order ID</th>
								<th className="py-3 px-4 font-medium">Customer</th>
								<th className="py-3 px-4 font-medium">Date</th>
								<th className="py-3 px-4 font-medium">Items</th>
								<th className="py-3 px-4 font-medium">Total</th>
								<th className="py-3 px-4 font-medium">Status</th>
								<th className="py-3 px-4 font-medium text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => {
								const badgeStyle = statusStyles[order.status] ?? statusStyles.default;
								return (
									<tr key={order.id} className="border-b border-gray-800/40 last:border-none">
										<td className="py-3 px-4">
											<span className="font-semibold text-white">{order.id}</span>
										</td>
										<td className="py-3 px-4">
											<div>
												<p className="font-semibold text-white">{order.customerName}</p>
												<span className="text-xs text-white/50">{order.email}</span>
											</div>
										</td>
										<td className="py-3 px-4 text-white/70">
											<div>
												<p>{order.date}</p>
												<span className="text-xs text-white/50">{order.time}</span>
											</div>
										</td>
										<td className="py-3 px-4 text-white/80">{order.items.length} item(s)</td>
										<td className="py-3 px-4 text-white font-semibold">Rs. {order.total.toLocaleString()}</td>
										<td className="py-3 px-4">
											<span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
												{order.status}
											</span>
										</td>
										<td className="py-3 px-4">
											<div className="flex justify-end gap-2">
												<button 
													onClick={() => handleGenerateBill(order)}
													className="px-3 py-1.5 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-300 text-xs flex items-center gap-1"
												>
													<FileText size={14} />
													<span>Bill</span>
												</button>
												<button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-1">
													<Eye size={14} />
													<span>View</span>
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

			{/* Bill Modal */}
			{showBillModal && selectedOrder && (
				<div id="bill-modal" className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/70 backdrop-blur-md print:relative print:inset-auto print:flex-none print:p-0 print:bg-white">
					<div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f141c] p-6 sm:p-8 text-white shadow-[0_20px_45px_-20px_rgba(255,255,255,0.45)] overflow-y-auto max-h-[90vh] print:max-w-none print:rounded-none print:border-0 print:bg-white print:text-black print:shadow-none print:overflow-visible print:max-h-full print:p-0">
						<div className="flex items-start justify-between gap-4 mb-6 print:mb-8">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-300 print:text-red-600">Invoice</p>
								<h3 className="mt-2 text-2xl font-semibold print:text-black print:text-3xl">{selectedOrder.id}</h3>
								<p className="mt-1 text-sm text-white/60 print:text-gray-600 print:text-base">{selectedOrder.date} at {selectedOrder.time}</p>
							</div>
							<button
								onClick={() => setShowBillModal(false)}
								className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white hover:border-white/30 transition print:hidden"
							>
								<XCircle size={18} />
							</button>
						</div>

						<div className="space-y-6 print:space-y-6">
							{/* Company Info with Logo */}
							<div className="border-b border-white/10 pb-4 print:border-gray-300 print:pb-6">
								<div className="flex items-center gap-4 mb-3">
									<img 
										src="/images/spiceup-logo.jpg" 
										alt="SPICE UP Logo" 
										className="w-16 h-16 object-cover rounded-full print:w-20 print:h-20"
									/>
									<div>
										<h4 className="text-2xl font-bold text-red-400 print:text-red-600 print:text-3xl tracking-wide">SPICE UP</h4>
										<p className="text-xs text-white/50 print:text-gray-500 uppercase tracking-wider">Premium Spices</p>
									</div>
								</div>
								<p className="text-sm text-white/60 mt-1 print:text-gray-600 print:text-base">123 Spice Street, Colombo 03, Sri Lanka</p>
								<p className="text-sm text-white/60 print:text-gray-600 print:text-base">+94 11 234 5678 | hello@kochchi.lk</p>
							</div>

							{/* Customer Info */}
							<div className="grid grid-cols-2 gap-4 print:gap-6 print:mb-8">
								<div>
									<p className="text-xs font-semibold uppercase text-white/50 mb-1 print:text-gray-500 print:text-sm">Bill To</p>
									<p className="font-semibold text-white print:text-black print:text-lg">{selectedOrder.customerName}</p>
									<p className="text-sm text-white/60 print:text-gray-600 print:text-base">{selectedOrder.email}</p>
									<p className="text-sm text-white/60 print:text-gray-600 print:text-base">{selectedOrder.phone}</p>
									<p className="text-sm text-white/60 mt-2 print:text-gray-600 print:text-base">{selectedOrder.shippingAddress}</p>
								</div>
								<div>
									<p className="text-xs font-semibold uppercase text-white/50 mb-1 print:text-gray-500 print:text-sm">Payment Method</p>
									<p className="text-sm text-white print:text-black print:text-base">{selectedOrder.paymentMethod}</p>
									<p className="text-xs font-semibold uppercase text-white/50 mt-3 mb-1 print:text-gray-500 print:text-sm">Status</p>
									<span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[selectedOrder.status]} print:border print:border-gray-400 print:bg-transparent print:text-gray-700 print:text-sm`}>
										{selectedOrder.status}
									</span>
								</div>
							</div>

							{/* Items Table */}
							<div className="print:mb-8">
								<table className="w-full text-sm print:text-base">
									<thead>
										<tr className="border-b border-white/10 text-white/50 print:border-gray-300 print:text-gray-600">
											<th className="py-2 text-left font-medium print:py-3">Item</th>
											<th className="py-2 text-center font-medium print:py-3">Qty</th>
											<th className="py-2 text-right font-medium print:py-3">Price</th>
											<th className="py-2 text-right font-medium print:py-3">Total</th>
										</tr>
									</thead>
									<tbody>
										{selectedOrder.items.map((item, index) => (
											<tr key={index} className="border-b border-white/5 print:border-gray-200">
												<td className="py-3 print:py-4">
													<p className="font-semibold text-white print:text-black print:text-base">{item.name}</p>
													<span className="text-xs text-white/50 print:text-gray-500 print:text-sm">{item.sku}</span>
												</td>
												<td className="py-3 text-center text-white/80 print:text-black print:py-4">{item.quantity}</td>
												<td className="py-3 text-right text-white/80 print:text-black print:py-4">Rs. {item.price.toLocaleString()}</td>
												<td className="py-3 text-right text-white font-semibold print:text-black print:py-4">Rs. {(item.quantity * item.price).toLocaleString()}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Totals */}
							<div className="space-y-2 border-t border-white/10 pt-4 print:border-gray-300 print:pt-6 print:space-y-3">
								<div className="flex justify-between text-sm print:text-base">
									<span className="text-white/60 print:text-gray-600">Subtotal</span>
									<span className="text-white print:text-black">Rs. {selectedOrder.subtotal.toLocaleString()}</span>
								</div>
								<div className="flex justify-between text-sm print:text-base">
									<span className="text-white/60 print:text-gray-600">Delivery Fee</span>
									<span className="text-white print:text-black">Rs. {selectedOrder.delivery.toLocaleString()}</span>
								</div>
								<div className="flex justify-between text-lg font-bold border-t border-white/10 pt-3 print:border-gray-300 print:text-2xl print:pt-4">
									<span className="text-white print:text-black">Total</span>
									<span className="text-red-400 print:text-red-600">Rs. {selectedOrder.total.toLocaleString()}</span>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-3 pt-4 print:hidden">
								<button
									onClick={handlePrintBill}
									className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 hover:brightness-110"
								>
									<FileText size={18} />
									<span>Print Bill</span>
								</button>
								<button
									onClick={handleDownloadBill}
									className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
								>
									<Download size={18} />
									<span>Download PDF</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Quick Bill Generator Modal */}
			{showQuickBillModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/70 backdrop-blur-md">
					<div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0f141c] p-6 sm:p-8 text-white shadow-[0_20px_45px_-20px_rgba(255,255,255,0.45)] overflow-y-auto max-h-[90vh]">
						<div className="flex items-start justify-between gap-4 mb-6">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-green-300">Quick Bill</p>
								<h3 className="mt-2 text-2xl font-semibold">Generate Custom Bill</h3>
								<p className="mt-1 text-sm text-white/60">Create a bill for walk-in customers or manual orders</p>
							</div>
							<button
								onClick={() => {
									setShowQuickBillModal(false);
									resetQuickBillForm();
								}}
								className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white hover:border-white/30 transition"
							>
								<X size={18} />
							</button>
						</div>

						<div className="space-y-6">
							{/* Customer Details */}
							<div className="space-y-4">
								<h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Customer Details</h4>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<label className="flex flex-col text-sm text-white/70">
										<span className="font-semibold text-white/80 mb-2">Customer/Shop Name *</span>
										<input
											name="customerName"
											value={quickBillForm.customerName}
											onChange={handleQuickBillChange}
											placeholder="John Doe / ABC Shop"
											className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-green-500 focus:outline-none"
											required
										/>
									</label>
									<label className="flex flex-col text-sm text-white/70">
										<span className="font-semibold text-white/80 mb-2">Phone Number *</span>
										<input
											name="phone"
											value={quickBillForm.phone}
											onChange={handleQuickBillChange}
											placeholder="+94 77 123 4567"
											className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-green-500 focus:outline-none"
											required
										/>
									</label>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<label className="flex flex-col text-sm text-white/70">
										<span className="font-semibold text-white/80 mb-2">Address (Optional)</span>
										<input
											name="address"
											value={quickBillForm.address}
											onChange={handleQuickBillChange}
											placeholder="123 Main Street, Colombo"
											className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-green-500 focus:outline-none"
										/>
									</label>
									<label className="flex flex-col text-sm text-white/70">
										<span className="font-semibold text-white/80 mb-2">Payment Method</span>
										<select
											name="paymentMethod"
											value={quickBillForm.paymentMethod}
											onChange={handleQuickBillChange}
											className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-green-500 focus:outline-none"
											style={{ backgroundColor: '#0f141c', color: '#fff' }}
										>
											<option value="Cash on Delivery" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Cash on Delivery</option>
											<option value="Cash" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Cash</option>
											<option value="Card" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Card</option>
											<option value="Bank Transfer" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Bank Transfer</option>
										</select>
									</label>
								</div>
							</div>

							{/* Products */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Products</h4>
									<button
										onClick={addItem}
										className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-300 text-xs font-semibold transition"
									>
										<Plus size={14} />
										<span>Add Item</span>
									</button>
								</div>
								
								{quickBillForm.items.map((item, index) => (
									<div key={index} className="grid grid-cols-12 gap-3 items-end p-4 rounded-2xl border border-white/10 bg-white/5">
										<label className="col-span-12 sm:col-span-5 flex flex-col text-sm text-white/70">
											<span className="font-semibold text-white/80 mb-2">Product Name</span>
											<select
												value={item.productId}
												onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
												className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-green-500 focus:outline-none text-sm"
												style={{ backgroundColor: '#0f141c', color: '#fff' }}
											>
												<option value="" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Select Product</option>
												{availableProducts.map(product => (
													<option 
														key={product.id} 
														value={product.id}
														style={{ backgroundColor: '#0f141c', color: '#fff' }}
													>
														{product.name} - Rs. {product.price}
													</option>
												))}
											</select>
										</label>
										<label className="col-span-6 sm:col-span-3 flex flex-col text-sm text-white/70">
											<span className="font-semibold text-white/80 mb-2">Quantity</span>
											<input
												type="number"
												min="1"
												value={item.quantity}
												onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
												className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-green-500 focus:outline-none text-sm"
											/>
										</label>
										<label className="col-span-6 sm:col-span-3 flex flex-col text-sm text-white/70">
											<span className="font-semibold text-white/80 mb-2">Price (Rs)</span>
											<input
												type="number"
												min="0"
												value={item.price}
												onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
												className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-green-500 focus:outline-none text-sm"
											/>
										</label>
										<div className="col-span-12 sm:col-span-1 flex items-center justify-center">
											{quickBillForm.items.length > 1 && (
												<button
													onClick={() => removeItem(index)}
													className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 transition"
												>
													<Trash2 size={16} />
												</button>
											)}
										</div>
									</div>
								))}
							</div>

							{/* Delivery Fee */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<label className="flex flex-col text-sm text-white/70">
									<span className="font-semibold text-white/80 mb-2">Delivery Fee (Rs)</span>
									<input
										name="deliveryFee"
										type="number"
										min="0"
										value={quickBillForm.deliveryFee}
										onChange={(e) => setQuickBillForm(prev => ({ ...prev, deliveryFee: parseFloat(e.target.value) || 0 }))}
										className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-green-500 focus:outline-none"
									/>
								</label>
							</div>

							{/* Preview Total */}
							<div className="rounded-2xl border border-green-500/40 bg-green-600/15 p-4">
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-white/70">Subtotal</span>
										<span className="text-white font-semibold">Rs. {calculateQuickBillTotal().subtotal.toLocaleString()}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-white/70">Delivery</span>
										<span className="text-white font-semibold">Rs. {calculateQuickBillTotal().delivery.toLocaleString()}</span>
									</div>
									<div className="flex justify-between text-lg font-bold border-t border-white/10 pt-2">
										<span className="text-white">Total</span>
										<span className="text-green-300">Rs. {calculateQuickBillTotal().total.toLocaleString()}</span>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col-reverse sm:flex-row gap-3">
								<button
									onClick={() => {
										setShowQuickBillModal(false);
										resetQuickBillForm();
									}}
									className="flex-1 rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/70 hover:text-white transition"
								>
									Cancel
								</button>
								<button
									onClick={handleGenerateQuickBill}
									className="flex-1 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/40 hover:brightness-110 transition"
								>
									Generate Bill
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Orders;
