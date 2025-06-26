import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:5000';

const DashboardTest = () => {
  const { user, token } = useAuth();
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 Tentative de récupération des données du restaurant...');
    console.log('👤 User:', user);
    console.log('🔑 Token:', token ? 'Présent' : 'Absent');
    
    if (token) {
      fetchRestaurantData();
    } else {
      setLoading(false);
      setError('Aucun token d\'authentification trouvé');
    }
  }, [token]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Test API - Token:', token ? 'Présent' : 'Absent');
      console.log('🔍 Test API - URL:', `${API_BASE_URL}/restaurant/me`);

      const response = await fetch(`${API_BASE_URL}/restaurant/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Réponse API:', response.status, response.statusText);
      
      const responseText = await response.text();
      console.log('📄 Contenu de la réponse:', responseText);

      // Essayer de parser comme JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Erreur parsing JSON:', parseError);
        setError('Réponse invalide du serveur');
        return;
      }

      if (response.ok && data) {
        setRestaurantData(data);
        console.log('✅ Données restaurant reçues:', data);
      } else {
        setError(`Erreur ${response.status}: ${data.message || response.statusText}`);
        console.error('❌ Erreur API:', data);
      }

    } catch (error) {
      console.error('❌ Erreur fetch:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h1>🔄 Chargement...</h1>
          <p>Récupération des données du restaurant en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1>🏪 Dashboard Restaurant</h1>
        <p>Gestion de votre restaurant</p>
      </div>

      {/* Informations utilisateur */}
      <div style={{
        background: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3>👤 Informations Utilisateur</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div><strong>Nom:</strong> {user?.name || 'Non défini'}</div>
          <div><strong>Email:</strong> {user?.email || 'Non défini'}</div>
          <div><strong>Rôle:</strong> {user?.role || 'Non défini'}</div>
          <div><strong>Token:</strong> {token ? '✅ Présent' : '❌ Absent'}</div>
        </div>
      </div>

      {/* Bouton de rechargement */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={fetchRestaurantData}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🔄 Recharger les données
        </button>
      </div>

      {/* Erreur */}
      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '2rem',
          border: '1px solid #f5c6cb'
        }}>
          <h4>❌ Erreur</h4>
          <p>{error}</p>
        </div>
      )}

      {/* Données du restaurant */}
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        marginBottom: '2rem'
      }}>
        <h3>🏪 Données du Restaurant</h3>
        {restaurantData ? (
          <div>
            {restaurantData.success ? (
              <div>
                <div style={{ 
                  background: '#d4edda', 
                  color: '#155724', 
                  padding: '1rem', 
                  borderRadius: '6px', 
                  marginBottom: '1rem',
                  border: '1px solid #c3e6cb'
                }}>
                  <h4>✅ Restaurant trouvé</h4>
                </div>
                <pre style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '0.9rem'
                }}>
                  {JSON.stringify(restaurantData.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div style={{ 
                background: '#fff3cd', 
                color: '#856404', 
                padding: '1rem', 
                borderRadius: '6px',
                border: '1px solid #ffeaa7'
              }}>
                <h4>⚠️ {restaurantData.message}</h4>
                <p>Vous devez d'abord configurer votre restaurant.</p>
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: '#6c757d' }}>Aucune donnée disponible</p>
        )}
      </div>
    </div>
  );
};

export default DashboardTest; 