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

const statusStyles = {
	Pending: 'bg-amber-700/25 text-amber-200',
	Confirmed: 'bg-blue-700/25 text-blue-300',
	Preparing: 'bg-indigo-700/25 text-indigo-200',
	Dispatched: 'bg-sky-700/25 text-sky-200',
	'Out For Delivery': 'bg-cyan-700/25 text-cyan-200',
	Delivered: 'bg-green-700/25 text-green-300',
	Cancelled: 'bg-red-700/25 text-red-300',
	Paid: 'bg-green-700/25 text-green-300',
	Completed: 'bg-green-700/25 text-green-300',
	Processing: 'bg-indigo-700/25 text-indigo-200',
	default: 'bg-gray-700/25 text-gray-300'
};

const ORDER_STATUS_OPTIONS = [
	'Confirmed',
	'Preparing',
	'Out For Delivery',
	'Delivered',
	'Cancelled'
];

const STATUS_FILTERS = ['All', ...ORDER_STATUS_OPTIONS];

const IN_PROGRESS_STATUSES = new Set([
	'Confirmed',
	'Preparing',
	'Out For Delivery'
]);

const FULFILLED_STATUSES = new Set(['Delivered']);

const Orders = () => {
	const [orders, setOrders] = React.useState([]);
	const [updatingId, setUpdatingId] = React.useState(null);
	const [availableProducts, setAvailableProducts] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [selectedOrder, setSelectedOrder] = React.useState(null);
	const [showBillModal, setShowBillModal] = React.useState(false);
	const [showQuickBillModal, setShowQuickBillModal] = React.useState(false);
	const [activeTab, setActiveTab] = React.useState('orders'); // 'orders' or 'bills'
	const [myBills, setMyBills] = React.useState([]);
	const [billFilter, setBillFilter] = React.useState('All');
	const [quickBillForm, setQuickBillForm] = React.useState({
		customerName: '',
		phone: '',
		address: '',
		paymentMethod: 'Cash on Delivery',
		items: [{ productId: '', product: '', quantity: 1, price: 0 }],
		deliveryFee: 300
	});

	// Fetch orders and products from backend
	React.useEffect(() => {
		const fetchData = async () => {
			try {
				const [ordersRes, productsRes, billsRes] = await Promise.all([
					fetch('http://localhost/backend/admin/api/get-orders.php'),
					fetch('http://localhost/backend/admin/api/get-products.php'),
					fetch('http://localhost/backend/admin/api/get-bills.php')
				]);
				const ordersData = await ordersRes.json();
				const productsData = await productsRes.json();
				const billsData = await billsRes.json();
				
				if (ordersData.success) {
					setOrders(ordersData.data);
				}
				if (productsData.success) {
					const productList = productsData.data.map(p => ({
						id: p.id,
						name: p.name,
						sku: p.sku,
						price: p.price
					}));
					setAvailableProducts(productList);
				}
				if (billsData.success) {
					setMyBills(billsData.data);
				}
			} catch (error) {
				console.error('Failed to fetch data:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const updateOrderStatus = async (orderId, nextStatus, options = {}) => {
		const payload = { orderId, status: nextStatus };
		const trackingNumber = typeof options.trackingNumber === 'string' ? options.trackingNumber.trim() : undefined;
		if (trackingNumber) {
			payload.trackingNumber = trackingNumber;
		}

		try {
			setUpdatingId(orderId);
			const res = await fetch('http://localhost/backend/admin/api/update-order-status.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const data = await res.json();
			if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update');
			setOrders(prev => prev.map(o => {
				if (o.id !== orderId) return o;
				return {
					...o,
					status: nextStatus,
					...(trackingNumber ? { trackingNumber } : {})
				};
			}));
		} catch (e) {
			alert(e.message || 'Failed to update order status');
		} finally {
			setUpdatingId(null);
		}
	};

	const orderSummary = React.useMemo(() => {
		const totalRevenue = orders.reduce((sum, order) => 
			FULFILLED_STATUSES.has(order.status) ? sum + order.total : sum
		, 0);
		const inProgressCount = orders.filter(o => IN_PROGRESS_STATUSES.has(o.status)).length;
		const deliveredCount = orders.filter(o => FULFILLED_STATUSES.has(o.status)).length;
		const creditBillsCount = myBills.filter(b => b.paymentMethod === 'Credit').length;

		return [
			{ label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, delta: 'From delivered orders', icon: DollarSign, accent: 'text-green-400', border: 'border-green-700/60' },
			{ label: 'Active Orders', value: String(inProgressCount), delta: 'Awaiting fulfilment', icon: Clock, accent: 'text-amber-300', border: 'border-amber-700/60' },
			{ label: 'Delivered', value: String(deliveredCount), delta: 'Successfully completed', icon: CheckCircle, accent: 'text-green-300', border: 'border-green-700/60' },
			{ label: 'Credit Bills', value: String(creditBillsCount), delta: 'Payment pending', icon: FileText, accent: 'text-orange-300', border: 'border-orange-700/60' },
		];
	}, [orders, myBills]);

	const filteredBills = React.useMemo(() => {
		if (billFilter === 'All') {
			return myBills;
		}

		return myBills.filter(bill => {
			const method = (bill.paymentMethod || '').toLowerCase();
			if (billFilter === 'Cash') {
				return method.includes('cash');
			}
			return method === billFilter.toLowerCase();
		});
	}, [billFilter, myBills]);

	const handleGenerateBill = (order) => {
		setSelectedOrder(order);
		setShowBillModal(true);
	};

	const requestTrackingNumber = (order) => {
		const existing = order.trackingNumber || '';
		const input = window.prompt('Enter the tracking number for this order', existing);
		if (input === null) {
			return null;
		}
		const trimmed = input.trim();
		if (!trimmed) {
			alert('Tracking number cannot be empty.');
			return null;
		}
		return trimmed;
	};

	const handleStatusChange = (order, nextStatus, target) => {
		if (nextStatus === order.status) {
			return;
		}

		if (nextStatus === 'Out For Delivery') {
			const trackingNumber = requestTrackingNumber(order);
			if (!trackingNumber) {
				target.value = order.status;
				return;
			}
			updateOrderStatus(order.id, nextStatus, { trackingNumber });
			return;
		}

		updateOrderStatus(order.id, nextStatus);
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

	const handleGenerateQuickBill = async () => {
		// Validate form
		if (!quickBillForm.customerName || !quickBillForm.phone) {
			alert('Please enter customer name and phone number');
			return;
		}
		
		const hasValidItems = quickBillForm.items.some(item => 
			item.productId && item.quantity > 0 && item.price > 0
		);
		
		if (!hasValidItems) {
			alert('Please add at least one product with valid details');
			return;
		}

		try {
			// Calculate totals
			const { subtotal, delivery, total } = calculateQuickBillTotal();
			
			// Prepare order data for backend
			const orderData = {
				userId: null, // Walk-in customer
				customerName: quickBillForm.customerName,
				customerPhone: quickBillForm.phone,
				customerAddress: quickBillForm.address || '',
				paymentMethod: quickBillForm.paymentMethod,
				status: 'Delivered',
				total,
				deliveryFee: delivery,
				notes: `Walk-in customer: ${quickBillForm.customerName}, Phone: ${quickBillForm.phone}, Address: ${quickBillForm.address || 'N/A'}`,
				items: quickBillForm.items
					.filter(item => item.productId && item.quantity > 0)
					.map(item => ({
						productId: item.productId,
						quantity: item.quantity,
						price: item.price
					}))
			};

			// Save order to backend
			const response = await fetch('http://localhost/backend/admin/api/add-order.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(orderData)
			});

			const result = await response.json();

			if (result.success) {
				// Create order object for bill display
				const now = new Date();
				const quickOrder = {
					id: result.orderNumber,
					orderId: result.orderId,
					customerName: quickBillForm.customerName,
					email: 'Walk-in Customer',
					phone: quickBillForm.phone,
					date: now.toISOString().split('T')[0],
					time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
					items: quickBillForm.items
						.filter(item => item.productId && item.quantity > 0)
						.map(item => ({
							name: item.product,
							sku: item.productId,
							quantity: item.quantity,
							price: item.price
						})),
					subtotal,
					delivery,
					total,
					status: 'Delivered',
					paymentMethod: quickBillForm.paymentMethod,
					shippingAddress: quickBillForm.address || 'N/A'
				};

				// Refresh orders list
				const ordersRes = await fetch('http://localhost/backend/admin/api/get-orders.php');
				const ordersData = await ordersRes.json();
				if (ordersData.success) {
					setOrders(ordersData.data);
				}

				// Add the generated bill to My Bills list
				setMyBills(prev => [quickOrder, ...prev]);

				try {
					const billsRes = await fetch('http://localhost/backend/admin/api/get-bills.php');
					const billsData = await billsRes.json();
					if (billsData.success) {
						setMyBills(billsData.data);
					}
				} catch (refreshError) {
					console.error('Failed to refresh bills list:', refreshError);
				}

				setSelectedOrder(quickOrder);
				setShowQuickBillModal(false);
				setShowBillModal(true);
				resetQuickBillForm();
			} else {
				alert('Error creating order: ' + (result.error || 'Unknown error'));
			}
		} catch (error) {
			console.error('Failed to create order:', error);
			alert('Failed to create order. Please try again.');
		}
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
			{loading ? (
				<div className="flex items-center justify-center py-20">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
				</div>
			) : (
				<>
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
						{ORDER_STATUS_OPTIONS.map(status => (
							<option key={status} value={status} style={{ backgroundColor: '#0f141c', color: '#fff' }}>
								{status}
							</option>
						))}
					</select>
				</div>
				<button
					onClick={() => setShowQuickBillModal(true)}
					className="flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-green-500 hover:brightness-110 text-white font-semibold px-4 py-3 rounded-xl transition shadow-lg shadow-green-900/40"
				>
					<Plus size={18} />
					<span>Quick Bill</span>
				</button>
			</section>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
				{orderSummary.map(({ label, value, delta, icon: Icon, accent, border }) => (
					<div key={label} className={`bg-linear-to-br from-black/80 to-[#131822] border ${border} rounded-2xl p-5 shadow-lg flex flex-col gap-3`}>
						<span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-600/10 ${accent}`}>
							<Icon size={20} />
						</span>
						<div className="text-2xl font-bold text-white">{value}</div>
						<p className="text-sm text-white/70">{label}</p>
						<span className="text-xs text-white/50">{delta}</span>
					</div>
				))}
			</div>

			{/* Tab Navigation */}
			<section className="bg-black/80 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-800/50 print:hidden">
				<div className="flex items-center gap-2 mb-4 border-b border-gray-800/50 pb-1">
					<button
						onClick={() => setActiveTab('orders')}
						className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition ${
							activeTab === 'orders' 
								? 'bg-red-600/20 text-red-300 border-b-2 border-red-500' 
								: 'text-white/60 hover:text-white/90'
						}`}
					>
						Recent Orders
					</button>
					<button
						onClick={() => setActiveTab('bills')}
						className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition ${
							activeTab === 'bills' 
								? 'bg-red-600/20 text-red-300 border-b-2 border-red-500' 
								: 'text-white/60 hover:text-white/90'
						}`}
					>
						My Bills
					</button>
				</div>

				{/* Orders Tab Content */}
				{activeTab === 'orders' && (
					<>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
							<h2 className="text-base md:text-lg font-bold text-white">All Customer Orders</h2>
							<div className="flex flex-wrap gap-2">
								{STATUS_FILTERS.map((status, index) => {
									const baseClasses = 'px-3 py-1.5 rounded-lg text-xs';
									const activeClasses = 'bg-red-600/20 text-red-300 font-semibold';
									const inactiveClasses = 'bg-gray-800/80 text-white/70';
									return (
										<button key={status} className={`${baseClasses} ${index === 0 ? activeClasses : inactiveClasses}`}>
											{status}
										</button>
									);
								})}
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
													<div className="flex flex-col gap-1">
														<div className="flex flex-wrap items-center gap-2">
															<span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>{order.status}</span>
															<select
																disabled={updatingId === order.id}
																value={order.status}
																onChange={(e) => handleStatusChange(order, e.target.value, e.target)}
																className="ml-2 bg-gray-900/70 border border-gray-800 rounded-md py-1 px-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500/60"
																style={{ backgroundColor: '#0f141c', color: '#fff' }}
															>
																{ORDER_STATUS_OPTIONS.map(status => (
																	<option key={status} value={status} style={{ backgroundColor: '#0f141c', color: '#fff' }}>
																		{status}
																	</option>
																))}
															</select>
															{order.status === 'Out For Delivery' && (
																<button
																	type="button"
																	onClick={() => {
																		const trackingNumber = requestTrackingNumber(order);
																		if (!trackingNumber) {
																			return;
																		}
																		updateOrderStatus(order.id, 'Out For Delivery', { trackingNumber });
																	}}
																	disabled={updatingId === order.id}
																	className="ml-2 px-3 py-1 rounded-md bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 text-xs font-semibold transition"
																>
																	{order.trackingNumber ? 'Update Tracking' : 'Add Tracking'}
																</button>
															)}
														</div>
														{order.trackingNumber && (
															<span className="text-xs text-cyan-200 font-semibold">Tracking: {order.trackingNumber}</span>
														)}
													</div>
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
					</>
				)}

				{/* My Bills Tab Content */}
				{activeTab === 'bills' && (
					<>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
							<h2 className="text-base md:text-lg font-bold text-white">Generated Bills</h2>
							<div className="flex flex-wrap gap-2">
								{['All', 'Cash', 'Credit', 'Card'].map(option => {
									const isActive = billFilter === option;
									const activeClasses = 'bg-red-600/20 text-red-300 border border-red-500/40';
									const inactiveClasses = 'bg-gray-800/80 text-white/70 border border-gray-800 hover:text-white/90';
									return (
										<button
											key={option}
											onClick={() => setBillFilter(option)}
											className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${isActive ? activeClasses : inactiveClasses}`}
										>
											{option}
										</button>
									);
								})}
							</div>
						</div>
						<div className="overflow-x-auto -mx-4 md:mx-0">
							<table className="min-w-full text-left text-sm text-white/90">
								<thead>
									<tr className="border-b border-gray-800/60 text-white/60">
										<th className="py-3 px-4 font-medium">Bill ID</th>
										<th className="py-3 px-4 font-medium">Customer</th>
										<th className="py-3 px-4 font-medium">Date</th>
										<th className="py-3 px-4 font-medium">Items</th>
										<th className="py-3 px-4 font-medium">Total</th>
										<th className="py-3 px-4 font-medium">Payment</th>
										<th className="py-3 px-4 font-medium text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredBills.length === 0 ? (
										<tr>
											<td colSpan="7" className="py-12 text-center text-white/50">
												<FileText size={48} className="mx-auto mb-3 text-white/30" />
												<p className="text-base font-semibold">No bills found</p>
												<p className="text-sm mt-1">Try adjusting the filter or generate a new bill</p>
											</td>
										</tr>
									) : (
										filteredBills.map((bill) => {
											const paymentBadgeStyle = bill.paymentMethod === 'Credit' 
												? 'bg-orange-700/25 text-orange-300'
												: bill.paymentMethod === 'Card'
												? 'bg-blue-700/25 text-blue-300'
												: 'bg-green-700/25 text-green-300';
											
											return (
												<tr key={bill.id} className="border-b border-gray-800/40 last:border-none">
													<td className="py-3 px-4">
														<span className="font-semibold text-white">{bill.id}</span>
													</td>
													<td className="py-3 px-4">
														<div>
															<p className="font-semibold text-white">{bill.customerName}</p>
															<span className="text-xs text-white/50">{bill.phone}</span>
														</div>
													</td>
													<td className="py-3 px-4 text-white/70">
														<div>
															<p>{bill.date}</p>
															<span className="text-xs text-white/50">{bill.time}</span>
														</div>
													</td>
													<td className="py-3 px-4 text-white/80">{bill.items.length} item(s)</td>
													<td className="py-3 px-4 text-white font-semibold">Rs. {bill.total.toLocaleString()}</td>
													<td className="py-3 px-4">
														<span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentBadgeStyle}`}>
															{bill.paymentMethod}
														</span>
													</td>
													<td className="py-3 px-4">
														<div className="flex justify-end gap-2">
															<button 
																onClick={() => handleGenerateBill(bill)}
																className="px-3 py-1.5 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-300 text-xs flex items-center gap-1"
															>
																<Eye size={14} />
																<span>View</span>
															</button>
															<button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-1">
																<Download size={14} />
																<span>PDF</span>
															</button>
														</div>
													</td>
												</tr>
											);
										})
									)}
								</tbody>
							</table>
						</div>
					</>
				)}
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
									<span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[selectedOrder.status] ?? statusStyles.default} print:border print:border-gray-400 print:bg-transparent print:text-gray-700 print:text-sm`}>
										{selectedOrder.status}
									</span>
									{selectedOrder.trackingNumber && (
										<p className="mt-2 text-xs font-semibold uppercase text-cyan-200 print:text-gray-600 print:text-sm">
											Tracking: {selectedOrder.trackingNumber}
										</p>
									)}
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
									className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 hover:brightness-110"
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
											<option value="Credit" style={{ backgroundColor: '#0f141c', color: '#fff' }}>Credit</option>
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
									className="flex-1 rounded-2xl bg-linear-to-r from-green-600 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/40 hover:brightness-110 transition"
								>
									Generate Bill
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			</>
		)}
		</div>
	);
	// Close component function
};

export default Orders;
