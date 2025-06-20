import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    dietaryPreferences: [],
    allergies: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Charger les données utilisateur au montage
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          postalCode: user.address?.postalCode || '',
          country: user.address?.country || ''
        },
        dietaryPreferences: user.dietaryPreferences || [],
        allergies: user.allergies || []
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setMessage('Profil mis à jour avec succès !');
        console.log('✅ Profil mis à jour:', updatedUser);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur mise à jour profil:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h2>Mon Profil</h2>
          <p>Complétez vos informations personnelles</p>
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3>Informations personnelles</h3>
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nom complet
              </label>
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
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
              />
              <small>L'email ne peut pas être modifié</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Adresse de livraison</h3>
            
            <div className="form-group">
              <label htmlFor="address.street" className="form-label">
                Rue et numéro
              </label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                className="form-input"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="123 Rue de la Paix"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.city" className="form-label">
                  Ville
                </label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  className="form-input"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="Paris"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.postalCode" className="form-label">
                  Code postal
                </label>
                <input
                  type="text"
                  id="address.postalCode"
                  name="address.postalCode"
                  className="form-input"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  placeholder="75001"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address.country" className="form-label">
                Pays
              </label>
              <input
                type="text"
                id="address.country"
                name="address.country"
                className="form-input"
                value={formData.address.country}
                onChange={handleChange}
                placeholder="France"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Préférences alimentaires (optionnel)</h3>
            
            <div className="form-group">
              <label htmlFor="dietaryPreferences" className="form-label">
                Régime alimentaire
              </label>
              <select
                id="dietaryPreferences"
                name="dietaryPreferences"
                className="form-select"
                multiple
                value={formData.dietaryPreferences}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData(prev => ({
                    ...prev,
                    dietaryPreferences: selected
                  }));
                }}
              >
                <option value="vegetarian">Végétarien</option>
                <option value="vegan">Végan</option>
                <option value="gluten-free">Sans gluten</option>
                <option value="lactose-free">Sans lactose</option>
                <option value="halal">Halal</option>
                <option value="kosher">Casher</option>
              </select>
              <small>Maintenez Ctrl (ou Cmd) pour sélectionner plusieurs options</small>
            </div>

            <div className="form-group">
              <label htmlFor="allergies" className="form-label">
                Allergies alimentaires
              </label>
              <input
                type="text"
                id="allergies"
                name="allergies"
                className="form-input"
                value={formData.allergies.join(', ')}
                onChange={(e) => {
                  const allergies = e.target.value.split(',').map(item => item.trim()).filter(item => item);
                  setFormData(prev => ({
                    ...prev,
                    allergies
                  }));
                }}
                placeholder="Arachides, fruits de mer, lait..."
              />
              <small>Séparez les allergies par des virgules</small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Mise à jour...' : 'Sauvegarder le profil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 