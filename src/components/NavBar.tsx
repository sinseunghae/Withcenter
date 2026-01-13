import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hook';
import { logout } from '../features/auth/authSlice';
import { supabase } from '../services/supabaseClient';

export const Navbar = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        dispatch(logout());
    };

    return (
        <nav className="w-full bg-white border-b-[1.5px] border-black sticky top-0 z-[100] px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-baseline">
            
            {/* Left: Branding */}
            <div className="flex flex-col">
            <Link to="/" className="text-3xl font-900 tracking-tighter uppercase leading-none hover:italic transition-all">
                Withcenter<span className="text-gray-300">.</span>
            </Link>
            <span className="text-[9px] uppercase tracking-[0.4em] text-gray-400 mt-1 font-bold">
                Assessment
            </span>
            </div>

            {/* Right: Navigation Links */}
            <div className="flex items-center gap-12">
            <ul className="flex gap-10 text-[10px] uppercase tracking-[0.2em] font-bold">
                <li>
                <Link to="" className="hover:line-through decoration-2 underline-offset-4">
                    Home
                </Link>
                </li>
                {user ? (
                <>
                    <li>
                    <Link to="/create" className="hover:line-through decoration-2 underline-offset-4">
                        Enter New Blog
                    </Link>
                    </li>
                    <li>
                    <button 
                        onClick={handleLogout}
                        className="hover:text-red-600 transition-colors tracking-[0.2em] uppercase font-bold"
                    >
                        Logout
                    </button>
                    </li>
                </>
                ) : (
                <li>
                    <Link 
                    to="/login" 
                    className="bg-black text-white px-5 py-2 hover:bg-white hover:text-black border border-black transition-all"
                    >
                    Login
                    </Link>
                </li>
                )}
            </ul>

            {/* User Identity Marker (Minimalist Avatar) */}
            {user && (
                <div className="hidden md:flex items-center pl-10 border-l border-gray-100 gap-3">
                <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-medium">
                    User: {user.email?.split('@')[0]}
                </span>
                </div>
            )}
            </div>
        </div>
        </nav>
    );
    };