// Load environment variables from local.settings.json
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, 'local.settings.json');
if (fs.existsSync(settingsPath)) {
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  Object.assign(process.env, settings.Values);
}

// Import the function
const deleteShiftHandler = require('./shifts/index');

// Get the shift ID and month from command line
const shiftId = process.argv[2];
const month = process.argv[3] || '2025-11';

if (!shiftId) {
  console.error('Usage: node test-delete.js <shiftId> [month]');
  process.exit(1);
}

// Mock context
const mockContext = function(...args) {
  console.log('LOG:', ...args);
};
mockContext.log = mockContext;
mockContext.log.error = function(...args) {
  console.error('ERROR:', ...args);
};
mockContext.bindingData = { id: shiftId };

// Mock request for delete
const mockRequest = {
  method: 'DELETE',
  body: {
    month: month
  }
};

// Run the function
console.log(`=== TESTING DELETE SHIFT ${shiftId} (month: ${month}) ===\n`);

deleteShiftHandler(mockContext, mockRequest)
  .then(() => {
    console.log('\n=== RESPONSE ===');
    console.log(JSON.stringify(mockContext.res, null, 2));
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
