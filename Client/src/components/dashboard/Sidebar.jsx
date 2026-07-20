import React from 'react';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Sidebar({ theme, userName, userEmail }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  return (
    <aside className={`w-64 h-screen sticky top-0 hidden md:flex flex-col justify-between p-6 border-r transition-colors duration-500 ${
      theme === 'dark' ? 'bg-slate-900/40 border-slate-900' : 'bg-white border-slate-200/60'
    }`}>
      <div className="space-y-8">
        {/* Brand Header updated to Praxis. */}
        <div className="px-2">
          <a href="#" className={`text-2xl font-black tracking-tighter transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>
            Praxis<span className="text-cyan-400">.</span>
          </a>
        </div>

        {/* Navigation Rail */}
        <nav className="space-y-1.5">
          <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            theme === 'dark' ? 'bg-violet-500/10 text-violet-400' : 'bg-violet-600 text-white shadow-sm shadow-violet-600/10'
          }`}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </a>
        </nav>
      </div>

      {/* User Session card Anchor */}
      <div className={`flex items-center justify-between p-3 rounded-xl border ${
        theme === 'dark' ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm">
            {userName ? userName.charAt(0).toUpperCase() : "G"}
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">{userName || "Guest"}</h4>
            <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px] block">{userEmail || "View Profile"}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}