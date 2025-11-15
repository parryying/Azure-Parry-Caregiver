# Caregiver Time Tracking App - Requirements Document

**Project:** Azure-Parry-Caregiver  
**Version:** 1.0  
**Last Updated:** November 15, 2025  
**Owner:** Parry's Family

---

## 1. Project Overview

A senior-friendly web application to track caregiver clock in/out times, calculate hours worked, and manage monthly hour allocations. The app must be accessible across multiple devices with cloud synchronization.

---

## 2. User Requirements

### 2.1 Primary Users
- **Parry's family members only** (not used by caregivers)
- **No login/authentication required** (family use only)
- **Multiple device access** (phones, tablets, computers)

### 2.2 Accessibility Requirements
- **Senior-friendly design:**
  - Large fonts
  - High contrast colors
  - Big, easy-to-tap buttons
  - Phone-friendly/mobile-optimized
- **Single-screen layout** - all features visible without navigation
- **Bilingual interface** - English and Chinese (中文)

---

## 3. Caregiver Information

### 3.1 Hardcoded Caregivers (2 total)
1. **Amy / 小谷**
2. **Linda / 张洁**

### 3.2 Caregiver Settings
- **Default hourly rate:** $22.50/hour (editable in app)
- **All caregivers paid at same rate**
- **All shifts are paid** (no unpaid breaks tracking)

---

## 4. Functional Requirements

### 4.1 Clock In/Out Functionality
- **Clock In button** - records current timestamp
- **Clock Out button** - records current timestamp and calculates total hours
- **Running timer display** - shows elapsed time while clocked in (updates every second)
- **Multiple concurrent shifts** - both caregivers can be clocked in simultaneously
- **Timezone:** Pacific Standard Time (PST)
- **Time format:** 12-hour (e.g., 3:00 PM)

### 4.2 Time Tracking & Calculations
- **Automatic hour calculation** - (clock out time - clock in time)
- **Running timer** - live display of current shift duration
- **Total hours per shift** - displayed in shift history
- **Monthly totals** - sum of all hours worked in current month

### 4.3 Monthly Hour Management
Each caregiver section must display:
- **Assigned hours** - total hours allocated for the month (editable)
- **Worked hours** - sum of all completed shifts this month
- **Remaining hours** - (assigned - worked)

### 4.4 Shift History
- **Recent shifts** - display last 3 shifts (auto-expanded)
- **Collapsed history** - "Show All This Month" button to expand remaining shifts
- **Shift details displayed:**
  - Caregiver name (bilingual)
  - Date
  - Clock in time
  - Clock out time
  - Total hours worked
  - Edit and Delete buttons

### 4.5 Edit/Delete Capabilities
- **Edit past shifts** - ability to modify clock in/out times (for forgotten clock-ins)
- **Delete shifts** - remove incorrect entries
- **No export functionality required** (not needed initially)

---

## 5. User Interface Layout

### 5.1 Screen Structure (Single Scrollable Page)

```
┌─────────────────────────────────────────────────┐
│              AMY / 小谷 SECTION                  │
├─────────────────────────────────────────────────┤
│  Current Status / 当前状态:                      │
│  [CLOCK IN 打卡上班] or                          │
│  [Working 工作中: 2h 15m] [CLOCK OUT 打卡下班]   │
│                                                  │
│  Hourly Rate / 时薪: $22.50 [Edit 编辑]         │
├─────────────────────────────────────────────────┤
│  Recent Shifts / 最近班次 (last 3):              │
│  • Nov 15: 9:00 AM - 5:00 PM (8.0 hrs) [Edit]   │
│  • Nov 14: 9:00 AM - 5:00 PM (8.0 hrs) [Edit]   │
│  • Nov 13: 9:00 AM - 3:00 PM (6.0 hrs) [Edit]   │
│  [Show All This Month 显示本月全部]              │
├─────────────────────────────────────────────────┤
│  This Month Summary / 本月总结:                  │
│  Assigned 分配: 80 hours                         │
│  Worked 已工作: 64 hours                         │
│  Remaining 剩余: 16 hours                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│             LINDA / 张洁 SECTION                 │
├─────────────────────────────────────────────────┤
│  Current Status / 当前状态:                      │
│  [CLOCK IN 打卡上班] or                          │
│  [Working 工作中: 0h 45m] [CLOCK OUT 打卡下班]   │
│                                                  │
│  Hourly Rate / 时薪: $22.50 [Edit 编辑]         │
├─────────────────────────────────────────────────┤
│  Recent Shifts / 最近班次 (last 3):              │
│  • Nov 15: 1:00 PM - 6:00 PM (5.0 hrs) [Edit]   │
│  • Nov 12: 1:00 PM - 6:00 PM (5.0 hrs) [Edit]   │
│  [Show All This Month 显示本月全部]              │
├─────────────────────────────────────────────────┤
│  This Month Summary / 本月总结:                  │
│  Assigned 分配: 80 hours                         │
│  Worked 已工作: 40 hours                         │
│  Remaining 剩余: 40 hours                        │
└─────────────────────────────────────────────────┘
```

### 5.2 Layout Specifications
- **Two separate sections** - one per caregiver
- **Each section contains:**
  1. Current status with clock in/out controls
  2. Editable hourly rate
  3. Recent shift history (last 3 expanded)
  4. Monthly summary (assigned vs worked hours)
- **Vertical scrolling** - sections stacked on mobile devices
- **All content on one screen** - no navigation menus or separate pages

---

## 6. Technical Requirements

### 6.1 Cloud Storage & Sync
- **Storage:** Azure Table Storage or Cosmos DB
- **Multi-device sync** - data accessible from any device
- **Real-time updates** - page refresh shows latest data from all devices
- **Data persistence** - survives browser cache clearing

### 6.2 Data Models

**Shift Record:**
- Shift ID (unique)
- Caregiver ID (Amy or Linda)
- Clock In timestamp
- Clock Out timestamp (null if currently active)
- Total Hours (calculated)
- Date
- Notes (optional for future)

**Caregiver Settings:**
- Caregiver ID
- Name (English)
- Name (Chinese)
- Hourly Rate
- Monthly Assigned Hours
- Current Month Year (for tracking)

### 6.3 Platform Requirements
- **Deployment:** Azure Static Web Apps
- **CI/CD:** GitHub Actions (already configured)
- **Browser Support:** Modern browsers (Chrome, Safari, Edge, Firefox)
- **Mobile Responsive:** Works on phones, tablets, desktops

---

## 7. Feature Priorities

### 7.1 Must Have (MVP)
✅ Clock in/out functionality  
✅ Running timer display  
✅ Shift history (last 3 visible)  
✅ Edit/delete past shifts  
✅ Monthly hour tracking (assigned vs worked)  
✅ Editable hourly rates  
✅ Editable assigned hours  
✅ Bilingual UI (English/Chinese)  
✅ Cloud storage with multi-device sync  
✅ Senior-friendly design (large buttons, fonts)  

### 7.2 Nice to Have (Future)
⏸️ Export to Excel/CSV  
⏸️ Payment calculation display ($$ totals)  
⏸️ Break time tracking  
⏸️ Notes per shift  
⏸️ Notifications/reminders  
⏸️ Historical reports beyond current month  

### 7.3 Not Needed
❌ User authentication/login  
❌ Multiple family accounts  
❌ Caregiver self-service  
❌ Overtime tracking  
❌ Tax calculations  

---

## 8. Design Constraints

### 8.1 Must Follow
- **No payment totals displayed** (only hours)
- **Same hourly rate for all caregivers**
- **Only current month data shown** (no multi-month views yet)
- **Two caregivers only** (hardcoded)
- **Family use only** (no security needed)

### 8.2 Key User Experience Goals
1. **One-tap clock in/out** - minimal steps
2. **Immediate visual feedback** - running timer visible
3. **Easy error correction** - edit/delete always available
4. **No training required** - intuitive for seniors
5. **Works offline-first, syncs when online** (future enhancement)

---

## 9. Success Criteria

The app is considered successful if:
1. ✅ Family members can clock caregivers in/out in < 5 seconds
2. ✅ Running timer is clearly visible when caregiver is working
3. ✅ All devices show same data after refresh
4. ✅ Edits to past shifts work reliably
5. ✅ Monthly assigned hours can be adjusted easily
6. ✅ App works on phones without zooming/scrolling horizontally
7. ✅ No data loss occurs across device switches

---

## 10. Future Enhancements (Backlog)

Ideas for future versions:
- Export timesheet to Excel/CSV
- Email monthly summaries
- Push notifications for shift reminders
- Add more caregivers (dynamic list)
- Multi-month historical reports
- Overtime rate calculations
- Dark mode toggle
- PWA (installable app)
- Offline-first architecture with background sync

---

## 11. Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| Nov 15, 2025 | 1.0 | Initial requirements document | Parry |

---

**Note:** Any changes to this requirements document must be explicitly agreed upon before implementation. All development work must adhere to these specifications unless this document is updated.
