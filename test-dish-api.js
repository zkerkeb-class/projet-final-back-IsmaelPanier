const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000';

// Test de l'API des plats
async function testDishAPI() {
  console.log('🧪 Test de l\'API des plats...\n');

  try {
    // Test 1: Récupérer tous les plats
    console.log('1️⃣ Test - Récupération de tous les plats');
    const allDishesResponse = await fetch(`${API_BASE_URL}/dishes`);
    console.log('Status:', allDishesResponse.status);
    
    if (allDishesResponse.ok) {
      const allDishes = await allDishesResponse.json();
      console.log('✅ Plats trouvés:', allDishes.length);
      console.log('📋 Premier plat:', allDishes[0] ? {
        id: allDishes[0]._id,
        name: allDishes[0].name,
        restaurantId: allDishes[0].restaurantId
      } : 'Aucun plat');
    } else {
      console.log('❌ Erreur:', allDishesResponse.statusText);
    }
    console.log('');

    // Test 2: Récupérer les plats d'un restaurant spécifique
    console.log('2️⃣ Test - Récupération des plats d\'un restaurant');
    
    // D'abord, récupérer un restaurant
    const restaurantsResponse = await fetch(`${API_BASE_URL}/restaurants`);
    if (restaurantsResponse.ok) {
      const restaurants = await restaurantsResponse.json();
      if (restaurants.length > 0) {
        const restaurantId = restaurants[0]._id;
        console.log('🏪 Restaurant testé:', restaurants[0].name, '(ID:', restaurantId, ')');
        
        const dishesResponse = await fetch(`${API_BASE_URL}/dishes/restaurant/${restaurantId}`);
        console.log('Status:', dishesResponse.status);
        
        if (dishesResponse.ok) {
          const dishes = await dishesResponse.json();
          console.log('✅ Plats trouvés pour ce restaurant:', dishes.length);
          if (dishes.length > 0) {
            console.log('📋 Premier plat du restaurant:', {
              id: dishes[0]._id,
              name: dishes[0].name,
              price: dishes[0].basePrice,
              category: dishes[0].category
            });
          }
        } else {
          console.log('❌ Erreur:', dishesResponse.statusText);
          const errorText = await dishesResponse.text();
          console.log('Détails:', errorText);
        }
      } else {
        console.log('❌ Aucun restaurant trouvé');
      }
    } else {
      console.log('❌ Erreur lors de la récupération des restaurants');
    }
    console.log('');

    // Test 3: Vérifier la structure de la base de données
    console.log('3️⃣ Test - Vérification de la base de données');
    const dbResponse = await fetch(`${API_BASE_URL}/dishes`);
    if (dbResponse.ok) {
      const dishes = await dbResponse.json();
      console.log('📊 Statistiques:');
      console.log('   - Total des plats:', dishes.length);
      
      if (dishes.length > 0) {
        const restaurantsWithDishes = [...new Set(dishes.map(dish => dish.restaurantId))];
        console.log('   - Restaurants avec des plats:', restaurantsWithDishes.length);
        
        const categories = [...new Set(dishes.map(dish => dish.category).filter(Boolean))];
        console.log('   - Catégories disponibles:', categories);
        
        const availableDishes = dishes.filter(dish => dish.isAvailable !== false);
        console.log('   - Plats disponibles:', availableDishes.length);
      }
    }
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Test de l'API des restaurants
async function testRestaurantAPI() {
  console.log('🏪 Test de l\'API des restaurants...\n');

  try {
    // Test de récupération de tous les restaurants
    console.log('1️⃣ Test GET /restaurants');
    const restaurantsResponse = await fetch(`${API_BASE_URL}/restaurants`);
    console.log('Status:', restaurantsResponse.status);
    if (restaurantsResponse.ok) {
      const restaurants = await restaurantsResponse.json();
      console.log('✅ Restaurants récupérés:', restaurants.length);
      if (restaurants.length > 0) {
        console.log('📋 Premier restaurant:', restaurants[0].name);
      }
    } else {
      console.log('❌ Erreur:', await restaurantsResponse.text());
    }
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors des tests restaurants:', error.message);
  }
}

// Exécution des tests
async function runTests() {
  console.log('🚀 Démarrage des tests API...\n');
  
  await testRestaurantAPI();
  console.log('');
  await testDishAPI();
  
  console.log('\n🎉 Tests terminés !');
}

runTests(); 