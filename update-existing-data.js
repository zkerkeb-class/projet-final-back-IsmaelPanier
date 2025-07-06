const mongoose = require('mongoose');

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

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

async function updateExistingData() {
  try {
    console.log('🔄 Mise à jour des données existantes...\n');

    // 1. Mettre à jour les restaurants existants
    console.log('1️⃣ Mise à jour des restaurants...');
    
    const restaurants = await Restaurant.find({});
    console.log(`📊 Restaurants trouvés: ${restaurants.length}`);

    for (const restaurant of restaurants) {
      const updates = {};

      // Mettre à jour l'adresse si elle est vide ou par défaut
      if (!restaurant.address || 
          restaurant.address.street === 'Adresse à définir' ||
          restaurant.address.street === 'Adresse à compléter') {
        updates.address = {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        };
      }

      // Mettre à jour le téléphone s'il est vide ou par défaut
      if (!restaurant.phone || 
          restaurant.phone === 'Téléphone à définir' ||
          restaurant.phone === 'Téléphone à compléter') {
        updates.phone = '+33 1 23 45 67 89';
      }

      // Ajouter des options de livraison si vides
      if (!restaurant.deliveryOptions || restaurant.deliveryOptions.length === 0) {
        updates.deliveryOptions = ['Livraison', 'Emporter'];
      }

      // Ajouter des méthodes de paiement si vides
      if (!restaurant.paymentMethods || restaurant.paymentMethods.length === 0) {
        updates.paymentMethods = ['Carte', 'Espèces'];
      }

      // Ajouter une image si elle n'existe pas
      if (!restaurant.image) {
        updates.image = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400';
      }

      // Ajouter des horaires si ils n'existent pas
      if (!restaurant.openingHours) {
        updates.openingHours = {
          monday: '11:00-22:00',
          tuesday: '11:00-22:00',
          wednesday: '11:00-22:00',
          thursday: '11:00-22:00',
          friday: '11:00-23:00',
          saturday: '11:00-23:00',
          sunday: '12:00-21:00'
        };
      }

      // Ajouter un temps de livraison si il n'existe pas
      if (!restaurant.deliveryTime) {
        updates.deliveryTime = 30;
      }

      // Ajouter un montant minimum de commande si il n'existe pas
      if (!restaurant.minOrderAmount) {
        updates.minOrderAmount = 15;
      }

      // Appliquer les mises à jour si il y en a
      if (Object.keys(updates).length > 0) {
        await Restaurant.findByIdAndUpdate(restaurant._id, { $set: updates });
        console.log(`✅ Restaurant "${restaurant.name}" mis à jour`);
      } else {
        console.log(`ℹ️ Restaurant "${restaurant.name}" déjà à jour`);
      }
    }

    // 2. Créer des restaurants de test si aucun n'existe
    if (restaurants.length === 0) {
      console.log('\n2️⃣ Création de restaurants de test...');
      
      const testRestaurants = [
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
          deliveryOptions: ['Livraison', 'Emporter'],
          paymentMethods: ['Carte', 'Espèces']
        }
      ];

      await Restaurant.insertMany(testRestaurants);
      console.log('✅ Restaurants de test créés');
    }

    // 3. Afficher un résumé
    console.log('\n🎉 Mise à jour terminée !');
    console.log('📊 Résumé:');
    console.log(`   - Restaurants mis à jour: ${restaurants.length}`);
    console.log('   - Informations complétées: adresse, téléphone, options de livraison, méthodes de paiement');
    console.log('\n🔗 URLs de test:');
    console.log('   - Frontend: http://localhost:3000');
    console.log('   - API Restaurants: http://localhost:5000/restaurant');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Exécuter la mise à jour
updateExistingData(); 