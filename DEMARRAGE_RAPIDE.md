# 🚀 Guide de Démarrage Rapide

## 📋 Vérifications de Base

### **1. Prérequis**
- Node.js installé (version 16+)
- MongoDB en cours d'exécution
- Ports 3000 (frontend) et 5000 (backend) libres

### **2. Démarrage des Serveurs**

#### **Backend (Terminal 1)**
```bash
cd server
npm run start:dev
```
✅ Le backend démarre sur `http://localhost:5000`

#### **Frontend (Terminal 2)**
```bash
cd client  
npm start
```
✅ Le frontend démarre sur `http://localhost:3000`

## 🔍 Test du Problème

### **1. Se connecter en tant que restaurant**
1. Allez sur `http://localhost:3000`
2. Cliquez sur "Connexion Restaurant"
3. Utilisez les identifiants :
   - Email: `pizzabella@test.com`
   - Mot de passe: `password123`

### **2. Aller dans Gestion des Plats**
1. Cliquez sur "Gestion des Plats" dans le menu
2. Cliquez sur "➕ Ajouter un nouveau plat"

### **3. Remplir le formulaire**
- **Nom** : "Test Pizza Debug"
- **Catégorie** : "Pizzas"  
- **Description** : "Pizza pour tester l'ajout"
- **Prix** : 15.50
- Ajouter quelques ingrédients
- Cocher quelques allergènes
- Cliquer sur "Ajouter le plat"

### **4. Vérifier les Logs**

#### **Dans le Frontend (F12 → Console)**
Vous devriez voir :
```
🍽️ Début sauvegarde plat: {name: "Test Pizza Debug", ...}
🔑 Token utilisé: Présent
➕ Ajout d'un nouveau plat
📡 Réponse ajout: 201
✅ Plat ajouté avec succès dans la DB: {...}
```

#### **Dans le Terminal Backend**
Vous devriez voir :
```
🍽️ Création d'un nouveau plat...
👤 User connecté: {...}
📦 DTO reçu: {...}
🏪 Restaurant trouvé: {...}
✅ Plat créé avec succès: {...}
```

## 🛠️ Debug en Cas de Problème

### **Si le formulaire ne se soumet pas :**

1. **Ouvrir F12 → Console** et vérifier les erreurs
2. **Vérifier les champs obligatoires** (nom, catégorie, description, prix)
3. **Vérifier la connexion** - le token est-il présent ?

### **Si l'API répond 401 :**
- Le token JWT a expiré, reconnectez-vous

### **Si l'API répond 500 :**
- Vérifier les logs du backend
- Vérifier que MongoDB est démarré

### **Si l'API répond 404 :**
- Vérifier que le backend est démarré sur le port 5000

## 🧪 Test API Direct

Pour tester directement l'API :

```bash
cd server
node test-dish-api.js
```

Ce script teste :
1. ✅ Connexion restaurant
2. ✅ Récupération des plats  
3. ✅ Ajout d'un plat
4. ✅ Suppression du plat de test

## 🎯 Points de Vérification

### **1. Base de Données**
```bash
# Se connecter à MongoDB
mongo
use food-delivery
db.dishes.find().pretty()
```

### **2. Logs Backend Détaillés**
Le backend affiche maintenant des logs détaillés pour chaque étape.

### **3. Notifications Frontend**
- ✅ Succès : Notification verte avec ✅
- ❌ Erreur : Notification rouge avec ❌

## 🔧 Solutions aux Problèmes Courants

### **"Veuillez corriger les erreurs"**
➡️ Un champ obligatoire est vide ou invalide

### **"Erreur 401"**
➡️ Token expiré, reconnectez-vous

### **"Erreur 500"**  
➡️ Problème côté serveur, vérifier les logs backend

### **"fetch failed"**
➡️ Backend non démarré ou port incorrect

### **Le plat n'apparaît pas dans la liste**
➡️ Rafraîchir la page ou vérifier la base de données

---

## 🎉 Si Tout Fonctionne

Vous devriez voir :
1. 🔧 Le modal se ferme après 2 secondes
2. ✅ Une notification de succès
3. 📋 Le nouveau plat dans la liste
4. 💾 Le plat sauvegardé en base de données

**La fonctionnalité est maintenant complètement opérationnelle !** 🚀 