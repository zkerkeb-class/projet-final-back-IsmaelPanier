const { MongoClient } = require('mongodb');

async function fixRestaurantOwner() {
  console.log('🔧 Correction de l\'ownerId du restaurant...');
  
  const uri = 'mongodb://localhost:27017/fooddelivery';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connexion MongoDB réussie');
    
    const db = client.db('fooddelivery');
    const usersCollection = db.collection('users');
    const restaurantsCollection = db.collection('restaurants');
    
    // Récupérer l'utilisateur restaurant
    const restaurantUser = await usersCollection.findOne({ email: 'restaurant@test.com' });
    if (!restaurantUser) {
      console.log('❌ Utilisateur restaurant non trouvé');
      return;
    }
    
    console.log('👤 Utilisateur restaurant trouvé:', restaurantUser._id);
    
    // Vérifier s'il y a déjà un restaurant pour cet utilisateur
    const existingRestaurant = await restaurantsCollection.findOne({ 
      ownerId: restaurantUser._id 
    });
    
    if (existingRestaurant) {
      console.log('✅ Restaurant déjà lié à l\'utilisateur:', existingRestaurant.name);
    } else {
      console.log('🔧 Création d\'un restaurant pour l\'utilisateur...');
      
      // Créer un nouveau restaurant pour cet utilisateur
      const newRestaurant = {
        name: 'Mon Restaurant',
        description: 'Restaurant créé automatiquement',
        cuisine: 'Française',
        address: {
          street: 'Adresse à compléter',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        phone: 'Téléphone à compléter',
        email: restaurantUser.email,
        priceRange: 'Moyen',
        rating: 4.0,
        deliveryTime: 30,
        minOrderAmount: 15,
        isOpen: true,
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
        paymentMethods: ['Carte', 'Espèces'],
        ownerId: restaurantUser._id
      };
      
      const result = await restaurantsCollection.insertOne(newRestaurant);
      console.log('✅ Restaurant créé avec ID:', result.insertedId);
    }
    
    // Lister tous les restaurants pour vérification
    const allRestaurants = await restaurantsCollection.find({}).toArray();
    console.log('\n🏪 Tous les restaurants:');
    allRestaurants.forEach(r => {
      console.log(`- ${r.name} | ownerId: ${r.ownerId}`);
    });
    
    await client.close();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

fixRestaurantOwner(); 