const path = require('path');
const fs = require('fs');

// Load local settings
const settingsPath = path.join(__dirname, 'local.settings.json');
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

// Set environment variables
process.env.COSMOS_ENDPOINT = settings.Values.COSMOS_ENDPOINT;
process.env.COSMOS_KEY = settings.Values.COSMOS_KEY;

const shiftsHandler = require('./shifts/index.js');

// Get shift ID and new times from command line
const shiftId = process.argv[2];
const newClockIn = process.argv[3]; // ISO format like "2025-11-15T08:00:00"
const newClockOut = process.argv[4]; // ISO format like "2025-11-15T16:00:00"

if (!shiftId || !newClockIn || !newClockOut) {
  console.log('Usage: node test-edit.js <shiftId> <clockInTime> <clockOutTime>');
  console.log('Example: node test-edit.js shift_123 "2025-11-15T08:00:00" "2025-11-15T16:00:00"');
  process.exit(1);
}

const mockContext = {
  log: console.log,
  bindingData: {
    id: shiftId
  },
  res: {}
};
mockContext.log.error = console.error;

const mockReq = {
  method: 'PUT',
  body: {
    clockInTime: new Date(newClockIn).toISOString(),
    clockOutTime: new Date(newClockOut).toISOString()
  }
};

console.log(`\nEditing shift ${shiftId}...`);
console.log(`New clock in: ${mockReq.body.clockInTime}`);
console.log(`New clock out: ${mockReq.body.clockOutTime}`);

shiftsHandler(mockContext, mockReq).then(() => {
  console.log('\nResponse:', JSON.stringify(mockContext.res, null, 2));
});
