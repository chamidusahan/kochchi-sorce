import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Simple route guard that checks the PHP session
// Renders children if authenticated; otherwise redirects to /admin-login
const ProtectedRoute = ({ children }) => {
	const location = useLocation();
	const [state, setState] = React.useState({ loading: true, authed: false });

	React.useEffect(() => {
		let cancelled = false;
		const check = async () => {
			try {
				const res = await fetch('http://localhost/backend/admin/check-session.php', {
					credentials: 'include',
				});
				if (!cancelled) {
					if (res.ok) {
						const data = await res.json();
						setState({ loading: false, authed: !!data?.authenticated });
					} else {
						setState({ loading: false, authed: false });
					}
				}
			} catch (e) {
				if (!cancelled) setState({ loading: false, authed: false });
			}
		};
		check();
		return () => { cancelled = true; };
	}, [location.pathname]);

	if (state.loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-black text-white">
				<div className="animate-spin rounded-full h-10 w-10 border-2 border-red-600 border-t-transparent" />
			</div>
		);
	}

	if (!state.authed) {
		return <Navigate to="/admin-login" replace state={{ from: location }} />;
	}

	return children;
};

export default ProtectedRoute;

