/**
 * API Client for Caregiver App
 * Handles all backend communication
 */

const API_BASE = '/api'; // Azure Static Web Apps automatically routes /api to Functions

const ApiClient = {
  /**
   * Fetch dashboard data for both caregivers
   */
  async getDashboard() {
    const response = await fetch(`${API_BASE}/dashboard`);
    if (!response.ok) throw new Error('Failed to fetch dashboard');
    return await response.json();
  },

  /**
   * Clock in a caregiver
   */
  async clockIn(caregiverId) {
    const clockInTime = new Date().toISOString();
    const response = await fetch(`${API_BASE}/shifts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caregiverId, clockInTime })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to clock in');
    }
    
    return await response.json();
  },

  /**
   * Clock out a caregiver
   */
  async clockOut(shiftId) {
    const clockOutTime = new Date().toISOString();
    const month = clockOutTime.slice(0, 7); // YYYY-MM format
    const response = await fetch(`${API_BASE}/shifts/${shiftId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clockOutTime, month })
    });
    
    if (!response.ok) throw new Error('Failed to clock out');
    return await response.json();
  },

  /**
   * Update a shift (edit times)
   */
  async updateShift(shiftId, updates) {
    const response = await fetch(`${API_BASE}/shifts/${shiftId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) throw new Error('Failed to update shift');
    return await response.json();
  },

  /**
   * Delete a shift
   */
  async deleteShift(shiftId) {
    const response = await fetch(`${API_BASE}/shifts/${shiftId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete shift');
  },

  /**
   * Update caregiver settings (hourly rate, assigned hours)
   */
  async updateSettings(caregiverId, settings) {
    const response = await fetch(`${API_BASE}/settings/${caregiverId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) throw new Error('Failed to update settings');
    return await response.json();
  }
};
