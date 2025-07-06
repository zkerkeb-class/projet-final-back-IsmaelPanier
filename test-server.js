const API_BASE_URL = 'http://localhost:5000';

async function testServer() {
  console.log('🔍 Test de connexion au serveur...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    console.log('📊 Status:', response.status);
    
    if (response.ok) {
      const data = await response.text();
      console.log('✅ Serveur répond:', data);
    } else {
      console.log('❌ Serveur répond mais avec erreur');
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

testServer(); 