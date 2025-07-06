const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function checkAndCreateUsers() {
  console.log('🔍 Vérification et création des utilisateurs de test...');
  
  const uri = 'mongodb://localhost:27017/fooddelivery';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connexion MongoDB réussie');
    
    const db = client.db('fooddelivery');
    const usersCollection = db.collection('users');
    
    // Vérifier si l'utilisateur restaurant existe
    const existingUser = await usersCollection.findOne({ email: 'restaurant@test.com' });
    
    if (existingUser) {
      console.log('✅ Utilisateur restaurant existe déjà:', existingUser.email);
    } else {
      console.log('📝 Création de l\'utilisateur restaurant...');
      
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const newUser = {
        email: 'restaurant@test.com',
        password: hashedPassword,
        firstName: 'Restaurant',
        lastName: 'Test',
        role: 'restaurant',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await usersCollection.insertOne(newUser);
      console.log('✅ Utilisateur restaurant créé avec ID:', result.insertedId);
    }
    
    // Lister tous les utilisateurs
    const allUsers = await usersCollection.find({}).toArray();
    console.log('📋 Tous les utilisateurs:', allUsers.map(u => ({ 
      email: u.email, 
      role: u.role, 
      id: u._id 
    })));
    
    await client.close();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkAndCreateUsers(); 