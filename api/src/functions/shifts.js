const { app } = require('@azure/functions');
const { getCosmosClient } = require('../shared/cosmosClient');

/**
 * POST /api/shifts - Clock in (create new shift)
 * PUT /api/shifts/{id} - Clock out or edit shift
 * DELETE /api/shifts/{id} - Delete shift
 */

// Clock In - Create new shift
app.http('clockIn', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'shifts',
  handler: async (request, context) => {
    context.log('Clock in request');
    
    try {
      const body = await request.json();
      const { caregiverId, clockInTime } = body;
      
      if (!caregiverId || !clockInTime) {
        return {
          status: 400,
          body: JSON.stringify({ error: 'caregiverId and clockInTime required' })
        };
      }
      
      const { shiftsContainer } = getCosmosClient();
      
      // Check if already clocked in
      const activeQuery = {
        query: 'SELECT * FROM c WHERE c.caregiverId = @caregiverId AND c.isActive = true',
        parameters: [{ name: '@caregiverId', value: caregiverId }]
      };
      
      const { resources: activeShifts } = await shiftsContainer.items
        .query(activeQuery)
        .fetchAll();
      
      if (activeShifts.length > 0) {
        return {
          status: 409,
          body: JSON.stringify({ error: 'Already clocked in' })
        };
      }
      
      // Create new shift
      const shift = {
        id: `shift_${Date.now()}_${caregiverId}`,
        caregiverId,
        clockInTime,
        clockOutTime: null,
        totalHours: 0,
        isActive: true,
        month: new Date(clockInTime).toISOString().slice(0, 7),
        createdAt: new Date().toISOString()
      };
      
      const { resource } = await shiftsContainer.items.create(shift);
      
      return {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource)
      };
      
    } catch (error) {
      context.error('Clock in error:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Failed to clock in' })
      };
    }
  }
});

// Clock Out / Edit Shift
app.http('updateShift', {
  methods: ['PUT', 'PATCH'],
  authLevel: 'anonymous',
  route: 'shifts/{id}',
  handler: async (request, context) => {
    const shiftId = request.params.id;
    context.log('Update shift:', shiftId);
    
    try {
      const body = await request.json();
      const { shiftsContainer } = getCosmosClient();
      
      // Fetch existing shift
      const { resource: shift } = await shiftsContainer.item(shiftId, shiftId).read();
      
      if (!shift) {
        return {
          status: 404,
          body: JSON.stringify({ error: 'Shift not found' })
        };
      }
      
      // Update fields
      if (body.clockOutTime) {
        shift.clockOutTime = body.clockOutTime;
        shift.isActive = false;
        
        // Calculate hours
        const clockIn = new Date(shift.clockInTime);
        const clockOut = new Date(body.clockOutTime);
        const diffMs = clockOut - clockIn;
        shift.totalHours = Math.round((diffMs / 3600000) * 100) / 100;
      }
      
      if (body.clockInTime) shift.clockInTime = body.clockInTime;
      if (body.totalHours !== undefined) shift.totalHours = body.totalHours;
      
      shift.updatedAt = new Date().toISOString();
      
      // Replace in Cosmos DB
      const { resource: updated } = await shiftsContainer.item(shiftId, shiftId).replace(shift);
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      };
      
    } catch (error) {
      context.error('Update shift error:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Failed to update shift' })
      };
    }
  }
});

// Delete Shift
app.http('deleteShift', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'shifts/{id}',
  handler: async (request, context) => {
    const shiftId = request.params.id;
    context.log('Delete shift:', shiftId);
    
    try {
      const { shiftsContainer } = getCosmosClient();
      
      await shiftsContainer.item(shiftId, shiftId).delete();
      
      return {
        status: 204,
        body: ''
      };
      
    } catch (error) {
      context.error('Delete shift error:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Failed to delete shift' })
      };
    }
  }
});
