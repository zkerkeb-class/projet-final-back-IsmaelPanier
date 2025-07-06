# 🎯 Guide de Démonstration - Dashboard Restaurant

## 🚀 Démarrage Rapide

### 1. **Lancer l'Application**
```bash
# Dans le dossier racine
npm start
```

### 2. **Accéder au Dashboard**
- Ouvrir : `http://localhost:3000`
- Se connecter avec un compte restaurant
- Aller sur : `/restaurant/dashboard`

## 📊 Exploration du Dashboard

### 🎯 **Section Actions Rapides**
- **Ajouter un plat** : Redirige vers la gestion des plats
- **Gérer les commandes** : Accès direct aux commandes
- **Gérer le menu** : Modification des plats existants
- **Paramètres** : Configuration du restaurant

### 📈 **Section Statistiques**
- **Chiffre d'affaires** : Total des ventes
- **Commandes** : Nombre total de commandes
- **Clients** : Nombre de clients uniques
- **Note moyenne** : Évaluation du restaurant
- **Panier moyen** : Montant moyen par commande
- **Plats actifs** : Nombre de plats disponibles

### 📊 **Section Graphiques**

#### 1. **Évolution des Ventes**
- **Graphique en aire** avec courbe de commandes
- **Données** : Ventes et commandes par jour
- **Interaction** : Hover pour voir les détails
- **Légende** : Ventes (aire) et Commandes (ligne)

#### 2. **Répartition par Catégorie**
- **Graphique circulaire** avec pourcentages
- **Couleurs** : Différentes pour chaque catégorie
- **Labels** : Nom + pourcentage
- **Interaction** : Clic pour isoler une catégorie

#### 3. **Activité par Heure**
- **Graphique en barres** double
- **Données** : Commandes et ventes par heure
- **Période** : 10h à 21h
- **Couleurs** : Commandes (bleu) et Ventes (vert)

#### 4. **Plats les Plus Populaires**
- **Graphique horizontal** avec deux métriques
- **Données** : Nombre de ventes et revenus
- **Tri** : Par popularité décroissante
- **Interaction** : Hover pour les détails

### 📋 **Section Commandes Récentes**
- **Cartes** : 5 commandes les plus récentes
- **Informations** : ID, statut, montant, heure
- **Statuts** : En attente, En préparation, Livré
- **Lien** : "Voir toutes les commandes"

## 🍽️ Test de l'Ajout de Plats

### 1. **Accéder à la Gestion des Plats**
- Cliquer sur "Ajouter un plat" ou aller sur `/restaurant/dishes`
- Cliquer sur le bouton "Ajouter un plat"

### 2. **Remplir le Formulaire**

#### Informations de Base
```
Nom du plat : Pizza Margherita
Catégorie : Pizzas
Description : Pizza classique avec tomate, mozzarella et basilic frais
Prix : 12.50
Temps de préparation : 15
```

#### Ingrédients
- Cliquer sur "Ajouter" pour chaque ingrédient :
  - Tomates
  - Mozzarella
  - Basilic
  - Huile d'olive

#### Allergènes
- Cocher les cases appropriées :
  - Gluten
  - Lactose

#### Propriétés
- Difficulté : Facile
- Végétarien : ✓
- Épicé : ✗
- Disponible : ✓

### 3. **Sauvegarder**
- Cliquer sur "Ajouter le plat"
- Vérifier que le plat apparaît dans la liste

## 🎨 Fonctionnalités Interactives

### 📱 **Responsive Design**
- **Mobile** : Grilles empilées, graphiques redimensionnés
- **Tablet** : Layout adaptatif, navigation optimisée
- **Desktop** : Affichage complet, toutes les fonctionnalités

### 🌓 **Thème Clair/Sombre**
- **Toggle** : Dans le header de l'application
- **Persistance** : Sauvegardé en localStorage
- **Adaptation** : Tous les composants s'adaptent

### ⚡ **Animations**
- **Hover effects** : Cartes et boutons
- **Transitions** : Fluides et naturelles
- **Loading states** : Spinners et skeletons

## 🔧 Fonctionnalités Avancées

### 📊 **Sélecteur de Période**
- **Aujourd'hui** : Données du jour
- **7 derniers jours** : Semaine en cours
- **30 derniers jours** : Mois en cours
- **3 derniers mois** : Trimestre

### 🔄 **Actualisation Automatique**
- **Données** : Mise à jour toutes les 30 secondes
- **Notifications** : Nouvelles commandes
- **Statuts** : Changements en temps réel

### 📈 **Calculs Intelligents**
- **Revenus** : Somme de toutes les commandes
- **Clients uniques** : Déduplication automatique
- **Panier moyen** : Moyenne pondérée
- **Tendances** : Comparaison avec périodes précédentes

## 🐛 Dépannage

### ❌ **Problèmes Courants**

#### Dashboard ne se charge pas
```bash
# Vérifier que le backend fonctionne
curl http://localhost:5000/restaurants

# Vérifier les logs
npm run start:backend
```

#### Graphiques ne s'affichent pas
```bash
# Vérifier l'installation de Recharts
npm list recharts

# Réinstaller si nécessaire
npm install recharts
```

#### Ajout de plat échoue
```bash
# Vérifier la validation
# Les catégories doivent être : Entrées, Plats principaux, Pizzas, Burgers, Sushis, Salades, Desserts, Boissons
```

### ✅ **Solutions**

#### Redémarrer l'Application
```bash
# Arrêter (Ctrl+C)
# Puis redémarrer
npm start
```

#### Vider le Cache
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install
```

#### Vérifier les Variables d'Environnement
```bash
# Vérifier .env dans le dossier server
MONGO_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=your-secret-key
```

## 📚 Ressources

### 🔗 **Liens Utiles**
- **Documentation Recharts** : https://recharts.org/
- **API Backend** : http://localhost:5000
- **Frontend** : http://localhost:3000

### 📖 **Fichiers Importants**
- `Dashboard.js` : Composant principal
- `Dashboard.css` : Styles du dashboard
- `DishModal.js` : Modal d'ajout de plat
- `create-dish.dto.ts` : Validation backend

### 🎯 **Prochaines Étapes**
1. **Tester** toutes les fonctionnalités
2. **Personnaliser** les couleurs et thèmes
3. **Ajouter** de nouvelles métriques
4. **Optimiser** les performances
5. **Déployer** en production 