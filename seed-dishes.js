const mongoose = require('mongoose');
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000';

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/fooddelivery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schéma pour les plats
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
  dietaryInfo: [String],
  customizationOptions: [{
    name: String,
    options: [{
      name: String,
      price: Number
    }]
  }],
  addOns: [{
    name: String,
    price: Number
  }]
}, { timestamps: true });

const Dish = mongoose.model('Dish', dishSchema);

// Schéma pour les restaurants
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

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// Données de test pour les plats
const sampleDishes = [
  {
    name: 'Pizza Margherita',
    description: 'Pizza classique avec tomate, mozzarella et basilic frais',
    basePrice: 12.50,
    category: 'Pizza',
    preparationTime: 15,
    isAvailable: true,
    images: ['https://via.placeholder.com/300x200?text=Pizza+Margherita'],
    isDailySpecial: false,
    isPromotion: false,
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
    isDailySpecial: false,
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
    isDailySpecial: true,
    isPromotion: false,
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
  },
  {
    name: 'Pasta Carbonara',
    description: 'Pâtes avec sauce crémeuse, lardons, parmesan et œuf',
    basePrice: 13.80,
    category: 'Pâtes',
    preparationTime: 18,
    isAvailable: true,
    images: ['https://via.placeholder.com/300x200?text=Pasta+Carbonara'],
    isDailySpecial: false,
    isPromotion: false,
    ingredients: ['Pâtes', 'Lardons', 'Parmesan', 'Œuf', 'Crème', 'Poivre noir'],
    allergens: ['Gluten', 'Lactose', 'Œufs'],
    isVegetarian: false,
    spicyLevel: 0,
    calories: 420,
    protein: 18,
    carbs: 55,
    fat: 15,
    tags: ['Italien', 'Crémeux'],
    dietaryInfo: ['Contient du porc']
  },
  {
    name: 'Sushi California',
    description: 'Rouleau de sushi avec crabe, avocat et concombre',
    basePrice: 16.50,
    category: 'Sushi',
    preparationTime: 10,
    isAvailable: true,
    images: ['https://via.placeholder.com/300x200?text=Sushi+California'],
    isDailySpecial: false,
    isPromotion: false,
    ingredients: ['Riz sushi', 'Crabe', 'Avocat', 'Concombre', 'Nori', 'Sauce soja'],
    allergens: ['Poisson', 'Soja'],
    isVegetarian: false,
    spicyLevel: 0,
    calories: 220,
    protein: 12,
    carbs: 35,
    fat: 5,
    tags: ['Japonais', 'Frais'],
    dietaryInfo: ['Contient du poisson']
  }
];

async function seedDishes() {
  try {
    console.log('🌱 Démarrage du seeding des plats...\n');

    // Récupérer un restaurant existant ou en créer un
    let restaurant = await Restaurant.findOne();
    
    if (!restaurant) {
      console.log('🏪 Aucun restaurant trouvé, création d\'un restaurant de test...');
      
      // Créer un utilisateur de test d'abord
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

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('✅ Utilisateur restaurant créé:', userData.user.email);
        
        // Créer le restaurant
        restaurant = new Restaurant({
          name: 'Restaurant Test',
          description: 'Un restaurant de test pour les plats',
          cuisine: 'Française',
          address: {
            street: '123 Rue de Test',
            city: 'Paris',
            postalCode: '75001',
            country: 'France'
          },
          phone: '01 23 45 67 89',
          email: 'restaurant@test.com',
          ownerId: userData.user._id,
          rating: 4.5,
          deliveryTime: 25,
          minOrderAmount: 8,
          openingHours: {
            monday: '11:00-22:00',
            tuesday: '11:00-22:00',
            wednesday: '11:00-22:00',
            thursday: '11:00-22:00',
            friday: '11:00-23:00',
            saturday: '11:00-23:00',
            sunday: '12:00-21:00'
          },
          deliveryOptions: ['Livraison', 'Emporter'],
          paymentMethods: ['Carte', 'Espèces']
        });
        
        await restaurant.save();
        console.log('✅ Restaurant créé:', restaurant.name);
      } else {
        console.log('❌ Erreur lors de la création de l\'utilisateur restaurant');
        return;
      }
    } else {
      console.log('🏪 Restaurant existant trouvé:', restaurant.name);
    }

    // Supprimer les plats existants pour ce restaurant
    await Dish.deleteMany({ restaurantId: restaurant._id });
    console.log('🗑️ Anciens plats supprimés');

    // Créer les nouveaux plats
    const dishesToCreate = sampleDishes.map(dish => ({
      ...dish,
      restaurantId: restaurant._id
    }));

    const createdDishes = await Dish.insertMany(dishesToCreate);
    console.log('✅ Plats créés:', createdDishes.length);

    // Afficher les détails des plats créés
    console.log('\n📋 Plats créés:');
    createdDishes.forEach((dish, index) => {
      console.log(`${index + 1}. ${dish.name} - ${dish.basePrice}€ (${dish.category})`);
    });

    console.log('\n🎉 Seeding terminé avec succès !');
    console.log(`🏪 Restaurant: ${restaurant.name} (ID: ${restaurant._id})`);
    console.log(`🍽️ Plats ajoutés: ${createdDishes.length}`);

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Exécuter le seeding
seedDishes(); 