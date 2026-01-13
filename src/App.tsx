import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import { useAppDispatch, useAppSelector } from './app/hook';
import { setUser, setLoading } from './features/auth/authSlice';

// Components & Pages (Ensure Navbar filename casing matches your file)
import { Navbar } from './components/NavBar';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { CreatePost } from './pages/createPost';
import { EditPost } from './pages/editPost';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(setLoading());
      
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      dispatch(setUser(session?.user ?? null));

      // Listen for identity changes (Login, Logout, Token Refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        dispatch(setUser(session?.user ?? null));
      });

      return () => subscription.unsubscribe();
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-black selection:text-white">
      {/* Editorial Masthead */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Top-level Loading Indicator for Auth Checks */}
        {status === 'loading' && (
          <div className="h-[1px] bg-black animate-pulse w-full fixed top-0 z-[110]" />
        )}
        
        <Routes>
          {/* Public Archive Access */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Restricted Editorial Suite */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Route>

          {/* Minimalist 404 - Entry Not Found */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center py-40 fade-in">
              <h1 className="text-[15vw] font-900 leading-none tracking-tighter uppercase">404</h1>
              <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-gray-400 mt-4">
                This Entry Does Not Exist In The Archive
              </p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;