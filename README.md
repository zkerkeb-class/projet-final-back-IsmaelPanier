# 🍕 FoodDelivery+ - Backend API

Une API RESTful moderne développée avec NestJS, offrant une architecture modulaire et des fonctionnalités avancées pour l'application de livraison de nourriture.

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run start:dev

# Démarrer en mode production
npm run start:prod

# Construire le projet
npm run build
```

## 📡 API Endpoints

L'API est accessible sur : `http://localhost:5000`

---

## 💡 Côté API / NoSQL - Fonctionnalités Implémentées

### ✅ **Routes CRUD Complètes**
- **Users** : `GET`, `POST`, `PUT`, `DELETE` - Gestion complète des utilisateurs
- **Restaurants** : `GET`, `POST`, `PUT`, `DELETE` - Gestion des restaurants
- **Dishes** : `GET`, `POST`, `PUT`, `DELETE` - Gestion des plats
- **Orders** : `GET`, `POST`, `PUT`, `DELETE` - Gestion des commandes
- **Auth** : `POST /login`, `POST /register` - Authentification

### ✅ **Structure de Code Modulaire (Controllers, Services, Modules)**
```
src/
├── module/
│   ├── auth/              # Module d'authentification
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.services.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   ├── users/             # Module utilisateurs
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── schemas/
│   │   └── dto/
│   ├── restaurants/       # Module restaurants
│   ├── dishes/           # Module plats
│   ├── orders/           # Module commandes
│   └── uploads/          # Module uploads
├── common/               # Éléments communs
│   ├── decorators/       # Décorateurs personnalisés
│   ├── guards/          # Guards d'authentification
│   ├── enums/           # Énumérations
│   └── exceptions/      # Gestion d'exceptions
└── config/              # Configuration
```

### ✅ **Système d'Authentification JWT**
- Génération de tokens JWT sécurisés
- Refresh tokens automatiques
- Validation des tokens côté serveur
- Gestion des sessions utilisateur
- Déconnexion sécurisée

### ✅ **Routes Protégées avec Guards**
- **JWT Guard** : Protection des routes avec validation de token
- **Roles Guard** : Protection basée sur les rôles utilisateur
- **Middleware d'authentification** : Vérification automatique des tokens
- **Décorateurs personnalisés** : `@Roles()`, `@Public()`

### ✅ **Base de Données MongoDB avec Mongoose**
- **Connection MongoDB** : Configuration optimisée
- **Schémas Mongoose** : Modèles de données structurés
- **Indexation** : Performance optimisée
- **Relations** : Références entre collections
- **Validation** : Validation côté base de données

### ✅ **Vérifications et Validation**
- **Champs obligatoires** : Validation des champs requis
- **Types de données** : String, Number, Boolean, Date
- **Validation personnalisée** : Règles métier spécifiques
- **Messages d'erreur** : Feedback détaillé pour les développeurs

### ✅ **Validation avec Joi**
- **DTOs validés** : Validation des données d'entrée
- **Schémas Joi** : Règles de validation complexes
- **Messages d'erreur** : Messages personnalisés
- **Validation automatique** : Middleware de validation global

### ✅ **Codes de Statut HTTP Appropriés**
- **200** : Succès
- **201** : Création réussie
- **400** : Requête invalide
- **401** : Non authentifié
- **403** : Non autorisé
- **404** : Ressource non trouvée
- **409** : Conflit
- **500** : Erreur serveur

---

## 🌟 **BONUS - Fonctionnalités Avancées**

### 🏗️ **Architecture Modulaire Avancée**
- **Modules NestJS** : Architecture modulaire complète
- **Dependency Injection** : Injection de dépendances automatique
- **Services réutilisables** : Logique métier centralisée
- **Interfaces** : Contrats clairs entre modules
- **Configuration centralisée** : Variables d'environnement

### 🔐 **Sécurité Renforcée**
- **Guards NestJS** : Protection des routes avancée
- **Décorateurs personnalisés** : `@Roles()`, `@Public()`
- **Validation des rôles** : Système de permissions granulaire
- **Hachage des mots de passe** : Sécurité des données sensibles
- **Protection CSRF** : Protection contre les attaques CSRF

### 📊 **Gestion d'État Avancée**
- **Cache intelligent** : Mise en cache des requêtes fréquentes
- **Optimistic locking** : Gestion des conflits de données
- **Transactions** : Opérations atomiques
- **Audit trail** : Traçabilité des modifications

### 🎯 **Expérience Développeur**
- **Documentation automatique** : Swagger/OpenAPI
- **Logs structurés** : Traçabilité complète
- **Gestion d'erreurs** : Exceptions personnalisées
- **Tests unitaires** : Couverture de code
- **Hot reload** : Développement rapide

### 🔧 **Outils de Développement**
- **Scripts d'automatisation** : Seeders, migrations
- **Configuration d'environnement** : Dev, Staging, Prod
- **Monitoring** : Métriques de performance
- **Debugging** : Outils de débogage avancés

### 📱 **Fonctionnalités Temps Réel**
- **WebSockets** : Communication bidirectionnelle
- **Notifications push** : Notifications en temps réel
- **Live tracking** : Suivi des commandes en temps réel
- **Chat en temps réel** : Communication client-restaurant

### 🎨 **API Design**
- **RESTful** : Conformité aux standards REST
- **Versioning** : Gestion des versions d'API
- **Rate limiting** : Protection contre le spam
- **CORS** : Configuration cross-origin
- **Compression** : Optimisation des réponses

### 🔄 **Performance**
- **Lazy loading** : Chargement à la demande
- **Connection pooling** : Optimisation des connexions DB
- **Query optimization** : Requêtes optimisées
- **Caching** : Mise en cache intelligente
- **Compression** : Réduction de la bande passante

---

## 🛠️ Technologies Utilisées

- **NestJS** - Framework Node.js modulaire
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **Joi** - Validation de schémas
- **Passport** - Stratégies d'authentification
- **Multer** - Gestion des uploads
- **Socket.io** - Communication temps réel

---

## 📁 Structure Détaillée du Projet

```
src/
├── module/
│   ├── auth/
│   │   ├── auth.controller.ts      # Contrôleur d'authentification
│   │   ├── auth.module.ts          # Module d'authentification
│   │   ├── auth.services.ts        # Services d'auth
│   │   ├── jwt.strategy.ts         # Stratégie JWT
│   │   └── dto/
│   │       ├── login.dto.ts        # DTO de connexion
│   │       └── register.dto.ts     # DTO d'inscription
│   ├── users/
│   │   ├── users.controller.ts     # Contrôleur utilisateurs
│   │   ├── users.module.ts         # Module utilisateurs
│   │   ├── users.service.ts        # Services utilisateurs
│   │   ├── schemas/
│   │   │   ├── user.schema.ts      # Schéma utilisateur
│   │   │   └── favorite.schema.ts  # Schéma favoris
│   │   └── dto/
│   │       ├── create-user.dto.ts  # DTO création utilisateur
│   │       └── update-user.dto.ts  # DTO mise à jour utilisateur
│   ├── restaurants/
│   │   ├── restaurant.module.ts    # Module restaurants
│   │   ├── restaurants.controller.ts # Contrôleur restaurants
│   │   ├── restaurants.services.ts # Services restaurants
│   │   ├── schemas/
│   │   │   └── restaurant.schema.ts # Schéma restaurant
│   │   └── dto/
│   │       ├── create-restaurant.dto.ts
│   │       └── update-restaurant-dto.ts
│   ├── dishes/
│   │   ├── dishes.controller.ts    # Contrôleur plats
│   │   ├── dishes.module.ts        # Module plats
│   │   ├── dishes.service.ts       # Services plats
│   │   ├── schemas/
│   │   │   └── dish.schema.ts      # Schéma plat
│   │   └── dto/
│   │       ├── create-dish.dto.ts  # DTO création plat
│   │       └── update-dish.dto.ts  # DTO mise à jour plat
│   ├── orders/
│   │   ├── order.controller.ts     # Contrôleur commandes
│   │   ├── orders.module.ts        # Module commandes
│   │   ├── orders.service.ts       # Services commandes
│   │   ├── schemas/
│   │   │   └── order.schema.ts     # Schéma commande
│   │   └── dto/
│   │       ├── create-order.dto.ts # DTO création commande
│   │       ├── update-order.dto.ts # DTO mise à jour commande
│   │       └── filter-order.dto.ts # DTO filtres commande
│   └── uploads/
│       ├── upload.controller.ts    # Contrôleur uploads
│       ├── upload.module.ts        # Module uploads
│       └── upload.service.ts       # Services uploads
├── common/
│   ├── decorators/
│   │   └── roles.decorator.ts      # Décorateur rôles
│   ├── enums/
│   │   └── user-role.enum.ts       # Énumération rôles
│   ├── exceptions/
│   │   └── http-exception/
│   │       └── http-exception.filter.ts # Filtre exceptions
│   └── guards/
│       ├── jwt-auth.gard.ts        # Guard JWT
│       └── roles.guard.ts          # Guard rôles
├── config/
│   └── mongo.config.ts             # Configuration MongoDB
├── app.controller.ts               # Contrôleur principal
├── app.module.ts                   # Module principal
├── app.service.ts                  # Service principal
└── main.ts                         # Point d'entrée
```

---

## 🔐 Système d'Authentification

### JWT Strategy
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

### Guards d'Authentification
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
```

---

## 📊 Modèles de Données

### Schéma Utilisateur
```typescript
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: [String], ref: 'Restaurant' })
  favoriteRestaurants: string[];

  @Prop({ type: [String], ref: 'Dish' })
  favoriteDishes: string[];
}
```

### Validation Joi
```typescript
export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('user', 'restaurant').default('user'),
});
```

---

## 🌐 Endpoints API

### Authentification
```
POST /auth/register     # Inscription
POST /auth/login        # Connexion
GET  /auth/profile      # Profil utilisateur (protégé)
```

### Utilisateurs
```
GET    /users           # Liste des utilisateurs (protégé)
POST   /users           # Créer un utilisateur
GET    /users/:id       # Détails utilisateur (protégé)
PUT    /users/:id       # Modifier utilisateur (protégé)
DELETE /users/:id       # Supprimer utilisateur (protégé)
```

### Restaurants
```
GET    /restaurants           # Liste des restaurants
POST   /restaurants           # Créer un restaurant (protégé)
GET    /restaurants/:id       # Détails restaurant
PUT    /restaurants/:id       # Modifier restaurant (protégé)
DELETE /restaurants/:id       # Supprimer restaurant (protégé)
```

### Plats
```
GET    /dishes               # Liste des plats
POST   /dishes               # Créer un plat (protégé)
GET    /dishes/:id           # Détails plat
PUT    /dishes/:id           # Modifier plat (protégé)
DELETE /dishes/:id           # Supprimer plat (protégé)
```

### Commandes
```
GET    /orders               # Liste des commandes (protégé)
POST   /orders               # Créer une commande (protégé)
GET    /orders/:id           # Détails commande (protégé)
PUT    /orders/:id           # Modifier commande (protégé)
DELETE /orders/:id           # Supprimer commande (protégé)
```

---

## 🔧 Scripts Disponibles

```bash
# Développement
npm run start:dev        # Démarrer en mode développement
npm run start:debug      # Démarrer avec debug
npm run start:prod       # Démarrer en production

# Build
npm run build           # Construire le projet
npm run build:webpack   # Build avec webpack

# Tests
npm run test            # Lancer les tests
npm run test:watch      # Tests en mode watch
npm run test:cov        # Tests avec couverture
npm run test:debug      # Tests en mode debug
npm run test:e2e        # Tests end-to-end

# Linting
npm run lint            # Linter le code
npm run lint:fix        # Corriger automatiquement

# Base de données
npm run seed            # Peupler la base de données
npm run reset           # Réinitialiser la base
```

---

## 📚 Documentation

- [Guide d'API](API_DOCUMENTATION.md)
- [Guide de déploiement](DEPLOYMENT.md)
- [Guide de développement](DEVELOPMENT.md)
- [Schémas de base de données](DATABASE_SCHEMAS.md)

---

## 🎯 Fonctionnalités Clés

### 👤 **Gestion des Utilisateurs**
- Inscription/Connexion sécurisée
- Gestion des rôles (USER, RESTAURANT)
- Profils personnalisables
- Système de favoris

### 🏪 **Gestion des Restaurants**
- CRUD complet des restaurants
- Gestion des informations
- Système de géolocalisation
- Horaires d'ouverture

### 🍽️ **Gestion des Plats**
- CRUD complet des plats
- Upload d'images
- Catégorisation
- Prix et disponibilité

### 📦 **Gestion des Commandes**
- Création de commandes
- Suivi des statuts
- Historique complet
- Notifications temps réel

---

## 🚀 Déploiement

L'API est prête pour le déploiement en production avec :
- Configuration d'environnement
- Optimisation des performances
- Monitoring et logging
- Sécurité renforcée

---

## 👨‍💻 Développé par

**Ismael Panier** - Développeur Full Stack

---

## 📄 Licence

Ce projet est sous licence MIT.

---

**🎉 FoodDelivery+ API - Une API robuste et modulaire pour la livraison de nourriture !**
