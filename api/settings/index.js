const { getCosmosClient } = require('../shared/cosmosClient');

module.exports = async function (context, req) {
  const { settingsContainer } = getCosmosClient();
  const method = req.method;
  const caregiverId = context.bindingData.id;
  
  try {
    if (method === 'GET') {
      const { resources: allSettings } = await settingsContainer.items
        .query('SELECT * FROM c')
        .fetchAll();
      
      if (allSettings.length === 0) {
        const defaults = [
          { id: 'amy', hourlyRate: 22.50, assignedHours: 80 },
          { id: 'linda', hourlyRate: 22.50, assignedHours: 80 }
        ];
        
        for (const setting of defaults) {
          await settingsContainer.items.create(setting);
        }
        
        context.res = {
          status: 200,
          body: defaults
        };
      } else {
        context.res = {
          status: 200,
          body: allSettings
        };
      }
      
    } else if (method === 'PUT') {
      const updates = req.body;
      
      try {
        const { resource: existing } = await settingsContainer.item(caregiverId, caregiverId).read();
        const updated = { ...existing, ...updates };
        const { resource } = await settingsContainer.item(caregiverId, caregiverId).replace(updated);
        
        context.res = {
          status: 200,
          body: resource
        };
      } catch (error) {
        if (error.code === 404) {
          const newSetting = { id: caregiverId, ...updates };
          const { resource } = await settingsContainer.items.create(newSetting);
          
          context.res = {
            status: 201,
            body: resource
          };
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    context.log.error('Settings error:', error);
    context.res = {
      status: 500,
      body: { error: error.message }
    };
  }
};
