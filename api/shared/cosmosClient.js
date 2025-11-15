/**
 * Cosmos DB Client Singleton
 * Manages connection to Azure Cosmos DB
 */

const { CosmosClient } = require('@azure/cosmos');

let client = null;
let database = null;
let shiftsContainer = null;
let settingsContainer = null;

/**
 * Initialize Cosmos DB connection
 */
function getCosmosClient() {
  if (!client) {
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;
    
    if (!endpoint || !key) {
      throw new Error('Cosmos DB credentials not configured. Set COSMOS_ENDPOINT and COSMOS_KEY.');
    }
    
    client = new CosmosClient({ endpoint, key });
    database = client.database('CaregiverDB');
    shiftsContainer = database.container('Shifts');
    settingsContainer = database.container('Settings');
  }
  
  return { client, database, shiftsContainer, settingsContainer };
}

module.exports = { getCosmosClient };
