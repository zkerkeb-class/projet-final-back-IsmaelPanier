import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// URL de l'API backend
const API_BASE_URL = 'http://localhost:5000';

// Message de confirmation de connexion au backend
console.log('🔗 Connexion au backend établie sur:', API_BASE_URL);
console.log('✅ Frontend prêt à communiquer avec l\'API');

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Vérifier le token au chargement
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            console.log('👤 Utilisateur connecté:', userData.email);
          } else {
            // Token invalide
            localStorage.removeItem('token');
            setToken(null);
            console.log('❌ Token invalide, déconnexion automatique');
          }
        } catch (error) {
          console.error('Erreur de vérification auth:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      } else {
        console.log('🔓 Aucun utilisateur connecté');
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('🔐 Tentative de connexion pour:', email);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      console.log('✅ Connexion réussie pour:', data.user.email);
      return { success: true, user: data.user };
    } catch (error) {
      console.log('❌ Échec de connexion:', error.message);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Tentative d\'inscription pour:', userData.email);
      console.log('🔗 URL de l\'API:', `${API_BASE_URL}/auth/register`);
      
      // Combiner firstName et lastName en name
      const backendData = {
        email: userData.email,
        password: userData.password,
        name: `${userData.firstName} ${userData.lastName}`.trim(),
        role: userData.role,
      };
      
      console.log('📦 Données envoyées au backend:', backendData);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      console.log('📡 Statut de la réponse:', response.status);
      console.log('📡 Headers de la réponse:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ Erreur reçue:', errorData);
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      const data = await response.json();
      console.log('✅ Inscription réussie pour:', data.user.email);
      
      // Connecter automatiquement l'utilisateur après inscription
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        setUser(data.user);
        console.log('🔐 Utilisateur automatiquement connecté après inscription');
      }
      
      return { success: true, user: data.user };
    } catch (error) {
      console.log('❌ Échec d\'inscription:', error.message);
      console.log('❌ Détails de l\'erreur:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    console.log('🚪 Déconnexion de l\'utilisateur');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isRestaurant: user?.role === 'restaurant',
    isUser: user?.role === 'user',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 