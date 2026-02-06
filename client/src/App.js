import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './styles/theme.css';

// Composants communs
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import SocketStatus from './components/common/SocketStatus';
import LoadingSpinner from './components/common/LoadingSpinner';

// Context pour l'authentification, le thème et Socket.io
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';

// Lazy loading des pages pour optimiser les performances
const LandingPage = lazy(() => import('./pages/LandingPage'));
const About = lazy(() => import('./pages/common/About'));
const Contact = lazy(() => import('./pages/common/Contact'));
const NavigationGuide = lazy(() => import('./pages/common/NavigationGuide'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const RestaurantRegister = lazy(() => import('./pages/auth/RestaurantRegister'));

// Pages Restaurant - Lazy loaded
const RestaurantDashboard = lazy(() => import('./pages/restaurant/Dashboard'));
const RestaurantDashboardTest = lazy(() => import('./pages/restaurant/DashboardTest'));
const RestaurantProfile = lazy(() => import('./pages/restaurant/Profile'));
const DishManagement = lazy(() => import('./pages/restaurant/DishManagement'));
const AdvancedDishManagement = lazy(() => import('./pages/restaurant/AdvancedDishManagement'));
const OrderManagement = lazy(() => import('./pages/restaurant/OrderManagement'));

// Pages User - Lazy loaded
const UserDashboard = lazy(() => import('./pages/user/Dashboard'));
const RestaurantList = lazy(() => import('./pages/user/RestaurantList'));
const RestaurantMenu = lazy(() => import('./pages/user/RestaurantMenu'));
const RestaurantDetails = lazy(() => import('./pages/user/RestaurantDetails'));
const OrderTracking = lazy(() => import('./pages/user/OrderTracking'));
const OrderHistory = lazy(() => import('./pages/user/OrderHistory'));
const Orders = lazy(() => import('./pages/user/Orders'));
const Favorites = lazy(() => import('./pages/user/Favorites'));
const UserProfile = lazy(() => import('./pages/user/Profile'));

// Composant de fallback pour le lazy loading
const PageLoader = () => (
  <div className="page-loader">
    <LoadingSpinner />
    <p>Chargement de la page...</p>
  </div>
);

// Composant 404
const NotFound = () => (
  <div className="not-found">
    <h1>404 - Page non trouvée</h1>
    <p>La page que vous recherchez n'existe pas.</p>
    <a href="/" className="btn btn-primary">Retour à l'accueil</a>
  </div>
);

function App() {
  // Message de démarrage de l'application (seulement en développement)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Application FoodDelivery+ démarrée');
      console.log('🌐 Frontend accessible sur: http://localhost:3000');
      console.log('🔗 Backend API sur: http://localhost:5000');
      console.log('🎨 Système de thème clair/sombre activé');
      console.log('🔌 Socket.io activé pour les notifications temps réel');
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className="App">
              <Header />
              <main className="main-content">
                <Suspense fallback={<PageLoader />}>
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
                    <Route path="/restaurant/dashboard-test" element={
                      <ProtectedRoute requiredRole="restaurant">
                        <RestaurantDashboardTest />
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
                        <Orders />
                      </ProtectedRoute>
                    } />
                    <Route path="/user/order-history" element={
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
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              
              {/* Indicateur de connexion Socket.io */}
              <SocketStatus />
              
              {/* Toast Container pour les notifications */}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
