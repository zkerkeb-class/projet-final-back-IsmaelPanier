const API_BASE_URL = 'http://localhost:5000';

async function debugDishCreation() {
  console.log('🔍 Débogage de la création de plat');
  console.log('=' .repeat(50));

  try {
    // 1. Se connecter
    console.log('1️⃣ Connexion...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'restaurant@test.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Échec de la connexion');
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Connexion réussie');

    // 2. Récupérer le restaurant
    console.log('\n2️⃣ Récupération du restaurant...');
    const restaurantResponse = await fetch(`${API_BASE_URL}/restaurants/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!restaurantResponse.ok) {
      throw new Error('Impossible de récupérer le restaurant');
    }

    const restaurantData = await restaurantResponse.json();
    console.log('✅ Restaurant:', restaurantData.data._id);

    // 3. Tester la création avec des données minimales
    console.log('\n3️⃣ Test création plat minimal...');
    const minimalDish = {
      name: 'Test Plat',
      basePrice: 10.00
    };

    console.log('📦 Données envoyées:', minimalDish);

    const createResponse = await fetch(`${API_BASE_URL}/dishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(minimalDish)
    });

    console.log('📊 Status:', createResponse.status);
    console.log('📊 Headers:', Object.fromEntries(createResponse.headers.entries()));

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.log('❌ Erreur:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.log('📋 Erreur JSON:', errorJson);
      } catch (e) {
        console.log('📋 Erreur texte brut:', errorText);
      }
    } else {
      const createdDish = await createResponse.json();
      console.log('✅ Plat créé:', createdDish);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

debugDishCreation(); 