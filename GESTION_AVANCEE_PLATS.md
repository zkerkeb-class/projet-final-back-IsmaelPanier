# Gestion Avancée des Plats - Food Delivery App

## Vue d'ensemble

La gestion avancée des plats offre aux restaurants un système complet pour gérer leur menu avec des fonctionnalités professionnelles incluant l'upload d'images, la gestion des ingrédients et allergènes, les options de prix variables, la gestion des stocks, et les promotions.

## Fonctionnalités principales

### 📸 Upload d'images pour les plats
- **Images multiples** : Possibilité d'ajouter plusieurs images par plat
- **Image principale** : Définir une image principale pour l'affichage
- **Ordre d'affichage** : Contrôler l'ordre des images
- **Validation** : Seuls les formats image sont acceptés (JPG, PNG, GIF, WebP)
- **Taille limitée** : Maximum 5MB par image
- **Stockage sécurisé** : Images stockées avec noms uniques

### 🥘 Gestion des ingrédients et allergènes
- **Ingrédients détaillés** : Nom, quantité et type d'ingrédient
- **Détection d'allergènes** : Marquer les ingrédients allergènes
- **Types d'allergènes** : Spécifier le type (gluten, lactose, etc.)
- **Liste principale** : Liste simplifiée des allergènes principaux
- **Informations nutritionnelles** : Calories, protéines, glucides, lipides

### 💰 Prix variables selon les options
- **Prix de base** : Prix standard du plat
- **Options de prix** : Petite/grande portion, menu complet
- **Prix personnalisés** : Prix spécifique pour chaque option
- **Descriptions** : Explication de chaque option
- **Suppléments** : Add-ons avec prix supplémentaires

### 📦 Gestion des stocks
- **Suivi optionnel** : Activer/désactiver le suivi de stock
- **Quantité illimitée** : Option pour stock illimité (-1)
- **Alerte stock bas** : Seuil d'alerte personnalisable
- **Mise à jour en temps réel** : Actualisation automatique
- **Notifications** : Alertes visuelles pour stock bas

### 🎯 Plats du jour et promotions
- **Plats du jour** : Marquer des plats comme spéciaux du jour
- **Promotions** : Système de réductions en pourcentage
- **Dates de promotion** : Début et fin de promotion
- **Description** : Explication de la promotion
- **Filtrage** : Voir uniquement les plats en promotion

## Interface utilisateur

### Formulaire avancé
Le formulaire est organisé en sections logiques :

1. **Informations de base**
   - Nom, description, catégorie
   - Prix de base et temps de préparation

2. **Images du plat**
   - Upload multiple d'images
   - Prévisualisation et gestion

3. **Options de prix**
   - Ajout/suppression d'options
   - Prix et descriptions

4. **Ingrédients et allergènes**
   - Liste détaillée des ingrédients
   - Marquage des allergènes

5. **Gestion des stocks**
   - Activation du suivi
   - Quantité et seuils d'alerte

6. **Promotions**
   - Plats du jour
   - Réductions et dates

7. **Informations nutritionnelles**
   - Calories, macronutriments

8. **Supplémements**
   - Add-ons disponibles

9. **Options finales**
   - Disponibilité, épice, popularité

### Filtres et recherche
- **Recherche textuelle** : Par nom, description ou tags
- **Filtres par statut** :
  - Tous les plats
  - Plats du jour
  - Promotions actives
  - Stock bas

### Affichage des plats
Chaque plat affiche :
- Image principale
- Badges (plat du jour, promotion, stock bas)
- Informations de base
- Options de prix
- État du stock
- Actions (modifier/supprimer)

## API Backend

### Routes principales
```
GET    /dishes/my-dishes          - Récupérer tous les plats du restaurant
POST   /dishes                    - Créer un nouveau plat
PUT    /dishes/:id                - Mettre à jour un plat
DELETE /dishes/:id                - Supprimer un plat
GET    /dishes/promotions         - Plats en promotion
GET    /dishes/daily-specials     - Plats du jour
GET    /dishes/low-stock          - Plats en stock bas
PUT    /dishes/:id/stock          - Mettre à jour le stock
GET    /dishes/search             - Rechercher des plats
GET    /dishes/stats              - Statistiques des plats
PUT    /dishes/:id/popular        - Marquer comme populaire
```

### Upload d'images
```
POST   /uploads/dish-image        - Upload d'une image
POST   /uploads/multiple-dish-images - Upload multiple d'images
```

### Schéma de données avancé
```typescript
interface Dish {
  // Informations de base
  name: string;
  description?: string;
  basePrice: number;
  category: string;
  
  // Options de prix
  priceOptions?: PriceOption[];
  
  // Ingrédients détaillés
  ingredients?: Ingredient[];
  allergens?: string[];
  
  // Images multiples
  images?: DishImage[];
  
  // Gestion des stocks
  trackStock?: boolean;
  stockQuantity?: number;
  minStockAlert?: number;
  
  // Promotions
  isDailySpecial?: boolean;
  isPromotion?: boolean;
  discountPercentage?: number;
  promotionStartDate?: Date;
  promotionEndDate?: Date;
  
  // Informations nutritionnelles
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  
  // Suppléments
  addOns?: AddOn[];
  
  // Métadonnées
  isSpicy?: boolean;
  spiceLevel?: number;
  isPopular?: boolean;
  viewCount?: number;
}
```

## Fonctionnalités avancées

### Gestion des allergènes
- **Détection automatique** : Marquage des ingrédients allergènes
- **Types spécifiques** : Gluten, lactose, fruits de mer, etc.
- **Affichage client** : Informations claires pour les clients
- **Conformité** : Respect des réglementations alimentaires

### Options de personnalisation
- **Choix de portions** : Petite, moyenne, grande
- **Suppléments** : Fromage extra, sauce supplémentaire
- **Personnalisations** : Sans oignons, extra épicé
- **Prix dynamiques** : Calcul automatique selon les options

### Système de promotions
- **Réductions en pourcentage** : De 0% à 100%
- **Périodes définies** : Dates de début et fin
- **Descriptions** : Explication des offres
- **Visibilité** : Badges visuels sur les plats

### Gestion des stocks intelligente
- **Suivi optionnel** : Chaque plat peut avoir son propre système
- **Alertes automatiques** : Notifications de stock bas
- **Quantité illimitée** : Option pour plats toujours disponibles
- **Mise à jour facile** : Interface intuitive

## Sécurité et validation

### Upload d'images
- **Types de fichiers** : Validation stricte des formats
- **Taille limitée** : Protection contre les fichiers trop gros
- **Noms sécurisés** : Génération de noms uniques
- **Stockage isolé** : Dossier dédié pour les images

### Validation des données
- **Schéma strict** : Validation TypeScript complète
- **Valeurs limites** : Pourcentages, prix, quantités
- **Relations** : Vérification des références
- **Permissions** : Accès restreint aux propriétaires

### Gestion des erreurs
- **Messages clairs** : Erreurs explicites pour l'utilisateur
- **Logs détaillés** : Traçabilité complète
- **Récupération** : Gestion gracieuse des erreurs
- **Validation côté client** : Feedback immédiat

## Performance et optimisation

### Images
- **Compression** : Optimisation automatique
- **Formats modernes** : Support WebP
- **Chargement différé** : Lazy loading
- **Cache** : Mise en cache des images

### Base de données
- **Indexation** : Index sur les champs de recherche
- **Agrégation** : Requêtes optimisées pour les statistiques
- **Pagination** : Chargement progressif
- **Projection** : Sélection des champs nécessaires

### Interface utilisateur
- **Actualisation intelligente** : Mise à jour ciblée
- **Formulaire dynamique** : Ajout/suppression d'éléments
- **Validation en temps réel** : Feedback immédiat
- **Responsive design** : Adaptation mobile

## Utilisation

### Pour les restaurants
1. **Accès** : Menu "Gestion Avancée" dans le dashboard
2. **Création** : Formulaire complet avec toutes les options
3. **Gestion** : Interface intuitive pour modifier les plats
4. **Suivi** : Filtres et recherche pour organiser le menu
5. **Promotions** : Gestion des offres et plats du jour

### Workflow typique
1. **Créer un plat** → Remplir les informations de base
2. **Ajouter des images** → Upload et organisation
3. **Définir les prix** → Options et suppléments
4. **Lister les ingrédients** → Détails et allergènes
5. **Configurer le stock** → Suivi et alertes
6. **Ajouter des promotions** → Réductions et dates
7. **Publier** → Rendre disponible aux clients

## Évolutions futures

### Fonctionnalités prévues
- **Galerie d'images** : Gestion avancée des photos
- **Templates de plats** : Modèles prédéfinis
- **Import/Export** : Sauvegarde et restauration
- **Analytics avancés** : Statistiques détaillées
- **Intégration** : Connexion avec les systèmes de caisse
- **IA** : Suggestions automatiques d'ingrédients
- **QR Codes** : Codes pour les tables
- **Multilingue** : Support de plusieurs langues 