import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from './lib/auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import UserReviewsPage from './pages/UserReviewsPage';
import SavedRestaurantsPage from './pages/SavedRestaurantsPage';
import FavoritesPage from './pages/FavoritesPage';
import NotificationsPage from './pages/NotificationsPage';
import RestaurantOwnerDashboard from './pages/RestaurantOwnerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const stripePromise = loadStripe('pk_test_51RKNmTAu7kC16BALKX1tMtIQluaDbZW5mq6zWDvyYoPGcrFZWOUlnYQiNkiDHWFhTKZg4BDFtUl2tDMhlmwfS8j500DkYsYpls');

const options = {
  fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <ErrorBoundary>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/notifications" element={
                  <ProtectedRoute user={user} isLoading={loading}>
                    <NotificationsPage />
                  </ProtectedRoute>
                } />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute user={user} isLoading={loading} requiredRole="admin">
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/dashboard" 
                  element={
                    <ProtectedRoute user={user} isLoading={loading} requiredRole="restaurant_owner">
                      <RestaurantOwnerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute user={user} isLoading={loading}>
                      <ProfilePage user={user} />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-reviews" 
                  element={
                    <ProtectedRoute user={user} isLoading={loading}>
                      <UserReviewsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/saved-restaurants" 
                  element={
                    <ProtectedRoute user={user} isLoading={loading}>
                      <SavedRestaurantsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/favorites" 
                  element={
                    <ProtectedRoute user={user} isLoading={loading}>
                      <FavoritesPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </Elements>
  );
}

export default App;