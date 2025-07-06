const mongoose = require('mongoose');
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000';

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/fooddelivery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schémas
const restaurantSchema = new mongoose.Schema({
  name: String,
  description: String,
  cuisine: String,
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  phone: String,
  email: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, default: 0 },
  deliveryTime: { type: Number, default: 30 },
  minOrderAmount: { type: Number, default: 10 },
  image: String,
  openingHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  deliveryOptions: [String],
  paymentMethods: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const dishSchema = new mongoose.Schema({
  name: String,
  description: String,
  basePrice: Number,
  category: String,
  preparationTime: Number,
  isAvailable: { type: Boolean, default: true },
  images: [String],
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  isDailySpecial: { type: Boolean, default: false },
  isPromotion: { type: Boolean, default: false },
  discountPercentage: { type: Number, default: 0 },
  ingredients: [String],
  allergens: [String],
  isVegetarian: { type: Boolean, default: false },
  spicyLevel: { type: Number, default: 0 },
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  tags: [String],
  dietaryInfo: [String]
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
const Dish = mongoose.model('Dish', dishSchema);

async function resetAndSeed() {
  try {
    console.log('🔄 Démarrage de la réinitialisation et du seeding...\n');

    // 1. Supprimer toutes les données existantes
    console.log('1️⃣ Suppression des données existantes...');
    await Restaurant.deleteMany({});
    await Dish.deleteMany({});
    console.log('✅ Données supprimées');

    // 2. Créer un utilisateur restaurant de test
    console.log('\n2️⃣ Création d\'un utilisateur restaurant de test...');
    const userResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'restaurant@test.com',
        password: 'password123',
        name: 'Restaurant Test',
        role: 'restaurant'
      })
    });

    let ownerId = null;
    if (userResponse.ok) {
      const userData = await userResponse.json();
      ownerId = userData.user._id;
      console.log('✅ Utilisateur restaurant créé:', userData.user.email);
    } else {
      console.log('⚠️ Utilisateur restaurant déjà existant ou erreur');
      // Utiliser un ID fictif pour les tests
      ownerId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
    }

    // 3. Créer les restaurants de test
    console.log('\n3️⃣ Création des restaurants de test...');
    const restaurants = [
      {
        name: 'Pizza Palace',
        description: 'Les meilleures pizzas de la ville avec des ingrédients frais et locaux',
        cuisine: 'Italienne',
        address: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        phone: '+33 1 23 45 67 89',
        email: 'contact@pizzapalace.fr',
        priceRange: 'Moyen',
        rating: 4.5,
        deliveryTime: 30,
        minOrderAmount: 15,
        openingHours: {
          monday: '11:00-23:00',
          tuesday: '11:00-23:00',
          wednesday: '11:00-23:00',
          thursday: '11:00-23:00',
          friday: '11:00-00:00',
          saturday: '11:00-00:00',
          sunday: '12:00-22:00'
        },
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        ownerId: ownerId,
        deliveryOptions: ['Livraison', 'Emporter'],
        paymentMethods: ['Carte', 'Espèces']
      },
      {
        name: 'Sushi Express',
        description: 'Sushis frais et authentiques préparés par nos chefs japonais',
        cuisine: 'Japonaise',
        address: {
          street: '456 Avenue des Champs',
          city: 'Paris',
          postalCode: '75008',
          country: 'France'
        },
        phone: '+33 1 98 76 54 32',
        email: 'info@sushiexpress.fr',
        priceRange: 'Élevé',
        rating: 4.8,
        deliveryTime: 25,
        minOrderAmount: 20,
        openingHours: {
          monday: '12:00-22:30',
          tuesday: '12:00-22:30',
          wednesday: '12:00-22:30',
          thursday: '12:00-22:30',
          friday: '12:00-23:30',
          saturday: '12:00-23:30',
          sunday: '12:00-21:30'
        },
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        ownerId: ownerId,
        deliveryOptions: ['Livraison', 'Emporter'],
        paymentMethods: ['Carte', 'Espèces']
      },
      {
        name: 'Burger House',
        description: 'Burgers gourmets avec des viandes de qualité et des frites maison',
        cuisine: 'Américaine',
        address: {
          street: '789 Boulevard Saint-Germain',
          city: 'Paris',
          postalCode: '75006',
          country: 'France'
        },
        phone: '+33 1 45 67 89 01',
        email: 'hello@burgerhouse.fr',
        priceRange: 'Économique',
        rating: 4.2,
        deliveryTime: 20,
        minOrderAmount: 12,
        openingHours: {
          monday: '11:30-22:00',
          tuesday: '11:30-22:00',
          wednesday: '11:30-22:00',
          thursday: '11:30-22:00',
          friday: '11:30-23:00',
          saturday: '11:30-23:00',
          sunday: '12:00-21:00'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        ownerId: ownerId,
        deliveryOptions: ['Livraison', 'Emporter'],
        paymentMethods: ['Carte', 'Espèces']
      }
    ];

    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log('✅ Restaurants créés:', createdRestaurants.length);

    // 4. Créer les plats de test pour le premier restaurant
    console.log('\n4️⃣ Création des plats de test...');
    const firstRestaurant = createdRestaurants[0];
    
    const dishes = [
      {
        name: 'Pizza Margherita',
        description: 'Pizza classique avec tomate, mozzarella et basilic frais',
        basePrice: 12.50,
        category: 'Pizza',
        preparationTime: 15,
        isAvailable: true,
        images: ['https://via.placeholder.com/300x200?text=Pizza+Margherita'],
        restaurantId: firstRestaurant._id,
        ingredients: ['Pâte à pizza', 'Sauce tomate', 'Mozzarella', 'Basilic frais', 'Huile d\'olive'],
        allergens: ['Gluten', 'Lactose'],
        isVegetarian: true,
        spicyLevel: 0,
        calories: 285,
        protein: 12,
        carbs: 35,
        fat: 10,
        tags: ['Classique', 'Végétarien'],
        dietaryInfo: ['Végétarien']
      },
      {
        name: 'Burger Classique',
        description: 'Burger avec steak haché, salade, tomate, cornichons et sauce spéciale',
        basePrice: 14.90,
        category: 'Burger',
        preparationTime: 12,
        isAvailable: true,
        images: ['https://via.placeholder.com/300x200?text=Burger+Classique'],
        restaurantId: firstRestaurant._id,
        isPromotion: true,
        discountPercentage: 10,
        ingredients: ['Pain burger', 'Steak haché 150g', 'Salade', 'Tomate', 'Cornichons', 'Sauce spéciale'],
        allergens: ['Gluten', 'Œufs'],
        isVegetarian: false,
        spicyLevel: 1,
        calories: 650,
        protein: 35,
        carbs: 45,
        fat: 25,
        tags: ['Populaire', 'Viande'],
        dietaryInfo: ['Contient de la viande']
      },
      {
        name: 'Salade César',
        description: 'Salade romaine, parmesan, croûtons et sauce César maison',
        basePrice: 11.50,
        category: 'Salade',
        preparationTime: 8,
        isAvailable: true,
        images: ['https://via.placeholder.com/300x200?text=Salade+Cesar'],
        restaurantId: firstRestaurant._id,
        isDailySpecial: true,
        ingredients: ['Salade romaine', 'Parmesan', 'Croûtons', 'Sauce César', 'Anchois'],
        allergens: ['Gluten', 'Lactose', 'Poisson'],
        isVegetarian: false,
        spicyLevel: 0,
        calories: 180,
        protein: 8,
        carbs: 12,
        fat: 12,
        tags: ['Léger', 'Salade'],
        dietaryInfo: ['Contient du poisson']
      }
    ];

    const createdDishes = await Dish.insertMany(dishes);
    console.log('✅ Plats créés:', createdDishes.length);

    // 5. Afficher un résumé
    console.log('\n🎉 Réinitialisation et seeding terminés avec succès !');
    console.log('📊 Résumé:');
    console.log(`   - Restaurants créés: ${createdRestaurants.length}`);
    console.log(`   - Plats créés: ${createdDishes.length}`);
    console.log(`   - Restaurant principal: ${firstRestaurant.name} (ID: ${firstRestaurant._id})`);
    console.log('\n🔗 URLs de test:');
    console.log(`   - API Restaurants: ${API_BASE_URL}/restaurant`);
    console.log(`   - API Plats: ${API_BASE_URL}/dishes/restaurant/${firstRestaurant._id}`);
    console.log(`   - Frontend: http://localhost:3000`);

  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Exécuter la réinitialisation
resetAndSeed(); 