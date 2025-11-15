# Caregiver Time Tracking App - Technical Design Document

**Project:** Azure-Parry-Caregiver  
**Version:** 1.0  
**Last Updated:** November 15, 2025  
**Owner:** Parry's Family  
**Related:** REQUIREMENTS.md

---

## 1. System Architecture

### 1.1 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │◄──►│  Static Web App │◄──►│ Azure Functions │
│  (Multi-device) │    │   (Frontend)    │    │    (API)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  GitHub Repo    │    │  Azure Table    │
                       │   (Source)      │    │   Storage       │
                       └─────────────────┘    └─────────────────┘
```

### 1.2 Technology Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Azure Functions (Node.js)
- **Database:** Azure Table Storage
- **Hosting:** Azure Static Web Apps
- **CI/CD:** GitHub Actions
- **Authentication:** None (family use only)

---

## 2. Data Models

### 2.1 Table Storage Schema

**Table: Shifts**
```javascript
{
  partitionKey: "2025-11",        // YYYY-MM format
  rowKey: "shift_uuid",           // Unique shift identifier
  caregiverId: "amy",             // amy | linda
  clockInTime: "2025-11-15T09:00:00-08:00", // ISO 8601 with PST
  clockOutTime: "2025-11-15T17:00:00-08:00", // null if active
  totalHours: 8.0,                // Calculated field
  isActive: false,                // true if currently clocked in
  timestamp: "2025-11-15T09:00:00Z" // Azure auto-timestamp
}
```

**Table: CaregiverSettings**
```javascript
{
  partitionKey: "settings",
  rowKey: "amy",                  // amy | linda
  nameEn: "Amy",
  nameCn: "小谷",
  hourlyRate: 22.50,
  monthlyAssignedHours: 80,
  currentMonth: "2025-11",        // Track which month the assignment is for
  timestamp: "2025-11-15T09:00:00Z"
}
```

### 2.2 Frontend Data Structures

**Caregiver Object:**
```javascript
const caregiver = {
  id: 'amy',
  nameEn: 'Amy',
  nameCn: '小谷',
  hourlyRate: 22.50,
  assignedHours: 80,
  currentShift: null,             // Active shift object or null
  recentShifts: [],              // Last 3 completed shifts
  monthlyStats: {
    assigned: 80,
    worked: 64,
    remaining: 16
  }
}
```

---

## 3. API Design

### 3.1 Azure Functions Endpoints

**Base URL:** `https://[app-name].azurestaticapps.net/api`

#### 3.1.1 Shift Management
```
GET    /shifts/{caregiverId}     - Get shifts for caregiver (current month)
POST   /shifts                  - Create new shift (clock in)
PUT    /shifts/{shiftId}        - Update shift (clock out or edit)
DELETE /shifts/{shiftId}        - Delete shift
```

#### 3.1.2 Caregiver Settings
```
GET    /caregivers              - Get all caregiver settings
PUT    /caregivers/{id}         - Update caregiver settings
```

#### 3.1.3 Dashboard Data
```
GET    /dashboard               - Get complete dashboard data for both caregivers
```

### 3.2 API Request/Response Examples

**Clock In (POST /shifts)**
```javascript
// Request
{
  "caregiverId": "amy",
  "clockInTime": "2025-11-15T09:00:00-08:00"
}

// Response
{
  "shiftId": "shift_uuid",
  "caregiverId": "amy",
  "clockInTime": "2025-11-15T09:00:00-08:00",
  "isActive": true
}
```

**Dashboard Data (GET /dashboard)**
```javascript
// Response
{
  "caregivers": {
    "amy": {
      "id": "amy",
      "nameEn": "Amy",
      "nameCn": "小谷",
      "hourlyRate": 22.50,
      "assignedHours": 80,
      "currentShift": {
        "shiftId": "active_shift_id",
        "clockInTime": "2025-11-15T09:00:00-08:00",
        "duration": "2:15:00"
      },
      "recentShifts": [...],
      "monthlyStats": {
        "assigned": 80,
        "worked": 64,
        "remaining": 16
      }
    },
    "linda": { /* ... */ }
  }
}
```

---

## 4. Frontend Architecture

### 4.1 File Structure
```
/
├── index.html              # Main application page
├── styles.css              # All styling (mobile-first)
├── script.js               # Main application logic
├── api.js                  # API communication layer
├── utils.js                # Helper functions (time, formatting)
├── api/                    # Azure Functions
│   ├── shifts.js
│   ├── caregivers.js
│   └── dashboard.js
├── .github/workflows/
│   └── azure-static-web-apps.yml
└── README.md
```

### 4.2 JavaScript Architecture

**Main App Object:**
```javascript
const CaregiverApp = {
  data: {
    caregivers: {},
    currentMonth: '2025-11'
  },
  ui: {
    updateTimer: null,
    elements: {}
  },
  api: {
    // API calls
  },
  utils: {
    // Helper functions
  },
  init() {
    // Initialize app
  }
}
```

### 4.3 State Management
- **Single source of truth:** Dashboard API response
- **Local state:** Stored in `CaregiverApp.data`
- **UI updates:** Direct DOM manipulation (no framework)
- **Auto-refresh:** Every 30 seconds to sync across devices
- **Timer updates:** Every 1 second for running timers

---

## 5. User Interface Design

### 5.1 CSS Architecture

**Mobile-First Approach:**
```css
/* Base styles (mobile) */
.caregiver-card { /* mobile styles */ }

/* Tablet */
@media (min-width: 768px) {
  .caregiver-card { /* tablet styles */ }
}

/* Desktop */
@media (min-width: 1024px) {
  .caregiver-card { /* desktop styles */ }
}
```

**Design Tokens:**
```css
:root {
  /* Colors */
  --primary-color: #0078d4;
  --success-color: #107c10;
  --danger-color: #d13438;
  --text-dark: #323130;
  --text-light: #605e5c;
  --bg-light: #faf9f8;
  
  /* Typography */
  --font-size-xl: 2rem;      /* Headings */
  --font-size-lg: 1.5rem;    /* Buttons */
  --font-size-md: 1.25rem;   /* Body text */
  --font-size-sm: 1rem;      /* Labels */
  
  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  
  /* Touch targets */
  --button-height: 60px;     /* Minimum 44px for accessibility */
  --input-height: 50px;
}
```

### 5.2 Component Design

**Caregiver Card Structure:**
```html
<div class="caregiver-card" data-caregiver-id="amy">
  <header class="caregiver-header">
    <h2 class="caregiver-name">
      <span class="name-en">Amy</span>
      <span class="name-cn">小谷</span>
    </h2>
  </header>
  
  <section class="current-status">
    <!-- Clock in/out controls -->
  </section>
  
  <section class="hourly-rate">
    <!-- Editable rate -->
  </section>
  
  <section class="recent-shifts">
    <!-- Last 3 shifts -->
  </section>
  
  <section class="monthly-summary">
    <!-- Assigned vs worked hours -->
  </section>
</div>
```

---

## 6. Business Logic

### 6.1 Time Calculations

**Clock In Process:**
1. Validate no active shift exists for caregiver
2. Create new shift record with current PST timestamp
3. Set `isActive = true`
4. Update UI to show running timer

**Clock Out Process:**
1. Find active shift for caregiver
2. Set `clockOutTime` to current PST timestamp
3. Calculate `totalHours = (clockOut - clockIn) / 3600000`
4. Set `isActive = false`
5. Update monthly statistics

**Running Timer Calculation:**
```javascript
function calculateDuration(clockInTime) {
  const start = new Date(clockInTime);
  const now = new Date();
  const diffMs = now - start;
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}
```

### 6.2 Monthly Statistics

**Calculate Monthly Hours:**
```javascript
function calculateMonthlyStats(shifts, assignedHours) {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyShifts = shifts.filter(shift => 
    shift.partitionKey === currentMonth && !shift.isActive
  );
  
  const workedHours = monthlyShifts.reduce((total, shift) => 
    total + shift.totalHours, 0
  );
  
  return {
    assigned: assignedHours,
    worked: Math.round(workedHours * 100) / 100, // Round to 2 decimals
    remaining: Math.round((assignedHours - workedHours) * 100) / 100
  };
}
```

---

## 7. Data Flow

### 7.1 Application Initialization
1. Load HTML page
2. Initialize JavaScript app
3. Fetch dashboard data from API
4. Render both caregiver cards
5. Start timer update loop (1s interval)
6. Start data refresh loop (30s interval)

### 7.2 Clock In Flow
```
User taps "CLOCK IN" 
    ↓
Validate no active shift exists
    ↓
Call POST /api/shifts
    ↓
Update local state
    ↓
Update UI (show running timer)
    ↓
Start timer updates
```

### 7.3 Edit Shift Flow
```
User taps "Edit" on shift
    ↓
Show edit modal/inline form
    ↓
User modifies times
    ↓
Validate time ranges
    ↓
Call PUT /api/shifts/{id}
    ↓
Refresh dashboard data
    ↓
Update UI
```

---

## 8. Error Handling

### 8.1 Client-Side Errors
- **Network failures:** Show retry button, cache actions offline
- **Validation errors:** Show inline error messages
- **Concurrent modifications:** Refresh data and show conflict resolution
- **Browser compatibility:** Graceful degradation for older browsers

### 8.2 Server-Side Errors
- **400 Bad Request:** Show user-friendly validation messages
- **409 Conflict:** Handle concurrent clock in/out attempts
- **500 Internal Server Error:** Show generic error with retry option
- **503 Service Unavailable:** Show maintenance message

### 8.3 Error User Experience
```javascript
const ErrorHandler = {
  show(message, type = 'error') {
    // Show toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 5000);
  }
};
```

---

## 9. Performance Considerations

### 9.1 Frontend Optimization
- **Minimal bundle size:** Vanilla JS, no frameworks
- **CSS optimization:** Critical CSS inline, non-critical async
- **Image optimization:** None needed (icon fonts/SVG only)
- **Caching strategy:** Service worker for offline capability (future)

### 9.2 Backend Optimization
- **Table Storage partitioning:** By month for optimal queries
- **API response size:** Only return current month data
- **Caching:** Azure Functions output caching (30s)
- **Connection pooling:** Reuse Table Storage connections

### 9.3 Mobile Performance
- **Touch targets:** Minimum 44px for accessibility
- **Viewport optimized:** No horizontal scrolling
- **Fast tap response:** CSS touch-action optimization
- **Minimal reflows:** Efficient DOM updates

---

## 10. Security Considerations

### 10.1 Data Security
- **No authentication:** Family use only (as per requirements)
- **HTTPS only:** Force SSL in Azure Static Web Apps
- **Input validation:** Sanitize all user inputs
- **SQL injection prevention:** Use parameterized queries

### 10.2 Privacy
- **No PII storage:** Only first names and hours
- **Data retention:** Keep current year only (auto-cleanup)
- **Access logs:** Azure built-in logging only

---

## 11. Deployment Strategy

### 11.1 Development Workflow
1. **Local development:** Live Server extension in VS Code
2. **Git workflow:** Feature branches → main branch
3. **Automatic deployment:** GitHub Actions to Azure
4. **Testing:** Manual testing on multiple devices

### 11.2 Environment Configuration
- **Production:** Azure Static Web Apps (main branch)
- **Staging:** Not needed (simple app, family use)
- **Local:** Live Server with mock API responses

---

## 12. Monitoring & Maintenance

### 12.1 Application Monitoring
- **Azure Application Insights:** Track API performance
- **Browser console errors:** Client-side error logging
- **User feedback:** Family reports only

### 12.2 Data Maintenance
- **Monthly cleanup:** Archive old shift data
- **Backup strategy:** Azure Table Storage geo-redundancy
- **Data migration:** Version schema changes carefully

---

## 13. Future Enhancements (Technical)

### 13.1 Phase 2 Features
- **Progressive Web App (PWA):** Installable, offline-first
- **Push notifications:** Shift reminders
- **Real-time updates:** SignalR for multi-device sync
- **Data export:** CSV generation client-side

### 13.2 Technical Debt
- **Framework migration:** Consider React/Vue for complex features
- **TypeScript adoption:** Better type safety
- **Automated testing:** Unit tests for critical business logic
- **Performance monitoring:** Real user metrics

---

## 14. Implementation Phases

### 14.1 Phase 1 (MVP - Week 1)
✅ Basic HTML/CSS layout  
✅ Clock in/out functionality  
✅ Local storage (no cloud yet)  
✅ Running timer display  
✅ Basic shift history  

### 14.2 Phase 2 (Cloud Integration - Week 2)  
⏸️ Azure Functions API  
⏸️ Table Storage setup  
⏸️ Frontend API integration  
⏸️ Multi-device sync  

### 14.3 Phase 3 (Polish - Week 3)
⏸️ Edit/delete functionality  
⏸️ Monthly hour management  
⏸️ Bilingual UI completion  
⏸️ Mobile optimization  

---

**Note:** This design document is a living document and should be updated as the implementation progresses and requirements evolve.