import React, { useState } from 'react';
import './DishModal.css';

const DishModal = ({ isOpen, onClose, onSave, dish = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: dish?.name || '',
    description: dish?.description || '',
    category: dish?.category || 'Plats principaux',
    basePrice: dish?.basePrice || '',
    isAvailable: dish?.isAvailable !== false,
    images: dish?.images || []
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const categories = [
    'Entrées',
    'Plats principaux',
    'Pizzas',
    'Burgers',
    'Sushis',
    'Salades',
    'Desserts',
    'Boissons',
    'Accompagnements'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedImages = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('http://localhost:5000/uploads/dish-image', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          uploadedImages.push({
            url: result.url,
            alt: file.name,
            isMain: false,
            order: uploadedImages.length
          });
        }
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const setMainImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isMain: i === index
      }))
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du plat est requis';
    }

    if (!formData.basePrice || formData.basePrice <= 0) {
      newErrors.basePrice = 'Le prix doit être supérieur à 0';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...formData,
        basePrice: parseFloat(formData.basePrice)
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Plats principaux',
      basePrice: '',
      isAvailable: true,
      images: []
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dish-modal-overlay" onClick={handleClose}>
      <div className="dish-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dish-modal-header">
          <h2>{isEdit ? 'Modifier le plat' : 'Ajouter un plat'}</h2>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="dish-modal-form">
          <div className="form-group">
            <label htmlFor="name">Nom du plat *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Pizza Margherita"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Catégorie *</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={errors.category ? 'error' : ''}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez votre plat, les ingrédients..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="basePrice">Prix (€) *</label>
              <input
                type="number"
                id="basePrice"
                step="0.01"
                min="0"
                value={formData.basePrice}
                onChange={(e) => handleChange('basePrice', e.target.value)}
                placeholder="12.50"
                className={errors.basePrice ? 'error' : ''}
              />
              {errors.basePrice && <span className="error-message">{errors.basePrice}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="isAvailable">Disponible</label>
              <select
                id="isAvailable"
                value={formData.isAvailable}
                onChange={(e) => handleChange('isAvailable', e.target.value === 'true')}
              >
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </select>
            </div>
          </div>

          {/* Upload d'images */}
          <div className="image-upload-section">
            <h4>Images du plat</h4>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ marginBottom: '1rem' }}
            />
            {uploading && <p style={{ color: '#667eea' }}>Upload en cours...</p>}

            {formData.images.length > 0 && (
              <div className="image-preview">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={image.url} alt={image.alt} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      ✕
                    </button>
                    {!image.isMain && (
                      <button
                        type="button"
                        className="set-main-btn"
                        onClick={() => setMainImage(index)}
                        style={{
                          position: 'absolute',
                          bottom: '5px',
                          left: '5px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        Principal
                      </button>
                    )}
                    {image.isMain && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '5px',
                          left: '5px',
                          background: '#10b981',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}
                      >
                        Principal
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEdit ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DishModal; 