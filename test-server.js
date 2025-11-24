// Test script to check if server is running and test auth endpoints
import http from 'http';

const testEndpoint = (method, path, data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
};

const runTests = async () => {
  console.log('Testing server endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await testEndpoint('GET', '/api/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, health.data);
    console.log('');

    // Test 2: Register
    console.log('2. Testing register endpoint...');
    const register = await testEndpoint('POST', '/api/register', {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log(`   Status: ${register.status}`);
    console.log(`   Response:`, register.data);
    console.log('');

    // Test 3: Login
    console.log('3. Testing login endpoint...');
    const login = await testEndpoint('POST', '/api/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log(`   Status: ${login.status}`);
    console.log(`   Response:`, login.data);
    console.log('');

  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nLe serveur ne semble pas être démarré sur le port 3000.');
    console.log('Veuillez démarrer le serveur avec: cd server && node app.js');
  }
};

runTests();
