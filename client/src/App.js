import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/theme.css';

// Pages principales
import LandingPage from './pages/LandingPage';
import About from './pages/common/About';
import Contact from './pages/common/Contact';
import NavigationGuide from './pages/common/NavigationGuide';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RestaurantRegister from './pages/auth/RestaurantRegister';

// Pages Restaurant
import RestaurantDashboard from './pages/restaurant/Dashboard';
import RestaurantProfile from './pages/restaurant/Profile';
import DishManagement from './pages/restaurant/DishManagement';
import AdvancedDishManagement from './pages/restaurant/AdvancedDishManagement';
import OrderManagement from './pages/restaurant/OrderManagement';

// Pages User
import UserDashboard from './pages/user/Dashboard';
import RestaurantList from './pages/user/RestaurantList';
import RestaurantMenu from './pages/user/RestaurantMenu';
import RestaurantDetails from './pages/user/RestaurantDetails';
import OrderTracking from './pages/user/OrderTracking';
import OrderHistory from './pages/user/OrderHistory';
import Favorites from './pages/user/Favorites';
import UserProfile from './pages/user/Profile';

// Composants communs
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Context pour l'authentification et le thème
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  // Message de démarrage de l'application
  useEffect(() => {
    console.log('🚀 Application FoodDelivery+ démarrée');
    console.log('🌐 Frontend accessible sur: http://localhost:3000');
    console.log('🔗 Backend API sur: http://localhost:5000');
    console.log('🎨 Système de thème clair/sombre activé');
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                {/* Routes publiques principales */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/navigation-guide" element={<NavigationGuide />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/restaurant-register" element={<RestaurantRegister />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/restaurant-register" element={<RestaurantRegister />} />
                
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
                <Route path="/user/restaurant/:id" element={
                  <ProtectedRoute requiredRole="user">
                    <RestaurantDetails />
                  </ProtectedRoute>
                } />
                <Route path="/user/restaurant/:restaurantId/menu" element={
                  <ProtectedRoute requiredRole="user">
                    <RestaurantMenu />
                  </ProtectedRoute>
                } />
                <Route path="/user/orders" element={
                  <ProtectedRoute requiredRole="user">
                    <OrderHistory />
                  </ProtectedRoute>
                } />
                <Route path="/user/orders/:orderId" element={
                  <ProtectedRoute requiredRole="user">
                    <OrderTracking />
                  </ProtectedRoute>
                } />
                <Route path="/user/favorites" element={
                  <ProtectedRoute requiredRole="user">
                    <Favorites />
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
