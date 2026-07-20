import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LandingPage from './pages/LandingPage';
import WorkspacePage from './pages/WorkspacePage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

// Simple guard: redirects unauthenticated users away from protected pages
function ProtectedRoute({ session, children }) {
  if (session === undefined) {
    // Still loading — show nothing to avoid flash
    return null;
  }
  if (!session) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const [authView, setAuthView] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  // undefined = loading, null = logged out, object = logged in
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Listen for auth state changes (handles Google OAuth redirect callbacks too)
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null);
    });

    // Subscribe to future changes (login, logout, token refresh, OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              authView={authView}
              setAuthView={setAuthView}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              theme={theme}
              toggleTheme={toggleTheme}
              session={session}
            />
          }
        />
        <Route
          path="/workspace/:videoId"
          element={
            <ProtectedRoute session={session}>
              <WorkspacePage theme={theme} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute session={session}>
              <DashboardPage theme={theme} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}