# 🚌 Bus Booking Application - Quick Start Guide

## 📌 Project Overview
This is a **fully functional Red Bus Clone** built with Angular 18. It allows users to search, book buses and provides admin panel for schedule management.

---

## 🚀 How to Run

### Prerequisites
- Node.js (v18+)
- npm (v8+)

### Installation & Startup
```bash
# 1. Navigate to project directory
cd d:\Projects\bus-booking-angular-18

# 2. Install dependencies (already done)
npm install

# 3. Start development server
npm start

# 4. Open browser
http://localhost:4200
```

---

## 🌐 Available Routes

### User Pages
| Route | Purpose | Features |
|-------|---------|----------|
| `/search` | 🔍 Bus Search | Search by location & date |
| `/buses` | 🚌 Browse Buses | Advanced filters & sorting |
| `/booking/:id` | 💺 Seat Selection | Book seats, enter details |
| `/tickets` | 🎫 My Bookings | View booking history |
| `/offers` | 🎁 Offers & Coupons | Discount codes |
| `/help` | ❓ Help | FAQ & support |

### Admin Pages
| Route | Purpose | Features |
|-------|---------|----------|
| `/admin` | ⚙️ Admin Panel | Manage schedules & vendors |

---

## 🎮 How to Use

### 1. **Search for Buses** (`/search`)
```
Step 1: Select "From Location" (e.g., Delhi)
Step 2: Select "To Location" (e.g., Pune)
Step 3: Pick a date
Step 4: Click "Search"
Step 5: Click "Book Now" on any bus
```

### 2. **Browse All Buses** (`/buses`)
```
Features:
- See all available buses
- Filter by: Vendor, Bus Type, Price, Rating
- Sort by: Price, Rating, Departure Time
- Search by vendor name or bus type
- Pagination: 10 buses per page
```

### 3. **Book a Seat** (`/booking/:id`)
```
Step 1: Click on available seats (gray)
Step 2: Enter passenger details:
        - Full Name
        - Email
        - Phone Number
        - Gender
Step 3: Review selected seats
Step 4: Click "Confirm Booking"
```

### 4. **View Bookings** (`/tickets`)
```
Features:
- View all your bookings
- Filter by status (Confirmed, Pending, Cancelled)
- Search by route or booking ID
- View booking details
- Cancel booking (if available)
```

### 5. **Manage Admin Tasks** (`/admin`)
```
Tabs:
✅ All Schedules - View all schedules
✅ Nagpur to Pune - View specific route
✅ Add Schedule - Create new schedule

Quick Actions:
📌 Click "Create All Schedules" for quick setup
📝 Fill form and click "Create Schedule"
✏️ Click "Edit" to modify schedule
🗑️ Click "Delete" to remove schedule
```

---

## 🔑 Key Features

### ✅ Search & Discovery
- **300+ Locations** - All major Indian cities
- **Advanced Filtering** - Price, vendor, type, rating
- **Smart Sorting** - By price, rating, departure time
- **Real-time Search** - Instant results as you type

### ✅ Booking System
- **Interactive Seat Grid** - Visual seat selection
- **Seat Status** - Available, Selected, Booked
- **Passenger Form** - Collect necessary details
- **Instant Confirmation** - Booking confirmed instantly

### ✅ Admin Management
- **Create Schedules** - Add new bus routes
- **Update Schedules** - Edit existing routes
- **Delete Schedules** - Remove routes
- **Vendor Management** - Manage bus operators
- **Quick Setup** - One-click schedule creation

### ✅ User Features
- **View Bookings** - See all tickets
- **Filter by Status** - Track booking status
- **Search Bookings** - Find specific tickets
- **Offer Coupons** - Apply discount codes
- **Help & Support** - FAQs and contact info

---

## 🔗 API Endpoints

### Working Endpoints
```
✅ GetBusLocations     → Get all cities
✅ GetBusVendors       → Get all bus operators
✅ GetBusSchedules     → Get all bus schedules
✅ searchBus           → Search buses (fixed with client-side filtering)
✅ GetBusScheduleById  → Get schedule details
✅ getBookedSeats      → Get booked seat information
✅ PostBusBooking      → Create booking
✅ PostBusSchedule     → Create schedule
✅ PutBusSchedule      → Update schedule
✅ DeleteBusSchedule   → Delete schedule
✅ AddNewUser          → Register user
```

**Base URL:** `https://projectapi.gerasim.in/api/BusBooking/`

---

## 🧪 Test Cases

### Test Case 1: Basic Search
```
1. Go to /search
2. Select "Nagpur" as From Location
3. Select "Pune" as To Location
4. Pick date: 18-08-2024
5. Click Search
Result: ✅ Buses displayed (if data exists)
```

### Test Case 2: Booking Flow
```
1. From search results, click "Book Now"
2. Select available seats (gray)
3. Enter passenger details
4. Click "Confirm Booking"
Result: ✅ Booking confirmed
```

### Test Case 3: Admin Schedule Creation
```
1. Go to /admin
2. Click "Add Schedule" tab
3. Fill all required fields:
   - Vendor: Select any vendor
   - Date: Pick a date
   - From Location: Nagpur
   - To Location: Pune
   - Times: 06:00 - 14:00
   - Seats: 45
   - Price: 600
4. Click "Create Schedule"
Result: ✅ Schedule created
```

### Test Case 4: Filtering & Sorting
```
1. Go to /buses
2. Select Price Range: ₹500-₹1000
3. Select Bus Type: AC Sleeper
4. Sort By: Price - Low to High
Result: ✅ Filtered & sorted buses displayed
```

---

## 📋 Data Available for Testing

### Test Locations (from API)
- Delhi (ID: 336)
- Pune (ID: 252)
- Nagpur (ID: 253)
- Mumbai (ID: 331)
- Bangalore (ID: 317)
- Chennai (ID: 341)
- Kolkata (ID: 346)
- ...and 400+ more

### Test Vendors (sample)
- RedBus (ID: 782)
- Purple Bus (ID: 85)
- VRL Travels (ID: 86)
- Sky Travels
- Gold Travels
- ...and 100+ more

### Test Routes with Data
- Nagpur ↔ Pune (18-08-2024) - ✅ Data available
- Multiple times and vendors

---

## 🛠️ Troubleshooting

### Issue: "No buses found"
```
Solution 1: Try date 18-08-2024 (known data available)
Solution 2: Use Nagpur → Pune route (confirmed working)
Solution 3: Check browser console for errors
```

### Issue: API errors in console
```
Solution: 
1. Check if proxy.conf.json is loaded
2. Restart dev server: npm start
3. Clear browser cache
4. Check internet connection
```

### Issue: Filters not working
```
Solution:
1. Click "Reset Filters"
2. Try again
3. Refresh page (F5)
4. Check browser console
```

### Issue: Booking not confirming
```
Solution:
1. Fill all passenger fields
2. Select valid seats
3. Check browser console for errors
4. Ensure you have internet connection
```

---

## 📊 Project Structure

```
src/
├── app/
│   ├── config/
│   │   └── api.config.ts        ← API endpoints config
│   ├── service/
│   │   └── master.service.ts    ← API calls
│   ├── interceptor/
│   │   └── http.interceptor.ts  ← Error handling
│   ├── pages/
│   │   ├── search/              ← Search page
│   │   ├── booking/             ← Booking page
│   │   ├── buses/               ← Browse buses
│   │   ├── admin/               ← Admin panel
│   │   ├── offers/              ← Offers page
│   │   ├── tickets/             ← Bookings page
│   │   └── help/                ← Help page
│   ├── app.component.ts         ← Main component
│   ├── app.routes.ts            ← Routes config
│   └── app.config.ts            ← App config
├── index.html
├── main.ts
├── styles.css
├── proxy.conf.json              ← Proxy config
└── ...other files

```

---

## 🚀 Production Deployment

### Before Deploying
1. ✅ Update API base URL to production
2. ✅ Remove proxy configuration
3. ✅ Update environment variables
4. ✅ Run production build: `npm run build`
5. ✅ Test all features in production environment

### Build for Production
```bash
npm run build
# Output: dist/bus-booking-angular-18/
```

---

## 💡 Tips & Tricks

### 🔹 Quick Admin Setup
```
1. Go to /admin
2. Click "Nagpur to Pune" tab
3. Click "Create All Schedules"
4. Done! 4 schedules created instantly
```

### 🔹 Search Tips
```
- Always select From, To, and Date
- Date format: YYYY-MM-DD (e.g., 2024-08-18)
- Nagpur-Pune route has most data
- Leave filters empty to see all buses
```

### 🔹 Booking Tips
```
- Can select multiple seats
- Selected seats shown in red
- Prices update as you select/deselect
- All passenger fields are required
```

### 🔹 Performance Tips
```
- Pagination shows 10 buses per page
- Use filters to narrow down options
- Sort by price for quick comparison
- Mobile responsive - works on all devices
```

---

## 📞 Contact & Support

### Getting Help
1. Check [PROJECT_STATUS_REPORT.md](PROJECT_STATUS_REPORT.md) for detailed info
2. Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for quick reference
3. Check [SCHEDULE_MANAGEMENT_GUIDE.md](SCHEDULE_MANAGEMENT_GUIDE.md) for admin help
4. Review console (F12) for error messages

### Common Issues
- **CORS errors:** Restart dev server
- **No data:** Use Nagpur-Pune route with date 18-08-2024
- **Booking fails:** Ensure all fields are filled
- **Filters not working:** Click Reset and try again

---

## ✅ Verification Checklist

Before considering the project "complete," verify:

- [x] All pages load without errors
- [x] Search functionality works
- [x] Filters and sorting work
- [x] Booking flow completes
- [x] Admin panel functions properly
- [x] API calls are successful
- [x] Mobile responsive design working
- [x] No console errors
- [x] All links working
- [x] Styling looks good

---

## 📈 Next Steps

### For Users
1. Explore all pages
2. Try different search combinations
3. Practice booking a seat
4. View offers and coupons

### For Developers
1. Review code structure
2. Understand API integration
3. Learn filter implementation
4. Study component architecture

### For Deployment
1. Prepare production environment
2. Update configuration
3. Deploy application
4. Monitor performance
5. Gather user feedback

---

**Last Updated:** January 22, 2026  
**Status:** ✅ **FULLY FUNCTIONAL & TESTED**

Happy Booking! 🚌✨
