/**
 * Caregiver Time Tracking App
 * Phase 2: Cloud backend with Cosmos DB
 * Per DESIGN.md Section 5.2 and 6.2
 */

const CaregiverApp = {
  data: {
    caregivers: {
      amy: {
        id: 'amy',
        nameEn: 'Amy',
        nameCn: '小谷',
        hourlyRate: 22.50,
        assignedHours: 80,
        currentShift: null,
        shifts: []
      },
      linda: {
        id: 'linda',
        nameEn: 'Linda',
        nameCn: '张洁',
        hourlyRate: 22.50,
        assignedHours: 80,
        currentShift: null,
        shifts: []
      }
    },
    currentMonth: new Date().toISOString().slice(0, 7) // YYYY-MM
  },

  ui: {
    updateTimer: null
  },

  /**
   * Initialize the application
   */
  async init() {
    await this.loadFromCloud();
    this.setupEventListeners();
    this.startTimerUpdates();
    this.render();
    this.updateLastSync();
  },

  /**
   * Load data from cloud API
   */
  async loadFromCloud() {
    try {
      const dashboard = await ApiClient.getDashboard();
      
      // Update caregivers with cloud data
      ['amy', 'linda'].forEach(id => {
        const cloudData = dashboard.caregivers[id];
        if (cloudData) {
          this.data.caregivers[id] = {
            ...this.data.caregivers[id],
            hourlyRate: cloudData.settings.hourlyRate,
            assignedHours: cloudData.settings.assignedHours,
            currentShift: cloudData.currentShift,
            shifts: cloudData.shifts
          };
        }
      });
      
      this.data.currentMonth = dashboard.currentMonth;
      this.updateLastSync();
    } catch (e) {
      console.error('Failed to load data from cloud:', e);
      this.showToast('Failed to load data from cloud', 'error');
    }
  },

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Clock in/out buttons
    ['amy', 'linda'].forEach(id => {
      const clockInBtn = document.getElementById(`${id}-clock-in`);
      const clockOutBtn = document.getElementById(`${id}-clock-out`);
      
      if (clockInBtn) {
        clockInBtn.addEventListener('click', () => this.clockIn(id));
      }
      if (clockOutBtn) {
        clockOutBtn.addEventListener('click', () => this.clockOut(id));
      }

      // Hourly rate changes
      const rateInput = document.getElementById(`${id}-rate`);
      if (rateInput) {
        rateInput.addEventListener('change', async (e) => {
          const newRate = parseFloat(e.target.value) || 0;
          try {
            await ApiClient.updateSettings(id, { hourlyRate: newRate });
            this.data.caregivers[id].hourlyRate = newRate;
            this.updateLastSync();
          } catch (e) {
            console.error('Failed to update rate:', e);
            this.showToast('Failed to update rate', 'error');
          }
        });
      }

      // Assigned hours changes
      const assignedInput = document.getElementById(`${id}-assigned`);
      if (assignedInput) {
        assignedInput.addEventListener('change', async (e) => {
          const newHours = parseInt(e.target.value) || 0;
          try {
            await ApiClient.updateSettings(id, { assignedHours: newHours });
            this.data.caregivers[id].assignedHours = newHours;
            this.updateMonthlyStats(id);
            this.updateLastSync();
          } catch (e) {
            console.error('Failed to update hours:', e);
            this.showToast('Failed to update hours', 'error');
          }
        });
      }
    });
  },

  /**
   * Clock in a caregiver
   */
  async clockIn(caregiverId) {
    const caregiver = this.data.caregivers[caregiverId];
    
    if (caregiver.currentShift) {
      this.showToast('Already clocked in!', 'error');
      return;
    }

    try {
      const shift = await ApiClient.clockIn(caregiverId);
      caregiver.currentShift = shift;
      caregiver.shifts.push(shift);
      
      this.renderStatus(caregiverId);
      this.updateLastSync();
      this.showToast(`${caregiver.nameEn} clocked in`, 'success');
    } catch (e) {
      console.error('Clock in failed:', e);
      this.showToast('Failed to clock in', 'error');
    }
  },

  /**
   * Clock out a caregiver
   */
  async clockOut(caregiverId) {
    const caregiver = this.data.caregivers[caregiverId];
    
    if (!caregiver.currentShift) {
      this.showToast('Not clocked in!', 'error');
      return;
    }

    try {
      const shift = await ApiClient.clockOut(caregiverId);
      
      // Update local shifts array
      const index = caregiver.shifts.findIndex(s => s.id === shift.id);
      if (index >= 0) {
        caregiver.shifts[index] = shift;
      }
      
      caregiver.currentShift = null;
      
      this.renderStatus(caregiverId);
      this.renderShifts(caregiverId);
      this.updateMonthlyStats(caregiverId);
      this.updateLastSync();
      this.showToast(`${caregiver.nameEn} clocked out`, 'success');
    } catch (e) {
      console.error('Clock out failed:', e);
      this.showToast('Failed to clock out', 'error');
    }
  },

  /**
   * Calculate duration from clock in time to now
   */
  calculateDuration(clockInTime) {
    const start = new Date(clockInTime);
    const now = new Date();
    const diffMs = now - start;
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return { hours, minutes, seconds, text: `${hours}h ${minutes}m ${seconds}s` };
  },

  /**
   * Format time in 12-hour PST format
   */
  formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Los_Angeles'
    });
  },

  /**
   * Format date
   */
  formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'America/Los_Angeles'
    });
  },

  /**
   * Render status section for a caregiver
   */
  renderStatus(caregiverId) {
    const caregiver = this.data.caregivers[caregiverId];
    const statusDiv = document.getElementById(`${caregiverId}-status`);
    
    if (!statusDiv) return;

    if (caregiver.currentShift) {
      const duration = this.calculateDuration(caregiver.currentShift.clockInTime);
      statusDiv.innerHTML = `
        <div class="timer-display">
          <div class="timer-label">Working / 工作中</div>
          <div class="timer-value" id="${caregiverId}-timer">${duration.text}</div>
          <div class="timer-started">Since ${this.formatTime(caregiver.currentShift.clockInTime)}</div>
        </div>
        <button class="btn-clock-out" id="${caregiverId}-clock-out">CLOCK OUT<br>打卡下班</button>
      `;
      
      // Re-attach event listener for clock out
      document.getElementById(`${caregiverId}-clock-out`).addEventListener('click', () => this.clockOut(caregiverId));
    } else {
      statusDiv.innerHTML = `
        <button class="btn-clock-in" id="${caregiverId}-clock-in">CLOCK IN<br>打卡上班</button>
      `;
      
      // Re-attach event listener for clock in
      document.getElementById(`${caregiverId}-clock-in`).addEventListener('click', () => this.clockIn(caregiverId));
    }
  },

  /**
   * Render shifts list for a caregiver
   */
  renderShifts(caregiverId) {
    const caregiver = this.data.caregivers[caregiverId];
    const shiftsDiv = document.getElementById(`${caregiverId}-shifts`);
    
    if (!shiftsDiv) return;

    const completedShifts = caregiver.shifts
      .filter(s => !s.isActive && s.month === this.data.currentMonth)
      .sort((a, b) => new Date(b.clockInTime) - new Date(a.clockInTime));

    if (completedShifts.length === 0) {
      shiftsDiv.innerHTML = '<p class="no-shifts">No shifts recorded yet / 暂无记录</p>';
      return;
    }

    const recentShifts = completedShifts.slice(0, 3);
    shiftsDiv.innerHTML = recentShifts.map(shift => {
      const payment = Math.round(shift.totalHours * caregiver.hourlyRate);
      return `
      <div class="shift-item" data-shift-id="${shift.id}">
        <div class="shift-main">
          <div class="shift-date">${this.formatDate(shift.clockInTime)}</div>
          <div class="shift-details">
            <span class="shift-hours">${shift.totalHours}h</span>
            <span class="shift-payment">$${payment}</span>
          </div>
        </div>
        <div class="shift-actions">
          <button class="btn-edit" onclick="CaregiverApp.editShift('${shift.id}', '${caregiverId}')" title="Edit">✏️</button>
          <button class="btn-delete" onclick="CaregiverApp.deleteShift('${shift.id}', '${caregiverId}')" title="Delete">🗑️</button>
        </div>
      </div>
      `;
    }).join('');

    // Show/hide "Show All" button
    const showAllBtn = document.getElementById(`${caregiverId}-show-all`);
    if (showAllBtn) {
      showAllBtn.style.display = completedShifts.length > 3 ? 'block' : 'none';
    }
  },

  /**
   * Update monthly statistics
   */
  updateMonthlyStats(caregiverId) {
    const caregiver = this.data.caregivers[caregiverId];
    
    const workedHours = caregiver.shifts
      .filter(s => !s.isActive && s.month === this.data.currentMonth)
      .reduce((total, shift) => total + shift.totalHours, 0);
    
    const worked = Math.round(workedHours * 100) / 100;
    const remaining = Math.round((caregiver.assignedHours - worked) * 100) / 100;

    document.getElementById(`${caregiverId}-worked`).textContent = worked;
    document.getElementById(`${caregiverId}-remaining`).textContent = remaining;
  },

  /**
   * Edit a shift (placeholder for Phase 3)
   */
  editShift(shiftId, caregiverId) {
    this.showToast('Edit functionality coming in Phase 3', 'error');
  },

  /**
   * Delete a shift
   */
  async deleteShift(shiftId, caregiverId) {
    if (!confirm('Delete this shift? / 删除此班次？')) return;

    try {
      await ApiClient.deleteShift(shiftId);
      
      const caregiver = this.data.caregivers[caregiverId];
      caregiver.shifts = caregiver.shifts.filter(s => s.id !== shiftId);
      
      this.renderShifts(caregiverId);
      this.updateMonthlyStats(caregiverId);
      this.updateLastSync();
      this.showToast('Shift deleted', 'success');
    } catch (e) {
      console.error('Delete failed:', e);
      this.showToast('Failed to delete shift', 'error');
    }
  },

  /**
   * Start timer updates (every 1 second)
   */
  startTimerUpdates() {
    if (this.ui.updateTimer) clearInterval(this.ui.updateTimer);
    
    this.ui.updateTimer = setInterval(() => {
      ['amy', 'linda'].forEach(id => {
        const caregiver = this.data.caregivers[id];
        if (caregiver.currentShift) {
          const timerEl = document.getElementById(`${id}-timer`);
          if (timerEl) {
            const duration = this.calculateDuration(caregiver.currentShift.clockInTime);
            timerEl.textContent = duration.text;
          }
        }
      });
    }, 1000);
  },

  /**
   * Update last sync timestamp
   */
  updateLastSync() {
    const syncEl = document.getElementById('last-sync');
    if (syncEl) {
      const now = new Date();
      syncEl.textContent = now.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'America/Los_Angeles'
      });
    }
  },

  /**
   * Show toast notification
   */
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  },

  /**
   * Render all UI elements
   */
  render() {
    ['amy', 'linda'].forEach(id => {
      this.renderStatus(id);
      this.renderShifts(id);
      this.updateMonthlyStats(id);
    });
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CaregiverApp.init());
} else {
  CaregiverApp.init();
}
