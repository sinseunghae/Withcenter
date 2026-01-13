import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAppDispatch, useAppSelector } from '../app/hook'; // Fixed hook path
import { setPosts, setLoading, setPage, removePost } from '../features/posts/postSlice';
import type { Post } from '../features/posts/postSlice';

export const Home = () => {
    const dispatch = useAppDispatch();
    const { items, status, page } = useAppSelector((state: { posts: any; }) => state.posts);
    const { user } = useAppSelector((state: { auth: any; }) => state.auth);

    const POSTS_PER_PAGE = 3;

    const fetchPosts = async (currentPage: number) => {
        dispatch(setLoading());
        
        const from = currentPage * POSTS_PER_PAGE;
        const to = from + (POSTS_PER_PAGE - 1);

        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error("Archive retrieval error:", error);
        } else {
            dispatch(setPosts(data || []));
        }
    };

    useEffect(() => {
        fetchPosts(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page, dispatch]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("CONFIRM REMOVAL FROM ARCHIVE?")) return;
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (!error) dispatch(removePost(id));
    };

    if (status === 'loading') {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-[10px] tracking-[0.5em] uppercase animate-pulse font-bold">
                    Retrieving Data...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-8 py-20 fade-in">
            <header className="mb-24 border-b border-black pb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-[12vw] md:text-[8vw] font-900 leading-[0.75] tracking-tighter uppercase">
                        BLOGS<span className="text-gray-200">.</span>
                    </h1>
                    <p className="text-[11px] uppercase tracking-[0.3em] mt-6 font-bold text-gray-400">
                        Page 0{page + 1}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-32 gap-x-16">
                {items.map((post: Post, index: number) => {
                    // Logic: First post is full-width (Hero), next two are half-width
                    const isHero = index === 0;
                    return (
                        <article 
                            key={post.id} 
                            className={`${isHero ? 'md:col-span-12' : 'md:col-span-6'} flex flex-col group`}
                        >
                            <Link to={`/edit/${post.id}`} className="block">
                                {post.image_url && (
                                    <div className="post-image-container mb-8 aspect-[16/9] bg-gray-50 border border-gray-100 overflow-hidden">
                                        <img 
                                            src={post.image_url} 
                                            alt="" 
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                                        />
                                    </div>
                                )}
                                
                                <div className={isHero ? "max-w-4xl" : "max-w-full"}>
                                    <h2 className={`font-700 uppercase leading-none mb-6 group-hover:italic transition-all duration-300 ${isHero ? 'text-5xl md:text-7xl' : 'text-3xl'}`}>
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-500 font-light text-lg leading-relaxed line-clamp-2 mb-8">
                                        {post.content}
                                    </p>
                                </div>
                            </Link>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                                <div className="flex gap-8 text-[10px] font-bold tracking-widest uppercase">
                                    <span className="text-gray-300">
                                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                    {user?.id === post.user_id && (
                                        <div className="flex gap-6">
                                            <Link to={`/edit/${post.id}`} className="hover:text-black text-gray-400 transition">Modify</Link>
                                            <button onClick={() => handleDelete(post.id)} className="hover:text-red-600 text-gray-400 transition">Remove</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            <footer className="mt-40 border-t border-black pt-12 flex justify-between items-center">
                <button 
                    disabled={page === 0}
                    onClick={() => dispatch(setPage(page - 1))}
                    className="text-[11px] font-bold uppercase tracking-[0.4em] disabled:opacity-10 hover:line-through decoration-2 transition-all"
                >
                    ← Previous
                </button>

                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    Page 0{page + 1}
                </span>

                <button 
                    disabled={items.length < POSTS_PER_PAGE}
                    onClick={() => dispatch(setPage(page + 1))}
                    className="text-[11px] font-bold uppercase tracking-[0.4em] disabled:opacity-10 hover:line-through decoration-2 transition-all"
                >
                    Next →
                </button>
            </footer>
        </div>
    );
};