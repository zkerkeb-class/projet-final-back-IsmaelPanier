const { MongoClient } = require('mongodb');

async function testMongo() {
  console.log('🔍 Test de connexion MongoDB...');
  
  const uri = 'mongodb://localhost:27017/fooddelivery';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connexion MongoDB réussie');
    
    const db = client.db('fooddelivery');
    const collections = await db.listCollections().toArray();
    console.log('📋 Collections trouvées:', collections.map(c => c.name));
    
    await client.close();
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    console.log('💡 Assurez-vous que MongoDB est démarré: mongod');
  }
}

testMongo(); 