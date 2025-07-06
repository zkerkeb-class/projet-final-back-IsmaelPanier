# 🚨 Guide des Erreurs Courantes et Solutions

## 📋 Erreurs Backend (NestJS)

### 1. **Erreur de Connexion MongoDB**
```
❌ Erreur: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**:
```bash
# Démarrer MongoDB
mongod

# Ou avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. **Erreur JWT_SECRET non défini**
```
❌ Erreur: JWT_SECRET is not defined
```

**Solution**:
```bash
# Créer un fichier .env dans le dossier server
echo "JWT_SECRET=votre_secret_jwt_tres_securise" > server/.env
```

### 3. **Erreur de Port déjà utilisé**
```
❌ Erreur: EADDRINUSE: address already in use :::5000
```

**Solution**:
```bash
# Tuer le processus sur le port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Ou changer le port dans main.ts
```

### 4. **Erreur de Module non trouvé**
```
❌ Erreur: Cannot find module '@nestjs/mongoose'
```

**Solution**:
```bash
cd server
npm install
```

### 5. **Erreur de Validation DTO**
```
❌ Erreur: Validation failed
```

**Solution**:
- Vérifier les champs requis dans les DTOs
- S'assurer que les types correspondent
- Vérifier les validations personnalisées

## 📋 Erreurs Frontend (React)

### 1. **Erreur CORS**
```
❌ Erreur: Access to fetch at 'http://localhost:5000/restaurant' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**:
```typescript
// Dans main.ts du backend
app.enableCors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
});
```

### 2. **Erreur 404 - Route non trouvée**
```
❌ Erreur: Cannot GET /restaurants
```

**Solution**:
- Vérifier que la route existe dans le contrôleur
- Vérifier que le module est importé dans app.module.ts
- Vérifier l'URL dans le frontend

### 3. **Erreur 401 - Non authentifié**
```
❌ Erreur: Unauthorized
```

**Solution**:
- Vérifier que le token JWT est envoyé dans les headers
- Vérifier que le token n'est pas expiré
- Vérifier que l'utilisateur est connecté

### 4. **Erreur 500 - Erreur serveur**
```
❌ Erreur: Internal Server Error
```

**Solution**:
- Vérifier les logs du backend
- Vérifier la connexion à la base de données
- Vérifier les validations des données

### 5. **Erreur ESLint**
```
❌ Warning: React Hook useEffect has a missing dependency
```

**Solution**:
```javascript
// Utiliser useCallback pour les fonctions
const loadData = useCallback(() => {
  // ...
}, [dependencies]);

useEffect(() => {
  loadData();
}, [loadData]);
```

### 6. **Erreur de Variables non définies**
```
❌ Erreur: Cannot read property 'name' of undefined
```

**Solution**:
```javascript
// Utiliser l'opérateur de chaînage optionnel
const name = user?.name || 'Utilisateur';

// Ou vérifier avant utilisation
if (user && user.name) {
  // utiliser user.name
}
```

## 📋 Erreurs de Base de Données

### 1. **Erreur de Schéma**
```
❌ Erreur: Schema hasn't been registered for model "Restaurant"
```

**Solution**:
```typescript
// S'assurer que le schéma est importé dans le module
@Module({
  imports: [MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantSchema }])],
})
```

### 2. **Erreur d'ObjectId invalide**
```
❌ Erreur: Cast to ObjectId failed
```

**Solution**:
```typescript
// Vérifier que l'ID est valide avant utilisation
if (!Types.ObjectId.isValid(id)) {
  throw new BadRequestException('ID invalide');
}
```

### 3. **Erreur de Connexion perdue**
```
❌ Erreur: MongooseServerSelectionError
```

**Solution**:
```typescript
// Ajouter des options de reconnexion
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
});
```

## 📋 Erreurs de Déploiement

### 1. **Erreur de Variables d'environnement**
```
❌ Erreur: process.env.MONGO_URI is undefined
```

**Solution**:
```bash
# Créer un fichier .env
MONGO_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=votre_secret
PORT=5000
```

### 2. **Erreur de Build**
```
❌ Erreur: Build failed
```

**Solution**:
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🛠️ Scripts de Diagnostic

### 1. **Diagnostic complet**
```bash
node diagnostic-errors.js
```

### 2. **Test de l'API**
```bash
node test-restaurant-api.js
```

### 3. **Réinitialisation des données**
```bash
node reset-and-seed.js
```

## 🔍 Checklist de Débogage

### Backend
- [ ] MongoDB est démarré
- [ ] Le serveur NestJS est démarré
- [ ] Les variables d'environnement sont définies
- [ ] Les modules sont correctement importés
- [ ] Les routes sont définies
- [ ] Les DTOs sont valides
- [ ] Les schémas sont enregistrés

### Frontend
- [ ] Le serveur React est démarré
- [ ] Les URLs de l'API sont correctes
- [ ] Les tokens d'authentification sont envoyés
- [ ] Les dépendances sont installées
- [ ] Pas d'erreurs ESLint
- [ ] Les composants sont correctement importés

### Base de Données
- [ ] La connexion MongoDB est établie
- [ ] Les collections existent
- [ ] Les données de test sont créées
- [ ] Les index sont créés
- [ ] Les permissions sont correctes

## 📞 Actions de Dépannage

### 1. **Redémarrer tout**
```bash
# Arrêter tous les processus
# Redémarrer MongoDB
mongod

# Redémarrer le backend
cd server && npm run start:dev

# Redémarrer le frontend
cd client && npm start
```

### 2. **Nettoyer et réinstaller**
```bash
# Backend
cd server
rm -rf node_modules package-lock.json
npm install

# Frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

### 3. **Réinitialiser la base de données**
```bash
# Supprimer et recréer les données
node reset-and-seed.js
```

### 4. **Vérifier les logs**
```bash
# Backend logs
# Vérifier la console du terminal backend

# Frontend logs
# Vérifier la console du navigateur (F12)
```

## 🎯 Erreurs Spécifiques au Projet

### 1. **Restaurants non affichés**
- Vérifier la route `/restaurant` (pas `/restaurants`)
- Vérifier que les données existent en base
- Vérifier le format des adresses

### 2. **Plats non affichés**
- Vérifier que les plats sont liés aux restaurants
- Vérifier la route `/dishes/restaurant/:id`
- Vérifier les permissions

### 3. **Panier non fonctionnel**
- Vérifier localStorage
- Vérifier les événements cartUpdated
- Vérifier les calculs de prix

### 4. **Authentification échoue**
- Vérifier JWT_SECRET
- Vérifier les routes protégées
- Vérifier les tokens dans localStorage

---

**💡 Conseil**: Utilisez toujours le script de diagnostic pour identifier rapidement les problèmes !

**📞 Support**: En cas de problème persistant, vérifiez les logs et utilisez les outils de diagnostic fournis. 