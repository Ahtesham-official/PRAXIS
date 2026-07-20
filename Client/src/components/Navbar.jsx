import React from 'react';
import { Sun, Moon, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Navbar({ setAuthView, theme, toggleTheme, session }) {
  const navigate = useNavigate();
  const user = session?.user;
  const initial = user?.user_metadata?.full_name?.charAt(0)?.toUpperCase()
    || user?.email?.charAt(0)?.toUpperCase()
    || 'U';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className={`h-16 w-full flex items-center justify-between px-6 border-b sticky top-0 z-40 transition-colors duration-500 backdrop-blur-md ${
      theme === 'dark' ? 'bg-slate-950/40 border-slate-900 text-white' : 'bg-white/60 border-slate-200 text-slate-900'
    }`}>
      <a href="/" className="text-xl font-black tracking-tighter transition-colors">
        Praxis<span className="text-cyan-400">.</span>
      </a>

      <div className="flex items-center gap-4">
        {/* Light/Dark toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-90 ${
            theme === 'dark' ? 'border-slate-800 bg-slate-900 text-amber-400 hover:bg-slate-800' : 'border-slate-200 bg-slate-100 text-indigo-900 hover:bg-slate-200'
          }`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {user ? (
          /* Logged-in state */
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-2 text-sm font-semibold transition-all cursor-pointer px-3 py-2 rounded-xl border ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            {/* User avatar bubble + logout on click */}
            <button
              onClick={handleLogout}
              title={`Logged in as ${user.email}\nClick to sign out`}
              className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm hover:bg-red-500 transition-colors cursor-pointer shadow-md"
            >
              {initial}
            </button>
          </div>
        ) : (
          /* Logged-out state */
          <>
            <button
              onClick={() => setAuthView('login')}
              className={`text-sm font-semibold transition-all cursor-pointer ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'}`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthView('signup')}
              className={`rounded-xl px-4 py-2 text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                theme === 'dark' ? 'bg-white text-black hover:bg-cyan-400' : 'bg-black text-white hover:bg-slate-800'
              }`}
            >
              Get Started Free
            </button>
          </>
        )}
      </div>
    </nav>
  );
}