import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

        if (error) {
        alert(error.message);
        } else {
        navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100-h-80px)] grid grid-cols-1 md:grid-cols-2 fade-in">
        
        <div className="hidden md:flex bg-black text-white p-20 flex-col justify-between items-start">
            <h2 className="text-[6vw] font-900 leading-[0.8] tracking-tighter uppercase">
            Welcome To Blogs<span className="text-gray-600">.</span>
            </h2>
            <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Identity Verification Required</p>
            <div className="h-[1px] w-24 bg-white"></div>
            </div>
        </div>

        <div className="flex items-center justify-center p-8 bg-white">
            <div className="max-w-md w-full space-y-12">
            <header>
                <h3 className="text-xs font-bold uppercase tracking-[0.4em] mb-2">
                {isSignUp ? 'New Account' : 'Already a user'}
                </h3>
                <div className="h-[2px] w-8 bg-black"></div>
            </header>

            <form onSubmit={handleAuth} className="space-y-8">
                <div className="group">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 group-focus-within:text-black transition-colors">
                    Email
                </label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2" // Note: Base styling comes from index.css
                    required
                />
                </div>

                <div className="group">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 group-focus-within:text-black transition-colors">
                    Password
                </label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2"
                    required
                />
                </div>

                <div className="pt-4 flex flex-col gap-6">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full text-center" // Inherits the boxed style from index.css
                >
                    {loading ? 'Authenticating...' : isSignUp ? 'Sign Up' : 'Sign in'}
                </button>

                <button 
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-black transition-colors underline decoration-1 underline-offset-8"
                >
                    {isSignUp ? 'Already registered? Login' : 'No Access? Request Account'}
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
};