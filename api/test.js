// Quick test of dashboard function
// Load environment variables from local.settings.json
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('./local.settings.json', 'utf8'));
Object.assign(process.env, settings.Values);

const handler = require('./dashboard/index.js');

const mockContext = {
  log: (...args) => console.log('LOG:', ...args),
  res: null
};
mockContext.log.error = (...args) => console.error('ERROR:', ...args);

const mockReq = {
  method: 'GET'
};

handler(mockContext, mockReq)
  .then(() => {
    console.log('\n=== RESPONSE ===');
    console.log(JSON.stringify(mockContext.res, null, 2));
  })
  .catch(err => {
    console.error('\n=== ERROR ===');
    console.error(err);
  });
