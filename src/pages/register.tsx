import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
        alert(error.message);
        } else {
        alert("Archive Access Requested. Check your email to verify.");
        navigate('/login');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-white flex flex-col items-center justify-center px-6 fade-in">
        <div className="max-w-md w-full">
            {/* Editorial Header */}
            <header className="mb-16">
            <p className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mb-4">Formal Application</p>
            <h1 className="text-6xl font-900 uppercase tracking-tighter leading-none">
                Register<span className="text-gray-200">.</span>
            </h1>
            <div className="h-[1px] w-full bg-black mt-8"></div>
            </header>

            <form onSubmit={handleRegister} className="space-y-10">
            {/* Email Input */}
            <div className="group">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 group-focus-within:text-black transition-colors">
                Identity Email
                </label>
                <input 
                type="email" 
                placeholder="USER@ARCHIVE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 text-xl font-light placeholder:text-gray-100 uppercase"
                required
                />
            </div>

            {/* Password Input */}
            <div className="group">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 group-focus-within:text-black transition-colors">
                Security String
                </label>
                <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 text-xl font-light"
                required
                />
            </div>

            {/* Submit Action */}
            <div className="pt-6">
                <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 text-[11px] tracking-[0.3em] font-bold uppercase bg-black text-white border border-black hover:bg-white hover:text-black transition-all"
                >
                {loading ? 'Initializing...' : 'Create Access'}
                </button>
                
                <div className="mt-10 flex justify-between items-center text-[10px] tracking-widest uppercase">
                <span className="text-gray-400 font-medium text-xs lowercase">Already indexed?</span>
                <Link to="/login" className="font-bold border-b border-black pb-1 hover:text-gray-400 hover:border-gray-400 transition-colors">
                    Login
                </Link>
                </div>
            </div>
            </form>
        </div>
        </div>
    );
};