import React from 'react';
import { ShoppingCart, DollarSign, Box, Users, BarChart2, LogOut, Settings, Package, List } from 'lucide-react';

const navItems = [
	{ label: 'Overview', icon: <BarChart2 size={20} />, active: true },
	{ label: 'Products', icon: <Box size={20} /> },
	{ label: 'Orders', icon: <Package size={20} /> },
	{ label: 'Settings', icon: <Settings size={20} /> },
];

const statCards = [
	{ label: 'Total Orders', value: '1,248', icon: <ShoppingCart size={28} />, growth: '+12%', color: 'text-red-500', border: 'border-red-800', sub: '', up: true },
	{ label: 'Revenue', value: '$12,540', icon: <DollarSign size={28} />, growth: '+8%', color: 'text-green-400', border: 'border-green-800', sub: '', up: true },
	{ label: 'Products', value: '86', icon: <Box size={28} />, growth: '+3', color: 'text-orange-400', border: 'border-orange-800', sub: '', up: true },
	{ label: 'Visitors', value: '4,321', icon: <Users size={28} />, growth: '+23%', color: 'text-blue-400', border: 'border-blue-800', sub: '', up: true },
];

const AdminDashboard = () => {
	const [sidebarOpen, setSidebarOpen] = React.useState(false);

	return (
		<div className="relative min-h-screen flex bg-gradient-to-b from-[#0a0e14] via-[#0e141d] to-[#0a0e14]">
			{/* Background vignette overlays */}
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(38,60,88,0.28),transparent_60%),radial-gradient(900px_500px_at_80%_90%,rgba(22,36,52,0.26),transparent_60%)]" />
			{/* Mobile Sidebar Toggle */}
			<button 
				onClick={() => setSidebarOpen(!sidebarOpen)}
				className="lg:hidden fixed top-4 left-4 z-50 bg-red-600 p-2 rounded-lg text-white"
			>
				<BarChart2 size={24} />
			</button>

			{/* Sidebar */}
			<aside className={`
				${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
				lg:translate-x-0 
				fixed lg:fixed top-5 left-5
				w-64 h-[calc(100vh-40px)] bg-gradient-to-b from-[#0b0d10]/90 to-[#0a0c11]/80 border border-red-900/40 rounded-2xl shadow-xl shadow-black/40 flex flex-col p-6 
				transition-transform duration-300 ease-in-out z-40
			`}>
				<div className="mb-10 flex items-center gap-3 flex-shrink-0">
					<div className="bg-red-600 rounded-lg p-2"><BarChart2 size={28} className="text-white" /></div>
					<span className="text-xl font-bold text-white tracking-wide">Admin <span className="text-red-500">Panel</span></span>
				</div>
				<nav className="flex-1">
					<ul className="space-y-2">
						{navItems.map((item) => (
							<li key={item.label}>
								<button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white transition font-medium ${item.active ? 'bg-red-600 shadow-[0_0_18px] shadow-red-500/30 ring-1 ring-red-500/40' : 'hover:bg-red-900/40'}`}>
									<span className="text-lg">{item.icon}</span>
									<span>{item.label}</span>
								</button>
							</li>
						))}
					</ul>
				</nav>
				<button 
					onClick={async () => {
						try {
							await fetch('http://localhost/backend/admin/logout.php', { method: 'POST', credentials: 'include' });
							window.location.href = '/admin-login';
						} catch (e) {
							window.location.href = '/admin-login';
						}
					}}
					className="mt-6 px-4 py-2 rounded-lg border border-red-600 text-red-500 hover:bg-red-700/20 font-semibold flex items-center gap-2 transition flex-shrink-0">
					<LogOut size={18} /> Logout
				</button>
			</aside>
			
			{/* Overlay for mobile */}
			{sidebarOpen && (
				<div 
					className="lg:hidden fixed inset-0 bg-black/50 z-30"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

		{/* Main Content */}
		<main className="relative flex-1 p-4 md:p-6 lg:p-10 overflow-y-auto lg:ml-[19rem] lg:mr-5 lg:mt-5 w-full">
			{/* Floating user badge on large screens */}
			<div className="hidden lg:block absolute top-2 right-2">
				<div className="bg-red-600 rounded-lg px-4 py-2 text-white text-sm font-semibold shadow-md shadow-red-800/30">
					Imantha <span className="block text-white/70 text-xs font-normal">Administrator</span>
				</div>
			</div>
				<header className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold text-red-500 mb-1">Dashboard Overview</h1>
						<span className="text-white/80 text-sm md:text-base">Welcome back, <span className="text-red-400 font-semibold">Imantha</span></span>
					</div>
				<div className="flex items-center gap-4 lg:hidden">
					<div className="bg-red-600 rounded-lg px-3 py-1 text-white text-xs font-semibold">Imantha<br /><span className="text-white/60 font-normal">Administrator</span></div>
				</div>
				</header>
				{/* Stat Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-10">
					{statCards.map((card) => (
						<div key={card.label} className={`bg-gradient-to-br from-black/80 to-[#181a20] rounded-2xl p-5 md:p-7 shadow-lg border ${card.border} flex flex-col gap-3`}> 
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2">
									<span className="bg-red-600/10 rounded-lg p-2 text-red-500">{card.icon}</span>
									<span className="text-white/80 text-sm md:text-base font-semibold">{card.label}</span>
								</div>
								<span className={`text-xs md:text-sm font-semibold ${card.color}`}>{card.growth}</span>
							</div>
							<div className="text-2xl md:text-3xl font-bold text-white">{card.value}</div>
						</div>
					))}
				</div>
				{/* Weekly Sales Chart */}
				<div className="bg-black/80 rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-800/40 mb-6 md:mb-10">
					<div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
						<div>
							<h2 className="text-base md:text-lg font-bold text-white mb-1 flex items-center gap-2"><List size={18} className="text-red-500" /> Weekly Sales</h2>
							<span className="text-white/60 text-xs md:text-sm">Last 7 days performance</span>
						</div>
						<div className="text-xl md:text-2xl font-bold text-white">$4,890 <span className="text-green-400 text-sm md:text-base font-semibold ml-2">+15.3%</span></div>
					</div>
					{/* Bar Chart SVG */}
					<div className="w-full h-40 md:h-56 flex items-end justify-center overflow-x-auto">
						<svg width="100%" height="100%" viewBox="0 0 420 160" preserveAspectRatio="xMidYMid meet">
							<rect x="0" y="0" width="420" height="160" rx="16" fill="#18181b" />
							{/* Bars */}
							<rect x="30" y="90" width="32" height="50" rx="6" fill="#c10c0cff" />
							<rect x="80" y="110" width="32" height="30" rx="6" fill="#c10c0cff" />
							<rect x="130" y="60" width="32" height="80" rx="6" fill="#c10c0cff" />
							<rect x="180" y="120" width="32" height="20" rx="6" fill="#c10c0cff" />
							<rect x="230" y="40" width="32" height="100" rx="6" fill="#c10c0cff" />
							<rect x="280" y="80" width="32" height="60" rx="6" fill="#c10c0cff" />
							<rect x="330" y="100" width="32" height="40" rx="6" fill="#c10c0cff" />
							{/* X axis labels */}
							<text x="46"  y="155" textAnchor="middle" fontSize="14" fill="#fff">Mon</text>
							<text x="96"  y="155" textAnchor="middle" fontSize="14" fill="#fff">Tue</text>
							<text x="146" y="155" textAnchor="middle" fontSize="14" fill="#fff">Wed</text>
							<text x="196" y="155" textAnchor="middle" fontSize="14" fill="#fff">Thu</text>
							<text x="246" y="155" textAnchor="middle" fontSize="14" fill="#fff">Fri</text>
							<text x="296" y="155" textAnchor="middle" fontSize="14" fill="#fff">Sat</text>
							<text x="346" y="155" textAnchor="middle" fontSize="14" fill="#fff">Sun</text>
						</svg>
					</div>
				</div>
				{/* Recent Orders Table */}
				<div className="bg-black/80 rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-800/40">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
						<h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2"><ShoppingCart size={18} className="text-red-500" /> Recent Orders</h2>
						<button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs md:text-sm transition w-full sm:w-auto">View All</button>
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
								{/* Example rows, replace with real data */}
								<tr className="border-b border-gray-800/40">
									<td className="py-2 px-4">#1001</td>
									<td className="py-2 px-4">Chamidu S.</td>
									<td className="py-2 px-4">$120.00</td>
									<td className="py-2 px-4"><span className="px-3 py-1 rounded-full bg-green-700/30 text-green-400 text-xs font-semibold">Completed</span></td>
								</tr>
								<tr className="border-b border-gray-800/40">
									<td className="py-2 px-4">#1002</td>
									<td className="py-2 px-4">Nova Sync</td>
									<td className="py-2 px-4">$75.50</td>
									<td className="py-2 px-4"><span className="px-3 py-1 rounded-full bg-yellow-700/30 text-yellow-400 text-xs font-semibold">Pending</span></td>
								</tr>
								<tr>
									<td className="py-2 px-4">#1003</td>
									<td className="py-2 px-4">Test User</td>
									<td className="py-2 px-4">$49.99</td>
									<td className="py-2 px-4"><span className="px-3 py-1 rounded-full bg-red-700/30 text-red-400 text-xs font-semibold">Cancelled</span></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</main>
		</div>
	);
};

export default AdminDashboard;


