const { getCosmosClient } = require('../shared/cosmosClient');

module.exports = async function (context, req) {
  const { shiftsContainer } = getCosmosClient();
  const method = req.method;
  const shiftId = context.bindingData.id;
  
  try {
    if (method === 'POST') {
      // Clock in
      const { caregiverId } = req.body;
      
      // Check for existing active shift
      const checkQuery = {
        query: 'SELECT * FROM c WHERE c.caregiverId = @caregiverId AND c.isActive = true',
        parameters: [{ name: '@caregiverId', value: caregiverId }]
      };
      const { resources: activeShifts } = await shiftsContainer.items.query(checkQuery).fetchAll();
      
      if (activeShifts.length > 0) {
        context.res = {
          status: 409,
          body: { error: 'Caregiver already has an active shift' }
        };
        return;
      }
      
      const now = new Date();
      const shift = {
        id: `shift_${Date.now()}`,
        caregiverId,
        clockInTime: now.toISOString(),
        clockOutTime: null,
        totalHours: 0,
        isActive: true,
        month: now.toISOString().slice(0, 7)
      };
      
      const { resource } = await shiftsContainer.items.create(shift);
      context.res = {
        status: 201,
        body: resource
      };
      
    } else if (method === 'PUT') {
      // Clock out or update shift
      const updates = req.body;
      
      // For updates, month might not be in updates, so try to find the shift
      let shift;
      if (updates.month) {
        const { resource } = await shiftsContainer.item(shiftId, updates.month).read();
        shift = resource;
      } else {
        // Search for shift if month not provided
        const query = {
          query: 'SELECT * FROM c WHERE c.id = @shiftId',
          parameters: [{ name: '@shiftId', value: shiftId }]
        };
        const { resources } = await shiftsContainer.items.query(query).fetchAll();
        shift = resources[0];
      }
      
      if (!shift) {
        context.res = {
          status: 404,
          body: { error: 'Shift not found' }
        };
        return;
      }
      
      // Recalculate hours if times are being updated
      if (updates.clockInTime || updates.clockOutTime) {
        const clockIn = new Date(updates.clockInTime || shift.clockInTime);
        const clockOut = new Date(updates.clockOutTime || shift.clockOutTime);
        
        if (clockOut && clockIn) {
          const diffMs = clockOut - clockIn;
          updates.totalHours = Math.round((diffMs / 3600000) * 10) / 10;
          updates.isActive = false;
        }
      }
      // If just clocking out, calculate hours
      else if (updates.clockOutTime && !shift.clockOutTime) {
        const clockIn = new Date(shift.clockInTime);
        const clockOut = new Date(updates.clockOutTime);
        const diffMs = clockOut - clockIn;
        updates.totalHours = Math.round((diffMs / 3600000) * 100) / 100;
        updates.isActive = false;
      }
      
      const updated = { ...shift, ...updates };
      const { resource } = await shiftsContainer.item(shiftId, shift.month).replace(updated);
      
      context.res = {
        status: 200,
        body: resource
      };
      
    } else if (method === 'DELETE') {
      const month = req.body.month;
      await shiftsContainer.item(shiftId, month).delete();
      
      context.res = {
        status: 204
      };
    }
  } catch (error) {
    context.log.error('Shifts error:', error);
    context.res = {
      status: 500,
      body: { error: error.message }
    };
  }
};
