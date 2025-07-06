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
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // Vérifier le token au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (savedToken) {
        try {
          console.log('🔍 Vérification du token existant...');
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(savedToken);
            console.log('✅ Utilisateur restauré depuis le token:', userData.email);
            setIsFirstVisit(false);
          } else {
            // Token invalide
            console.log('❌ Token invalide, suppression...');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('❌ Erreur de vérification auth:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('🔓 Aucun token trouvé');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email ou mot de passe incorrect');
      }

      const data = await response.json();
      
      // Sauvegarder le token
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      
      // Déterminer si c'est un retour ou une première connexion
      const wasLoggedIn = localStorage.getItem('wasLoggedIn') === 'true';
      setIsFirstVisit(!wasLoggedIn);
      localStorage.setItem('wasLoggedIn', 'true');
      
      console.log('✅ Connexion réussie pour:', data.user.email);
      return { success: true, user: data.user, isReturning: wasLoggedIn };
    } catch (error) {
      console.log('❌ Échec de connexion:', error.message);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Tentative d\'inscription pour:', userData.email);
      
      // Vérifier d'abord si l'email existe déjà
      const checkResponse = await fetch(`${API_BASE_URL}/users/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userData.email }),
      });

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.exists) {
          throw new Error('Cet email est déjà utilisé. Veuillez utiliser un autre email ou vous connecter.');
        }
      }
      
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

      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ Erreur reçue:', errorData);
        
        // Gérer les erreurs spécifiques
        if (errorData.message && errorData.message.includes('déjà utilisé')) {
          throw new Error('Cet email est déjà utilisé. Veuillez utiliser un autre email ou vous connecter.');
        }
        
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      const data = await response.json();
      console.log('✅ Inscription réussie pour:', data.user.email);
      
      // Connecter automatiquement l'utilisateur après inscription
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        setUser(data.user);
        setIsFirstVisit(true);
        localStorage.setItem('wasLoggedIn', 'false');
        console.log('🔐 Utilisateur automatiquement connecté après inscription');
      }
      
      return { success: true, user: data.user };
    } catch (error) {
      console.log('❌ Échec d\'inscription:', error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    console.log('🚪 Déconnexion de l\'utilisateur');
    localStorage.removeItem('token');
    localStorage.removeItem('wasLoggedIn');
    setToken(null);
    setUser(null);
    setIsFirstVisit(true);
  };

  const updateUser = (userData) => {
    console.log('🔄 Mise à jour des données utilisateur');
    setUser(userData);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isRestaurant: user?.role === 'restaurant',
    isUser: user?.role === 'user',
    isFirstVisit,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 