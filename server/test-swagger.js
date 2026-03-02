#!/usr/bin/env node

/**
 * Simple test script to verify Swagger documentation setup
 */

const http = require("http");

// Test if server is running and Swagger docs are accessible
function testSwaggerEndpoint() {
  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/api-docs",
    method: "GET",
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);

    if (res.statusCode === 200) {
      console.log("✅ Swagger documentation is accessible at http://localhost:3000/api-docs");
    } else {
      console.log("❌ Failed to access Swagger documentation");
    }
  });

  req.on("error", (e) => {
    console.error(`❌ Error connecting to server: ${e.message}`);
    console.log("Make sure the server is running with: npm run dev");
  });

  req.end();
}

// Test API endpoints
function testApiEndpoint() {
  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/api/v1",
    method: "GET",
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 404) {
      console.log("✅ API base route is properly configured (404 expected for GET /)");
    } else {
      console.log(`📋 API response status: ${res.statusCode}`);
    }
  });

  req.on("error", (e) => {
    console.error(`❌ Error connecting to API: ${e.message}`);
  });

  req.end();
}

console.log("🧪 Testing Swagger Documentation Setup...\n");

// Wait a moment for server to be ready, then test
setTimeout(() => {
  testSwaggerEndpoint();
  testApiEndpoint();
}, 1000);

console.log("📚 To access the full API documentation:");
console.log("   🌐 Swagger UI: http://localhost:3000/api-docs");
console.log("   📄 README: ./API_DOCUMENTATION.md\n");
console.log("🚀 Start the server with: npm run dev");
