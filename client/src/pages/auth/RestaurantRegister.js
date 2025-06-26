import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './RestaurantRegister.css';

const API_BASE_URL = 'http://localhost:5000';

const RestaurantRegister = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userToken, setUserToken] = useState(null);
  const [userName, setUserName] = useState('');

  // Données du formulaire restaurant
  const [restaurantData, setRestaurantData] = useState({
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
    }
  });

  // Données du compte utilisateur
  const [userAccount, setUserAccount] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Jours fermés
  const [closedDays, setClosedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });

  // Types de cuisine
  const cuisineTypes = [
    'Française', 'Italienne', 'Japonaise', 'Chinoise', 'Mexicaine',
    'Indienne', 'Américaine', 'Méditerranéenne', 'Libanaise', 'Thaï',
    'Cuisine du monde', 'Fast-food', 'Végétarienne', 'Autre'
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  const steps = [
    { number: 1, title: 'Création du compte', icon: '👤' },
    { number: 2, title: 'Bienvenue', icon: '🎉' },
    { number: 3, title: 'Informations du restaurant', icon: '🏪' },
    { number: 4, title: 'Horaires d\'ouverture', icon: '🕒' },
    { number: 5, title: 'Contact & Adresse', icon: '📍' },
    { number: 6, title: 'Création en cours', icon: '⚡' }
  ];

  const handleRestaurantChange = (field, value) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setRestaurantData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setRestaurantData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleUserChange = (field, value) => {
    setUserAccount(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHoursChange = (day, type, value) => {
    setRestaurantData(prev => {
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
      setRestaurantData(prevForm => ({
        ...prevForm,
        openingHours: {
          ...prevForm.openingHours,
          [day]: newClosed[day] ? 'Fermé' : '11:00-22:00'
        }
      }));
      
      return newClosed;
    });
  };

  const getOpeningTime = (dayHours) => {
    if (!dayHours || dayHours === 'Fermé') return '11:00';
    return dayHours.split('-')[0] || '11:00';
  };

  const getClosingTime = (dayHours) => {
    if (!dayHours || dayHours === 'Fermé') return '22:00';
    return dayHours.split('-')[1] || '22:00';
  };

  const validateStep = (step) => {
    setError('');
    
    switch (step) {
      case 1: // Création du compte
        if (!userAccount.firstName.trim()) {
          setError('Le prénom est requis');
          return false;
        }
        if (!userAccount.lastName.trim()) {
          setError('Le nom est requis');
          return false;
        }
        if (!userAccount.email.trim()) {
          setError('L\'email est requis');
          return false;
        }
        if (userAccount.password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          return false;
        }
        if (userAccount.password !== userAccount.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return false;
        }
        break;
      case 3: // Informations du restaurant
        if (!restaurantData.name.trim()) {
          setError('Le nom du restaurant est requis');
          return false;
        }
        if (!restaurantData.cuisine) {
          setError('Le type de cuisine est requis');
          return false;
        }
        if (!restaurantData.description.trim()) {
          setError('Une description du restaurant est requise');
          return false;
        }
        break;
      case 4: // Horaires d'ouverture
        // Vérifier qu'il y a au moins un jour ouvert
        const hasOpenDay = Object.values(closedDays).some(closed => !closed);
        if (!hasOpenDay) {
          setError('Le restaurant doit être ouvert au moins un jour par semaine');
          return false;
        }
        break;
      case 5: // Contact & Adresse
        if (!restaurantData.phone.trim()) {
          setError('Le numéro de téléphone est requis');
          return false;
        }
        if (!restaurantData.email.trim()) {
          setError('L\'email de contact est requis');
          return false;
        }
        if (!restaurantData.address.street.trim()) {
          setError('L\'adresse est requise');
          return false;
        }
        if (!restaurantData.address.city.trim()) {
          setError('La ville est requise');
          return false;
        }
        break;
      default:
        // Rien à faire
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  // Étape 1: Création du compte utilisateur
  const handleCreateAccount = async () => {
    if (!validateStep(1)) return;

    setIsSubmitting(true);
    setError('');

    try {
      console.log('🔐 Création du compte utilisateur...');
      const userResponse = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${userAccount.firstName} ${userAccount.lastName}`,
          email: userAccount.email,
          password: userAccount.password,
          role: 'restaurant'
        })
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        console.error('❌ Erreur création compte:', errorData);
        
        let errorMessage = errorData.message || 'Erreur lors de la création du compte';
        if (errorMessage.includes('déjà utilisé')) {
          errorMessage = 'Cet email est déjà utilisé. Veuillez utiliser un autre email ou vous connecter.';
        } else if (errorMessage.includes('validation')) {
          errorMessage = 'Veuillez vérifier les informations saisies.';
        }
        
        throw new Error(errorMessage);
      }

      const userData = await userResponse.json();
      console.log('✅ Compte utilisateur créé');

      // Stocker le token et le nom pour les étapes suivantes
      setUserToken(userData.access_token);
      setUserName(userAccount.firstName);
      
      // Passer à l'étape de bienvenue
      setCurrentStep(2);
      toast.success(`🎉 Compte créé avec succès ! Bienvenue ${userAccount.firstName} !`);

    } catch (error) {
      console.error('❌ Erreur création compte:', error);
      
      let errorMessage = error.message;
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = 'Problème de connexion. Vérifiez votre connexion internet et réessayez.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'La requête a pris trop de temps. Veuillez réessayer.';
      }
      
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Étape 6: Création du restaurant
  const handleCreateRestaurant = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setError('');

    try {
      console.log('🏪 Création du restaurant...');
      
      // Créer le restaurant avec les informations fournies
      const createRestaurantResponse = await fetch(`${API_BASE_URL}/restaurant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          name: restaurantData.name,
          description: restaurantData.description,
          cuisine: restaurantData.cuisine,
          phone: restaurantData.phone,
          email: restaurantData.email,
          priceRange: restaurantData.priceRange,
          address: restaurantData.address,
          openingHours: restaurantData.openingHours
        })
      });

      if (!createRestaurantResponse.ok) {
        const errorData = await createRestaurantResponse.json();
        console.error('❌ Erreur création restaurant:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la création du restaurant');
      }

      const restaurantResult = await createRestaurantResponse.json();
      console.log('✅ Restaurant créé avec succès:', restaurantResult);

      // Passer à l'étape finale (loader)
      setCurrentStep(6);
      
      // Attendre 2 secondes pour l'effet visuel
      setTimeout(() => {
        toast.success(`🎉 Votre restaurant "${restaurantData.name}" a été créé avec succès !`);
        
        // Stocker le token pour la connexion
        localStorage.setItem('token', userToken);
        
        // Redirection vers le dashboard
        navigate('/restaurant/dashboard');
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur création restaurant:', error);
      
      let errorMessage = error.message;
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = 'Problème de connexion. Vérifiez votre connexion internet et réessayez.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'La requête a pris trop de temps. Veuillez réessayer.';
      }
      
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Étape 1: Création du compte
  const renderStep1 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>👤 Création de votre compte</h2>
        <p>Créez votre compte pour gérer votre restaurant</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            <span className="material-icons">person</span>
            Prénom *
          </label>
          <input
            type="text"
            value={userAccount.firstName}
            onChange={(e) => handleUserChange('firstName', e.target.value)}
            className="form-input"
            placeholder="Votre prénom"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="material-icons">person</span>
            Nom *
          </label>
          <input
            type="text"
            value={userAccount.lastName}
            onChange={(e) => handleUserChange('lastName', e.target.value)}
            className="form-input"
            placeholder="Votre nom"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <span className="material-icons">email</span>
          Email de connexion *
        </label>
        <input
          type="email"
          value={userAccount.email}
          onChange={(e) => handleUserChange('email', e.target.value)}
          className="form-input"
          placeholder="votre.email@exemple.com"
          required
        />
        <small className="form-help">Cet email sera utilisé pour vous connecter</small>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            <span className="material-icons">lock</span>
            Mot de passe *
          </label>
          <input
            type="password"
            value={userAccount.password}
            onChange={(e) => handleUserChange('password', e.target.value)}
            className="form-input"
            placeholder="Minimum 6 caractères"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="material-icons">lock_outline</span>
            Confirmer le mot de passe *
          </label>
          <input
            type="password"
            value={userAccount.confirmPassword}
            onChange={(e) => handleUserChange('confirmPassword', e.target.value)}
            className="form-input"
            placeholder="Répétez votre mot de passe"
            required
          />
        </div>
      </div>

      <div className="step-actions">
        <button
          type="button"
          onClick={handleCreateAccount}
          disabled={isSubmitting}
          className="btn btn-primary btn-large"
        >
          {isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
        </button>
      </div>
    </div>
  );

  // Étape 2: Bienvenue
  const renderStep2 = () => (
    <div className="step-content welcome-step">
      <div className="welcome-content">
        <div className="welcome-icon">🎉</div>
        <h2>Bienvenue {userName} !</h2>
        <p>Votre compte a été créé avec succès. Maintenant, créons votre restaurant !</p>
        <div className="welcome-info">
          <div className="info-item">
            <span className="material-icons">check_circle</span>
            <span>Compte utilisateur créé</span>
          </div>
          <div className="info-item">
            <span className="material-icons">pending</span>
            <span>Restaurant à configurer</span>
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button
          type="button"
          onClick={nextStep}
          className="btn btn-primary btn-large"
        >
          Commencer la configuration du restaurant
        </button>
      </div>
    </div>
  );

  // Étape 3: Informations du restaurant
  const renderStep3 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>🏪 Informations du restaurant</h2>
        <p>Présentez votre restaurant à vos futurs clients</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            <span className="material-icons">store</span>
            Nom du restaurant *
          </label>
          <input
            type="text"
            value={restaurantData.name}
            onChange={(e) => handleRestaurantChange('name', e.target.value)}
            className="form-input"
            placeholder="Ex: Chez Pierre, Pizza Palace..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="material-icons">restaurant_menu</span>
            Type de cuisine *
          </label>
          <select
            value={restaurantData.cuisine}
            onChange={(e) => handleRestaurantChange('cuisine', e.target.value)}
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
            value={restaurantData.priceRange}
            onChange={(e) => handleRestaurantChange('priceRange', e.target.value)}
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
          Description du restaurant *
        </label>
        <textarea
          value={restaurantData.description}
          onChange={(e) => handleRestaurantChange('description', e.target.value)}
          className="form-textarea"
          placeholder="Décrivez votre restaurant, vos spécialités, l'ambiance... Cette description sera visible par vos clients."
          rows="4"
          required
        />
      </div>

      <div className="step-actions">
        <button
          type="button"
          onClick={prevStep}
          className="btn btn-secondary"
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="btn btn-primary"
        >
          Suivant
        </button>
      </div>
    </div>
  );

  // Étape 4: Horaires d'ouverture
  const renderStep4 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>🕒 Horaires d'ouverture</h2>
        <p>Définissez vos horaires de service pour vos clients</p>
      </div>

      <div className="opening-hours">
        {daysOfWeek.map(day => (
          <div key={day.key} className="day-hours">
            <div className="day-name">{day.label}</div>
            
            {!closedDays[day.key] ? (
              <>
                <input
                  type="time"
                  className="time-input"
                  value={getOpeningTime(restaurantData.openingHours[day.key])}
                  onChange={(e) => handleHoursChange(day.key, 'open', e.target.value)}
                />
                <span className="time-separator">à</span>
                <input
                  type="time"
                  className="time-input"
                  value={getClosingTime(restaurantData.openingHours[day.key])}
                  onChange={(e) => handleHoursChange(day.key, 'close', e.target.value)}
                />
              </>
            ) : (
              <span className="closed-text">Fermé</span>
            )}
            
            <button
              type="button"
              className={`toggle-day-btn ${closedDays[day.key] ? 'closed' : 'open'}`}
                onClick={() => toggleDayClosed(day.key)}
            >
              {closedDays[day.key] ? 'Ouvrir' : 'Fermer'}
            </button>
          </div>
        ))}
      </div>

      <div className="step-actions">
        <button
          type="button"
          onClick={prevStep}
          className="btn btn-secondary"
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="btn btn-primary"
        >
          Suivant
        </button>
      </div>
    </div>
  );

  // Étape 5: Contact & Adresse
  const renderStep5 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>📍 Contact & Adresse</h2>
        <p>Informations de contact et localisation de votre restaurant</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            <span className="material-icons">phone</span>
            Téléphone *
          </label>
          <input
            type="tel"
            value={restaurantData.phone}
            onChange={(e) => handleRestaurantChange('phone', e.target.value)}
            className="form-input"
            placeholder="01 23 45 67 89"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="material-icons">email</span>
            Email de contact *
          </label>
          <input
            type="email"
            value={restaurantData.email}
            onChange={(e) => handleRestaurantChange('email', e.target.value)}
            className="form-input"
            placeholder="contact@restaurant.com"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <span className="material-icons">location_on</span>
          Adresse *
        </label>
        <input
          type="text"
          value={restaurantData.address.street}
          onChange={(e) => handleRestaurantChange('address.street', e.target.value)}
          className="form-input"
          placeholder="123 Rue de la Gastronomie"
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            <span className="material-icons">location_city</span>
            Ville *
          </label>
          <input
            type="text"
            value={restaurantData.address.city}
            onChange={(e) => handleRestaurantChange('address.city', e.target.value)}
            className="form-input"
            placeholder="Paris"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="material-icons">markunread_mailbox</span>
            Code postal
          </label>
          <input
            type="text"
            value={restaurantData.address.postalCode}
            onChange={(e) => handleRestaurantChange('address.postalCode', e.target.value)}
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
            value={restaurantData.address.country}
            onChange={(e) => handleRestaurantChange('address.country', e.target.value)}
            className="form-input"
            placeholder="France"
          />
        </div>
      </div>

      <div className="step-actions">
        <button
          type="button"
          onClick={prevStep}
          className="btn btn-secondary"
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={handleCreateRestaurant}
          disabled={isSubmitting}
          className="btn btn-primary btn-large"
        >
          {isSubmitting ? 'Configuration en cours...' : 'Finaliser la configuration'}
        </button>
      </div>
    </div>
  );

  // Étape 6: Loader final
  const renderStep6 = () => (
    <div className="step-content loading-step">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <h2>Configuration de votre restaurant en cours...</h2>
        <p>Nous finalisons la configuration de votre espace restaurant. Cela ne prendra que quelques secondes.</p>
        <div className="loading-steps">
          <div className="loading-step">
            <span className="material-icons">check_circle</span>
            <span>Compte utilisateur créé</span>
        </div>
          <div className="loading-step">
            <span className="material-icons">check_circle</span>
            <span>Restaurant initialisé</span>
      </div>
          <div className="loading-step">
            <span className="material-icons">pending</span>
            <span>Configuration en cours...</span>
        </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="restaurant-register-container">
        <div className="register-header">
        <Link to="/" className="back-link">
            <span className="material-icons">arrow_back</span>
          Retour à l'accueil
          </Link>
        <h1>Inscription Restaurant</h1>
          <p>Rejoignez FoodDelivery+ et développez votre activité</p>
        </div>

      <div className="register-content">
        <div className="steps-indicator">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`step-indicator ${currentStep > step.number ? 'completed' : currentStep === step.number ? 'active' : ''}`}
            >
              <div className="step-number">
                {currentStep > step.number ? (
                  <span className="material-icons">check</span>
                ) : (
                  step.number
                )}
              </div>
              <div className="step-info">
                <div className="step-icon">{step.icon}</div>
                <div className="step-title">{step.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-container">
          {error && (
            <div className="error-message">
              <span className="material-icons">error</span>
              {error}
            </div>
          )}

          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegister; 