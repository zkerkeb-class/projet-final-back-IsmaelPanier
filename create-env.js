const fs = require('fs');
const path = require('path');

const envContent = `MONGO_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=votre_secret_jwt_tres_securise_pour_le_developpement
PORT=5000
MONGO_DB_NAME=fooddelivery
`;

const envPath = path.join(__dirname, 'server', '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env créé avec succès dans server/.env');
  console.log('📋 Contenu:');
  console.log(envContent);
} catch (error) {
  console.error('❌ Erreur lors de la création du fichier .env:', error.message);
} 