import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdvancedDishManagement.css';

const API_BASE_URL = 'http://localhost:5000';

const AdvancedDishManagement = () => {
  const { token } = useAuth();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 0,
    category: 'Plat principal',
    preparationTime: 0,
    isAvailable: true,
    trackStock: false,
    stockQuantity: -1,
    minStockAlert: 0,
    isDailySpecial: false,
    isPromotion: false,
    discountPercentage: 0,
    promotionStartDate: '',
    promotionEndDate: '',
    promotionDescription: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    isSpicy: false,
    spiceLevel: 1,
    isPopular: false,
    tags: [],
    dietaryInfo: [],
    customizationOptions: [],
    priceOptions: [],
    ingredients: [],
    addOns: [],
    images: []
  });

  // Récupérer les plats
  const fetchDishes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes/my-dishes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDishes(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des plats:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  // Upload d'images
  const handleImageUpload = async (files) => {
    setUploadingImages(true);
    const formData = new FormData();
    
    Array.from(files).forEach((file, index) => {
      formData.append('images', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/uploads/multiple-dish-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const newImages = result.images.map((img, index) => ({
          url: `${API_BASE_URL}${img.imageUrl}`,
          alt: `Image ${index + 1}`,
          isMain: index === 0,
          order: index
        }));
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  // Gestion des ingrédients
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, {
        name: '',
        quantity: '',
        isAllergen: false,
        allergenType: ''
      }]
    }));
  };

  const updateIngredient = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // Gestion des options de prix
  const addPriceOption = () => {
    setFormData(prev => ({
      ...prev,
      priceOptions: [...prev.priceOptions, {
        name: '',
        price: 0,
        description: ''
      }]
    }));
  };

  const updatePriceOption = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      priceOptions: prev.priceOptions.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const removePriceOption = (index) => {
    setFormData(prev => ({
      ...prev,
      priceOptions: prev.priceOptions.filter((_, i) => i !== index)
    }));
  };

  // Gestion des suppléments
  const addAddOn = () => {
    setFormData(prev => ({
      ...prev,
      addOns: [...prev.addOns, {
        name: '',
        price: 0,
        description: ''
      }]
    }));
  };

  const updateAddOn = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.map((addon, i) => 
        i === index ? { ...addon, [field]: value } : addon
      )
    }));
  };

  const removeAddOn = (index) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.filter((_, i) => i !== index)
    }));
  };

  // Créer ou mettre à jour un plat
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingDish 
        ? `${API_BASE_URL}/dishes/${editingDish._id}`
        : `${API_BASE_URL}/dishes`;
      
      const method = editingDish ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setEditingDish(null);
        resetForm();
        fetchDishes();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      basePrice: 0,
      category: 'Plat principal',
      preparationTime: 0,
      isAvailable: true,
      trackStock: false,
      stockQuantity: -1,
      minStockAlert: 0,
      isDailySpecial: false,
      isPromotion: false,
      discountPercentage: 0,
      promotionStartDate: '',
      promotionEndDate: '',
      promotionDescription: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      isSpicy: false,
      spiceLevel: 1,
      isPopular: false,
      tags: [],
      dietaryInfo: [],
      customizationOptions: [],
      priceOptions: [],
      ingredients: [],
      addOns: [],
      images: []
    });
  };

  // Éditer un plat
  const editDish = (dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      description: dish.description || '',
      basePrice: dish.basePrice || dish.price || 0,
      category: dish.category || 'Plat principal',
      preparationTime: dish.preparationTime || 0,
      isAvailable: dish.isAvailable !== false,
      trackStock: dish.trackStock || false,
      stockQuantity: dish.stockQuantity || -1,
      minStockAlert: dish.minStockAlert || 0,
      isDailySpecial: dish.isDailySpecial || false,
      isPromotion: dish.isPromotion || false,
      discountPercentage: dish.discountPercentage || 0,
      promotionStartDate: dish.promotionStartDate || '',
      promotionEndDate: dish.promotionEndDate || '',
      promotionDescription: dish.promotionDescription || '',
      calories: dish.calories || 0,
      protein: dish.protein || 0,
      carbs: dish.carbs || 0,
      fat: dish.fat || 0,
      isSpicy: dish.isSpicy || false,
      spiceLevel: dish.spiceLevel || 1,
      isPopular: dish.isPopular || false,
      tags: dish.tags || [],
      dietaryInfo: dish.dietaryInfo || [],
      customizationOptions: dish.customizationOptions || [],
      priceOptions: dish.priceOptions || [],
      ingredients: dish.ingredients || [],
      addOns: dish.addOns || [],
      images: dish.images || []
    });
    setShowForm(true);
  };

  // Supprimer un plat
  const deleteDish = async (dishId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/dishes/${dishId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchDishes();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Filtrer les plats
  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'daily' && dish.isDailySpecial) ||
                      (activeTab === 'promotion' && dish.isPromotion) ||
                      (activeTab === 'low-stock' && dish.trackStock && dish.stockQuantity <= dish.minStockAlert);

    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="advanced-dish-management">
        <div className="sidebar">
          <h3>Menu Restaurant</h3>
          <ul className="sidebar-menu">
            <li><Link to="/restaurant/dashboard">Dashboard</Link></li>
            <li><Link to="/restaurant/dishes">Mes Plats</Link></li>
            <li><Link to="/restaurant/orders">Commandes</Link></li>
            <li><Link to="/restaurant/profile">Profil</Link></li>
          </ul>
        </div>
        <div className="content-area">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="advanced-dish-management">
      <div className="sidebar">
        <h3>Menu Restaurant</h3>
        <ul className="sidebar-menu">
          <li><Link to="/restaurant/dashboard">Dashboard</Link></li>
          <li><Link to="/restaurant/dishes">Mes Plats</Link></li>
          <li><Link to="/restaurant/orders">Commandes</Link></li>
          <li><Link to="/restaurant/profile">Profil</Link></li>
        </ul>
      </div>

      <div className="content-area">
        <div className="header-section">
          <h1>Gestion Avancée des Plats</h1>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingDish(null);
              resetForm();
            }}
          >
            + Nouveau Plat
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Rechercher un plat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Tous ({dishes.length})
            </button>
            <button 
              className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
              onClick={() => setActiveTab('daily')}
            >
              Plats du jour ({dishes.filter(d => d.isDailySpecial).length})
            </button>
            <button 
              className={`tab ${activeTab === 'promotion' ? 'active' : ''}`}
              onClick={() => setActiveTab('promotion')}
            >
              Promotions ({dishes.filter(d => d.isPromotion).length})
            </button>
            <button 
              className={`tab ${activeTab === 'low-stock' ? 'active' : ''}`}
              onClick={() => setActiveTab('low-stock')}
            >
              Stock bas ({dishes.filter(d => d.trackStock && d.stockQuantity <= d.minStockAlert).length})
            </button>
          </div>
        </div>

        {/* Formulaire de création/édition */}
        {showForm && (
          <div className="form-overlay">
            <div className="form-container">
              <div className="form-header">
                <h2>{editingDish ? 'Modifier le plat' : 'Nouveau plat'}</h2>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingDish(null);
                    resetForm();
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="advanced-form">
                {/* Informations de base */}
                <div className="form-section">
                  <h3>Informations de base</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nom du plat *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Catégorie</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="Entrée">Entrée</option>
                        <option value="Plat principal">Plat principal</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Boisson">Boisson</option>
                        <option value="Accompagnement">Accompagnement</option>
                        <option value="Menu du jour">Menu du jour</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Prix de base *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Temps de préparation (min)</label>
                      <input
                        type="number"
                        value={formData.preparationTime}
                        onChange={(e) => setFormData({...formData, preparationTime: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="form-section">
                  <h3>Images du plat</h3>
                  <div className="image-upload">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      disabled={uploadingImages}
                    />
                    {uploadingImages && <p>Upload en cours...</p>}
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="image-preview">
                      {formData.images.map((img, index) => (
                        <div key={index} className="image-item">
                          <img src={img.url} alt={img.alt} />
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              images: formData.images.filter((_, i) => i !== index)
                            })}
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Options de prix */}
                <div className="form-section">
                  <h3>Options de prix</h3>
                  <button type="button" onClick={addPriceOption} className="btn btn-secondary">
                    + Ajouter une option
                  </button>
                  
                  {formData.priceOptions.map((option, index) => (
                    <div key={index} className="option-item">
                      <input
                        type="text"
                        placeholder="Nom (ex: Grande portion)"
                        value={option.name}
                        onChange={(e) => updatePriceOption(index, 'name', e.target.value)}
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Prix"
                        value={option.price}
                        onChange={(e) => updatePriceOption(index, 'price', parseFloat(e.target.value))}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={option.description}
                        onChange={(e) => updatePriceOption(index, 'description', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removePriceOption(index)}
                        className="btn btn-danger"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>

                {/* Ingrédients */}
                <div className="form-section">
                  <h3>Ingrédients et allergènes</h3>
                  <button type="button" onClick={addIngredient} className="btn btn-secondary">
                    + Ajouter un ingrédient
                  </button>
                  
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-item">
                      <input
                        type="text"
                        placeholder="Nom de l'ingrédient"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Quantité (ex: 100g)"
                        value={ingredient.quantity}
                        onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                      />
                      <label>
                        <input
                          type="checkbox"
                          checked={ingredient.isAllergen}
                          onChange={(e) => updateIngredient(index, 'isAllergen', e.target.checked)}
                        />
                        Allergène
                      </label>
                      {ingredient.isAllergen && (
                        <input
                          type="text"
                          placeholder="Type d'allergène"
                          value={ingredient.allergenType}
                          onChange={(e) => updateIngredient(index, 'allergenType', e.target.value)}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="btn btn-danger"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>

                {/* Gestion des stocks */}
                <div className="form-section">
                  <h3>Gestion des stocks</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.trackStock}
                          onChange={(e) => setFormData({...formData, trackStock: e.target.checked})}
                        />
                        Suivre le stock
                      </label>
                    </div>
                    
                    {formData.trackStock && (
                      <>
                        <div className="form-group">
                          <label>Quantité en stock</label>
                          <input
                            type="number"
                            value={formData.stockQuantity}
                            onChange={(e) => setFormData({...formData, stockQuantity: parseInt(e.target.value)})}
                            min="-1"
                          />
                          <small>-1 = stock illimité</small>
                        </div>
                        
                        <div className="form-group">
                          <label>Alerte stock bas</label>
                          <input
                            type="number"
                            value={formData.minStockAlert}
                            onChange={(e) => setFormData({...formData, minStockAlert: parseInt(e.target.value)})}
                            min="0"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Promotions */}
                <div className="form-section">
                  <h3>Promotions et plats du jour</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.isDailySpecial}
                          onChange={(e) => setFormData({...formData, isDailySpecial: e.target.checked})}
                        />
                        Plat du jour
                      </label>
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.isPromotion}
                          onChange={(e) => setFormData({...formData, isPromotion: e.target.checked})}
                        />
                        En promotion
                      </label>
                    </div>
                  </div>
                  
                  {formData.isPromotion && (
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Pourcentage de réduction</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discountPercentage}
                          onChange={(e) => setFormData({...formData, discountPercentage: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Date de début</label>
                        <input
                          type="date"
                          value={formData.promotionStartDate}
                          onChange={(e) => setFormData({...formData, promotionStartDate: e.target.value})}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Date de fin</label>
                        <input
                          type="date"
                          value={formData.promotionEndDate}
                          onChange={(e) => setFormData({...formData, promotionEndDate: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                  
                  {formData.isPromotion && (
                    <div className="form-group full-width">
                      <label>Description de la promotion</label>
                      <textarea
                        value={formData.promotionDescription}
                        onChange={(e) => setFormData({...formData, promotionDescription: e.target.value})}
                        rows="2"
                      />
                    </div>
                  )}
                </div>

                {/* Informations nutritionnelles */}
                <div className="form-section">
                  <h3>Informations nutritionnelles</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Calories</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.calories}
                        onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Protéines (g)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.protein}
                        onChange={(e) => setFormData({...formData, protein: parseFloat(e.target.value)})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Glucides (g)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.carbs}
                        onChange={(e) => setFormData({...formData, carbs: parseFloat(e.target.value)})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Lipides (g)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.fat}
                        onChange={(e) => setFormData({...formData, fat: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                {/* Suppléments */}
                <div className="form-section">
                  <h3>Suppléments disponibles</h3>
                  <button type="button" onClick={addAddOn} className="btn btn-secondary">
                    + Ajouter un supplément
                  </button>
                  
                  {formData.addOns.map((addon, index) => (
                    <div key={index} className="option-item">
                      <input
                        type="text"
                        placeholder="Nom du supplément"
                        value={addon.name}
                        onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Prix"
                        value={addon.price}
                        onChange={(e) => updateAddOn(index, 'price', parseFloat(e.target.value))}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={addon.description}
                        onChange={(e) => updateAddOn(index, 'description', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeAddOn(index)}
                        className="btn btn-danger"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>

                {/* Options finales */}
                <div className="form-section">
                  <h3>Options</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.isAvailable}
                          onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                        />
                        Disponible
                      </label>
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.isSpicy}
                          onChange={(e) => setFormData({...formData, isSpicy: e.target.checked})}
                        />
                        Épicé
                      </label>
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.isPopular}
                          onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                        />
                        Plat populaire
                      </label>
                    </div>
                  </div>
                  
                  {formData.isSpicy && (
                    <div className="form-group">
                      <label>Niveau d'épice (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={formData.spiceLevel}
                        onChange={(e) => setFormData({...formData, spiceLevel: parseInt(e.target.value)})}
                      />
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingDish ? 'Mettre à jour' : 'Créer le plat'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingDish(null);
                      resetForm();
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Liste des plats */}
        <div className="dishes-grid">
          {filteredDishes.map((dish) => (
            <div key={dish._id} className="dish-card">
              <div className="dish-image">
                {dish.images && dish.images.length > 0 ? (
                  <img src={`${API_BASE_URL}${dish.images[0].url}`} alt={dish.name} />
                ) : (
                  <div className="no-image">Aucune image</div>
                )}
                
                {dish.isDailySpecial && <span className="badge daily">Plat du jour</span>}
                {dish.isPromotion && <span className="badge promotion">Promotion</span>}
                {dish.trackStock && dish.stockQuantity <= dish.minStockAlert && (
                  <span className="badge low-stock">Stock bas</span>
                )}
              </div>
              
              <div className="dish-content">
                <h3>{dish.name}</h3>
                <p className="description">{dish.description}</p>
                
                <div className="dish-info">
                  <span className="price">{dish.basePrice || dish.price}€</span>
                  <span className="category">{dish.category}</span>
                </div>
                
                {dish.priceOptions && dish.priceOptions.length > 0 && (
                  <div className="price-options">
                    {dish.priceOptions.map((option, index) => (
                      <span key={index} className="price-option">
                        {option.name}: {option.price}€
                      </span>
                    ))}
                  </div>
                )}
                
                {dish.trackStock && (
                  <div className="stock-info">
                    <span className={`stock ${dish.stockQuantity <= dish.minStockAlert ? 'low' : 'ok'}`}>
                      Stock: {dish.stockQuantity === -1 ? 'Illimité' : dish.stockQuantity}
                    </span>
                  </div>
                )}
                
                {dish.isPromotion && dish.discountPercentage > 0 && (
                  <div className="promotion-info">
                    <span className="discount">-{dish.discountPercentage}%</span>
                  </div>
                )}
                
                <div className="dish-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => editDish(dish)}
                  >
                    Modifier
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => deleteDish(dish._id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedDishManagement; 