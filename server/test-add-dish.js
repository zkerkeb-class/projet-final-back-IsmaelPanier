const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:5000';

// Données de test pour un restaurant
const testRestaurant = {
  email: 'pizzabella@test.com',
  password: 'password123'
};

// Plats de test à ajouter
const testDishes = [
  {
    name: 'Pizza Margherita',
    description: 'Pizza classique avec sauce tomate, mozzarella di bufala, basilic frais et huile d\'olive extra vierge',
    basePrice: 12.50,
    category: 'Pizzas',
    ingredients: ['Pâte à pizza', 'Sauce tomate', 'Mozzarella di bufala', 'Basilic frais', 'Huile d\'olive'],
    allergens: ['Gluten', 'Lactose'],
    preparationTime: 15,
    isVegetarian: true,
    isSpicy: false,
    difficulty: 'Facile',
    isAvailable: true
  },
  {
    name: 'Pizza Pepperoni',
    description: 'Pizza avec sauce tomate, mozzarella et pepperoni épicé',
    basePrice: 14.90,
    category: 'Pizzas',
    ingredients: ['Pâte à pizza', 'Sauce tomate', 'Mozzarella', 'Pepperoni'],
    allergens: ['Gluten', 'Lactose'],
    preparationTime: 18,
    isVegetarian: false,
    isSpicy: true,
    difficulty: 'Facile',
    isAvailable: true
  },
  {
    name: 'Salade César',
    description: 'Salade romaine, parmesan, croûtons, poulet grillé et sauce César maison',
    basePrice: 11.50,
    category: 'Salades',
    ingredients: ['Salade romaine', 'Parmesan', 'Croûtons', 'Poulet grillé', 'Sauce César'],
    allergens: ['Gluten', 'Lactose', 'Œufs'],
    preparationTime: 10,
    isVegetarian: false,
    isSpicy: false,
    difficulty: 'Facile',
    isAvailable: true
  },
  {
    name: 'Tiramisu Maison',
    description: 'Dessert italien traditionnel avec mascarpone, café et cacao',
    basePrice: 6.50,
    category: 'Desserts',
    ingredients: ['Mascarpone', 'Biscuits à la cuillère', 'Café', 'Cacao', 'Œufs', 'Sucre'],
    allergens: ['Lactose', 'Œufs', 'Gluten'],
    preparationTime: 5,
    isVegetarian: true,
    isSpicy: false,
    difficulty: 'Moyen',
    isAvailable: true
  }
];

async function loginRestaurant() {
  try {
    console.log('🔐 Connexion du restaurant...');
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testRestaurant)
    });

    if (!response.ok) {
      throw new Error(`Erreur de connexion: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Connexion réussie');
    return data.access_token;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    return null;
  }
}

async function addDish(dish, token) {
  try {
    console.log(`🍽️ Ajout du plat: ${dish.name}...`);
    
    const response = await fetch(`${API_BASE_URL}/dishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dish)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erreur ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    console.log(`✅ Plat "${dish.name}" ajouté avec succès!`);
    return data;
  } catch (error) {
    console.error(`❌ Erreur lors de l'ajout de "${dish.name}":`, error.message);
    return null;
  }
}

async function testAddDishes() {
  console.log('🚀 Début du test d\'ajout de plats...\n');

  // 1. Se connecter
  const token = await loginRestaurant();
  if (!token) {
    console.log('❌ Impossible de se connecter, arrêt du test');
    return;
  }

  console.log('\n📋 Ajout des plats de test...');
  
  // 2. Ajouter chaque plat
  const results = [];
  for (const dish of testDishes) {
    const result = await addDish(dish, token);
    results.push(result);
    
    // Petite pause entre les ajouts
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 3. Résumé
  const successCount = results.filter(r => r !== null).length;
  console.log(`\n📊 Résumé:`);
  console.log(`✅ Plats ajoutés avec succès: ${successCount}/${testDishes.length}`);
  
  if (successCount > 0) {
    console.log('\n🎉 Test terminé! Vous pouvez maintenant voir les plats dans l\'interface restaurant.');
  }
}

// Exécuter le test
testAddDishes().catch(console.error); 