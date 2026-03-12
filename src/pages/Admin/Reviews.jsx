import React from 'react';
import { Loader2, RefreshCw, ShieldCheck, ShieldOff } from 'lucide-react';

const tabs = [
	{ key: 'pending', label: 'Pending', description: 'Awaiting moderation' },
	{ key: 'approved', label: 'Approved', description: 'Visible to customers' },
];

const Reviews = () => {
	const [activeTab, setActiveTab] = React.useState('pending');
	const [ratings, setRatings] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState('');
	const [actionStates, setActionStates] = React.useState({});

	const fetchRatings = React.useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const response = await fetch('backend/admin/api/get-ratings.php', {
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to load ratings');
			}

			const payload = await response.json();

			if (!payload.success) {
				throw new Error(payload.message || 'Unable to load ratings');
			}

			setRatings(Array.isArray(payload.data) ? payload.data : []);
		} catch (err) {
			setError(err.message || 'Unexpected error occurred');
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		fetchRatings();
	}, [fetchRatings]);

	const filteredRatings = ratings.filter((rating) =>
		activeTab === 'pending' ? Number(rating.is_approved) !== 1 : Number(rating.is_approved) === 1
	);

	const handleAction = async (ratingId, action) => {
		setActionStates((prev) => ({ ...prev, [ratingId]: action }));
		try {
			const response = await fetch('backend/admin/api/update-rating-status.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ ratingId, action }),
			});

			if (!response.ok) {
				throw new Error('Failed to update rating');
			}

			const payload = await response.json();
			if (!payload.success) {
				throw new Error(payload.message || 'Unable to update rating');
			}

			setRatings((prev) => {
				if (action === 'reject') {
					return prev.filter((rating) => Number(rating.id) !== Number(ratingId));
				}
				return prev.map((rating) =>
					Number(rating.id) === Number(ratingId)
						? { ...rating, is_approved: action === 'approve' ? 1 : 0 }
						: rating
				);
			});
		} catch (err) {
			setError(err.message || 'Unexpected error occurred');
		} finally {
			setActionStates((prev) => {
				const { [ratingId]: _ignored, ...rest } = prev;
				return rest;
			});
		}
	};

	return (
		<section className="bg-black/80 rounded-2xl border border-gray-800/50 p-5 md:p-7 text-white shadow-lg shadow-black/30">
			<header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
				<div>
					<h2 className="text-xl md:text-2xl font-semibold text-red-400">Review Moderation</h2>
					<p className="text-sm text-white/60">Approve or reject customer feedback before it appears publicly.</p>
				</div>
				<button
					onClick={fetchRatings}
					disabled={loading}
					className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-400 hover:bg-red-600/10 transition disabled:opacity-60"
				>
					<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
					Refresh
				</button>
			</header>

			<nav className="flex flex-wrap gap-3 mb-6">
				{tabs.map((tab) => {
					const active = tab.key === activeTab;
					return (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`px-4 py-2 rounded-xl border transition text-sm md:text-base font-medium ${
								active
									? 'bg-red-600 text-white border-red-500 shadow-[0_0_18px] shadow-red-600/40'
									: 'border-red-900/50 text-white/70 hover:bg-red-900/30'
							}`}
						>
							<span>{tab.label}</span>
							<span className="block text-xs text-white/50">{tab.description}</span>
						</button>
					);
				})}
			</nav>

			{error && (
				<div className="mb-5 rounded-xl border border-red-700/50 bg-red-900/40 px-4 py-3 text-sm text-red-200">
					{error}
				</div>
			)}

			{loading ? (
				<div className="flex justify-center items-center py-16">
					<Loader2 size={28} className="animate-spin text-red-400" />
				</div>
			) : filteredRatings.length === 0 ? (
				<div className="rounded-xl border border-gray-800/60 bg-black/40 px-5 py-12 text-center">
					<p className="text-white/70 text-sm md:text-base">
						{activeTab === 'pending'
							? 'There are no reviews awaiting moderation.'
							: 'No approved reviews to display right now.'}
					</p>
				</div>
			) : (
				<ul className="space-y-4">
					{filteredRatings.map((rating) => {
						const isProcessing = actionStates[rating.id];
						const fullName = [rating.first_name, rating.last_name].filter(Boolean).join(' ') || 'Guest User';
						const showApproveButton = activeTab !== 'approved';
						return (
							<li key={rating.id} className="rounded-2xl border border-gray-800/50 bg-black/60 p-5">
								<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
									<div className="flex-1 space-y-2">
										<div className="flex flex-wrap items-center gap-3">
											<span className="px-3 py-1 rounded-lg bg-red-600/20 text-red-300 text-xs font-semibold">
												Rating: {rating.rating}/5
											</span>
											<span className="text-sm text-white/60">
												Submitted {new Date(rating.created_at).toLocaleString()}
											</span>
										</div>
										<h3 className="text-lg font-semibold text-white">{fullName}</h3>
										{rating.email && <p className="text-xs text-white/40">{rating.email}</p>}
										<p className="text-sm text-white/80 leading-relaxed">{rating.comment || 'No comment provided.'}</p>
									</div>
									<div className="flex flex-wrap items-center gap-3">
										{showApproveButton && (
											<button
												onClick={() => handleAction(rating.id, 'approve')}
												disabled={Boolean(isProcessing) || Number(rating.is_approved) === 1}
												className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600/20 text-green-300 border border-green-700/60 hover:bg-green-600/30 transition disabled:opacity-60"
											>
												<ShieldCheck size={16} />
												Approve
											</button>
										)}
										<button
											onClick={() => handleAction(rating.id, 'reject')}
											disabled={Boolean(isProcessing)}
											className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-200 border border-red-700/60 hover:bg-red-600/30 transition disabled:opacity-60"
										>
											<ShieldOff size={16} />
											Reject
										</button>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
};

export default Reviews;
