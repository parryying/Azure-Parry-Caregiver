/**
 * Cosmos DB Client Singleton
 * Manages connection to Azure Cosmos DB
 */

const { CosmosClient } = require('@azure/cosmos');

// Polyfill for crypto in Azure Functions environment
if (typeof global.crypto === 'undefined') {
  global.crypto = require('crypto').webcrypto;
}

let client = null;
let database = null;
let shiftsContainer = null;
let settingsContainer = null;

/**
 * Initialize Cosmos DB connection
 */
function getCosmosClient() {
  if (!client) {
    const endpoint = process.env.COSMOS_ENDPOINT || process.env.COSMOS_DB_ENDPOINT;
    const key = process.env.COSMOS_KEY || process.env.COSMOS_DB_KEY;
    
    console.log('Endpoint:', endpoint ? 'Found' : 'MISSING');
    console.log('Key:', key ? 'Found' : 'MISSING');
    
    if (!endpoint || !key) {
      throw new Error(`Cosmos DB credentials not configured. ENDPOINT: ${endpoint ? 'set' : 'missing'}, KEY: ${key ? 'set' : 'missing'}`);
    }
    
    // Check if using local emulator
    const isLocalEmulator = endpoint.includes('localhost') || endpoint.includes('127.0.0.1');
    
    const clientOptions = { endpoint, key };
    
    // Disable SSL verification for local emulator
    if (isLocalEmulator) {
      clientOptions.agent = new (require('https').Agent)({
        rejectUnauthorized: false
      });
    }
    
    client = new CosmosClient(clientOptions);
    database = client.database('CaregiverDB');
    shiftsContainer = database.container('Shifts');
    settingsContainer = database.container('Settings');
  }
  
  return { client, database, shiftsContainer, settingsContainer };
}

module.exports = { getCosmosClient };
