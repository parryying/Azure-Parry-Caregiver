// Load environment variables from local.settings.json
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, 'local.settings.json');
if (fs.existsSync(settingsPath)) {
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  Object.assign(process.env, settings.Values);
}

// Import the function
const clockInHandler = require('./shifts/index');

// Mock context
const mockContext = function(...args) {
  console.log('LOG:', ...args);
};
mockContext.log = mockContext;
mockContext.log.error = function(...args) {
  console.error('ERROR:', ...args);
};
mockContext.bindingData = {}; // For route parameters

// Get caregiver from command line or default to amy
const caregiverId = process.argv[2] || 'amy';

// Mock request for clock in (POST with caregiverId in body)
const mockRequest = {
  method: 'POST',
  body: {
    caregiverId: caregiverId
  }
};

// Run the function
console.log(`=== TESTING CLOCK IN FOR ${caregiverId.toUpperCase()} ===\n`);

clockInHandler(mockContext, mockRequest)
  .then(() => {
    console.log('\n=== RESPONSE ===');
    console.log(JSON.stringify(mockContext.res, null, 2));
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
