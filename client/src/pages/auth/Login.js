import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
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
      console.log('🔐 Tentative de connexion pour:', formData.email);
      const result = await login(formData.email, formData.password);
      
      console.log('📡 Résultat de la connexion:', result);
      
      if (result.success) {
        toast.success(`🎉 Connexion réussie ! Bienvenue ${result.user.name || result.user.email}`);
        
        // Redirection selon le rôle avec délai pour voir le toast
        setTimeout(() => {
          if (result.user.role === 'restaurant') {
            navigate('/restaurant/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        }, 1000);
      } else {
        console.log('❌ Échec de connexion - Résultat:', result);
        
        // Messages d'erreur spécifiques
        let errorMessage = result.error || 'Erreur de connexion inconnue';
        console.log('📝 Message d\'erreur original:', errorMessage);
        
        if (errorMessage.includes('mot de passe') || errorMessage.includes('password') || errorMessage.includes('incorrect')) {
          errorMessage = '❌ Mot de passe incorrect. Vérifiez votre mot de passe.';
        } else if (errorMessage.includes('email') || errorMessage.includes('utilisateur') || errorMessage.includes('compte')) {
          errorMessage = '❌ Aucun compte trouvé avec cet email. Vérifiez votre email ou inscrivez-vous.';
        } else if (errorMessage.includes('réseau') || errorMessage.includes('internet')) {
          errorMessage = '❌ Problème de connexion. Vérifiez votre connexion internet.';
        } else {
          errorMessage = '❌ Email ou mot de passe incorrect. Veuillez vérifier vos informations.';
        }
        
        console.log('📝 Message d\'erreur final:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
        
        // Vider le mot de passe en cas d'erreur
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      console.error('❌ Erreur exceptionnelle:', err);
      const errorMsg = '❌ Erreur de connexion. Vérifiez votre connexion internet.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <div className="login-form">
          <h2>🔐 Connexion</h2>
          <p>Connectez-vous à votre compte FoodDelivery+</p>
        </div>

        {error && (
          <div className="error-message" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder="Votre mot de passe"
              autoComplete="current-password"
              required
            />
            {fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Pas encore de compte ?{' '}
            <Link to="/register" className="link">
              S'inscrire gratuitement
            </Link>
          </p>
          <p>
            <Link to="/" className="link">
              <span className="material-icons">arrow_back</span>
              Retour à l'accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 