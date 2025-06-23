import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulation d'envoi de formulaire
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-title">Contactez-nous</h1>
          <p className="contact-subtitle">
            Nous sommes là pour vous aider. N'hésitez pas à nous contacter !
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Envoyez-nous un message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nom complet *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    required
                    placeholder="Votre nom complet"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    required
                    placeholder="votre.email@exemple.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Sujet *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Choisissez un sujet</option>
                    <option value="support">Support technique</option>
                    <option value="partnership">Partenariat</option>
                    <option value="feedback">Retour d'expérience</option>
                    <option value="bug">Signalement de bug</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="input"
                    rows="6"
                    required
                    placeholder="Votre message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>

                {submitStatus === 'success' && (
                  <div className="notification success">
                    ✅ Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="notification error">
                    ❌ Une erreur s'est produite. Veuillez réessayer.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="contact-info-container">
              <h2>Informations de contact</h2>
              
              <div className="contact-info-grid">
                <div className="contact-info-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-details">
                    <h3>Adresse</h3>
                    <p>123 Rue de la Livraison<br />75001 Paris, France</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-details">
                    <h4>Email</h4>
                    <p>contact@fooddelivery-plus.com</p>
                    <p>support@fooddelivery-plus.com</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-details">
                    <h3>Téléphone</h3>
                    <p>+33 1 23 45 67 89</p>
                    <p>Lun-Ven: 9h-18h</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">💬</div>
                  <div className="contact-details">
                    <h3>Chat en ligne</h3>
                    <p>Disponible 24h/24</p>
                    <p>Support en temps réel</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <h3>Suivez-nous</h3>
                <div className="social-icons">
                  <button className="social-icon" title="Facebook">
                    📘
                  </button>
                  <button className="social-icon" title="Twitter">
                    🐦
                  </button>
                  <button className="social-icon" title="Instagram">
                    📷
                  </button>
                  <button className="social-icon" title="LinkedIn">
                    💼
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Questions fréquentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Comment fonctionne la livraison ?</h3>
              <p>
                Nos livreurs partenaires récupèrent votre commande au restaurant 
                et vous la livrent à l'adresse indiquée en moins de 30 minutes.
              </p>
            </div>

            <div className="faq-item">
              <h3>Quels sont les moyens de paiement acceptés ?</h3>
              <p>
                Nous acceptons les cartes bancaires, PayPal, Apple Pay, 
                Google Pay et les paiements en espèces à la livraison.
              </p>
            </div>

            <div className="faq-item">
              <h3>Comment devenir restaurant partenaire ?</h3>
              <p>
                Contactez-nous via le formulaire ci-dessus ou par email. 
                Notre équipe vous accompagnera dans l'intégration.
              </p>
            </div>

            <div className="faq-item">
              <h3>Que faire en cas de problème avec ma commande ?</h3>
              <p>
                Contactez notre support client immédiatement. 
                Nous nous engageons à résoudre tout problème rapidement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 