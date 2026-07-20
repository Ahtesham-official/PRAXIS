import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ authView, setAuthView, showPassword, setShowPassword, theme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async () => {
    setError('');
    try {
      setLoading(true);

      if (authView === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) { setError(error.message); return; }
        // If email confirmation is disabled in Supabase, session is immediate
        if (data.session) {
          setAuthView(null);
          navigate('/dashboard');
        } else {
          setError('Account created! Check your email to confirm before logging in.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setError(error.message); return; }
        setAuthView(null);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      setOauthLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      if (error) setError(error.message);
      // On success, browser redirects to Google — no further action needed here
    } catch (err) {
      console.error(err);
      setError('Google sign-in failed. Please try again.');
      setOauthLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`w-full max-w-md rounded-3xl p-8 relative border flex flex-col shadow-2xl transition-colors duration-500 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button 
          onClick={() => setAuthView(null)} 
          className="absolute top-5 right-6 text-slate-400 hover:text-cyan-400 text-xl font-bold cursor-pointer transition-colors"
        >
          ✕
        </button>

        <h2 className="text-3xl font-extrabold tracking-tight">
          {authView === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className={`text-sm mt-1.5 mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          {authView === 'login' ? 'Glad to have you back! Please enter your details.' : 'Start transforming your video consumption into real code.'}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={handleGoogleAuth}
            disabled={oauthLoading || loading}
            className={`flex items-center justify-center gap-2 border rounded-2xl py-3 active:scale-98 transition-all font-semibold text-sm cursor-pointer disabled:opacity-60 ${
              theme === 'dark' ? 'border-slate-800 bg-slate-950 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            {oauthLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FcGoogle className="text-lg" />}
            {oauthLoading ? 'Redirecting...' : 'Google'}
          </button>
          <button
            disabled
            title="GitHub login coming soon"
            className={`flex items-center justify-center gap-2 border rounded-2xl py-3 transition-all font-semibold text-sm opacity-40 cursor-not-allowed ${
              theme === 'dark' ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <FaGithub className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`} /> GitHub
          </button>
        </div>

        <div className="flex items-center my-3">
          <div className={`flex-1 h-[1px] ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          <span className="text-xs text-slate-400 px-3 font-medium uppercase tracking-wider">or</span>
          <div className={`flex-1 h-[1px] ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 mt-2">
          {authView === 'signup' && (
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 pl-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="Alex Mercer" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full h-12 px-4 rounded-xl border outline-none transition-all ${
                  theme === 'dark' ? 'border-slate-800 bg-slate-950/50 text-white focus:border-cyan-500' : 'border-slate-200 bg-slate-50 text-black focus:border-black'
                }`} 
              />
            </div>
          )}

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 pl-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full h-12 px-4 rounded-xl border outline-none transition-all ${
                theme === 'dark' ? 'border-slate-800 bg-slate-950/50 text-white focus:border-cyan-500' : 'border-slate-200 bg-slate-50 text-black focus:border-black'
              }`} 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 pl-1">
              <label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Password</label>
              {authView === 'login' && <a href="#" className="text-xs font-semibold text-slate-400 hover:text-cyan-400 underline">Forgot?</a>}
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-12 px-4 pr-12 rounded-xl border outline-none transition-all ${
                  theme === 'dark' ? 'border-slate-800 bg-slate-950/50 text-white focus:border-cyan-500' : 'border-slate-200 bg-slate-50 text-black focus:border-black'
                }`} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[32%] text-slate-400 hover:text-cyan-400 cursor-pointer text-lg">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <button 
            type="button" 
            onClick={handleAuth} 
            disabled={loading || oauthLoading}
            className={`w-full h-13 rounded-xl font-bold text-base mt-2 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 ${
              theme === 'dark' ? 'bg-white text-black hover:bg-cyan-400 shadow-white/5' : 'bg-black text-white hover:bg-slate-800 shadow-black/15'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>{loading ? 'Please wait...' : authView === 'login' ? 'Sign In' : 'Register Account'}</span>
          </button>
        </form>

        <p className="text-sm text-center text-slate-400 mt-6 font-medium">
          {authView === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setAuthView(authView === 'login' ? 'signup' : 'login'); setShowPassword(false); }}
            className={`font-bold underline cursor-pointer ${theme === 'dark' ? 'text-white hover:text-cyan-400' : 'text-black hover:text-slate-700'}`}
          >
            {authView === 'login' ? 'Sign up for free' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  );
}