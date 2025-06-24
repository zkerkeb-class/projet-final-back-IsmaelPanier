import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [searchLocation, setSearchLocation] = useState('');

  const popularCategories = [
    { name: 'Pizza', icon: 'local_pizza', color: '#ff6b35' },
    { name: 'Burger', icon: 'lunch_dining', color: '#4caf50' },
    { name: 'Sushi', icon: 'ramen_dining', color: '#2196f3' },
    { name: 'Indien', icon: 'curry', color: '#ff9800' },
    { name: 'Desserts', icon: 'cake', color: '#e91e63' },
    { name: 'Café', icon: 'local_cafe', color: '#795548' }
  ];

  const features = [
    {
      icon: 'flash_on',
      title: 'Livraison ultra-rapide',
      description: 'En moyenne 25 minutes',
      color: '#ff6b35'
    },
    {
      icon: 'verified',
      title: 'Restaurants vérifiés',
      description: 'Qualité garantie',
      color: '#4caf50'
    },
    {
      icon: 'track_changes',
      title: 'Suivi en temps réel',
      description: 'De la commande à la livraison',
      color: '#2196f3'
    },
    {
      icon: 'support_agent',
      title: 'Support 24/7',
      description: 'Toujours là pour vous',
      color: '#9c27b0'
    }
  ];

  const testimonials = [
    {
      name: 'Sophie M.',
      rating: 5,
      comment: 'Service parfait, livraison rapide et plats délicieux !',
      avatar: '👩‍💼'
    },
    {
      name: 'Thomas L.',
      rating: 5,
      comment: 'Interface intuitive et large choix de restaurants.',
      avatar: '👨‍💻'
    },
    {
      name: 'Marie D.',
      rating: 5,
      comment: 'Je recommande, très pratique au quotidien.',
      avatar: '👩‍🎓'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Vos plats préférés
                <span className="gradient-text"> livrés en un clic</span>
              </h1>
              <p className="hero-subtitle">
                Plus de 1000 restaurants partenaires près de chez vous. 
                Commandez maintenant et régalez-vous !
              </p>
              
              <div className="hero-search">
                <div className="search-wrapper">
                  <div className="search-input-group">
                    <span className="material-icons search-icon">location_on</span>
                    <input
                      type="text"
                      placeholder="Entrez votre adresse..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="location-input"
                    />
                  </div>
                  <Link to="/user/restaurants" className="search-btn">
                    <span className="material-icons">search</span>
                    <span>Explorer</span>
                  </Link>
                </div>
                <p className="search-hint">
                  <span className="material-icons">info</span>
                  Livraison gratuite pour les commandes de plus de 25€
                </p>
              </div>

              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Restaurants</div>
                </div>
                <div className="stat">
                  <div className="stat-number">50k+</div>
                  <div className="stat-label">Clients satisfaits</div>
                </div>
                <div className="stat">
                  <div className="stat-number">25min</div>
                  <div className="stat-label">Livraison moyenne</div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image">
                <div className="floating-food">
                  <div className="food-item pizza">
                    <span className="material-icons">local_pizza</span>
                  </div>
                  <div className="food-item burger">
                    <span className="material-icons">lunch_dining</span>
                  </div>
                  <div className="food-item sushi">
                    <span className="material-icons">ramen_dining</span>
                  </div>
                  <div className="food-item dessert">
                    <span className="material-icons">cake</span>
                  </div>
                </div>
                <div className="phone-mockup">
                  <div className="phone-screen">
                    <div className="app-interface">
                      <div className="app-header">
                        <span className="material-icons">restaurant</span>
                        <span>FoodDelivery+</span>
                      </div>
                      <div className="app-content">
                        <div className="restaurant-card-mini">
                          <div className="restaurant-thumb"></div>
                          <div className="restaurant-info-mini">
                            <div className="restaurant-name">Bella Pizza</div>
                            <div className="restaurant-rating">⭐ 4.8</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>Explorez par catégorie</h2>
            <p>Découvrez une variété de cuisines</p>
          </div>
          <div className="categories-grid">
            {popularCategories.map((category, index) => (
              <Link 
                to="/user/restaurants" 
                key={index} 
                className="category-card"
              >
                <div 
                  className="category-icon"
                  style={{ backgroundColor: category.color }}
                >
                  <span className="material-icons">{category.icon}</span>
                </div>
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Pourquoi nous choisir ?</h2>
            <p>Une expérience de livraison exceptionnelle</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
              >
                <div 
                  className="feature-icon"
                  style={{ backgroundColor: feature.color }}
                >
                  <span className="material-icons">{feature.icon}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="partnership">
        <div className="container">
          <div className="partnership-content">
            <div className="partnership-left">
              <div className="partnership-card restaurant-partnership">
                <div className="partnership-icon">
                  <span className="material-icons">restaurant_menu</span>
                </div>
                <h3>Vous êtes restaurateur ?</h3>
                <h2>Collaborez avec nous</h2>
                <p>Rejoignez plus de 1000 restaurants partenaires et développez votre activité.</p>
                <ul className="benefits">
                  <li>
                    <span className="material-icons">check_circle</span>
                    Augmentez votre visibilité
                  </li>
                  <li>
                    <span className="material-icons">check_circle</span>
                    Interface de gestion simple
                  </li>
                  <li>
                    <span className="material-icons">check_circle</span>
                    Support marketing inclus
                  </li>
                </ul>
                <Link to="/register?type=restaurant" className="btn btn-restaurant">
                  <span className="material-icons">restaurant_menu</span>
                  Devenir partenaire
                </Link>
              </div>
            </div>

            <div className="partnership-right">
              <div className="partnership-card delivery-partnership">
                <div className="partnership-icon">
                  <span className="material-icons">delivery_dining</span>
                </div>
                <h3>Envie de liberté ?</h3>
                <h2>Roulez avec nous</h2>
                <p>Devenez livreur et profitez d'horaires flexibles avec des revenus attractifs.</p>
                <ul className="benefits">
                  <li>
                    <span className="material-icons">check_circle</span>
                    Horaires flexibles
                  </li>
                  <li>
                    <span className="material-icons">check_circle</span>
                    Jusqu'à 20€/heure
                  </li>
                  <li>
                    <span className="material-icons">check_circle</span>
                    Paiements hebdomadaires
                  </li>
                </ul>
                <Link to="/register?type=livreur" className="btn btn-delivery">
                  <span className="material-icons">delivery_dining</span>
                  Devenir livreur
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Ils nous font confiance</h2>
            <p>L'avis de nos clients</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="avatar">{testimonial.avatar}</div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <div className="rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="material-icons star">star</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p>"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt à commander ?</h2>
            <p>Rejoignez des milliers de clients satisfaits</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                <span className="material-icons">person_add</span>
                Créer un compte
              </Link>
              <Link to="/user/restaurants" className="btn btn-outline btn-large">
                <span className="material-icons">restaurant</span>
                Voir les restaurants
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 