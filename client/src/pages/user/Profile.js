import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const API_BASE_URL = 'http://localhost:5000';

const UserProfile = () => {
  const { token, user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState({});
  const [saving, setSaving] = useState({});
  const [formData, setFormData] = useState({});

  // Charger les données de l'utilisateur
  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données utilisateur');
      }

      const data = await response.json();
      if (data.success && data.data) {
        const userData = data.data;
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            postalCode: userData.address?.postalCode || '',
            country: userData.address?.country || ''
          },
          preferences: {
            notifications: userData.preferences?.notifications || true,
            newsletter: userData.preferences?.newsletter || false,
            language: userData.preferences?.language || 'fr',
            theme: userData.preferences?.theme || 'light'
          },
          dietaryRestrictions: userData.dietaryRestrictions || [],
          allergies: userData.allergies || []
        });
      } else {
        throw new Error('Aucun utilisateur trouvé');
      }
    } catch (err) {
      console.error('Erreur chargement utilisateur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

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

      const response = await fetch(`${API_BASE_URL}/users/me`, {
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
        // Mettre à jour le contexte d'authentification
        if (updateUser) {
          updateUser(result.data);
        }
        setEditing(prev => ({ ...prev, [field]: false }));
        await loadUserData();
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

      const response = await fetch(`${API_BASE_URL}/users/me`, {
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
        // Mettre à jour le contexte d'authentification
        if (updateUser) {
          updateUser(result.data);
        }
        setEditing({});
        alert('Profil mis à jour avec succès !');
        await loadUserData();
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
    loadUserData();
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-page">
        <div className="error-container">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={loadUserData} className="btn btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="error-container">
          <h2>Aucun utilisateur trouvé</h2>
          <p>Vous devez être connecté pour accéder à votre profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1>Mon Profil</h1>
          <p>Gérez vos informations personnelles</p>
        </div>

        {/* Informations personnelles */}
        <div className="profile-section">
          <h2>Informations personnelles</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Prénom</label>
              <div className="editable-field">
                {editing.firstName ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="form-input"
                      placeholder="Votre prénom"
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => saveField('firstName')}
                        disabled={saving.firstName}
                        className="btn btn-success btn-sm"
                      >
                        {saving.firstName ? 'Sauvegarde...' : '✓'}
                      </button>
                      <button 
                        onClick={() => cancelEditing('firstName')}
                        className="btn btn-outline btn-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="field-value">{user.firstName || 'Non renseigné'}</span>
                    <button 
                      onClick={() => startEditing('firstName')}
                      className="btn btn-outline btn-sm"
                    >
                      Modifier
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Nom</label>
              <div className="editable-field">
                {editing.lastName ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="form-input"
                      placeholder="Votre nom"
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => saveField('lastName')}
                        disabled={saving.lastName}
                        className="btn btn-success btn-sm"
                      >
                        {saving.lastName ? 'Sauvegarde...' : '✓'}
                      </button>
                      <button 
                        onClick={() => cancelEditing('lastName')}
                        className="btn btn-outline btn-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="field-value">{user.lastName || 'Non renseigné'}</span>
                    <button 
                      onClick={() => startEditing('lastName')}
                      className="btn btn-outline btn-sm"
                    >
                      Modifier
                    </button>
                  </div>
                )}
              </div>
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
                    placeholder="votre@email.com"
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
                  <span className="field-value">{user.email}</span>
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
                    placeholder="+33 6 12 34 56 78"
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
                  <span className="field-value">{user.phone || 'Non renseigné'}</span>
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
        </div>

        {/* Adresse */}
        <div className="profile-section">
          <h2>Adresse de livraison</h2>
          
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
                  <span className="field-value">{user.address?.street || 'Non renseigné'}</span>
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
                    <span className="field-value">{user.address?.city || 'Non renseigné'}</span>
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
                    <span className="field-value">{user.address?.postalCode || 'Non renseigné'}</span>
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

        {/* Préférences */}
        <div className="profile-section">
          <h2>Préférences</h2>
          
          <div className="form-group">
            <label>Notifications</label>
            <div className="editable-field">
              {editing['preferences.notifications'] ? (
                <div className="edit-mode">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.preferences.notifications}
                        onChange={(e) => handleInputChange('preferences.notifications', e.target.checked)}
                      />
                      Recevoir les notifications par email
                    </label>
                  </div>
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('preferences')}
                      disabled={saving['preferences.notifications']}
                      className="btn btn-success btn-sm"
                    >
                      {saving['preferences.notifications'] ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('preferences.notifications')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">
                    {user.preferences?.notifications ? 'Activées' : 'Désactivées'}
                  </span>
                  <button 
                    onClick={() => startEditing('preferences.notifications')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Newsletter</label>
            <div className="editable-field">
              {editing['preferences.newsletter'] ? (
                <div className="edit-mode">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.preferences.newsletter}
                        onChange={(e) => handleInputChange('preferences.newsletter', e.target.checked)}
                      />
                      Recevoir la newsletter
                    </label>
                  </div>
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('preferences')}
                      disabled={saving['preferences.newsletter']}
                      className="btn btn-success btn-sm"
                    >
                      {saving['preferences.newsletter'] ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('preferences.newsletter')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">
                    {user.preferences?.newsletter ? 'Abonné' : 'Non abonné'}
                  </span>
                  <button 
                    onClick={() => startEditing('preferences.newsletter')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Langue</label>
            <div className="editable-field">
              {editing['preferences.language'] ? (
                <div className="edit-mode">
                  <select
                    value={formData.preferences.language}
                    onChange={(e) => handleInputChange('preferences.language', e.target.value)}
                    className="form-select"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('preferences')}
                      disabled={saving['preferences.language']}
                      className="btn btn-success btn-sm"
                    >
                      {saving['preferences.language'] ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('preferences.language')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">
                    {user.preferences?.language === 'fr' ? 'Français' : 
                     user.preferences?.language === 'en' ? 'English' : 
                     user.preferences?.language === 'es' ? 'Español' : 'Français'}
                  </span>
                  <button 
                    onClick={() => startEditing('preferences.language')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Restrictions alimentaires */}
        <div className="profile-section">
          <h2>Préférences alimentaires</h2>
          
          <div className="form-group">
            <label>Régimes alimentaires</label>
            <div className="editable-field">
              {editing.dietaryRestrictions ? (
                <div className="edit-mode">
                  <div className="checkbox-group">
                    {['Végétarien', 'Végétalien', 'Sans gluten', 'Sans lactose', 'Halal', 'Casher'].map(diet => (
                      <label key={diet} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.dietaryRestrictions.includes(diet)}
                          onChange={(e) => {
                            const newRestrictions = e.target.checked
                              ? [...formData.dietaryRestrictions, diet]
                              : formData.dietaryRestrictions.filter(r => r !== diet);
                            handleInputChange('dietaryRestrictions', newRestrictions);
                          }}
                        />
                        {diet}
                      </label>
                    ))}
                  </div>
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('dietaryRestrictions')}
                      disabled={saving.dietaryRestrictions}
                      className="btn btn-success btn-sm"
                    >
                      {saving.dietaryRestrictions ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('dietaryRestrictions')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">
                    {user.dietaryRestrictions?.length > 0 
                      ? user.dietaryRestrictions.join(', ') 
                      : 'Aucune restriction'}
                  </span>
                  <button 
                    onClick={() => startEditing('dietaryRestrictions')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Allergies</label>
            <div className="editable-field">
              {editing.allergies ? (
                <div className="edit-mode">
                  <div className="checkbox-group">
                    {['Gluten', 'Lactose', 'Œufs', 'Poisson', 'Fruits de mer', 'Arachides', 'Noix', 'Soja'].map(allergy => (
                      <label key={allergy} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.allergies.includes(allergy)}
                          onChange={(e) => {
                            const newAllergies = e.target.checked
                              ? [...formData.allergies, allergy]
                              : formData.allergies.filter(a => a !== allergy);
                            handleInputChange('allergies', newAllergies);
                          }}
                        />
                        {allergy}
                      </label>
                    ))}
                  </div>
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveField('allergies')}
                      disabled={saving.allergies}
                      className="btn btn-success btn-sm"
                    >
                      {saving.allergies ? 'Sauvegarde...' : '✓'}
                    </button>
                    <button 
                      onClick={() => cancelEditing('allergies')}
                      className="btn btn-outline btn-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="field-value">
                    {user.allergies?.length > 0 
                      ? user.allergies.join(', ') 
                      : 'Aucune allergie'}
                  </span>
                  <button 
                    onClick={() => startEditing('allergies')}
                    className="btn btn-outline btn-sm"
                  >
                    Modifier
                  </button>
                </div>
              )}
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

export default UserProfile; 