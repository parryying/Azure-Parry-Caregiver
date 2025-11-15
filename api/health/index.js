module.exports = async function (context, req) {
  context.log('Health check requested');
  
  const envVars = {
    COSMOS_ENDPOINT: process.env.COSMOS_ENDPOINT ? 'SET' : 'MISSING',
    COSMOS_KEY: process.env.COSMOS_KEY ? 'SET' : 'MISSING',
    COSMOS_DB_ENDPOINT: process.env.COSMOS_DB_ENDPOINT ? 'SET' : 'MISSING',
    COSMOS_DB_KEY: process.env.COSMOS_DB_KEY ? 'SET' : 'MISSING',
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('COSMOS'))
  };
  
  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: envVars
  };
};
