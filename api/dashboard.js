const { app } = require('@azure/functions');
const { getCosmosClient } = require('../shared/cosmosClient');

/**
 * GET /api/dashboard
 * Returns complete dashboard data for both caregivers
 */
app.http('dashboard', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'dashboard',
  handler: async (request, context) => {
    context.log('Dashboard request received');
    
    try {
      const { shiftsContainer, settingsContainer } = getCosmosClient();
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      
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
        amy: buildCaregiverData('amy', allShifts, allSettings),
        linda: buildCaregiverData('linda', allShifts, allSettings)
      };
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caregivers, currentMonth })
      };
      
    } catch (error) {
      context.error('Dashboard error:', error);
      return {
        status: 500,
        body: JSON.stringify({ error: 'Failed to fetch dashboard data' })
      };
    }
  }
});

/**
 * Build caregiver data object
 */
function buildCaregiverData(caregiverId, allShifts, allSettings) {
  const settings = allSettings.find(s => s.id === caregiverId) || {
    id: caregiverId,
    nameEn: caregiverId === 'amy' ? 'Amy' : 'Linda',
    nameCn: caregiverId === 'amy' ? '小谷' : '张洁',
    hourlyRate: 22.50,
    assignedHours: 80
  };
  
  const caregiverShifts = allShifts.filter(s => s.caregiverId === caregiverId);
  const currentShift = caregiverShifts.find(s => s.isActive) || null;
  const completedShifts = caregiverShifts.filter(s => !s.isActive);
  
  // Calculate monthly stats
  const workedHours = completedShifts.reduce((sum, s) => sum + s.totalHours, 0);
  const monthlyStats = {
    assigned: settings.assignedHours,
    worked: Math.round(workedHours * 100) / 100,
    remaining: Math.round((settings.assignedHours - workedHours) * 100) / 100
  };
  
  return {
    id: caregiverId,
    nameEn: settings.nameEn,
    nameCn: settings.nameCn,
    hourlyRate: settings.hourlyRate,
    assignedHours: settings.assignedHours,
    currentShift,
    shifts: completedShifts,
    monthlyStats
  };
}
