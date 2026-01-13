import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hook';

export const ProtectedRoute = () => {
    const { user, status } = useAppSelector((state: { auth: any; }) => state.auth);
    const location = useLocation();

    // 1. Loading State: Minimalist "Identity Check"
    if (status === 'loading') {
        return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 fade-in">
            <div className="max-w-xs w-full text-center space-y-4">
            <div className="h-[1px] w-full bg-black animate-pulse"></div>
            <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-black animate-pulse">
                Verifying Identity...
            </p>
            <div className="h-[1px] w-full bg-black animate-pulse"></div>
            </div>
        </div>
        );
    }

    // 2. Redirect: If no user, send to login but save where they were trying to go
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Success: Render the child components
    return <Outlet />;
};