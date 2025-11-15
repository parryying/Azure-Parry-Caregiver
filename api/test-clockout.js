// Load environment variables from local.settings.json
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, 'local.settings.json');
if (fs.existsSync(settingsPath)) {
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  Object.assign(process.env, settings.Values);
}

// Import the function
const clockOutHandler = require('./shifts/index');

// Get the shift ID from command line or use a default
const shiftId = process.argv[2] || 'shift_1763243968562';

// Mock context
const mockContext = function(...args) {
  console.log('LOG:', ...args);
};
mockContext.log = mockContext;
mockContext.log.error = function(...args) {
  console.error('ERROR:', ...args);
};
mockContext.bindingData = { id: shiftId };

// Mock request for clock out (PUT with shift ID)
const mockRequest = {
  method: 'PUT',
  body: {
    month: '2025-11',
    clockOutTime: new Date().toISOString()
  }
};

// Run the function
console.log(`=== TESTING CLOCK OUT FOR SHIFT ${shiftId} ===\n`);

clockOutHandler(mockContext, mockRequest)
  .then(() => {
    console.log('\n=== RESPONSE ===');
    console.log(JSON.stringify(mockContext.res, null, 2));
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
