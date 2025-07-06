const { MongoClient } = require('mongodb');

async function listUsersAndRestaurants() {
  console.log('🔍 Listing utilisateurs et restaurants...');
  const uri = 'mongodb://localhost:27017/fooddelivery';
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('fooddelivery');
    const users = await db.collection('users').find({}).toArray();
    const restaurants = await db.collection('restaurants').find({}).toArray();
    console.log('\n👤 Utilisateurs:');
    users.forEach(u => {
      console.log(`- id: ${u._id} | email: ${u.email} | role: ${u.role}`);
    });
    console.log('\n🏪 Restaurants:');
    restaurants.forEach(r => {
      console.log(`- id: ${r._id} | name: ${r.name} | ownerId: ${r.ownerId}`);
    });
    await client.close();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

listUsersAndRestaurants(); 