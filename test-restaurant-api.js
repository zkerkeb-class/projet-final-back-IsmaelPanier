const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000';

async function testRestaurantAPI() {
  console.log('🧪 Test de l\'API des restaurants...\n');

  try {
    // Test 1: Récupérer tous les restaurants
    console.log('1️⃣ Test - Récupération de tous les restaurants');
    const allRestaurantsResponse = await fetch(`${API_BASE_URL}/restaurants`);
    console.log('Status:', allRestaurantsResponse.status);
    
    if (allRestaurantsResponse.ok) {
      const allRestaurants = await allRestaurantsResponse.json();
      console.log('✅ Restaurants trouvés:', allRestaurants.length);
      
      if (allRestaurants.length > 0) {
        const firstRestaurant = allRestaurants[0];
        console.log('📋 Premier restaurant:', {
          id: firstRestaurant._id,
          name: firstRestaurant.name,
          cuisine: firstRestaurant.cuisine,
          phone: firstRestaurant.phone,
          address: firstRestaurant.address,
          rating: firstRestaurant.rating,
          deliveryTime: firstRestaurant.deliveryTime,
          minOrderAmount: firstRestaurant.minOrderAmount
        });
        
        // Test 2: Récupérer un restaurant spécifique
        console.log('\n2️⃣ Test - Récupération d\'un restaurant spécifique');
        const restaurantId = firstRestaurant._id;
        const restaurantResponse = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`);
        console.log('Status:', restaurantResponse.status);
        
        if (restaurantResponse.ok) {
          const restaurant = await restaurantResponse.json();
          console.log('✅ Restaurant récupéré:', {
            name: restaurant.name,
            phone: restaurant.phone,
            email: restaurant.email,
            address: restaurant.address,
            openingHours: restaurant.openingHours,
            deliveryOptions: restaurant.deliveryOptions,
            paymentMethods: restaurant.paymentMethods
          });
        } else {
          console.log('❌ Erreur:', restaurantResponse.statusText);
        }
      }
    } else {
      console.log('❌ Erreur:', allRestaurantsResponse.statusText);
    }
    console.log('');

    // Test 3: Vérifier la structure des données
    console.log('3️⃣ Test - Vérification de la structure des données');
    const structureResponse = await fetch(`${API_BASE_URL}/restaurants`);
    if (structureResponse.ok) {
      const restaurants = await structureResponse.json();
      console.log('📊 Statistiques:');
      console.log('   - Total des restaurants:', restaurants.length);
      
      if (restaurants.length > 0) {
        const restaurant = restaurants[0];
        console.log('   - Champs disponibles:', Object.keys(restaurant));
        
        // Vérifier les champs importants
        const importantFields = ['name', 'phone', 'email', 'address', 'cuisine', 'rating', 'deliveryTime'];
        const missingFields = importantFields.filter(field => !restaurant[field]);
        
        if (missingFields.length > 0) {
          console.log('   ⚠️ Champs manquants:', missingFields);
        } else {
          console.log('   ✅ Tous les champs importants sont présents');
        }
        
        // Vérifier le format de l'adresse
        if (restaurant.address) {
          if (typeof restaurant.address === 'object') {
            console.log('   ✅ Adresse au bon format (objet)');
          } else {
            console.log('   ⚠️ Adresse au mauvais format (string au lieu d\'objet)');
          }
        }
      }
    }
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testRestaurantAPI(); 