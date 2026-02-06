import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import DishModal from '../../components/common/DishModal';
import './DishManagement.css';

const API_BASE_URL = 'http://localhost:5000';

const DishManagement = () => {
  const { user, token } = useAuth();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');

  const categories = ['Toutes', 'Entrées', 'Plats principaux', 'Pizzas', 'Burgers', 'Sushis', 'Salades', 'Desserts', 'Boissons'];

  const fetchDishes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Tentative de récupération des plats depuis la base de données...');
      
      const response = await fetch(`${API_BASE_URL}/dishes/my-dishes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Statut de la réponse:', response.status);

      if (response.ok) {
        const data = await response.json();
        setDishes(Array.isArray(data) ? data : []);
        console.log('✅ Plats chargés depuis la base de données:', data);
      } else if (response.status === 401) {
        // Erreur d'authentification - pas de données de test
        console.log('❌ Erreur d\'authentification');
        setError('Erreur d\'authentification. Veuillez vous reconnecter.');
        setDishes([]);
      } else if (response.status === 404) {
        // Aucun plat trouvé - c'est normal, pas d'erreur
        console.log('📭 Aucun plat trouvé dans la base de données');
        setDishes([]);
      } else {
        // Erreur serveur - utiliser des données de test
        console.log('❌ Erreur serveur, utilisation des données de test');
        const mockDishes = [
          {
            _id: '1',
            name: 'Pizza Margherita',
            description: 'Pizza classique avec tomate, mozzarella et basilic frais',
            basePrice: 12.50,
            category: 'Pizzas',
            isAvailable: true,
            images: [],
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Burger Classique',
            description: 'Burger avec steak haché, salade, tomate, cornichons et sauce spéciale',
            basePrice: 14.90,
            category: 'Burgers',
            isAvailable: true,
            images: [],
            createdAt: new Date().toISOString()
          }
        ];
        setDishes(mockDishes);
        setError('Mode démo activé - données de test affichées');
        console.log('📋 Utilisation des données d\'exemple (mode démo)');
      }
    } catch (err) {
      console.error('❌ Erreur de connexion au serveur:', err);
      // Erreur réseau - utiliser des données de test
      const mockDishes = [
        {
          _id: '1',
          name: 'Pizza Margherita',
          description: 'Pizza classique avec tomate, mozzarella et basilic frais',
          basePrice: 12.50,
          category: 'Pizzas',
          isAvailable: true,
          images: [],
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Burger Classique',
          description: 'Burger avec steak haché, salade, tomate, cornichons et sauce spéciale',
          basePrice: 14.90,
          category: 'Burgers',
          isAvailable: true,
          images: [],
          createdAt: new Date().toISOString()
        }
      ];
      setDishes(mockDishes);
      setError('Mode démo activé - connexion serveur impossible');
      console.log('📋 Utilisation des données d\'exemple (erreur réseau)');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || dish.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddDish = () => {
    setEditingDish(null);
    setShowModal(true);
  };

  const handleEditDish = (dish) => {
    setEditingDish(dish);
    setShowModal(true);
  };

  const handleSaveDish = async (dishData) => {
    try {
      setError('');
      console.log('🍽️ Début sauvegarde plat:', dishData);
      console.log('🔑 Token utilisé:', token ? 'Présent' : 'Manquant');
      
      if (editingDish) {
        // Modifier un plat existant
        console.log('✏️ Modification du plat:', editingDish._id);
        const response = await fetch(`${API_BASE_URL}/dishes/${editingDish._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dishData)
        });

        console.log('📡 Réponse modification:', response.status);

        if (response.ok) {
          const updatedDish = await response.json();
          setDishes(prev => prev.map(dish => 
            dish._id === editingDish._id ? updatedDish : dish
          ));
          console.log('✅ Plat modifié avec succès dans la DB:', updatedDish);
        } else if (response.status === 401) {
          throw new Error('Erreur d\'authentification. Veuillez vous reconnecter.');
        } else if (response.status === 404) {
          throw new Error('Plat non trouvé dans la base de données.');
        } else {
          const errorText = await response.text();
          console.error('❌ Erreur modification:', response.status, errorText);
          throw new Error(`Erreur ${response.status}: ${errorText}`);
        }
      } else {
        // Ajouter un nouveau plat
        console.log('➕ Ajout d\'un nouveau plat');
        const response = await fetch(`${API_BASE_URL}/dishes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dishData)
        });

        console.log('📡 Réponse ajout:', response.status);

        if (response.ok) {
          const newDish = await response.json();
          setDishes(prev => [...prev, newDish]);
          console.log('✅ Plat ajouté avec succès dans la DB:', newDish);
          
          // Rafraîchir la liste pour être sûr
          setTimeout(() => {
            fetchDishes();
          }, 1000);
        } else if (response.status === 401) {
          throw new Error('Erreur d\'authentification. Veuillez vous reconnecter.');
        } else if (response.status >= 500) {
          // Erreur serveur - sauvegarder localement
          console.log('❌ Erreur serveur, sauvegarde locale');
          const newDish = {
            ...dishData,
            _id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          setDishes(prev => [...prev, newDish]);
          setError('Mode démo - plat sauvegardé localement (erreur serveur)');
          console.log('📋 Plat ajouté localement (erreur serveur):', newDish);
        } else {
          const errorText = await response.text();
          console.error('❌ Erreur ajout API:', response.status, errorText);
          throw new Error(`Erreur ${response.status}: ${errorText}`);
        }
      }
      
      // Fermer le modal après succès
      setEditingDish(null);
      setShowModal(false);
      
    } catch (err) {
      console.error('❌ Erreur générale sauvegarde plat:', err);
      
      // Si c'est une erreur réseau, sauvegarder localement
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        console.log('❌ Erreur réseau, sauvegarde locale');
        const newDish = {
          ...dishData,
          _id: editingDish ? editingDish._id : Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        
        if (editingDish) {
          setDishes(prev => prev.map(dish => 
            dish._id === editingDish._id ? newDish : dish
          ));
        } else {
          setDishes(prev => [...prev, newDish]);
        }
        
        setError('Mode démo - plat sauvegardé localement (erreur réseau)');
        setEditingDish(null);
        setShowModal(false);
      } else {
        setError(`Erreur lors de la sauvegarde: ${err.message}`);
      }
    }
  };

  const handleDeleteDish = async (dishId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dishes/${dishId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok || response.status === 404) {
        setDishes(prev => prev.filter(dish => dish._id !== dishId));
        console.log('✅ Plat supprimé');
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (err) {
      // Supprimer localement même si l'API ne répond pas
      setDishes(prev => prev.filter(dish => dish._id !== dishId));
      console.log('📋 Plat supprimé localement');
    }
  };

  const toggleAvailability = async (dish) => {
    try {
      const updatedDish = { ...dish, isAvailable: !dish.isAvailable };
      
      const response = await fetch(`${API_BASE_URL}/dishes/${dish._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedDish)
      });

      if (response.ok || response.status === 404) {
        setDishes(prev => prev.map(d => 
          d._id === dish._id ? updatedDish : d
        ));
        console.log('✅ Disponibilité mise à jour');
      }
    } catch (err) {
      // Mettre à jour localement même si l'API ne répond pas
      setDishes(prev => prev.map(d => 
        d._id === dish._id ? { ...d, isAvailable: !d.isAvailable } : d
      ));
      console.log('📋 Disponibilité mise à jour localement');
    }
  };

  if (loading) {
    return (
      <div className="dish-management">
        <div className="uber-loading">
          <div className="uber-spinner"></div>
          <p>Chargement de vos plats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dish-management">
      {/* Header */}
      <header className="uber-header">
        <div className="uber-header-content">
          <div className="app-logo">
            <div className="app-logo-icon">🍽️</div>
            <span>Gestion des Plats</span>
      </div>

          <div className="header-user-info">
            <span className="welcome-text">Restaurant {user?.firstName || 'Admin'}</span>
          </div>
                </div>
      </header>

      {/* Main Content */}
      <main className="dish-management-main">
        <div className="dish-management-container">
          {/* Hero Section */}
          <section className="hero-section">
            <h1 className="hero-title">Gérez votre menu</h1>
            <p className="hero-subtitle">Ajoutez, modifiez et organisez vos plats</p>
            
                <button 
              onClick={handleAddDish}
              className="uber-btn uber-btn-primary hero-btn"
                >
              ➕ Ajouter un nouveau plat
                </button>
          </section>

          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button onClick={() => setError('')} className="error-close">✕</button>
            </div>
          )}

          {/* Filters */}
          <section className="filters-section">
            <div className="filters-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Rechercher un plat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="uber-input search-input"
                />
                <span className="search-icon">🔍</span>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="uber-input category-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Statistics */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🍽️</div>
                <div className="stat-content">
                  <div className="stat-number">{dishes.length}</div>
                  <div className="stat-label">Plats au total</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{dishes.filter(d => d.isAvailable).length}</div>
                  <div className="stat-label">Disponibles</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <div className="stat-number">{dishes.filter(d => !d.isAvailable).length}</div>
                  <div className="stat-label">Indisponibles</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <div className="stat-number">
                    {dishes.length > 0 
                      ? (dishes.reduce((sum, d) => sum + (d.basePrice || d.price || 0), 0) / dishes.length).toFixed(2)
                      : '0.00'
                    }€
                  </div>
                  <div className="stat-label">Prix moyen</div>
                </div>
              </div>
            </div>
          </section>

          {/* Dishes Grid */}
          <section className="dishes-section">
            <div className="section-header">
              <h2>Vos plats ({filteredDishes.length})</h2>
              </div>

            {filteredDishes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3>Aucun plat trouvé</h3>
                <p>
                  {dishes.length === 0 
                    ? "Commencez par ajouter votre premier plat"
                    : "Aucun plat ne correspond à vos critères de recherche"
                  }
                </p>
                <button 
                  onClick={handleAddDish}
                  className="uber-btn uber-btn-primary"
                >
                  ➕ Ajouter un plat
                </button>
              </div>
            ) : (
              <div className="dishes-grid">
                {filteredDishes.map(dish => (
                  <div key={dish._id} className={`dish-card ${!dish.isAvailable ? 'unavailable' : ''}`}>
                    <div className="dish-card-image">
                      {dish.images && dish.images.length > 0 ? (
                        <img src={dish.images[0].url} alt={dish.name} />
                      ) : (
                        <div className="dish-placeholder">
                          <span className="dish-placeholder-icon">🍽️</span>
        </div>
      )}
                      <div className="dish-card-overlay">
                        <button 
                          onClick={() => handleEditDish(dish)}
                          className="action-btn edit-btn"
                          title="Modifier"
                        >
                          ✏️
                        </button>
              <button 
                          onClick={() => handleDeleteDish(dish._id)}
                          className="action-btn delete-btn"
                          title="Supprimer"
              >
                          🗑️
              </button>
            </div>
              </div>

                    <div className="dish-card-content">
                      <div className="dish-card-header">
                        <h3 className="dish-name">{dish.name}</h3>
                        <span className="dish-price">{(dish.basePrice || dish.price || 0).toFixed(2)}€</span>
              </div>

                      <p className="dish-description">
                        {dish.description || 'Aucune description'}
                      </p>
                      
                      <div className="dish-card-meta">
                        <span className="dish-category">{dish.category}</span>
                        <div className="availability-toggle">
                          <label className="toggle-switch">
                  <input
                              type="checkbox"
                              checked={dish.isAvailable}
                              onChange={() => toggleAvailability(dish)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                          <span className="availability-text">
                            {dish.isAvailable ? 'Disponible' : 'Indisponible'}
                          </span>
                </div>
                </div>
              </div>
              </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal */}
      <DishModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveDish}
        dish={editingDish}
        isEdit={!!editingDish}
      />
    </div>
  );
};

export default DishManagement; 