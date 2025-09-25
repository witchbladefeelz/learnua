import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/auth/AdminRoute';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';

import ProtectedRoute from './components/auth/ProtectedRoute';

const TRANSITION_DURATION = 240;

function App() {
  const { loading } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname && transitionStage !== 'fade-out') {
      setTransitionStage('fade-out');
    }
  }, [location, displayLocation, transitionStage]);

  useEffect(() => {
    if (transitionStage === 'fade-out') {
      const timeout = window.setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fade-in');
      }, TRANSITION_DURATION);

      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [transitionStage, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className={isHome ? 'flex-1' : 'flex-1 w-full relative'}>
          <div className={`page-transition-wrapper ${transitionStage}`}>
            <Routes location={displayLocation}>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/lessons" element={
                <ProtectedRoute>
                  <Lessons />
                </ProtectedRoute>
              } />
              <Route path="/lessons/:id" element={
                <ProtectedRoute>
                  <LessonDetail />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/users/:id" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
