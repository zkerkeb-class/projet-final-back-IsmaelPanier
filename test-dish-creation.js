const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000';

// Test de création de plat avec authentification
async function testDishCreation() {
  console.log('🧪 Test de création et récupération de plats');
  console.log('=' .repeat(50));

  try {
    // 1. Se connecter en tant que restaurant
    console.log('1️⃣ Connexion en tant que restaurant...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'restaurant@test.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Échec de la connexion');
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Connexion réussie');

    // 2. Récupérer les informations du restaurant
    console.log('\n2️⃣ Récupération des informations du restaurant...');
    const restaurantResponse = await fetch(`${API_BASE_URL}/restaurants/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!restaurantResponse.ok) {
      throw new Error('Impossible de récupérer les informations du restaurant');
    }

    const restaurantData = await restaurantResponse.json();
    const restaurantId = restaurantData.data._id;
    console.log('✅ Restaurant trouvé:', restaurantId);

    // 3. Créer un nouveau plat
    console.log('\n3️⃣ Création d\'un nouveau plat...');
    const dishData = {
      name: 'Pizza Test',
      description: 'Pizza de test pour vérifier la création',
      basePrice: 15.99,
      category: 'Pizzas',
      isAvailable: true
    };

    const createDishResponse = await fetch(`${API_BASE_URL}/dishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dishData)
    });

    if (!createDishResponse.ok) {
      const errorData = await createDishResponse.json();
      throw new Error(`Erreur création plat: ${JSON.stringify(errorData)}`);
    }

    const createdDish = await createDishResponse.json();
    console.log('✅ Plat créé:', createdDish._id);
    console.log('🏪 RestaurantId du plat créé:', createdDish.restaurantId);

    // 4. Récupérer tous les plats du restaurant
    console.log('\n4️⃣ Récupération des plats du restaurant...');
    const dishesResponse = await fetch(`${API_BASE_URL}/dishes/restaurant/${restaurantId}`);
    
    if (!dishesResponse.ok) {
      const errorData = await dishesResponse.json();
      throw new Error(`Erreur récupération plats: ${JSON.stringify(errorData)}`);
    }

    const dishes = await dishesResponse.json();
    console.log('📋 Nombre de plats trouvés:', dishes.length);
    console.log('📋 Détails des plats:', JSON.stringify(dishes.map(d => ({ 
      id: d._id, 
      name: d.name, 
      restaurantId: d.restaurantId 
    })), null, 2));

    // 5. Vérifier que le plat créé est bien dans la liste
    const createdDishInList = dishes.find(d => d._id === createdDish._id);
    if (createdDishInList) {
      console.log('✅ Le plat créé est bien dans la liste');
    } else {
      console.log('❌ Le plat créé n\'est pas dans la liste');
    }

    // 6. Test avec la route publique
    console.log('\n5️⃣ Test avec la route publique...');
    const publicDishesResponse = await fetch(`${API_BASE_URL}/dishes?restaurantId=${restaurantId}`);
    
    if (publicDishesResponse.ok) {
      const publicDishes = await publicDishesResponse.json();
      console.log('📋 Nombre de plats (route publique):', publicDishes.length);
    } else {
      console.log('❌ Erreur route publique');
    }

    console.log('\n🎉 Test terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      const errorData = await error.response.json();
      console.error('📋 Détails de l\'erreur:', errorData);
    }
  }
}

// Test de l'API sans authentification
async function testPublicAPI() {
  console.log('🌐 Test de l\'API publique...\n');

  try {
    // Test de récupération de tous les restaurants
    console.log('1️⃣ Test GET /restaurants');
    const restaurantsResponse = await fetch(`${API_BASE_URL}/restaurants`);
    console.log('Status:', restaurantsResponse.status);
    if (restaurantsResponse.ok) {
      const restaurants = await restaurantsResponse.json();
      console.log('✅ Restaurants trouvés:', restaurants.length);
      if (restaurants.length > 0) {
        console.log('📋 Premier restaurant:', restaurants[0].name);
      }
    } else {
      console.log('❌ Erreur:', await restaurantsResponse.text());
    }
    console.log('');

    // Test de récupération de tous les plats
    console.log('2️⃣ Test GET /dishes');
    const dishesResponse = await fetch(`${API_BASE_URL}/dishes`);
    console.log('Status:', dishesResponse.status);
    if (dishesResponse.ok) {
      const dishes = await dishesResponse.json();
      console.log('✅ Plats trouvés:', dishes.length);
    } else {
      console.log('❌ Erreur:', await dishesResponse.text());
    }

  } catch (error) {
    console.error('❌ Erreur API publique:', error.message);
  }
}

// Exécution des tests
async function runTests() {
  console.log('🚀 Démarrage des tests de création de plat...\n');
  
  await testPublicAPI();
  console.log('');
  await testDishCreation();
  
  console.log('\n🎉 Tests terminés !');
}

runTests(); 