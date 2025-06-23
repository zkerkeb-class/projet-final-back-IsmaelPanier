import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Simuler la mise à jour du profil
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ici vous appelleriez votre API pour mettre à jour le profil
      // await updateProfile(formData);
      
      setMessage('Profil mis à jour avec succès !');
      setIsEditing(false);
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>👤 Mon Profil</h1>
          <p>Gérez vos informations personnelles</p>
        </div>

        {message && (
          <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-avatar">
            <div className="avatar">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <h2>{user?.firstName} {user?.lastName}</h2>
            <p className="user-email">{user?.email}</p>
          </div>

          <div className="profile-form">
            <div className="form-header">
              <h3>Informations personnelles</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  ✏️ Modifier
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Prénom *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Nom *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Adresse</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Votre adresse de livraison"
                  rows="3"
                />
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="profile-stats">
            <h3>Statistiques</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🍽️</div>
                <div className="stat-content">
                  <h4>Commandes</h4>
                  <p className="stat-number">12</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <div className="stat-content">
                  <h4>Favoris</h4>
                  <p className="stat-number">5</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h4>Note moyenne</h4>
                  <p className="stat-number">4.8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 