// Script de test simple pour vérifier l'API des plats
const API_BASE_URL = 'http://localhost:5000';

// Test simple avec fetch natif (pour Node.js 18+)
async function testDishAPI() {
  console.log('🔍 Test de l\'API des plats...\n');

  // 1. Test de connexion restaurant
  console.log('1️⃣ Test de connexion...');
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'pizzabella@test.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Connexion échouée:', loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Connexion réussie!');

    // 2. Test récupération des plats
    console.log('\n2️⃣ Test récupération des plats...');
    const dishesResponse = await fetch(`${API_BASE_URL}/dishes/my-dishes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (dishesResponse.ok) {
      const dishes = await dishesResponse.json();
      console.log(`✅ ${dishes.length} plats récupérés`);
      dishes.forEach((dish, index) => {
        console.log(`   ${index + 1}. ${dish.name} - ${dish.basePrice}€`);
      });
    } else {
      console.log('❌ Erreur récupération plats:', dishesResponse.status);
    }

    // 3. Test ajout d'un plat
    console.log('\n3️⃣ Test ajout d\'un plat...');
    const newDish = {
      name: 'Test Pizza API',
      description: 'Pizza de test pour vérifier l\'API',
      basePrice: 15.50,
      category: 'Pizzas',
      ingredients: ['Pâte', 'Sauce tomate', 'Fromage'],
      allergens: ['Gluten', 'Lactose'],
      preparationTime: 20,
      isVegetarian: true,
      isSpicy: false,
      difficulty: 'Facile',
      isAvailable: true
    };

    const addResponse = await fetch(`${API_BASE_URL}/dishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newDish)
    });

    if (addResponse.ok) {
      const addedDish = await addResponse.json();
      console.log('✅ Plat ajouté avec succès!');
      console.log('   ID:', addedDish._id);
      console.log('   Nom:', addedDish.name);
      console.log('   Prix:', addedDish.basePrice + '€');
      
      // 4. Test suppression du plat de test
      console.log('\n4️⃣ Nettoyage - Suppression du plat de test...');
      const deleteResponse = await fetch(`${API_BASE_URL}/dishes/${addedDish._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (deleteResponse.ok) {
        console.log('✅ Plat de test supprimé');
      } else {
        console.log('⚠️ Erreur suppression plat de test');
      }
    } else {
      const errorText = await addResponse.text();
      console.log('❌ Erreur ajout plat:', addResponse.status);
      console.log('   Détails:', errorText);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }

  console.log('\n🏁 Test terminé!');
}

// Exécuter le test
testDishAPI(); 