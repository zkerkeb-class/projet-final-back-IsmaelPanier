import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Profile.css';

const API_BASE_URL = 'http://localhost:5000';

const RestaurantProfile = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    phone: '',
    email: '',
    priceRange: 'Moyen',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    openingHours: {
      monday: '11:00-22:00',
      tuesday: '11:00-22:00',
      wednesday: '11:00-22:00',
      thursday: '11:00-22:00',
      friday: '11:00-23:00',
      saturday: '11:00-23:00',
      sunday: '12:00-21:00'
    },
    isOpen: true
  });

  const [closedDays, setClosedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });

  const daysOfWeek = useMemo(() => [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ], []);

  const cuisineTypes = useMemo(() => [
    'Française', 'Italienne', 'Japonaise', 'Chinoise', 'Mexicaine',
    'Indienne', 'Américaine', 'Méditerranéenne', 'Libanaise', 'Thaï',
    'Cuisine du monde', 'Fast-food', 'Végétarienne', 'Autre'
  ], []);

  const fetchRestaurantData = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/restaurant/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const restaurantData = data.data;
          setRestaurant(restaurantData);
          
          // Remplir le formulaire avec les données existantes
          setFormData({
            name: restaurantData.name || '',
            description: restaurantData.description || '',
            cuisine: restaurantData.cuisine || '',
            phone: restaurantData.phone || '',
            email: restaurantData.email || user?.email || '',
            priceRange: restaurantData.priceRange || 'Moyen',
            address: {
              street: restaurantData.address?.street || '',
              city: restaurantData.address?.city || '',
              postalCode: restaurantData.address?.postalCode || '',
              country: restaurantData.address?.country || 'France'
            },
            openingHours: restaurantData.openingHours || {
              monday: '11:00-22:00',
              tuesday: '11:00-22:00',
              wednesday: '11:00-22:00',
              thursday: '11:00-22:00',
              friday: '11:00-23:00',
              saturday: '11:00-23:00',
              sunday: '12:00-21:00'
            },
            isOpen: restaurantData.isOpen !== undefined ? restaurantData.isOpen : true
          });

          // Déterminer les jours fermés
          const closed = {};
          daysOfWeek.forEach(day => {
            const hours = restaurantData.openingHours?.[day.key];
            closed[day.key] = !hours || hours === 'Fermé' || hours === '';
          });
          setClosedDays(closed);
        }
      } else if (response.status === 404) {
        // Pas de restaurant, utiliser les valeurs par défaut
        console.log('Aucun restaurant trouvé, utilisation des valeurs par défaut');
      }
    } catch (error) {
      console.error('Erreur chargement restaurant:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [token, user?.email, daysOfWeek]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleHoursChange = (day, type, value) => {
    setFormData(prev => {
      const currentHours = prev.openingHours[day] || '11:00-22:00';
      const [openTime, closeTime] = currentHours.split('-');
      
      const newTime = type === 'open' ? value : (type === 'close' ? value : currentHours);
      const otherTime = type === 'open' ? closeTime : openTime;
      
      return {
        ...prev,
        openingHours: {
          ...prev.openingHours,
          [day]: type === 'open' ? `${newTime}-${otherTime}` : `${otherTime}-${newTime}`
        }
      };
    });
  };

  const toggleDayClosed = (day) => {
    setClosedDays(prev => {
      const newClosed = { ...prev, [day]: !prev[day] };
      
      // Mettre à jour les horaires
      setFormData(prevForm => ({
        ...prevForm,
        openingHours: {
          ...prevForm.openingHours,
          [day]: newClosed[day] ? 'Fermé' : '11:00-22:00'
        }
      }));
      
      return newClosed;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Si on a déjà un restaurant, on met à jour, sinon on crée
      const method = restaurant && restaurant._id ? 'PUT' : 'POST';
      const endpoint = restaurant && restaurant._id ? `${API_BASE_URL}/restaurant/me` : `${API_BASE_URL}/restaurant`;

      console.log('🔍 Méthode:', method);
      console.log('🔍 Endpoint:', endpoint);
      console.log('🔍 Restaurant existant:', restaurant);

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setRestaurant(result);
        toast.success(restaurant && restaurant._id ? 'Informations mises à jour avec succès !' : 'Restaurant créé avec succès !');
        
        // Recharger les données
        fetchRestaurantData();
      } else {
        const errorData = await response.text();
        console.error('Erreur sauvegarde:', errorData);
        toast.error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion');
    } finally {
      setSaving(false);
    }
  };

  const getOpeningTime = (dayHours) => {
    if (!dayHours || dayHours === 'Fermé') return '11:00';
    return dayHours.split('-')[0] || '11:00';
  };

  const getClosingTime = (dayHours) => {
    if (!dayHours || dayHours === 'Fermé') return '22:00';
    return dayHours.split('-')[1] || '22:00';
  };

  if (loading) {
    return (
      <div className="restaurant-profile">
        <div className="profile-container">
          <div className="tab-content">
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
              <p style={{ marginTop: '1rem', color: '#718096' }}>Chargement du profil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-profile">
      <div className="profile-container">
        {/* En-tête du profil */}
        <div className="profile-header">
          <div className="restaurant-avatar">
            🏪
          </div>
          <div className="profile-info">
            <h1>{formData.name || 'Mon Restaurant'}</h1>
            <p>{formData.cuisine || 'Type de cuisine'} • {formData.address.city || 'Ville'}</p>
            <div className="restaurant-status">
              <div className={`status-indicator ${formData.isOpen ? '' : 'closed'}`}></div>
              <span>{formData.isOpen ? 'Ouvert' : 'Fermé'}</span>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <span className="material-icons">info</span>
            Informations générales
          </button>
          <button 
            className={`tab-button ${activeTab === 'hours' ? 'active' : ''}`}
            onClick={() => setActiveTab('hours')}
          >
            <span className="material-icons">schedule</span>
            Horaires d'ouverture
          </button>
          <button 
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <span className="material-icons">contact_page</span>
            Contact & Adresse
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="tab-content">
            {activeTab === 'general' && (
              <div className="form-section">
                <h2 className="section-title">
                  <span className="material-icons">restaurant</span>
                  Informations du restaurant
                </h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="material-icons">store</span>
                      Nom du restaurant *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Ex: Chez Pierre"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="material-icons">restaurant_menu</span>
                      Type de cuisine *
                    </label>
                    <select
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Sélectionner un type</option>
                      {cuisineTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="material-icons">euro</span>
                      Gamme de prix
                    </label>
                    <select
                      name="priceRange"
                      value={formData.priceRange}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Économique">€ - Économique</option>
                      <option value="Moyen">€€ - Moyen</option>
                      <option value="Élevé">€€€ - Élevé</option>
                      <option value="Luxe">€€€€ - Luxe</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="material-icons">description</span>
                    Description du restaurant
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Décrivez votre restaurant, votre spécialité, l'ambiance..."
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="material-icons">toggle_on</span>
                    Statut du restaurant
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="isOpen"
                        checked={formData.isOpen}
                        onChange={handleInputChange}
                      />
                      Restaurant actuellement ouvert
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hours' && (
              <div className="form-section">
                <h2 className="section-title">
                  <span className="material-icons">access_time</span>
                  Horaires d'ouverture
                </h2>
                
                <div className="opening-hours">
                  {daysOfWeek.map(day => (
                    <div key={day.key} className="day-hours">
                      <div className="day-name">{day.label}</div>
                      
                      {!closedDays[day.key] ? (
                        <>
                          <input
                            type="time"
                            className="time-input"
                            value={getOpeningTime(formData.openingHours[day.key])}
                            onChange={(e) => handleHoursChange(day.key, 'open', e.target.value)}
                          />
                          <input
                            type="time"
                            className="time-input"
                            value={getClosingTime(formData.openingHours[day.key])}
                            onChange={(e) => handleHoursChange(day.key, 'close', e.target.value)}
                          />
                        </>
                      ) : (
                        <>
                          <div style={{ color: '#718096', fontStyle: 'italic' }}>Fermé</div>
                          <div></div>
                        </>
                      )}
                      
                      <div className="closed-toggle">
                        <div 
                          className={`toggle-switch ${!closedDays[day.key] ? 'active' : ''}`}
                          onClick={() => toggleDayClosed(day.key)}
                        ></div>
                        <span style={{ fontSize: '0.875rem', color: '#718096' }}>
                          {closedDays[day.key] ? 'Fermé' : 'Ouvert'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="form-section">
                <h2 className="section-title">
                  <span className="material-icons">contact_mail</span>
                  Informations de contact
                </h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="material-icons">email</span>
                      Email de contact
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="contact@restaurant.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="material-icons">phone</span>
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="01 23 45 67 89"
                    />
                  </div>
                </div>

                <h3 className="section-title">
                  <span className="material-icons">location_on</span>
                  Adresse
                </h3>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="material-icons">home</span>
                      Rue et numéro
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="123 Rue de la Paix"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="material-icons">location_city</span>
                      Ville
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Paris"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="material-icons">markunread_mailbox</span>
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="75001"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="material-icons">public</span>
                      Pays
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="France"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="loading-spinner"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <span className="material-icons">save</span>
                    {restaurant ? 'Mettre à jour' : 'Créer le restaurant'}
                  </>
                )}
              </button>
              
              <button
                type="button"
                className="btn btn-secondary"
                onClick={fetchRestaurantData}
                disabled={saving}
              >
                <span className="material-icons">refresh</span>
                Annuler
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantProfile; 