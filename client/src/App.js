import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/theme.css';

// Pages principales
import Home from './pages/common/Home';
import About from './pages/common/About';
import Contact from './pages/common/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages Restaurant
import RestaurantDashboard from './pages/restaurant/Dashboard';
import RestaurantProfile from './pages/restaurant/Profile';
import DishManagement from './pages/restaurant/DishManagement';
import AdvancedDishManagement from './pages/restaurant/AdvancedDishManagement';
import OrderManagement from './pages/restaurant/OrderManagement';

// Pages User
import UserDashboard from './pages/user/Dashboard';
import RestaurantList from './pages/user/RestaurantList';
import UserProfile from './pages/user/Profile';

// Composants communs
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Context pour l'authentification et le thème
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Message de démarrage de l'application
console.log('🚀 Application FoodDelivery démarrée');
console.log('🌐 Frontend accessible sur: http://localhost:3000');
console.log('🔗 Backend API sur: http://localhost:5000');
console.log('🎨 Système de thème clair/sombre activé');

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                {/* Routes publiques principales */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
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
                <Route path="/restaurant/dishes/advanced" element={
                  <ProtectedRoute requiredRole="restaurant">
                    <AdvancedDishManagement />
                  </ProtectedRoute>
                } />
                <Route path="/restaurant/orders" element={
                  <ProtectedRoute requiredRole="restaurant">
                    <OrderManagement />
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

                {/* Route de fallback */}
                <Route path="*" element={
                  <div className="not-found">
                    <h1>404 - Page non trouvée</h1>
                    <p>La page que vous recherchez n'existe pas.</p>
                    <a href="/" className="btn btn-primary">Retour à l'accueil</a>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
