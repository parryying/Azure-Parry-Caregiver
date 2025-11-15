const { app } = require('@azure/functions');
const { getCosmosClient } = require('./shared/cosmosClient');

/**
 * GET /api/settings - Get all caregiver settings
 * PUT /api/settings/{id} - Update caregiver settings
 */

// Get All Settings
app.http('getSettings', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'settings',
  handler: async (request, context) => {
    context.log('Get settings request');
    
    try {
      const { settingsContainer } = getCosmosClient();
      
      const { resources } = await settingsContainer.items
        .query('SELECT * FROM c')
        .fetchAll();
      
      // If no settings exist, return defaults
      if (resources.length === 0) {
        const defaults = [
          {
            id: 'amy',
            nameEn: 'Amy',
            nameCn: '小谷',
            hourlyRate: 22.50,
            assignedHours: 80,
            currentMonth: new Date().toISOString().slice(0, 7)
          },
          {
            id: 'linda',
            nameEn: 'Linda',
            nameCn: '张洁',
            hourlyRate: 22.50,
            assignedHours: 80,
            currentMonth: new Date().toISOString().slice(0, 7)
          }
        ];
        
        // Create default settings
        for (const setting of defaults) {
          await settingsContainer.items.create(setting);
        }
        
        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(defaults)
        };
      }
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resources)
      };
      
    } catch (error) {
      context.error('Get settings error:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Failed to fetch settings' })
      };
    }
  }
});

// Update Settings
app.http('updateSettings', {
  methods: ['PUT', 'PATCH'],
  authLevel: 'anonymous',
  route: 'settings/{id}',
  handler: async (request, context) => {
    const caregiverId = request.params.id;
    context.log('Update settings for:', caregiverId);
    
    try {
      const body = await request.json();
      const { settingsContainer } = getCosmosClient();
      
      // Try to fetch existing settings
      let settings;
      try {
        const { resource } = await settingsContainer.item(caregiverId, caregiverId).read();
        settings = resource;
      } catch (error) {
        // Settings don't exist, create new
        settings = {
          id: caregiverId,
          nameEn: caregiverId === 'amy' ? 'Amy' : 'Linda',
          nameCn: caregiverId === 'amy' ? '小谷' : '张洁',
          hourlyRate: 22.50,
          assignedHours: 80,
          currentMonth: new Date().toISOString().slice(0, 7)
        };
      }
      
      // Update fields
      if (body.hourlyRate !== undefined) settings.hourlyRate = body.hourlyRate;
      if (body.assignedHours !== undefined) settings.assignedHours = body.assignedHours;
      if (body.currentMonth) settings.currentMonth = body.currentMonth;
      
      settings.updatedAt = new Date().toISOString();
      
      // Upsert (create or replace)
      const { resource: updated } = await settingsContainer.items.upsert(settings);
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      };
      
    } catch (error) {
      context.error('Update settings error:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Failed to update settings' })
      };
    }
  }
});
