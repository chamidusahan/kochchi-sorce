import React, { useState, useEffect } from 'react';
import {
	ShoppingCart,
	Banknote,
	Box,
	Users,
	BarChart2,
	LogOut,
	Settings,
	Package,
	List,
	Menu,
	Star,
	MessageSquare
} from 'lucide-react';

import ProductDetails from './ProductDetails';
import Orders from './Orders';
import Reviews from './Reviews';
import Messages from './Messages';

const navItems = [
	{ label: 'Overview', icon: BarChart2 },
	{ label: 'Products', icon: Box },
	{ label: 'Orders', icon: Package },
	{ label: 'Messages', icon: MessageSquare },
	{ label: 'Reviews', icon: Star },
	{ label: 'Settings', icon: Settings },
];

const AdminDashboard = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeNav, setActiveNav] = useState(navItems[0].label);
	const [dashboardData, setDashboardData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				const response = await fetch('http://localhost/backend/admin/api/get-dashboard-stats.php', {
					method: 'GET',
					credentials: 'include'
				});

				if (!response.ok) {
					throw new Error('Failed to fetch dashboard data');
				}

				const result = await response.json();
				if (result.success) {
					setDashboardData(result.data);
				} else {
					throw new Error(result.message || 'Failed to load data');
				}
			} catch (err) {
				console.error('Error fetching dashboard data:', err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (activeNav === 'Overview') {
			fetchDashboardData();
		}
	}, [activeNav]);

	const toggleSidebar = () => setSidebarOpen((prev) => !prev);

	const headerTitle =
		activeNav === 'Overview'
			? 'Dashboard Overview'
			: activeNav === 'Products'
			? 'Product Manager'
			: activeNav === 'Orders'
			? 'Order Management'
			: activeNav === 'Messages'
			? 'Inbox & Messages'
			: activeNav === 'Reviews'
			? 'Review Moderation'
			: 'Admin Settings';

	const renderHeaderSubtitle = () => {
		if (activeNav === 'Overview') {
			return (
				<>
					Welcome back,{' '}
					<span className="text-red-400 font-semibold">Imantha</span>
				</>
			);
		}
		if (activeNav === 'Products') {
			return 'Add, update, and organize your product catalogue.';
		}
		if (activeNav === 'Orders') {
			return 'Track fulfilment status and keep customers informed.';
		}
		if (activeNav === 'Reviews') {
			return 'Review feedback before it goes live on the storefront.';
		}
		if (activeNav === 'Messages') {
			return 'Manage customer conversations and follow up quickly.';
		}
		return 'Configure administrator preferences and storefront defaults.';
	};

	const renderOverview = () => {
		if (loading) {
			return (
				<div className="flex items-center justify-center h-96">
					<div className="text-white text-lg">Loading dashboard data...</div>
				</div>
			);
		}

		if (error) {
			return (
				<div className="bg-red-900/20 border border-red-500 rounded-2xl p-6 text-center">
					<p className="text-red-400 text-lg">Error loading dashboard: {error}</p>
					<button 
						onClick={() => window.location.reload()}
						className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition"
					>
						Retry
					</button>
				</div>
			);
		}

		if (!dashboardData) {
			return null;
		}

		const { stats, weeklySales, recentOrders } = dashboardData;

		const formatCurrency = (amount) =>
			`LKR ${Number(amount || 0).toLocaleString('en-LK', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			})}`;

		const statCards = [
			{ 
				label: 'Total Orders', 
				value: stats.totalOrders.toLocaleString(), 
				icon: ShoppingCart, 
				growth: `${stats.ordersGrowth >= 0 ? '+' : ''}${stats.ordersGrowth}%`, 
				color: stats.ordersGrowth >= 0 ? 'text-green-400' : 'text-red-400', 
				border: 'border-red-800' 
			},
			{ 
				label: 'Revenue', 
				value: formatCurrency(stats.totalRevenue), 
				icon: Banknote, 
				growth: `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth}%`, 
				color: stats.revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400', 
				border: 'border-green-800' 
			},
			{ 
				label: 'Products', 
				value: stats.totalProducts.toString(), 
				icon: Box, 
				growth: `${stats.productsGrowth >= 0 ? '+' : ''}${stats.productsGrowth}`, 
				color: stats.productsGrowth >= 0 ? 'text-green-400' : 'text-red-400', 
				border: 'border-orange-800' 
			},
			{ 
				label: 'Visitors', 
				value: stats.totalUsers.toLocaleString(), 
				icon: Users, 
				growth: `${stats.usersGrowth >= 0 ? '+' : ''}${stats.usersGrowth}%`, 
				color: stats.usersGrowth >= 0 ? 'text-green-400' : 'text-red-400', 
				border: 'border-blue-800' 
			},
		];

		// Calculate bar heights for weekly sales chart
		const maxAmount = Math.max(...weeklySales.data.map(d => d.amount), 1);
		const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		
		// Create complete week data with 0 for missing days
		const completeWeekData = daysOfWeek.map(day => {
			const found = weeklySales.data.find(d => d.day === day);
			return { day: day.substring(0, 3), amount: found ? found.amount : 0 };
		});

		return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
				{statCards.map(({ label, value, icon: Icon, growth, color, border }) => (
					<div
						key={label}
						className={`bg-gradient-to-br from-black/80 to-[#181a20] rounded-2xl p-5 md:p-6 shadow-lg border ${border} flex flex-col gap-4`}
					>
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-3">
								<span className="bg-red-600/10 rounded-lg p-2 text-red-500">
									<Icon size={24} />
								</span>
								<span className="text-white/80 text-sm md:text-base font-semibold">{label}</span>
							</div>
							<span className={`text-xs md:text-sm font-semibold ${color}`}>{growth}</span>
						</div>
						<div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
					</div>
					))}
			</div>

			<section className="bg-black/80 rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-800/40 mb-6 md:mb-8">
				<div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
					<div>
						<h2 className="text-base md:text-lg font-bold text-white mb-1 flex items-center gap-2">
							<List size={18} className="text-red-500" /> Weekly Sales
						</h2>
						<span className="text-white/60 text-xs md:text-sm">Last 7 days performance</span>
					</div>
					<div className="text-xl md:text-2xl font-bold text-white">
						{formatCurrency(weeklySales.total)} 
						<span className={`${weeklySales.growth >= 0 ? 'text-green-400' : 'text-red-400'} text-sm md:text-base font-semibold ml-2`}>
							{weeklySales.growth >= 0 ? '+' : ''}{weeklySales.growth}%
						</span>
					</div>
				</div>
				<div className="w-full h-40 md:h-56 flex items-end justify-center overflow-x-auto">
					<svg width="640" height="160" viewBox="0 0 420 160" preserveAspectRatio="xMidYMid meet">
						<rect x="0" y="0" width="420" height="160" rx="16" fill="#18181b" />
						{completeWeekData.map((day, index) => {
							const height = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 10;
							const x = 30 + (index * 50);
							const y = 140 - height;
							return (
								<g key={index}>
									<rect 
										x={x} 
										y={y} 
										width="32" 
										height={height} 
										rx="6" 
										fill="#c10c0cff" 
									/>
									<text x={x + 16} y="155" textAnchor="middle" fontSize="13" fill="#fff">
										{day.day}
									</text>
								</g>
							);
						})}
					</svg>
				</div>
			</section>

			<section className="bg-black/80 rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-800/40">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
					<h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
						<ShoppingCart size={18} className="text-red-500" /> Recent Orders
					</h2>
					<button 
						onClick={() => setActiveNav('Orders')}
						className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs md:text-sm transition w-full sm:w-auto"
					>
						View All
					</button>
				</div>
				<div className="overflow-x-auto -mx-4 md:mx-0">
					<table className="min-w-full text-left text-white/90 text-sm md:text-base">
						<thead>
							<tr className="border-b border-gray-700/40">
								<th className="py-2 px-4">Order ID</th>
								<th className="py-2 px-4">Customer</th>
								<th className="py-2 px-4">Total</th>
								<th className="py-2 px-4">Status</th>
							</tr>
						</thead>
						<tbody>
							{recentOrders.length === 0 ? (
								<tr>
									<td colSpan="4" className="py-4 px-4 text-center text-white/60">
										No orders yet
									</td>
								</tr>
							) : (
								recentOrders.map((order) => (
									<tr key={order.orderId} className="border-b border-gray-800/40">
										<td className="py-2 px-4">#{order.orderId}</td>
										<td className="py-2 px-4">{order.customer}</td>
										<td className="py-2 px-4">{formatCurrency(order.total)}</td>
										<td className="py-2 px-4">
											<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
												order.status === 'paid' 
													? 'bg-green-700/30 text-green-400' 
													: order.status === 'pending'
													? 'bg-yellow-700/30 text-yellow-400'
													: 'bg-red-700/30 text-red-400'
											}`}>
												{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
											</span>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</section>
		</>
	);
	};

	const renderPlaceholder = (label) => (
		<section className="bg-black/70 border border-gray-800/40 rounded-2xl p-8 text-center text-white/70 shadow-lg">
			<h2 className="text-xl font-semibold text-white mb-3">{label} workspace coming soon</h2>
			<p className="text-sm">
				This section is being prepared to help you manage {label.toLowerCase()} with more control.
			</p>
		</section>
	);

	return (
		<div className="relative min-h-screen flex bg-gradient-to-b from-[#0a0e14] via-[#0e141d] to-[#0a0e14]">
			{/* Background vignette overlays */}
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(38,60,88,0.28),transparent_60%),radial-gradient(900px_500px_at_80%_90%,rgba(22,36,52,0.26),transparent_60%)]" />

			{/* Mobile top bar */}
			<header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0b1119]/95 backdrop-blur border-b border-red-900/30">
				<div className="flex items-center gap-3">
					<button
						onClick={toggleSidebar}
						className="bg-red-600/90 p-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-400"
						aria-label="Toggle navigation"
					>
						<Menu size={22} />
					</button>
					<div>
						<p className="text-sm text-white/70">Administrator</p>
						<p className="text-base font-semibold text-white">Imantha</p>
					</div>
				</div>
				<button
					onClick={async () => {
						try {
							await fetch('http://localhost/backend/admin/logout.php', { method: 'POST', credentials: 'include' });
						} finally {
							window.location.href = '/admin-login';
						}
					}}
					className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-600 text-red-400 text-sm font-medium"
				>
					<LogOut size={16} />
					<span>Logout</span>
				</button>
			</header>

			{/* Sidebar */}
			<aside
				className={`
					fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-[#0b0d10]/98 to-[#0a0c11]/92 border-r border-red-900/40 shadow-xl shadow-black/40 flex flex-col p-6 transition-transform duration-300 ease-in-out z-50
					lg:top-5 lg:left-5 lg:bottom-5 lg:rounded-2xl lg:border lg:w-64 lg:translate-x-0
					${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
				`}
			>
				<div className="mt-12 lg:mt-0 mb-8 flex items-center gap-3 flex-shrink-0">
					<div className="bg-red-600 rounded-lg p-2">
						<BarChart2 size={28} className="text-white" />
					</div>
					<span className="text-xl font-bold text-white tracking-wide">
						Admin <span className="text-red-500">Panel</span>
					</span>
				</div>
				<nav className="flex-1 overflow-y-auto">
					<ul className="space-y-2 pr-1">
						{navItems.map(({ label, icon: Icon }) => (
							<li key={label}>
								<button
									onClick={() => {
										setActiveNav(label);
										if (window.innerWidth < 1024) toggleSidebar();
									}}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white transition font-medium focus:outline-none focus:ring-2 focus:ring-red-400/50
										${activeNav === label ? 'bg-red-600 shadow-[0_0_18px] shadow-red-500/30 ring-1 ring-red-500/40' : 'hover:bg-red-900/40'}`}
								>
									<span className="text-lg"><Icon size={20} /></span>
									<span>{label}</span>
								</button>
							</li>
						))}
					</ul>
				</nav>
				<button
					onClick={async () => {
						try {
							await fetch('http://localhost/backend/admin/logout.php', { method: 'POST', credentials: 'include' });
						} finally {
							window.location.href = '/admin-login';
						}
					}}
					className="mt-6 px-4 py-2 rounded-lg border border-red-600 text-red-500 hover:bg-red-700/20 font-semibold flex items-center gap-2 transition flex-shrink-0"
				>
					<LogOut size={18} />
					Logout
				</button>
			</aside>

			{/* Overlay for mobile */}
			{sidebarOpen && (
				<div
					onClick={toggleSidebar}
					className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
				/>
			)}

			{/* Main Content */}
			<main className="relative flex-1 px-4 pb-6 pt-[4.75rem] sm:px-6 lg:px-10 lg:py-10 overflow-y-auto lg:ml-[19rem] lg:mr-5 lg:mt-5 w-full">
				{/* Floating user badge on large screens */}
				<div className="hidden lg:block absolute top-4 right-4">
					<div className="bg-red-600 rounded-lg px-4 py-2 text-white text-sm font-semibold shadow-md shadow-red-800/30">
						Imantha
						<span className="block text-white/70 text-xs font-normal">Administrator</span>
					</div>
				</div>

				<header className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold text-red-500 mb-1">{headerTitle}</h1>
						<p className="text-white/80 text-sm md:text-base">{renderHeaderSubtitle()}</p>
					</div>
				</header>

				{activeNav === 'Overview' && renderOverview()}
				{activeNav === 'Products' && <ProductDetails />}
				{activeNav === 'Orders' && <Orders />}
				{activeNav === 'Messages' && <Messages />}
				{activeNav === 'Settings' && renderPlaceholder('Settings')}
				{activeNav === 'Reviews' && <Reviews />}
			</main>
		</div>
	);
};

export default AdminDashboard;


