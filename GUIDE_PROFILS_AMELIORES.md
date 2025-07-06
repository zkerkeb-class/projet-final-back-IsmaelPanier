# 🎯 Guide des Profils Améliorés

## 📋 Vue d'ensemble

Ce guide présente les nouvelles fonctionnalités de profil pour les restaurants et les utilisateurs, permettant une édition en temps réel et une gestion complète des informations.

## 🏪 Profil Restaurant

### 🎯 Fonctionnalités

#### Informations de base
- **Nom du restaurant** : Modifiable en temps réel
- **Description** : Zone de texte extensible
- **Type de cuisine** : Menu déroulant avec options prédéfinies

#### Contact
- **Téléphone** : Format international supporté
- **Email** : Validation automatique

#### Adresse
- **Rue** : Adresse complète
- **Ville** : Ville de localisation
- **Code postal** : Code postal français
- **Pays** : Par défaut "France"

#### Horaires d'ouverture
- **7 jours** : Lundi à dimanche
- **Format** : "11:00-22:00"
- **Édition individuelle** : Chaque jour modifiable séparément

#### Options de service
- **Livraison** : Livraison à domicile
- **Emporter** : Prise en charge
- **Sur place** : Consommation sur place

#### Méthodes de paiement
- **Carte** : Paiement par carte
- **Espèces** : Paiement en espèces
- **PayPal** : Paiement en ligne
- **Chèque restaurant** : Titres restaurant

#### Paramètres de commande
- **Commande minimum** : Montant minimum en euros
- **Temps de livraison** : Délai en minutes

### 🔧 Utilisation

1. **Accès** : Connectez-vous en tant que restaurant
2. **Navigation** : Allez sur `/restaurant/profile`
3. **Édition** : Cliquez sur "Modifier" pour chaque champ
4. **Sauvegarde** : 
   - Sauvegarde individuelle : ✓ pour chaque champ
   - Sauvegarde globale : "Sauvegarder tout"

## 👤 Profil Utilisateur

### 🎯 Fonctionnalités

#### Informations personnelles
- **Prénom** : Nom de l'utilisateur
- **Nom** : Nom de famille
- **Email** : Adresse email (non modifiable après inscription)
- **Téléphone** : Numéro de contact

#### Adresse de livraison
- **Rue** : Adresse complète
- **Ville** : Ville de livraison
- **Code postal** : Code postal
- **Pays** : Par défaut "France"

#### Préférences
- **Notifications** : Recevoir les notifications par email
- **Newsletter** : S'abonner à la newsletter
- **Langue** : Français, English, Español

#### Préférences alimentaires
- **Régimes alimentaires** :
  - Végétarien
  - Végétalien
  - Sans gluten
  - Sans lactose
  - Halal
  - Casher

- **Allergies** :
  - Gluten
  - Lactose
  - Œufs
  - Poisson
  - Fruits de mer
  - Arachides
  - Noix
  - Soja

### 🔧 Utilisation

1. **Accès** : Connectez-vous en tant qu'utilisateur
2. **Navigation** : Allez sur `/user/profile`
3. **Édition** : Cliquez sur "Modifier" pour chaque champ
4. **Sauvegarde** : 
   - Sauvegarde individuelle : ✓ pour chaque champ
   - Sauvegarde globale : "Sauvegarder tout"

## 🎨 Interface Utilisateur

### Design
- **Moderne** : Interface épurée et professionnelle
- **Responsive** : Adaptation mobile et desktop
- **Animations** : Transitions fluides
- **Thème** : Support clair/sombre

### États
- **Visualisation** : Affichage des informations
- **Édition** : Mode modification avec formulaires
- **Chargement** : Indicateur de progression
- **Erreur** : Messages d'erreur explicites
- **Succès** : Confirmation des actions

### Interactions
- **Hover** : Effets au survol
- **Focus** : Indication du champ actif
- **Validation** : Vérification en temps réel
- **Feedback** : Retour utilisateur immédiat

## 🔒 Sécurité

### Authentification
- **Protection** : Routes protégées par JWT
- **Rôles** : Vérification des permissions
- **Session** : Gestion automatique des tokens

### Validation
- **Frontend** : Validation côté client
- **Backend** : Validation côté serveur
- **Sanitisation** : Nettoyage des données

## 🚀 Installation et Démarrage

### Prérequis
```bash
# Backend
cd projet-final-back-IsmaelPanier/server
npm install
npm run start:dev

# Frontend
cd projet-final-back-IsmaelPanier/client
npm install
npm start
```

### Test des fonctionnalités
```bash
# Tester les endpoints
node test-profile-features.js

# Vérifier la connectivité
curl http://localhost:5000/health
```

## 📱 Responsive Design

### Mobile (< 768px)
- **Layout** : Colonne unique
- **Boutons** : Taille adaptée
- **Formulaires** : Pleine largeur
- **Navigation** : Menu hamburger

### Tablet (768px - 1024px)
- **Layout** : Grille adaptative
- **Formulaires** : Largeur optimisée
- **Boutons** : Espacement ajusté

### Desktop (> 1024px)
- **Layout** : Grille complète
- **Formulaires** : Largeur maximale
- **Navigation** : Menu horizontal

## 🔧 Configuration

### Variables CSS
```css
:root {
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --gray-50: #f9fafb;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-900: #111827;
  --green-600: #16a34a;
  --green-700: #15803d;
  --red-600: #dc2626;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --transition-base: 0.15s ease-in-out;
}
```

### API Endpoints
```javascript
// Restaurant
GET /restaurant/me          // Récupérer le profil
PUT /restaurant/me          // Mettre à jour le profil

// Utilisateur
GET /users/me               // Récupérer le profil
PUT /users/me               // Mettre à jour le profil
```

## 🐛 Dépannage

### Problèmes courants

#### Erreur 401 - Non autorisé
```bash
# Vérifier le token
localStorage.getItem('token')

# Se reconnecter
# Aller sur /login
```

#### Erreur 500 - Serveur
```bash
# Vérifier le backend
cd server
npm run start:dev

# Vérifier les logs
# Redémarrer le serveur
```

#### Champs non sauvegardés
```bash
# Vérifier la connexion
# Vérifier les permissions
# Vérifier la validation
```

### Logs utiles
```javascript
// Frontend
console.log('🔍 Vérification du token...');
console.log('✅ Sauvegarde réussie');
console.log('❌ Erreur de sauvegarde');

// Backend
console.log('📋 Récupération du profil');
console.log('💾 Mise à jour du profil');
console.log('🔒 Vérification des permissions');
```

## 📈 Améliorations futures

### Fonctionnalités prévues
- **Upload d'images** : Logo restaurant, photo profil
- **Géolocalisation** : Sélection automatique de l'adresse
- **Historique** : Suivi des modifications
- **Export** : Export des données
- **Import** : Import depuis CSV/JSON
- **Notifications** : Notifications push
- **API publique** : Accès aux profils publics

### Optimisations
- **Cache** : Mise en cache des données
- **Lazy loading** : Chargement différé
- **Compression** : Optimisation des images
- **CDN** : Distribution du contenu
- **PWA** : Application web progressive

## 📞 Support

### Contact
- **Email** : support@fooddelivery.com
- **Documentation** : `/docs`
- **Issues** : GitHub Issues
- **Discord** : Serveur communautaire

### Ressources
- **API Docs** : `/api/docs`
- **Code Source** : GitHub Repository
- **Démo** : `/demo`
- **Tests** : `/tests`

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2024-01-XX  
**Auteur** : Équipe FoodDelivery+ 