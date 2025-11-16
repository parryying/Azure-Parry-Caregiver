const { CosmosClient } = require('@azure/cosmos');

// Cosmos DB Emulator settings
const endpoint = 'https://localhost:8081';
const key = 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==';

async function setupLocalDatabase() {
  console.log('Setting up local Cosmos DB Emulator database...\n');
  
  // Create client with certificate validation disabled for emulator
  const client = new CosmosClient({
    endpoint,
    key,
    connectionPolicy: {
      requestTimeout: 10000
    },
    agent: new (require('https').Agent)({
      rejectUnauthorized: false // Required for emulator self-signed cert
    })
  });

  try {
    // Create database
    console.log('Creating database: CaregiverDB');
    const { database } = await client.databases.createIfNotExists({
      id: 'CaregiverDB'
    });
    console.log('✅ Database ready\n');

    // Create Shifts container
    console.log('Creating container: Shifts (partition key: /month)');
    const { container: shiftsContainer } = await database.containers.createIfNotExists({
      id: 'Shifts',
      partitionKey: '/month'
    });
    console.log('✅ Shifts container ready\n');

    // Create Settings container
    console.log('Creating container: Settings (partition key: /id)');
    const { container: settingsContainer } = await database.containers.createIfNotExists({
      id: 'Settings',
      partitionKey: '/id'
    });
    console.log('✅ Settings container ready\n');

    // Add default settings
    console.log('Adding default settings for caregivers...');
    
    const defaultSettings = [
      {
        id: 'amy',
        caregiverId: 'amy',
        hourlyRate: 22.50,
        assignedHours: 80
      },
      {
        id: 'linda',
        caregiverId: 'linda',
        hourlyRate: 22.50,
        assignedHours: 80
      }
    ];

    for (const setting of defaultSettings) {
      await settingsContainer.items.upsert(setting);
      console.log(`  ✅ ${setting.id} settings created`);
    }

    console.log('\n🎉 Local development environment is ready!');
    console.log('\nNext steps:');
    console.log('1. Start Azure Functions: func start (or full path if needed)');
    console.log('2. Access Cosmos DB Explorer: https://localhost:8081/_explorer/index.html');
    console.log('3. Run tests: node test.js');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure Cosmos DB Emulator is running');
    console.error('2. Check if port 8081 is available');
    console.error('3. Accept the emulator self-signed certificate if prompted');
    process.exit(1);
  }
}

setupLocalDatabase();
