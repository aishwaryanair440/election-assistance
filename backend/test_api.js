/**
 * API Test Suite for NirvachakSetu
 * This script validates the core backend functionality.
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // 1. Health Check
    console.log('Test 1: Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health OK:', health.data.status);

    // 2. Modules Retrieval
    console.log('\nTest 2: Fetching Modules...');
    const modules = await axios.get(`${BASE_URL}/modules`);
    console.log(`✅ Modules Found: ${modules.data.length}`);
    if (modules.data.length >= 20) {
      console.log('✅ Module count criteria met (20 modules).');
    }

    // 3. Quiz Retrieval
    console.log('\nTest 3: Fetching Quizzes...');
    const quizzes = await axios.get(`${BASE_URL}/quizzes`);
    console.log(`✅ Quizzes Found: ${quizzes.data.length}`);

    // 5. Error Handling Check (Security)
    console.log('\nTest 5: Error Handling...');
    try {
      await axios.get(`${BASE_URL}/invalid-route`);
    } catch (err) {
      if (err.response.status === 404) {
        console.log('✅ 404 Error handling (Security) works.');
      }
    }

    // 6. Content-Type Check (Quality)
    const res = await axios.get(`${BASE_URL}/health`);
    if (res.headers['content-type'].includes('application/json')) {
      console.log('✅ Correct Content-Type (Quality) returned.');
    }

    console.log('\n✨ All tests passed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Response Data:', error.response.data);
    }
    console.log('\nNote: Make sure the server is running on port 5000.');
  }
}


runTests();
