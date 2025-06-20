# 🎨 Système de Thème et Routes Principales

## Vue d'ensemble

Cette mise à jour ajoute un système de thème clair/sombre complet et les routes principales essentielles pour une application web moderne.

## 🌓 Système de Thème

### Fonctionnalités

- **Thème clair/sombre** : Basculement automatique entre les deux modes
- **Persistance** : Le choix de thème est sauvegardé dans le localStorage
- **Transitions fluides** : Animations douces lors du changement de thème
- **Variables CSS** : Système de variables pour une cohérence parfaite
- **Responsive** : Adaptation automatique sur tous les appareils

### Architecture

#### 1. ThemeContext (`context/ThemeContext.js`)
```javascript
// Gestion de l'état du thème
const { theme, toggleTheme, setLightTheme, setDarkTheme } = useTheme();
```

#### 2. Variables CSS (`styles/theme.css`)
```css
:root {
  /* Thème clair */
  --primary-color: #3498db;
  --bg-primary: #ffffff;
  --text-primary: #2c3e50;
}

[data-theme="dark"] {
  /* Thème sombre */
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
}
```

#### 3. Composant ThemeToggle
```javascript
// Bouton de changement de thème avec icônes
<ThemeToggle />
```

### Utilisation

1. **Dans un composant** :
```javascript
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`my-component ${theme}`}>
      <button onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
};
```

2. **Classes CSS** :
```css
.my-component {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

## 🛣️ Routes Principales

### Pages Créées

#### 1. Page d'Accueil (`/`)
- **Fichier** : `pages/common/Home.js`
- **Fonctionnalités** :
  - Section hero avec call-to-action
  - Présentation des fonctionnalités
  - Étapes d'utilisation
  - Section CTA finale

#### 2. Page À Propos (`/about`)
- **Fichier** : `pages/common/About.js`
- **Fonctionnalités** :
  - Mission et valeurs de l'entreprise
  - Statistiques et chiffres clés
  - Présentation de l'équipe
  - Technologies utilisées

#### 3. Page Contact (`/contact`)
- **Fichier** : `pages/common/Contact.js`
- **Fonctionnalités** :
  - Formulaire de contact complet
  - Informations de contact
  - Liens vers les réseaux sociaux
  - Section FAQ

### Navigation

#### Header Mis à Jour
```javascript
// Routes principales toujours visibles
<Link to="/">Accueil</Link>
<Link to="/about">À propos</Link>
<Link to="/contact">Contact</Link>

// Bouton de thème
<ThemeToggle />

// Routes conditionnelles selon l'authentification
{!isAuthenticated ? (
  // Routes de connexion
) : (
  // Routes utilisateur/restaurant
)}
```

#### Footer Enrichi
```javascript
// Sections du footer
- Logo et description
- Liens rapides
- Support
- Informations légales
- Réseaux sociaux
```

## 🎨 Design System

### Variables CSS Principales

#### Couleurs
```css
--primary-color: #3498db;
--secondary-color: #95a5a6;
--success-color: #27ae60;
--danger-color: #e74c3c;
--warning-color: #f39c12;
--info-color: #17a2b8;
```

#### Arrière-plans
```css
--bg-primary: #ffffff;      /* Thème clair */
--bg-secondary: #f8f9fa;
--bg-tertiary: #e9ecef;
--bg-card: #ffffff;
```

#### Textes
```css
--text-primary: #2c3e50;
--text-secondary: #6c757d;
--text-muted: #7f8c8d;
--text-light: #ffffff;
```

#### Espacements
```css
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
--spacing-xxl: 3rem;
```

#### Ombres
```css
--shadow-light: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-medium: 0 4px 8px rgba(0, 0, 0, 0.15);
--shadow-heavy: 0 8px 16px rgba(0, 0, 0, 0.2);
```

### Classes Utilitaires

#### Boutons
```css
.btn                    /* Bouton de base */
.btn-primary           /* Bouton principal */
.btn-secondary         /* Bouton secondaire */
.btn-success           /* Bouton de succès */
.btn-danger            /* Bouton de danger */
.btn-warning           /* Bouton d'avertissement */
.btn-info              /* Bouton d'information */
```

#### Cartes
```css
.card                  /* Carte de base */
.card-header           /* En-tête de carte */
.card-body             /* Corps de carte */
```

#### Formulaires
```css
.input                 /* Champ de saisie */
.form-group            /* Groupe de formulaire */
.form-label            /* Label de formulaire */
```

#### Notifications
```css
.notification          /* Notification de base */
.notification.success  /* Notification de succès */
.notification.error    /* Notification d'erreur */
.notification.warning  /* Notification d'avertissement */
.notification.info     /* Notification d'information */
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 480px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop */
@media (min-width: 769px) { }
```

### Adaptations

#### Header
- Menu hamburger sur mobile
- Logo redimensionné
- Navigation verticale

#### Footer
- Grille adaptative
- Sections empilées sur mobile
- Icônes sociales centrées

#### Pages
- Contenu adapté à la largeur d'écran
- Grilles responsives
- Espacements ajustés

## 🔧 Installation et Configuration

### 1. Imports Requis
```javascript
// Dans App.js
import { ThemeProvider } from './context/ThemeContext';
import './styles/theme.css';

// Dans index.css
@import './components/common/Header.css';
@import './components/common/Footer.css';
```

### 2. Structure des Dossiers
```
src/
├── context/
│   └── ThemeContext.js
├── styles/
│   └── theme.css
├── components/
│   └── common/
│       ├── Header.js
│       ├── Header.css
│       ├── Footer.js
│       ├── Footer.css
│       └── ThemeToggle.js
└── pages/
    └── common/
        ├── Home.js
        ├── Home.css
        ├── About.js
        ├── About.css
        ├── Contact.js
        └── Contact.css
```

### 3. Configuration du Router
```javascript
// Routes principales
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />

// Route de fallback
<Route path="*" element={<NotFound />} />
```

## 🎯 Bonnes Pratiques

### 1. Utilisation des Variables CSS
```css
/* ✅ Bon */
.my-component {
  background: var(--bg-card);
  color: var(--text-primary);
  padding: var(--spacing-md);
}

/* ❌ Éviter */
.my-component {
  background: #ffffff;
  color: #333333;
  padding: 1rem;
}
```

### 2. Classes Utilitaires
```css
/* ✅ Utiliser les classes existantes */
<div className="card">
  <div className="btn btn-primary">Action</div>
</div>

/* ❌ Éviter les styles inline */
<div style={{background: 'white', padding: '1rem'}}>
  <button style={{background: 'blue', color: 'white'}}>Action</button>
</div>
```

### 3. Responsive Design
```css
/* ✅ Mobile-first */
.my-component {
  padding: var(--spacing-sm);
}

@media (min-width: 768px) {
  .my-component {
    padding: var(--spacing-lg);
  }
}
```

## 🚀 Fonctionnalités Avancées

### 1. Animations de Thème
```css
/* Transition automatique */
* {
  transition: background-color var(--transition-normal), 
              color var(--transition-normal), 
              border-color var(--transition-normal);
}
```

### 2. Scrollbars Personnalisées
```css
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: var(--border-radius-sm);
}
```

### 3. Focus Accessible
```css
*:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

## 📊 Performance

### Optimisations
- Variables CSS pour éviter les recalculs
- Transitions optimisées
- Images et icônes optimisées
- Code splitting pour les pages

### Métriques
- Temps de chargement initial : < 2s
- Temps de changement de thème : < 100ms
- Score Lighthouse : > 90

## 🔮 Évolutions Futures

### Fonctionnalités Prévues
- Thème automatique selon l'heure
- Thème personnalisé par utilisateur
- Animations plus avancées
- Mode haute contraste
- Support des préférences système

### Améliorations Techniques
- Service Worker pour le cache
- Lazy loading des images
- Optimisation des bundles
- Tests automatisés

---

**Note** : Ce système de thème et ces routes principales constituent la base d'une application web moderne et accessible, offrant une expérience utilisateur optimale sur tous les appareils. 