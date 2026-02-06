# 🍕 FoodDelivery+ - Guide Complet des Interfaces

## 📋 Vue d'ensemble

FoodDelivery+ est une plateforme complète de livraison de nourriture avec **3 interfaces principales** :

1. **👥 Interface Client** - Pour commander des repas
2. **🏪 Interface Restaurant** - Pour gérer un restaurant
3. **🔐 Interface Authentification** - Pour s'inscrire/se connecter

---

## 🔐 Interface Authentification

### Pages Disponibles

#### 1. **Inscription Utilisateur** (`/register`)
- **Fichier** : `pages/auth/Register.js`
- **Fonctionnalités** :
  - Formulaire d'inscription client
  - Validation des données
  - Création de compte utilisateur
- **Accès** : Public
- **Test** : `http://localhost:3000/register`

#### 2. **Inscription Restaurant** (`/restaurant-register`)
- **Fichier** : `pages/auth/RestaurantRegister.js`
- **Fonctionnalités** :
  - **Formulaire multi-étapes** (4 étapes)
  - **Étape 1** : Informations de base du restaurant
  - **Étape 2** : Configuration des horaires d'ouverture
  - **Étape 3** : **Ajout de plats avec images** (Modal DishModal)
  - **Étape 4** : Création du compte utilisateur
  - **Upload d'images** pour les plats
  - **Modal de bienvenue** après inscription
- **Accès** : Public
- **Test** : `http://localhost:3000/restaurant-register`

#### 3. **Connexion** (`/login`)
- **Fichier** : `pages/auth/Login.js`
- **Fonctionnalités** :
  - Connexion utilisateur/restaurant
  - Gestion des rôles
  - Redirection selon le type de compte
- **Accès** : Public
- **Test** : `http://localhost:3000/login`

---

## 👥 Interface Client

### Pages Disponibles

#### 1. **Dashboard Client** (`/user/dashboard`)
- **Fichier** : `pages/user/Dashboard.js`
- **Fonctionnalités** :
  - Vue d'ensemble du compte client
  - Statistiques personnelles
  - Actions rapides
- **Accès** : Utilisateurs connectés
- **Test** : `http://localhost:3000/user/dashboard`

#### 2. **Liste des Restaurants** (`/user/restaurants`)
- **Fichier** : `pages/user/RestaurantList.js`
- **Fonctionnalités** :
  - Affichage de tous les restaurants
  - **Recherche** par nom ou cuisine
  - **Filtres** par type de cuisine, gamme de prix
  - **Tri** par nom, note, distance, temps de livraison
  - **Statut ouvert/fermé** en temps réel
  - **Système de favoris** (❤️/🤍)
  - Informations détaillées : note, prix, temps de livraison
- **Accès** : Utilisateurs connectés
- **Test** : `http://localhost:3000/user/restaurants`

#### 3. **Menu Restaurant** (`/user/restaurant/:restaurantId`)
- **Fichier** : `pages/user/RestaurantMenu.js`
- **Fonctionnalités** :
  - Affichage du menu complet du restaurant
  - **Images des plats** avec fallback
  - Informations détaillées : prix, temps de préparation, ingrédients, allergènes
  - **Plats du jour** et promotions
  - **Modal de détail** pour chaque plat
  - **Panier flottant** avec calcul automatique
  - **Validation du minimum** de commande
  - **Ajout au panier** avec options
- **Accès** : Utilisateurs connectés
- **Test** : `http://localhost:3000/user/restaurant/[ID]`

#### 4. **Suivi de Commande** (`/user/orders/:orderId`)
- **Fichier** : `pages/user/OrderTracking.js`
- **Fonctionnalités** :
  - **Timeline visuelle** des étapes
  - **Statuts en temps réel** : en attente, acceptée, en préparation, prête, en livraison, livrée
  - **Simulation de livraison** avec livreur aléatoire
  - **Estimation du temps** de livraison
  - **Informations du livreur** (nom, véhicule, note)
  - **Détails complets** de la commande
  - **Possibilité d'annuler** (si en attente)
- **Accès** : Utilisateurs connectés
- **Test** : `http://localhost:3000/user/orders/[ID]`

#### 5. **Historique des Commandes** (`/user/orders`)
- **Fichier** : `pages/user/OrderHistory.js`
- **Fonctionnalités** :
  - Liste de toutes les commandes passées
  - **Filtres par statut** et période
  - **Recherche** par restaurant ou numéro de commande
  - **Tri par date** (plus récentes en premier)
  - **Résumé de chaque commande**
  - **Actions** : voir détails, commander à nouveau
  - **Statuts colorés** et icônes
- **Accès** : Utilisateurs connectés
- **Test** : `http://localhost:3000/user/orders`

#### 6. **Système de Favoris** (`/user/favorites`)
- **Fichier** : `pages/user/Favorites.js`
- **Fonctionnalités** :
  - **Onglets restaurants/plats**
  - **Ajout/retrait** des favoris
  - **Recherche** dans les favoris
  - **Affichage des informations** détaillées
  - **Actions rapides** vers les restaurants/plats
  - **État vide** avec suggestions
- **Accès** : Utilisateurs connectés
- **Test** : `http://localhost:3000/user/favorites`

#### 7. **Profil Client** (`/user/profile`)
- **Fichier** : `pages/user/Profile.js`
- **Fonctionnalités** :
  - Gestion des informations personnelles
  - Modification du profil
  - Historique des commandes
  - Préférences utilisateur
- **Accès** : Utilisateurs connectés
- **Test** : `http://localhost:3000/user/profile`

---

## 🏪 Interface Restaurant

### Pages Disponibles

#### 1. **Dashboard Restaurant** (`/restaurant/dashboard`)
- **Fichier** : `pages/restaurant/Dashboard.js`
- **Fonctionnalités** :
  - Vue d'ensemble du restaurant
  - Statistiques des commandes
  - Chiffre d'affaires
  - Commandes récentes
- **Accès** : Restaurants connectés
- **Test** : `http://localhost:3000/restaurant/dashboard`

#### 2. **Gestion des Plats** (`/restaurant/dishes`)
- **Fichier** : `pages/restaurant/DishManagement.js`
- **Fonctionnalités** :
  - **Ajout/modification/suppression** de plats
  - **Upload d'images** multiples
  - **Gestion des catégories**
  - **Prix et disponibilité**
  - **Description et ingrédients**
- **Accès** : Restaurants connectés
- **Test** : `http://localhost:3000/restaurant/dishes`

#### 3. **Gestion Avancée des Plats** (`/restaurant/dishes/advanced`)
- **Fichier** : `pages/restaurant/AdvancedDishManagement.js`
- **Fonctionnalités** :
  - **Interface avancée** pour la gestion complète
  - **Gestion des allergènes**
  - **Promotions et offres**
  - **Nutrition et calories**
  - **Gestion des variantes**
  - **Images multiples** avec ordre
- **Accès** : Restaurants connectés
- **Test** : `http://localhost:3000/restaurant/dishes/advanced`

#### 4. **Gestion des Commandes** (`/restaurant/orders`)
- **Fichier** : `pages/restaurant/OrderManagement.js`
- **Fonctionnalités** :
  - **Acceptation/refus** des commandes
  - **Mise à jour des statuts**
  - **Historique des commandes**
  - **Filtres et recherche**
  - **Notifications** en temps réel
- **Accès** : Restaurants connectés
- **Test** : `http://localhost:3000/restaurant/orders`

#### 5. **Profil Restaurant** (`/restaurant/profile`)
- **Fichier** : `pages/restaurant/Profile.js`
- **Fonctionnalités** :
  - Gestion des informations du restaurant
  - Horaires d'ouverture
  - Adresse et contact
  - Images du restaurant
- **Accès** : Restaurants connectés
- **Test** : `http://localhost:3000/restaurant/profile`

---

## 🌐 Pages Communes

### Pages Disponibles

#### 1. **Page d'Accueil** (`/`)
- **Fichier** : `pages/common/Home.js`
- **Fonctionnalités** :
  - Section hero avec call-to-action
  - Présentation des fonctionnalités
  - Étapes d'utilisation
  - Section CTA finale
- **Accès** : Public
- **Test** : `http://localhost:3000/`

#### 2. **À Propos** (`/about`)
- **Fichier** : `pages/common/About.js`
- **Fonctionnalités** :
  - Mission et valeurs de l'entreprise
  - Statistiques et chiffres clés
  - Présentation de l'équipe
  - Technologies utilisées
- **Accès** : Public
- **Test** : `http://localhost:3000/about`

#### 3. **Contact** (`/contact`)
- **Fichier** : `pages/common/Contact.js`
- **Fonctionnalités** :
  - Formulaire de contact complet
  - Informations de contact
  - Liens vers les réseaux sociaux
  - Section FAQ
- **Accès** : Public
- **Test** : `http://localhost:3000/contact`

#### 4. **Guide de Navigation** (`/navigation-guide`)
- **Fichier** : `pages/common/NavigationGuide.js`
- **Fonctionnalités** :
  - **Vue d'ensemble** de toutes les interfaces
  - **Liens directs** vers chaque page
  - **Statut** des fonctionnalités
  - **Actions rapides**
- **Accès** : Public
- **Test** : `http://localhost:3000/navigation-guide`

---

## ✨ Fonctionnalités Spéciales

### 🎨 Système de Thème
- **Thème clair/sombre** avec persistance
- **Variables CSS** pour la cohérence
- **Transitions fluides** lors du changement
- **Composant ThemeToggle** dans le header

### 📱 Design Responsive
- **Mobile-first** design
- **Breakpoints** : 480px, 768px, 1024px
- **Navigation mobile** optimisée
- **Grilles flexibles** qui s'adaptent

### 🔔 Notifications
- **NotificationBell** dans le header
- **Statuts de commande** en temps réel
- **Acceptation/refus** par le restaurant
- **Simulation de livraison** avec livreur

### 🖼️ Upload d'Images
- **Upload multiple** pour les plats
- **Prévisualisation** des images
- **Image principale** pour chaque plat
- **Suppression** d'images
- **Stockage** sur le serveur

### ❤️ Système de Favoris
- **Restaurants favoris**
- **Plats favoris**
- **Onglets séparés**
- **Actions rapides**

---

## 🚀 Comment Tester

### 1. **Démarrer l'application**
```bash
cd projet-final-back-IsmaelPanier/client
npm start
```

### 2. **Accéder au guide de navigation**
- Aller sur : `http://localhost:3000/navigation-guide`
- Cliquer sur "🧭 Guide" dans le header

### 3. **Tester l'inscription restaurant**
- Aller sur : `http://localhost:3000/restaurant-register`
- Suivre les 4 étapes du formulaire
- Tester l'upload d'images

### 4. **Tester le parcours client**
- S'inscrire : `http://localhost:3000/register`
- Parcourir les restaurants : `/user/restaurants`
- Commander des plats
- Suivre une commande

### 5. **Tester l'interface restaurant**
- S'inscrire en tant que restaurant
- Gérer les plats : `/restaurant/dishes`
- Gérer les commandes : `/restaurant/orders`

---

## 📊 Statut des Fonctionnalités

### ✅ **Complètement Fonctionnel**
- Authentification (inscription/connexion)
- Interface client complète
- Interface restaurant de base
- Upload d'images
- Système de favoris
- Suivi de commande
- Thème clair/sombre

### 🔄 **En Développement**
- Paiement en ligne
- Géolocalisation
- Push notifications
- Chat en temps réel

### 📋 **À Implémenter**
- Système de notes et avis
- Codes promo
- Historique de recherche
- Suggestions personnalisées

---

## 🎯 Prochaines Étapes

1. **Tester toutes les interfaces** via le guide de navigation
2. **Ajouter des données de test** dans la base de données
3. **Implémenter le paiement** en ligne
4. **Ajouter la géolocalisation**
5. **Optimiser les performances**
6. **Ajouter des tests** unitaires et d'intégration 