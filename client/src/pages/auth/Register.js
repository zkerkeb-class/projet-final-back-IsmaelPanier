import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Register.css';

const Register = () => {
  const [step, setStep] = useState('select'); // 'select' ou 'form'
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    // Validation du prénom
    if (!formData.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    }
    
    // Validation du nom
    if (!formData.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Le nom doit contenir au moins 2 caractères';
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide (ex: nom@exemple.com)';
    }
    
    // Validation du mot de passe
    if (!formData.password.trim()) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      errors.password = 'Le mot de passe doit contenir au moins une lettre minuscule';
    }
    
    // Validation de la confirmation
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRoleSelect = (role) => {
    if (role === 'restaurant') {
      // Rediriger vers l'inscription restaurant spécialisée
      navigate('/restaurant-register');
      return;
    }
    
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
    setStep('form');
    setError('');
    setFieldErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Effacer les erreurs quand l'utilisateur tape
    if (error) {
      setError('');
    }
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log('📝 Tentative d\'inscription pour:', formData.email);
      
      const userData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: formData.role,
      };

      const result = await register(userData);
      
      if (result.success) {
        toast.success(`🎉 Inscription réussie ! Bienvenue ${userData.firstName} !`);
        
        // Redirection vers le dashboard selon le rôle avec délai
        setTimeout(() => {
          if (formData.role === 'restaurant') {
            navigate('/restaurant/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        }, 1500);
      } else {
        // Messages d'erreur spécifiques
        let errorMessage = result.error;
        
        if (errorMessage.includes('déjà utilisé') || errorMessage.includes('already exists')) {
          errorMessage = '❌ Cette adresse email est déjà utilisée. Connectez-vous ou utilisez un autre email.';
          setFieldErrors({ email: 'Email déjà utilisé' });
        } else if (errorMessage.includes('mot de passe') || errorMessage.includes('password')) {
          errorMessage = '❌ Mot de passe invalide. Utilisez au moins 6 caractères.';
          setFieldErrors({ password: 'Mot de passe invalide' });
        } else if (errorMessage.includes('email')) {
          errorMessage = '❌ Format d\'email invalide.';
          setFieldErrors({ email: 'Format invalide' });
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
        
        // Vider les mots de passe en cas d'erreur
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (err) {
      const errorMsg = '❌ Erreur d\'inscription. Vérifiez votre connexion internet.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Erreur inscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep('select');
    setSelectedRole('');
    setError('');
    setFieldErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: 'user',
    });
  };

  // Étape 1: Sélection du type de compte
  if (step === 'select') {
    return (
      <div className="register-page">
        <div className="register-container">
          <div className="register-header">
            <h1>🏪 Rejoignez FoodDelivery+</h1>
            <p>Choisissez votre type de compte pour commencer</p>
          </div>

          <div className="role-selection">
            <div 
              className="role-card"
              onClick={() => handleRoleSelect('user')}
            >
              <div className="role-icon">👤</div>
              <h2>Client</h2>
              <p>Je veux commander des repas</p>
              <ul className="role-features">
                <li>✓ Commandez en quelques clics</li>
                <li>✓ Suivez vos livraisons en temps réel</li>
                <li>✓ Gérez vos favoris</li>
                <li>✓ Consultez votre historique</li>
              </ul>
              <button className="btn btn-primary">
                Devenir Client
              </button>
            </div>

            <div 
              className="role-card restaurant"
              onClick={() => handleRoleSelect('restaurant')}
            >
              <div className="role-icon">🏪</div>
              <h2>Restaurant</h2>
              <p>Je veux vendre mes plats</p>
              <ul className="role-features">
                <li>✓ Gérez votre menu facilement</li>
                <li>✓ Recevez des commandes en temps réel</li>
                <li>✓ Suivez vos performances</li>
                <li>✓ Développez votre activité</li>
              </ul>
              <button className="btn btn-success">
                Devenir Restaurant
              </button>
            </div>
          </div>

          <div className="register-footer">
            <p>
              Déjà un compte ?{' '}
              <Link to="/login" className="link">
                Se connecter
              </Link>
            </p>
            <p>
              <Link to="/" className="link">
                ← Retour à l'accueil
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Étape 2: Formulaire d'inscription
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <button onClick={goBack} className="back-btn">
            ← Retour
          </button>
          <h1>
            {selectedRole === 'restaurant' ? '🏪' : '👤'} 
            Inscription {selectedRole === 'restaurant' ? 'Restaurant' : 'Client'}
          </h1>
          <p>
            {selectedRole === 'restaurant' 
              ? 'Créez votre compte restaurant et commencez à vendre vos plats'
              : 'Créez votre compte client et commencez à commander'
            }
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span className="material-icons">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                <span className="material-icons">person</span>
                Prénom *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`form-input ${fieldErrors.firstName ? 'error' : ''}`}
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Votre prénom"
                autoComplete="given-name"
                required
              />
              {fieldErrors.firstName && (
                <span className="field-error">{fieldErrors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                <span className="material-icons">person</span>
                Nom *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`form-input ${fieldErrors.lastName ? 'error' : ''}`}
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Votre nom"
                autoComplete="family-name"
                required
              />
              {fieldErrors.lastName && (
                <span className="field-error">{fieldErrors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <span className="material-icons">email</span>
              Adresse email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${fieldErrors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="votre.email@exemple.com"
              autoComplete="email"
              required
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="material-icons">lock</span>
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 caractères"
                autoComplete="new-password"
                required
              />
              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <span className="material-icons">lock_outline</span>
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Répétez votre mot de passe"
                autoComplete="new-password"
                required
              />
              {fieldErrors.confirmPassword && (
                <span className="field-error">{fieldErrors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Inscription en cours...
              </>
            ) : (
              <>
                <span className="material-icons">person_add</span>
                Créer mon compte {selectedRole === 'restaurant' ? 'restaurant' : 'client'}
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Déjà un compte ?{' '}
            <Link to="/login" className="link">
              Se connecter
            </Link>
          </p>
          <p>
            <Link to="/" className="link">
              ← Retour à l'accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 