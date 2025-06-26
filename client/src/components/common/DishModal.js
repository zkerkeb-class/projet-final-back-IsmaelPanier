import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './DishModal.css';

const DishModal = ({ isOpen, onClose, onSave, dish, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    category: '',
    isAvailable: true,
    images: [],
    ingredients: [],
    allergens: [],
    preparationTime: '',
    difficulty: 'Facile',
    isVegetarian: false,
    isSpicy: false
  });

  const [errors, setErrors] = useState({});
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Entrées', 'Plats principaux', 'Pizzas', 'Burgers', 
    'Sushis', 'Salades', 'Desserts', 'Boissons'
  ];

  const commonAllergens = [
    'Gluten', 'Lactose', 'Œufs', 'Arachides', 'Fruits à coque',
    'Soja', 'Poisson', 'Crustacés', 'Moutarde', 'Sésame'
  ];

  useEffect(() => {
    if (isEdit && dish) {
      setFormData({
        name: dish.name || '',
        description: dish.description || '',
        basePrice: (dish.basePrice || dish.price || '').toString(),
        category: dish.category || '',
        isAvailable: dish.isAvailable !== undefined ? dish.isAvailable : true,
        images: dish.images || [],
        ingredients: dish.ingredients || [],
        allergens: dish.allergens || [],
        preparationTime: dish.preparationTime || '',
        difficulty: dish.difficulty || 'Facile',
        isVegetarian: dish.isVegetarian || false,
        isSpicy: dish.isSpicy || false
      });
    } else {
      setFormData({
        name: '',
        description: '',
        basePrice: '',
        category: '',
        isAvailable: true,
        images: [],
        ingredients: [],
        allergens: [],
        preparationTime: '',
        difficulty: 'Facile',
        isVegetarian: false,
        isSpicy: false
      });
    }
    setErrors({});
  }, [isEdit, dish, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addIngredient = () => {
    if (currentIngredient.trim() && !formData.ingredients.includes(currentIngredient.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, currentIngredient.trim()]
      }));
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing !== ingredient)
    }));
  };

  const addAllergen = (allergen) => {
    if (!formData.allergens.includes(allergen)) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, allergen]
      }));
    }
  };

  const removeAllergen = (allergen) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(all => all !== allergen)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du plat est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = 'Le prix doit être supérieur à 0';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);

    try {
      const dishData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : null
      };

      await onSave(dishData);
      
      toast.success(
        isEdit 
          ? `✅ Plat "${formData.name}" modifié avec succès !`
          : `✅ Plat "${formData.name}" ajouté avec succès !`
      );

      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur sauvegarde plat:', error);
      toast.error(
        `❌ Erreur lors de la ${isEdit ? 'modification' : 'création'} du plat`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="dish-modal-overlay" onClick={onClose}>
        <div className="dish-modal" onClick={e => e.stopPropagation()}>
          <div className="dish-modal-header">
            <h2>{isEdit ? 'Modifier le plat' : 'Ajouter un nouveau plat'}</h2>
            <button className="dish-modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="dish-modal-form">
            <div className="dish-modal-content">
              {/* Basic Information */}
              <div className="form-section">
                <h3 className="section-title">Informations de base</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Nom du plat *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`uber-input ${errors.name ? 'error' : ''}`}
                      placeholder="Ex: Pizza Margherita"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="category" className="form-label">
                      Catégorie *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`uber-input ${errors.category ? 'error' : ''}`}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <span className="error-text">{errors.category}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`uber-input ${errors.description ? 'error' : ''}`}
                    rows="3"
                    placeholder="Décrivez votre plat..."
                  />
                  {errors.description && <span className="error-text">{errors.description}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="basePrice" className="form-label">
                      Prix (€) *
                    </label>
                    <input
                      type="number"
                      id="basePrice"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleChange}
                      className={`uber-input ${errors.basePrice ? 'error' : ''}`}
                      step="0.01"
                      min="0"
                      placeholder="12.50"
                    />
                    {errors.basePrice && <span className="error-text">{errors.basePrice}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="preparationTime" className="form-label">
                      Temps de préparation (min)
                    </label>
                    <input
                      type="number"
                      id="preparationTime"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleChange}
                      className="uber-input"
                      min="1"
                      placeholder="15"
                    />
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="form-section">
                <h3 className="section-title">Ingrédients</h3>
                
                <div className="ingredient-input">
                  <input
                    type="text"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    className="uber-input"
                    placeholder="Ajouter un ingrédient..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  />
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="uber-btn uber-btn-secondary"
                  >
                    Ajouter
                  </button>
                </div>

                <div className="tags-container">
                  {formData.ingredients.map((ingredient, index) => (
                    <span key={index} className="tag tag-ingredient">
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient)}
                        className="tag-remove"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              <div className="form-section">
                <h3 className="section-title">Allergènes</h3>
                
                <div className="allergens-grid">
                  {commonAllergens.map(allergen => (
                    <label key={allergen} className="allergen-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.allergens.includes(allergen)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            addAllergen(allergen);
                          } else {
                            removeAllergen(allergen);
                          }
                        }}
                      />
                      <span className="checkmark"></span>
                      {allergen}
                    </label>
                  ))}
                </div>
              </div>

              {/* Properties */}
              <div className="form-section">
                <h3 className="section-title">Propriétés</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="difficulty" className="form-label">
                      Difficulté
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="uber-input"
                    >
                      <option value="Facile">Facile</option>
                      <option value="Moyen">Moyen</option>
                      <option value="Difficile">Difficile</option>
                    </select>
                  </div>
                </div>

                <div className="checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    Végétarien
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isSpicy"
                      checked={formData.isSpicy}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    Épicé
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    Disponible
                  </label>
                </div>
              </div>
            </div>

            <div className="dish-modal-footer">
              <button
                type="button"
                onClick={onClose}
                className="uber-btn uber-btn-secondary"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="uber-btn uber-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    {isEdit ? 'Modification...' : 'Ajout...'}
                  </>
                ) : (
                  isEdit ? 'Modifier le plat' : 'Ajouter le plat'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notification intégrée dans le contexte Socket.io */}
    </>
  );
};

export default DishModal; 