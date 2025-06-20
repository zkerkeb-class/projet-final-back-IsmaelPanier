import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages principales
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages Restaurant
import RestaurantDashboard from './pages/restaurant/Dashboard';
import RestaurantProfile from './pages/restaurant/Profile';
import DishManagement from './pages/restaurant/DishManagement';

// Pages User
import UserDashboard from './pages/user/Dashboard';
import RestaurantList from './pages/user/RestaurantList';
import UserProfile from './pages/user/Profile';

// Composants communs
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Context pour l'authentification
import { AuthProvider } from './context/AuthContext';

// Message de démarrage de l'application
console.log('🚀 Application FoodDelivery démarrée');
console.log('🌐 Frontend accessible sur: http://localhost:3000');
console.log('🔗 Backend API sur: http://localhost:5000');

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Routes Restaurant - Protégées */}
              <Route path="/restaurant/dashboard" element={
                <ProtectedRoute requiredRole="restaurant">
                  <RestaurantDashboard />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/profile" element={
                <ProtectedRoute requiredRole="restaurant">
                  <RestaurantProfile />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/dishes" element={
                <ProtectedRoute requiredRole="restaurant">
                  <DishManagement />
                </ProtectedRoute>
              } />
              
              {/* Routes User - Protégées */}
              <Route path="/user/dashboard" element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/user/restaurants" element={
                <ProtectedRoute requiredRole="user">
                  <RestaurantList />
                </ProtectedRoute>
              } />
              <Route path="/user/profile" element={
                <ProtectedRoute requiredRole="user">
                  <UserProfile />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
