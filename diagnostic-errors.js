const fetch = require('node-fetch');
const mongoose = require('mongoose');

const API_BASE_URL = 'http://localhost:5000';

async function diagnosticErrors() {
  console.log('🔍 Diagnostic des erreurs courantes...\n');

  // 1. Test de connexion au serveur
  console.log('1️⃣ Test de connexion au serveur...');
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (response.ok) {
      console.log('✅ Serveur accessible');
    } else {
      console.log('❌ Serveur répond mais avec erreur:', response.status);
    }
  } catch (error) {
    console.log('❌ Serveur inaccessible:', error.message);
    console.log('💡 Vérifiez que le serveur backend est démarré sur le port 5000');
    return;
  }

  // 2. Test de connexion MongoDB
  console.log('\n2️⃣ Test de connexion MongoDB...');
  try {
    await mongoose.connect('mongodb://localhost:27017/fooddelivery', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connecté');
    
    // Vérifier les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Collections disponibles:', collections.map(c => c.name));
    
    await mongoose.connection.close();
  } catch (error) {
    console.log('❌ Erreur MongoDB:', error.message);
    console.log('💡 Vérifiez que MongoDB est démarré sur localhost:27017');
  }

  // 3. Test des routes principales
  console.log('\n3️⃣ Test des routes principales...');
  
  const routes = [
    { name: 'Restaurants', path: '/restaurant' },
    { name: 'Plats', path: '/dishes' },
    { name: 'Auth Register', path: '/auth/register', method: 'POST' },
    { name: 'Auth Login', path: '/auth/login', method: 'POST' }
  ];

  for (const route of routes) {
    try {
      const options = {
        method: route.method || 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (route.method === 'POST') {
        options.body = JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });
      }

      const response = await fetch(`${API_BASE_URL}${route.path}`, options);
      console.log(`${response.ok ? '✅' : '❌'} ${route.name}: ${response.status} ${response.statusText}`);
      
      if (!response.ok && response.status !== 400) {
        console.log(`   Détails: ${route.path}`);
      }
    } catch (error) {
      console.log(`❌ ${route.name}: ${error.message}`);
    }
  }

  // 4. Test des erreurs CORS
  console.log('\n4️⃣ Test des erreurs CORS...');
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant`, {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    
    const corsHeader = response.headers.get('access-control-allow-origin');
    if (corsHeader) {
      console.log('✅ CORS configuré:', corsHeader);
    } else {
      console.log('⚠️ CORS non détecté');
    }
  } catch (error) {
    console.log('❌ Erreur CORS:', error.message);
  }

  // 5. Test des données de test
  console.log('\n5️⃣ Vérification des données de test...');
  try {
    const restaurantsResponse = await fetch(`${API_BASE_URL}/restaurant`);
    if (restaurantsResponse.ok) {
      const restaurants = await restaurantsResponse.json();
      console.log(`📊 Restaurants en base: ${restaurants.length}`);
      
      if (restaurants.length > 0) {
        const firstRestaurant = restaurants[0];
        console.log('🏪 Premier restaurant:', {
          id: firstRestaurant._id,
          name: firstRestaurant.name,
          hasPhone: !!firstRestaurant.phone,
          hasEmail: !!firstRestaurant.email,
          hasAddress: !!firstRestaurant.address,
          addressType: typeof firstRestaurant.address
        });

        // Test des plats pour ce restaurant
        const dishesResponse = await fetch(`${API_BASE_URL}/dishes/restaurant/${firstRestaurant._id}`);
        if (dishesResponse.ok) {
          const dishes = await dishesResponse.json();
          console.log(`🍽️ Plats pour ce restaurant: ${dishes.length}`);
        } else {
          console.log('❌ Erreur récupération plats:', dishesResponse.status);
        }
      } else {
        console.log('⚠️ Aucun restaurant en base - exécutez reset-and-seed.js');
      }
    }
  } catch (error) {
    console.log('❌ Erreur vérification données:', error.message);
  }

  // 6. Test des erreurs courantes du frontend
  console.log('\n6️⃣ Erreurs courantes du frontend...');
  console.log('🔍 Vérifiez dans la console du navigateur:');
  console.log('   - Erreurs CORS');
  console.log('   - Erreurs 404 (routes inexistantes)');
  console.log('   - Erreurs 401 (non authentifié)');
  console.log('   - Erreurs 500 (erreur serveur)');
  console.log('   - Erreurs de parsing JSON');
  console.log('   - Erreurs de variables non définies');

  // 7. Recommandations
  console.log('\n7️⃣ Recommandations...');
  console.log('📋 Actions à effectuer:');
  console.log('   1. Démarrer MongoDB: mongod');
  console.log('   2. Démarrer le backend: npm run start:dev');
  console.log('   3. Démarrer le frontend: npm start');
  console.log('   4. Réinitialiser les données: node reset-and-seed.js');
  console.log('   5. Vérifier les logs du backend pour les erreurs');
  console.log('   6. Vérifier la console du navigateur pour les erreurs frontend');

  // 8. Test des variables d'environnement
  console.log('\n8️⃣ Vérification des variables d\'environnement...');
  console.log('🔍 Vérifiez dans le backend:');
  console.log('   - MONGO_URI (mongodb://localhost:27017/fooddelivery)');
  console.log('   - JWT_SECRET (doit être défini)');
  console.log('   - PORT (5000 par défaut)');
  console.log('   - CORS_ORIGIN (http://localhost:3000)');

  console.log('\n🎯 Diagnostic terminé !');
}

// Exécuter le diagnostic
diagnosticErrors().catch(console.error); 