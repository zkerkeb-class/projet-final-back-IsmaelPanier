import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirection selon le rôle
        if (result.user.role === 'restaurant') {
          navigate('/restaurant/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <div className="form-header">
          <h2>Connexion</h2>
          <p>Connectez-vous à votre compte</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Pas encore de compte ?{' '}
            <Link to="/register" className="link">
              S'inscrire
            </Link>
          </p>
          <p>
            <Link to="/" className="link">
              Retour à l'accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 