import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const DishManagement = () => {
  const { token } = useAuth();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isAvailable: true
  });

  // Charger les plats au montage
  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/dishes/my-dishes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDishes(data);
        console.log('✅ Plats chargés:', data);
      } else {
        throw new Error('Erreur lors du chargement des plats');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur chargement plats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        const newDish = await response.json();
        setDishes(prev => [...prev, newDish]);
        setShowAddModal(false);
        resetForm();
        console.log('✅ Plat ajouté:', newDish);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout du plat');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur ajout plat:', err);
    }
  };

  const handleEditDish = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/dishes/${selectedDish._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        const updatedDish = await response.json();
        setDishes(prev => prev.map(dish => 
          dish._id === selectedDish._id ? updatedDish : dish
        ));
        setShowEditModal(false);
        setSelectedDish(null);
        resetForm();
        console.log('✅ Plat modifié:', updatedDish);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur modification plat:', err);
    }
  };

  const handleDeleteDish = async (dishId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/dishes/${dishId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setDishes(prev => prev.filter(dish => dish._id !== dishId));
        console.log('✅ Plat supprimé');
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur lors de la suppression du plat');
      console.error('Erreur suppression plat:', err);
    }
  };

  const openEditModal = (dish) => {
    setSelectedDish(dish);
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price.toString(),
      category: dish.category,
      image: dish.image || '',
      isAvailable: dish.isAvailable
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      isAvailable: true
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Chargement des plats...</div>
      </div>
    );
  }

  return (
    <div className="dish-management-page">
      <div className="dish-management-header">
        <h2>Gestion des Plats</h2>
        <p>Gérez votre carte de plats</p>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Ajouter un plat
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="dishes-grid">
        {dishes.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun plat pour le moment</h3>
            <p>Commencez par ajouter votre premier plat !</p>
          </div>
        ) : (
          dishes.map(dish => (
            <div key={dish._id} className="dish-card">
              <div className="dish-image">
                {dish.image ? (
                  <img src={dish.image} alt={dish.name} />
                ) : (
                  <div className="dish-placeholder">🍽️</div>
                )}
                <div className={`dish-status ${dish.isAvailable ? 'available' : 'unavailable'}`}>
                  {dish.isAvailable ? 'Disponible' : 'Indisponible'}
                </div>
              </div>
              
              <div className="dish-info">
                <h3>{dish.name}</h3>
                <p className="dish-description">{dish.description}</p>
                <div className="dish-details">
                  <span className="dish-category">{dish.category}</span>
                  <span className="dish-price">{dish.price}€</span>
                </div>
              </div>

              <div className="dish-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => openEditModal(dish)}
                >
                  Modifier
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDeleteDish(dish._id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ajouter un plat</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddDish}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nom du plat</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price" className="form-label">Prix (€)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-input"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category" className="form-label">Catégorie</label>
                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Entrées">Entrées</option>
                    <option value="Plats principaux">Plats principaux</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Boissons">Boissons</option>
                    <option value="Apéritifs">Apéritifs</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image" className="form-label">URL de l'image (optionnel)</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  className="form-input"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                  />
                  Disponible à la commande
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Ajouter le plat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Modifier le plat</h3>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditDish}>
              <div className="form-group">
                <label htmlFor="edit-name" className="form-label">Nom du plat</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description" className="form-label">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  className="form-input"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-price" className="form-label">Prix (€)</label>
                  <input
                    type="number"
                    id="edit-price"
                    name="price"
                    className="form-input"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-category" className="form-label">Catégorie</label>
                  <select
                    id="edit-category"
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Entrées">Entrées</option>
                    <option value="Plats principaux">Plats principaux</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Boissons">Boissons</option>
                    <option value="Apéritifs">Apéritifs</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-image" className="form-label">URL de l'image (optionnel)</label>
                <input
                  type="url"
                  id="edit-image"
                  name="image"
                  className="form-input"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                  />
                  Disponible à la commande
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Modifier le plat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishManagement; 