import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-title">À propos de FoodDelivery</h1>
          <p className="about-subtitle">
            Votre plateforme de livraison de nourriture préférée
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Notre Mission</h2>
              <p>
                Chez FoodDelivery, nous croyons que la bonne nourriture devrait être accessible à tous, 
                partout et à tout moment. Notre mission est de connecter les restaurants locaux avec 
                leurs clients de manière simple, rapide et fiable.
              </p>
              <p>
                Nous nous engageons à soutenir les restaurants locaux tout en offrant aux clients 
                une expérience de commande exceptionnelle, avec une livraison rapide et un service client de qualité.
              </p>
            </div>
            <div className="mission-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Restaurants partenaires</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50k+</div>
                <div className="stat-label">Clients satisfaits</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">30min</div>
                <div className="stat-label">Temps de livraison moyen</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Nos Valeurs</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Confiance</h3>
              <p>
                Nous construisons des relations durables basées sur la transparence, 
                la fiabilité et l'intégrité avec nos partenaires et clients.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h3>Innovation</h3>
              <p>
                Nous cherchons constamment à améliorer notre plateforme et à 
                offrir les meilleures technologies pour une expérience optimale.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Qualité</h3>
              <p>
                Nous nous engageons à maintenir les plus hauts standards de qualité 
                dans tous nos services et partenariats.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Durabilité</h3>
              <p>
                Nous soutenons les pratiques durables et encourageons nos partenaires 
                à adopter des solutions respectueuses de l'environnement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Notre Équipe</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h3>Ismael Panier</h3>
              <p className="member-role">Développeur Full-Stack</p>
              <p className="member-description">
                Passionné par les technologies web modernes et l'expérience utilisateur.
              </p>
            </div>
            <div className="team-member">
              <div className="member-avatar">🎨</div>
              <h3>Design Team</h3>
              <p className="member-role">UX/UI Designers</p>
              <p className="member-description">
                Créateurs d'interfaces intuitives et d'expériences utilisateur exceptionnelles.
              </p>
            </div>
            <div className="team-member">
              <div className="member-avatar">🔧</div>
              <h3>Tech Team</h3>
              <p className="member-role">Développeurs</p>
              <p className="member-description">
                Experts en développement backend et frontend pour une plateforme robuste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="tech-section">
        <div className="container">
          <h2 className="section-title">Technologies Utilisées</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-icon">⚛️</div>
              <h3>React</h3>
              <p>Interface utilisateur moderne et réactive</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🟢</div>
              <h3>Node.js</h3>
              <p>Backend performant avec NestJS</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🍃</div>
              <h3>MongoDB</h3>
              <p>Base de données NoSQL flexible</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🔐</div>
              <h3>JWT</h3>
              <p>Authentification sécurisée</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Compatible tous appareils</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">⚡</div>
              <h3>Performance</h3>
              <p>Optimisé pour la vitesse</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-content">
            <h2>En savoir plus</h2>
            <p>
              Vous souhaitez en savoir plus sur FoodDelivery ou devenir partenaire ? 
              N'hésitez pas à nous contacter !
            </p>
            <div className="contact-actions">
              <Link to="/contact" className="btn btn-primary">
                Nous contacter
              </Link>
              <Link to="/" className="btn btn-secondary">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 