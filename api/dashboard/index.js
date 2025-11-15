const { getCosmosClient } = require('../shared/cosmosClient');

module.exports = async function (context, req) {
  context.log('Dashboard request received');
  
  try {
    const { shiftsContainer, settingsContainer } = getCosmosClient();
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Fetch all shifts for current month
    const shiftsQuery = {
      query: 'SELECT * FROM c WHERE c.month = @month ORDER BY c.clockInTime DESC',
      parameters: [{ name: '@month', value: currentMonth }]
    };
    
    const { resources: allShifts } = await shiftsContainer.items
      .query(shiftsQuery)
      .fetchAll();
    
    // Fetch settings for both caregivers
    const { resources: allSettings } = await settingsContainer.items
      .query('SELECT * FROM c')
      .fetchAll();
    
    // Organize data by caregiver
    const caregivers = {
      amy: {
        shifts: allShifts.filter(s => s.caregiverId === 'amy'),
        settings: allSettings.find(s => s.id === 'amy') || {
          id: 'amy',
          hourlyRate: 22.50,
          assignedHours: 80
        },
        currentShift: allShifts.find(s => s.caregiverId === 'amy' && s.isActive) || null
      },
      linda: {
        shifts: allShifts.filter(s => s.caregiverId === 'linda'),
        settings: allSettings.find(s => s.id === 'linda') || {
          id: 'linda',
          hourlyRate: 22.50,
          assignedHours: 80
        },
        currentShift: allShifts.find(s => s.caregiverId === 'linda' && s.isActive) || null
      }
    };
    
    context.res = {
      status: 200,
      body: {
        caregivers,
        currentMonth
      }
    };
  } catch (error) {
    context.log.error('Dashboard error:', error);
    context.res = {
      status: 500,
      body: { error: error.message }
    };
  }
};
