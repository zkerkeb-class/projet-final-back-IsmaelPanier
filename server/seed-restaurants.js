const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/Deleveryfood', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schéma User (simplifié pour le seeding)
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
}, { timestamps: true });

// Schéma Restaurant (simplifié pour le seeding)
const restaurantSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  phone: String,
  email: String,
  cuisine: String,
  priceRange: { type: String, enum: ['Économique', 'Moyen', 'Élevé', 'Luxe'] },
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
  rating: { type: Number, default: 4.5 },
  deliveryTime: { type: String, default: '25-35 min' },
  isOpen: { type: Boolean, default: true },
  image: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

async function seedRestaurants() {
  try {
    console.log('🌱 Début du seeding des restaurants...');

    // Supprimer les données existantes
    await User.deleteMany({ role: 'restaurant' });
    await Restaurant.deleteMany({});
    console.log('🗑️ Données existantes supprimées');

    // Créer des utilisateurs restaurant
    const restaurantUsers = [
      {
        email: 'bella.pizza@example.com',
        password: 'password123',
        name: 'Bella Pizza',
        role: 'restaurant'
      },
      {
        email: 'sushi.master@example.com',
        password: 'password123',
        name: 'Sushi Master',
        role: 'restaurant'
      },
      {
        email: 'burger.house@example.com',
        password: 'password123',
        name: 'Burger House',
        role: 'restaurant'
      },
      {
        email: 'petit.bistrot@example.com',
        password: 'password123',
        name: 'Le Petit Bistrot',
        role: 'restaurant'
      },
      {
        email: 'taj.mahal@example.com',
        password: 'password123',
        name: 'Taj Mahal',
        role: 'restaurant'
      }
    ];

    const createdUsers = [];
    for (const userData of restaurantUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`✅ Utilisateur créé: ${userData.name}`);
    }

    // Créer des restaurants
    const restaurants = [
      {
        name: 'Bella Pizza',
        description: 'Pizzas authentiques italiennes cuites au feu de bois',
        cuisine: 'Italienne',
        priceRange: 'Moyen',
        rating: 4.5,
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        address: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        phone: '01 23 45 67 89',
        email: 'bella.pizza@example.com',
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
        paymentMethods: ['Carte', 'Espèces', 'PayPal']
      },
      {
        name: 'Sushi Master',
        description: 'Sushi frais et sashimi de qualité premium',
        cuisine: 'Japonaise',
        priceRange: 'Élevé',
        rating: 4.8,
        deliveryTime: '30-45 min',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        address: {
          street: '456 Avenue des Champs',
          city: 'Paris',
          postalCode: '75008',
          country: 'France'
        },
        phone: '01 98 76 54 32',
        email: 'sushi.master@example.com',
        openingHours: {
          monday: '12:00-14:30, 19:00-22:30',
          tuesday: '12:00-14:30, 19:00-22:30',
          wednesday: '12:00-14:30, 19:00-22:30',
          thursday: '12:00-14:30, 19:00-22:30',
          friday: '12:00-14:30, 19:00-23:00',
          saturday: '12:00-23:00',
          sunday: '12:00-21:00'
        },
        deliveryOptions: ['Livraison', 'Emporter'],
        paymentMethods: ['Carte', 'Espèces']
      },
      {
        name: 'Burger House',
        description: 'Burgers artisanaux et frites maison',
        cuisine: 'Américaine',
        priceRange: 'Économique',
        rating: 4.2,
        deliveryTime: '20-30 min',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        address: {
          street: '789 Boulevard Saint-Germain',
          city: 'Paris',
          postalCode: '75006',
          country: 'France'
        },
        phone: '01 11 22 33 44',
        email: 'burger.house@example.com',
        openingHours: {
          monday: '11:30-22:00',
          tuesday: '11:30-22:00',
          wednesday: '11:30-22:00',
          thursday: '11:30-22:00',
          friday: '11:30-23:00',
          saturday: '11:30-23:00',
          sunday: '12:00-21:00'
        },
        deliveryOptions: ['Livraison', 'Emporter'],
        paymentMethods: ['Carte', 'Espèces']
      },
      {
        name: 'Le Petit Bistrot',
        description: 'Cuisine française traditionnelle et raffinée',
        cuisine: 'Française',
        priceRange: 'Élevé',
        rating: 4.7,
        deliveryTime: '35-50 min',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
        address: {
          street: '321 Rue du Faubourg',
          city: 'Paris',
          postalCode: '75011',
          country: 'France'
        },
        phone: '01 55 66 77 88',
        email: 'petit.bistrot@example.com',
        openingHours: {
          monday: '12:00-14:30, 19:00-22:30',
          tuesday: '12:00-14:30, 19:00-22:30',
          wednesday: '12:00-14:30, 19:00-22:30',
          thursday: '12:00-14:30, 19:00-22:30',
          friday: '12:00-14:30, 19:00-23:00',
          saturday: '12:00-23:00',
          sunday: 'Fermé'
        },
        deliveryOptions: ['Livraison'],
        paymentMethods: ['Carte', 'Espèces']
      },
      {
        name: 'Taj Mahal',
        description: 'Cuisine indienne épicée et authentique',
        cuisine: 'Indienne',
        priceRange: 'Moyen',
        rating: 4.4,
        deliveryTime: '25-40 min',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
        address: {
          street: '654 Rue de la Roquette',
          city: 'Paris',
          postalCode: '75012',
          country: 'France'
        },
        phone: '01 99 88 77 66',
        email: 'taj.mahal@example.com',
        openingHours: {
          monday: '12:00-14:30, 19:00-22:30',
          tuesday: '12:00-14:30, 19:00-22:30',
          wednesday: '12:00-14:30, 19:00-22:30',
          thursday: '12:00-14:30, 19:00-22:30',
          friday: '12:00-14:30, 19:00-23:00',
          saturday: '12:00-23:00',
          sunday: '12:00-21:00'
        },
        deliveryOptions: ['Livraison', 'Emporter'],
        paymentMethods: ['Carte', 'Espèces']
      }
    ];

    // Associer chaque restaurant à un utilisateur
    for (let i = 0; i < restaurants.length; i++) {
      const restaurantData = restaurants[i];
      const restaurant = new Restaurant({
        ...restaurantData,
        ownerId: createdUsers[i]._id
      });
      await restaurant.save();
      console.log(`✅ Restaurant créé: ${restaurantData.name}`);
    }

    console.log('🎉 Seeding terminé avec succès !');
    console.log(`📊 ${createdUsers.length} utilisateurs restaurant créés`);
    console.log(`🏪 ${restaurants.length} restaurants créés`);

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedRestaurants(); 