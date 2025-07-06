import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const API_BASE_URL = 'http://localhost:5000';

const RestaurantProfile = () => {
  const { token } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState({});
  const [saving, setSaving] = useState({});
  const [formData, setFormData] = useState({});

  // Charger les données du restaurant
  const loadRestaurantData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/restaurant/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données du restaurant');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setRestaurant(data.data);
        setFormData({
          name: data.data.name || '',
          description: data.data.description || '',
          cuisine: data.data.cuisine || '',
          phone: data.data.phone || '',
          email: data.data.email || '',
          priceRange: data.data.priceRange || 'Moyen',
          address: {
            street: data.data.address?.street || '',
            city: data.data.address?.city || '',
            postalCode: data.data.address?.postalCode || '',
            country: data.data.address?.country || ''
          },
          openingHours: {
            monday: data.data.openingHours?.monday || '11:00-22:00',
            tuesday: data.data.openingHours?.tuesday || '11:00-22:00',
            wednesday: data.data.openingHours?.wednesday || '11:00-22:00',
            thursday: data.data.openingHours?.thursday || '11:00-22:00',
            friday: data.data.openingHours?.friday || '11:00-23:00',
            saturday: data.data.openingHours?.saturday || '11:00-23:00',
            sunday: data.data.openingHours?.sunday || '12:00-21:00'
          },
          deliveryOptions: data.data.deliveryOptions || ['Livraison', 'Emporter'],
          paymentMethods: data.data.paymentMethods || ['Carte', 'Espèces'],
          minOrderAmount: data.data.minOrderAmount || 15,
          deliveryTime: data.data.deliveryTime || 30
        });
      } else {
        throw new Error('Aucun restaurant trouvé');
      }
    } catch (err) {
      console.error('Erreur chargement restaurant:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadRestaurantData();
  }, [loadRestaurantData]);

  // Gérer les changements de formulaire
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Activer l'édition d'un champ
  const startEditing = (field) => {
    setEditing(prev => ({ ...prev, [field]: true }));
  };

  // Sauvegarder un champ spécifique
  const saveField = async (field) => {
    try {
      setSaving(prev => ({ ...prev, [field]: true }));

      const updateData = {};
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        updateData[parent] = { ...formData[parent] };
      } else {
        updateData[field] = formData[field];
      }

      const response = await fetch(`${API_BASE_URL}/restaurant/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      const result = await response.json();
      if (result.success) {
        setRestaurant(prev => ({ ...prev, ...updateData }));
        setEditing(prev => ({ ...prev, [field]: false }));
        // Recharger les données pour s'assurer de la cohérence
        await loadRestaurantData();
      } else {
        throw new Error(result.message || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      alert(`Erreur lors de la sauvegarde: ${err.message}`);
    } finally {
      setSaving(prev => ({ ...prev, [field]: false }));
    }
  };

  // Sauvegarder tous les changements
  const saveAll = async () => {
    try {
      setSaving(prev => ({ ...prev, all: true }));

      const response = await fetch(`${API_BASE_URL}/restaurant/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      const result = await response.json();
      if (result.success) {
        setRestaurant(result.data);
        setEditing({});
        alert('Profil mis à jour avec succès !');
        await loadRestaurantData();
      } else {
        throw new Error(result.message || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error('Erreur sauvegarde complète:', err);
      alert(`Erreur lors de la sauvegarde: ${err.message}`);
    } finally {
      setSaving(prev => ({ ...prev, all: false }));
    }
  };

  // Annuler l'édition d'un champ
  const cancelEditing = (field) => {
    setEditing(prev => ({ ...prev, [field]: false }));
    // Recharger les données originales
    loadRestaurantData();
  };

  if (loading) {
    return (
      <div className="restaurant-profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurant-profile-page">
        <div className="error-container">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={loadRestaurantData} className="btn btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="restaurant-profile-page">
        <div className="error-container">
          <h2>Aucun restaurant trouvé</h2>
          <p>Vous devez d'abord créer votre restaurant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1>Profil du Restaurant</h1>
          <p>Gérez les informations de votre restaurant</p>
        </div>

        {/* Informations de base */}
        <div className="profile-section">
          <h2>Informations de base</h2>
          
          <div className="form-group">
            <label>Nom du restaurant</label>
            <div className="editable-field">
              {editing.name ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="form-input"
                  />
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('name')}
                      disabled={saving.name}
                      className="btn btn-success btn-sm"
                    >
                      {saving.name ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('name')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">{restaurant.name}</span>
                  <button 
                    onClick={() => startEditing('name')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <div className="editable-field">
              {editing.description ? (
                <div className="edit-mode">
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="form-textarea"
                    rows="3"
                  />
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('description')}
                      disabled={saving.description}
                      className="btn btn-success btn-sm"
                    >
                      {saving.description ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('description')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">{restaurant.description}</span>
                  <button 
                    onClick={() => startEditing('description')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Type de cuisine</label>
            <div className="editable-field">
              {editing.cuisine ? (
                <div className="edit-mode">
                  <select
                    value={formData.cuisine}
                    onChange={(e) => handleInputChange('cuisine', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Française">Française</option>
                    <option value="Italienne">Italienne</option>
                    <option value="Japonaise">Japonaise</option>
                    <option value="Chinoise">Chinoise</option>
                    <option value="Indienne">Indienne</option>
                    <option value="Mexicaine">Mexicaine</option>
                    <option value="Américaine">Américaine</option>
                    <option value="Thaïlandaise">Thaïlandaise</option>
                    <option value="Libanaise">Libanaise</option>
                    <option value="Cuisine du monde">Cuisine du monde</option>
                  </select>
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('cuisine')}
                      disabled={saving.cuisine}
                      className="btn btn-success btn-sm"
                    >
                      {saving.cuisine ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('cuisine')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">{restaurant.cuisine}</span>
                  <button 
                    onClick={() => startEditing('cuisine')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="profile-section">
          <h2>Informations de contact</h2>
          
          <div className="form-group">
            <label>Téléphone</label>
            <div className="editable-field">
              {editing.phone ? (
                <div className="edit-mode">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="form-input"
                    placeholder="+33 1 23 45 67 89"
                  />
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('phone')}
                      disabled={saving.phone}
                      className="btn btn-success btn-sm"
                    >
                      {saving.phone ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('phone')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">{restaurant.phone}</span>
                  <button 
                    onClick={() => startEditing('phone')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="editable-field">
              {editing.email ? (
                <div className="edit-mode">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="form-input"
                    placeholder="contact@restaurant.fr"
                  />
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('email')}
                      disabled={saving.email}
                      className="btn btn-success btn-sm"
                    >
                      {saving.email ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('email')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">{restaurant.email}</span>
                  <button 
                    onClick={() => startEditing('email')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="profile-section">
          <h2>Adresse</h2>
          
          <div className="form-group">
            <label>Rue</label>
            <div className="editable-field">
              {editing['address.street'] ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    className="form-input"
                    placeholder="123 Rue de la Paix"
                  />
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('address')}
                      disabled={saving['address.street']}
                      className="btn btn-success btn-sm"
                    >
                      {saving['address.street'] ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('address.street')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">{restaurant.address?.street}</span>
                  <button 
                    onClick={() => startEditing('address.street')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ville</label>
              <div className="editable-field">
                {editing['address.city'] ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      className="form-input"
                      placeholder="Paris"
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => saveField('address')}
                        disabled={saving['address.city']}
                        className="btn btn-success btn-sm"
                      >
                        {saving['address.city'] ? 'Sauvegarde...' : '✓'}
                      </button>
                      <button 
                        onClick={() => cancelEditing('address.city')}
                        className="btn btn-outline btn-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="field-value">{restaurant.address?.city}</span>
                    <button 
                      onClick={() => startEditing('address.city')}
                      className="btn btn-outline btn-sm"
                    >
                      Modifier
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Code postal</label>
              <div className="editable-field">
                {editing['address.postalCode'] ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={formData.address.postalCode}
                      onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                      className="form-input"
                      placeholder="75001"
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => saveField('address')}
                        disabled={saving['address.postalCode']}
                        className="btn btn-success btn-sm"
                      >
                        {saving['address.postalCode'] ? 'Sauvegarde...' : '✓'}
                      </button>
                      <button 
                        onClick={() => cancelEditing('address.postalCode')}
                        className="btn btn-outline btn-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="field-value">{restaurant.address?.postalCode}</span>
                    <button 
                      onClick={() => startEditing('address.postalCode')}
                      className="btn btn-outline btn-sm"
                    >
                      Modifier
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Horaires d'ouverture */}
        <div className="profile-section">
          <h2>Horaires d'ouverture</h2>
          
          {Object.entries(formData.openingHours).map(([day, hours]) => (
            <div key={day} className="form-group">
              <label className="day-label">
                {day === 'monday' && 'Lundi'}
                {day === 'tuesday' && 'Mardi'}
                {day === 'wednesday' && 'Mercredi'}
                {day === 'thursday' && 'Jeudi'}
                {day === 'friday' && 'Vendredi'}
                {day === 'saturday' && 'Samedi'}
                {day === 'sunday' && 'Dimanche'}
              </label>
              <div className="editable-field">
                {editing[`openingHours.${day}`] ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) => handleInputChange(`openingHours.${day}`, e.target.value)}
                      className="form-input"
                      placeholder="11:00-22:00"
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => saveField('openingHours')}
                        disabled={saving[`openingHours.${day}`]}
                        className="btn btn-success btn-sm"
                      >
                        {saving[`openingHours.${day}`] ? 'Sauvegarde...' : '✓'}
                      </button>
                      <button 
                        onClick={() => cancelEditing(`openingHours.${day}`)}
                        className="btn btn-outline btn-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="field-value">{restaurant.openingHours?.[day]}</span>
                    <button 
                      onClick={() => startEditing(`openingHours.${day}`)}
                      className="btn btn-outline btn-sm"
                    >
                      Modifier
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Options de livraison et paiement */}
        <div className="profile-section">
          <h2>Options de service</h2>
          
          <div className="form-group">
            <label>Options de livraison</label>
            <div className="editable-field">
              {editing.deliveryOptions ? (
                <div className="edit-mode">
                  <div className="checkbox-group">
                    {['Livraison', 'Emporter', 'Sur place'].map(option => (
                      <label key={option} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.deliveryOptions.includes(option)}
                          onChange={(e) => {
                            const newOptions = e.target.checked
                              ? [...formData.deliveryOptions, option]
                              : formData.deliveryOptions.filter(opt => opt !== option);
                            handleInputChange('deliveryOptions', newOptions);
                          }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('deliveryOptions')}
                      disabled={saving.deliveryOptions}
                      className="btn btn-success btn-sm"
                    >
                      {saving.deliveryOptions ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('deliveryOptions')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">{restaurant.deliveryOptions?.join(', ') || 'Aucune'}</span>
                  <button 
                    onClick={() => startEditing('deliveryOptions')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Méthodes de paiement</label>
            <div className="editable-field">
              {editing.paymentMethods ? (
                <div className="edit-mode">
                  <div className="checkbox-group">
                    {['Carte', 'Espèces', 'PayPal', 'Chèque restaurant'].map(method => (
                      <label key={method} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.paymentMethods.includes(method)}
                          onChange={(e) => {
                            const newMethods = e.target.checked
                              ? [...formData.paymentMethods, method]
                              : formData.paymentMethods.filter(meth => meth !== method);
                            handleInputChange('paymentMethods', newMethods);
                          }}
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('paymentMethods')}
                      disabled={saving.paymentMethods}
                      className="btn btn-success btn-sm"
                    >
                      {saving.paymentMethods ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('paymentMethods')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">{restaurant.paymentMethods?.join(', ') || 'Aucune'}</span>
                  <button 
                    onClick={() => startEditing('paymentMethods')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Paramètres de commande */}
        <div className="profile-section">
          <h2>Paramètres de commande</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Commande minimum (€)</label>
              <div className="editable-field">
                {editing.minOrderAmount ? (
                  <div className="edit-mode">
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) => handleInputChange('minOrderAmount', parseFloat(e.target.value))}
                      className="form-input"
                      min="0"
                      step="0.01"
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => saveField('minOrderAmount')}
                        disabled={saving.minOrderAmount}
                        className="btn btn-success btn-sm"
                      >
                        {saving.minOrderAmount ? 'Sauvegarde...' : '✓'}
                      </button>
                      <button 
                        onClick={() => cancelEditing('minOrderAmount')}
                        className="btn btn-outline btn-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="field-value">{restaurant.minOrderAmount}€</span>
                    <button 
                      onClick={() => startEditing('minOrderAmount')}
                      className="btn btn-outline btn-sm"
                    >
                      Modifier
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Temps de livraison (min)</label>
              <div className="editable-field">
                {editing.deliveryTime ? (
                  <div className="edit-mode">
                    <input
                      type="number"
                      value={formData.deliveryTime}
                      onChange={(e) => handleInputChange('deliveryTime', parseInt(e.target.value))}
                      className="form-input"
                      min="0"
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => saveField('deliveryTime')}
                        disabled={saving.deliveryTime}
                        className="btn btn-success btn-sm"
                      >
                        {saving.deliveryTime ? 'Sauvegarde...' : '✓'}
                      </button>
                      <button 
                        onClick={() => cancelEditing('deliveryTime')}
                        className="btn btn-outline btn-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="field-value">{restaurant.deliveryTime} min</span>
                    <button 
                      onClick={() => startEditing('deliveryTime')}
                      className="btn btn-outline btn-sm"
                    >
                      Modifier
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions globales */}
        <div className="profile-actions">
          <button 
            onClick={saveAll}
            disabled={saving.all}
            className="btn btn-primary btn-large"
          >
            {saving.all ? 'Sauvegarde en cours...' : 'Sauvegarder tout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile; 