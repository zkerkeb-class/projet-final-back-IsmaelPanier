# Gestion des Commandes - Food Delivery App

## Vue d'ensemble

La section de gestion des commandes permet aux restaurants de gérer leurs commandes en temps réel avec toutes les fonctionnalités nécessaires pour un service de livraison de nourriture.

## Fonctionnalités principales

### 🔔 Commandes en temps réel
- **Actualisation automatique** : Les commandes se mettent à jour toutes les 30 secondes
- **Notifications** : Cloche de notification avec badge indiquant le nombre de commandes en attente
- **Statuts visuels** : Codes couleur pour chaque statut de commande
- **Filtrage** : Possibilité de filtrer par statut (en attente, acceptée, en préparation, etc.)

### ✅ Acceptation/Refus des commandes
- **Boutons d'action** : Accepter ou refuser les commandes en attente
- **Validation** : Seules les commandes "en attente" peuvent être acceptées/refusées
- **Raison de refus** : Possibilité d'ajouter une raison lors du refus
- **Sécurité** : Vérification que le restaurant est bien propriétaire de la commande

### 📊 Gestion des statuts
- **Workflow complet** : 
  - `pending` → `accepted` → `preparing` → `ready` → `delivered` → `completed`
- **Transitions validées** : Seules les transitions logiques sont autorisées
- **Mise à jour en temps réel** : Les changements de statut sont immédiatement visibles

### 📈 Historique et statistiques
- **Historique complet** : Toutes les commandes passées avec détails
- **Statistiques de vente** :
  - Nombre total de commandes
  - Chiffre d'affaires
  - Valeur moyenne des commandes
  - Taux de conversion
- **Filtres temporels** : Semaine, mois, année

## Interface utilisateur

### Onglets principaux
1. **Commandes en temps réel** : Commandes actives nécessitant une action
2. **Historique** : Toutes les commandes passées dans un tableau
3. **Statistiques** : Graphiques et métriques de performance

### Cartes de commande
Chaque commande affiche :
- Numéro de commande
- Informations client
- Date et heure
- Total de la commande
- Liste des plats commandés
- Statut actuel avec code couleur
- Boutons d'action selon le statut

## API Backend

### Routes principales
```
GET    /orders/restaurant     - Récupérer les commandes du restaurant
PUT    /orders/:id/accept     - Accepter une commande
PUT    /orders/:id/reject     - Refuser une commande
PUT    /orders/:id/status     - Mettre à jour le statut
```

### Statuts de commande
```typescript
enum OrderStatus {
  Pending = 'pending',      // En attente
  Accepted = 'accepted',    // Acceptée
  Preparing = 'preparing',  // En préparation
  Ready = 'ready',         // Prête
  Delivered = 'delivered',  // Livrée
  Completed = 'completed',  // Terminée
  Rejected = 'rejected',    // Refusée
  Cancelled = 'cancelled'   // Annulée
}
```

## Sécurité

### Authentification
- Toutes les routes nécessitent un token JWT valide
- Vérification du rôle "restaurant"
- Validation que le restaurant est propriétaire de la commande

### Validation des données
- Vérification des transitions de statut valides
- Validation des données d'entrée
- Gestion des erreurs avec messages explicites

## Notifications

### Cloche de notification
- **Badge animé** : Indique le nombre de commandes en attente
- **Dropdown** : Affiche les 5 commandes les plus récentes
- **Actualisation** : Toutes les 30 secondes
- **Navigation rapide** : Lien direct vers la page des commandes

### Informations affichées
- Numéro de commande
- Statut actuel
- Heure de réception
- Montant total

## Responsive Design

### Mobile
- Interface adaptée aux écrans tactiles
- Boutons plus grands pour faciliter l'utilisation
- Navigation simplifiée
- Notifications optimisées

### Desktop
- Affichage en grille pour les commandes
- Tableau complet pour l'historique
- Graphiques détaillés pour les statistiques

## Utilisation

### Pour les restaurants
1. **Connexion** : Se connecter avec un compte restaurant
2. **Notifications** : Vérifier la cloche pour les nouvelles commandes
3. **Gestion** : Aller dans "Commandes" pour voir toutes les commandes
4. **Actions** : Accepter/refuser et mettre à jour les statuts
5. **Suivi** : Consulter l'historique et les statistiques

### Workflow typique
1. Nouvelle commande reçue → Notification
2. Vérifier les détails → Accepter ou refuser
3. Si acceptée → Marquer "En préparation"
4. Une fois prête → Marquer "Prête"
5. Après livraison → Marquer "Livrée"
6. Commande terminée → Marquer "Terminée"

## Maintenance

### Logs
- Toutes les actions sont loggées côté serveur
- Traçabilité complète des changements de statut
- Gestion des erreurs avec messages détaillés

### Performance
- Actualisation optimisée (30 secondes)
- Pagination pour l'historique
- Mise en cache des données fréquemment utilisées

## Évolutions futures

### Fonctionnalités prévues
- **Notifications push** : Notifications en temps réel
- **Chat** : Communication directe avec les clients
- **Géolocalisation** : Suivi en temps réel des livreurs
- **Rapports avancés** : Analyses détaillées des performances
- **Intégration** : Connexion avec les systèmes de caisse 