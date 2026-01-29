# Quick Reference - Red Bus Angular Application

## 🌐 Application URLs

| Feature | URL |
|---------|-----|
| **Main App** | http://localhost:59355 |
| **Bus Search** | http://localhost:59355/search |
| **Admin Panel** | http://localhost:59355/admin |
| **Booking** | http://localhost:59355/booking/:scheduleId |
| **Backend API** | https://projectapi.gerasim.in |
| **Swagger Docs** | https://projectapi.gerasim.in/swagger |

## 📍 Pre-configured Route: Nagpur → Pune

### Location IDs
- **Nagpur**: 253 (also 330)
- **Pune**: 252 (also 270)

### Date for Testing
- **18-August-2024** (Format: 2024-08-18)

### 4 Pre-configured Schedules

| Timing | Vendor | Seats | Price | Bus Type |
|--------|--------|-------|-------|----------|
| 06:00 - 14:00 | RedBus (782) | 45 | ₹600 | AC Sleeper |
| 10:00 - 18:00 | Purple Bus (85) | 50 | ₹550 | AC Seater |
| 14:00 - 22:00 | VRL Travels (86) | 48 | ₹650 | Premium AC |
| 20:00 - 04:00 | Pammi Travels (137) | 40 | ₹500 | AC Sleeper |

## 🔧 Quick Commands

### View Available Locations
```bash
# Get all locations
curl "https://projectapi.gerasim.in/api/BusBooking/GetBusLocations"
```

### View Available Vendors
```bash
# Get all vendors
curl "https://projectapi.gerasim.in/api/BusBooking/GetBusVendors"
```

### Search Buses
```bash
# GET request with parameters
https://projectapi.gerasim.in/api/BusBooking/searchBus?fromLocation=253&toLocation=252&travelDate=18-08-2024
```

### Create Schedule (POST)
```json
{
  "vendorId": 782,
  "fromLocationId": 253,
  "toLocationId": 252,
  "departureTime": "06:00:00",
  "reachingTime": "14:00:00",
  "totalSeats": 45,
  "price": 600,
  "scheduleDate": "2024-08-18T00:00:00",
  "busType": "AC Sleeper"
}
```

## 📊 API Endpoints Used

### User Management
- `POST /api/BusBooking/AddNewUser` - Register user
- `POST /api/BusBooking/login` - Login user

### Location Management
- `GET /api/BusBooking/GetBusLocations` - Get all locations
- `GET /api/BusBooking/GetBusLocationById` - Get location by ID
- `POST /api/BusBooking/PostBusLocation` - Add location

### Vendor Management
- `GET /api/BusBooking/GetBusVendors` - Get all vendors
- `GET /api/BusBooking/GetBusVendorsById` - Get vendor by ID
- `POST /api/BusBooking/PostBusVendor` - Add vendor

### Schedule Management (NEW)
- `GET /api/BusBooking/GetBusSchedules` - Get all schedules
- `POST /api/BusBooking/PostBusSchedule` - Create schedule
- `PUT /api/BusBooking/PutBusSchedule` - Update schedule
- `DELETE /api/BusBooking/DeleteBusSchedule` - Delete schedule
- `GET /api/BusBooking/GetBusScheduleById` - Get schedule details

### Bus Booking
- `POST /api/BusBooking/searchBus` - Search buses
- `POST /api/BusBooking/PostBusBooking` - Create booking
- `GET /api/BusBooking/getBookedSeats` - Get booked seats

## 🎬 Step-by-Step Testing Guide

### 1️⃣ Setup Admin Schedules
```
Go to: http://localhost:59355/admin
Click: "Nagpur to Pune" tab
Click: "Create All Schedules" button
✅ 4 schedules created!
```

### 2️⃣ Search for Buses
```
Go to: http://localhost:59355/search
Select From: Nagpur
Select To: Pune
Select Date: 18-August-2024
Click: "Search"
✅ See all 4 schedules!
```

### 3️⃣ Test Booking Flow
```
Click: "Book Now" on any schedule
Select: 2-3 seats from grid
Fill: Passenger names, age, gender
Click: "Confirm Booking"
✅ Booking successful!
```

### 4️⃣ Manage Schedules
```
Go to: Admin panel
View: "All Schedules" or "Nagpur to Pune"
Actions: Edit or Delete schedules
✅ Full CRUD operations!
```

## 🎨 UI Components

### Navigation Bar
- Red gradient background (#cc0000 → #990000)
- Logo with bus emoji and "BUS" text
- Links: Buses, Admin, Offers, Help
- User login/logout
- Mobile responsive

### Search Page
- Location dropdowns (300+ cities)
- Date picker
- Search button
- Bus cards showing:
  - Vendor name
  - Departure/Arrival times
  - Duration
  - Price
  - Seats available
  - Bus type

### Booking Page
- Seat grid (4 columns)
- Seat states: Available (gray), Selected (red), Booked (dim)
- Passenger form
- Seat count display
- Confirm booking button

### Admin Dashboard
- Tabs: All Schedules, Nagpur→Pune, Add Schedule
- Schedule cards with all details
- Edit/Delete buttons
- Form for new schedules
- Success/Error messages

## 💾 LocalStorage Keys

- `redBusUser` - Stores logged-in user data

## 🔐 Authentication

Sample user for testing (create in admin):
```
Email: test@gmail.com
Password: Test@123
```

## 🐛 Troubleshooting

### Schedules not appearing?
1. Check admin panel
2. Click "Create All Schedules"
3. Go back to search page
4. Refresh browser

### API errors?
1. Check if backend is running
2. Verify proxy.conf.json
3. Check API endpoint in swagger

### Styling issues?
1. Clear browser cache
2. Restart dev server
3. Check styles.css

## 📱 Responsive Breakpoints

| Device | Width | Status |
|--------|-------|--------|
| Mobile | < 576px | ✅ Full support |
| Tablet | 576-768px | ✅ Full support |
| Desktop | > 768px | ✅ Full support |

## 🚀 Performance

- Lazy loading routes
- Optimized images
- Efficient API calls
- CSS animations (hardware accelerated)
- No external bloat

## ✅ Checklist for Demonstration

- [ ] Application running at localhost:59355
- [ ] Navigation bar visible with Red Bus branding
- [ ] Login/Register modal working
- [ ] Admin panel accessible
- [ ] Create schedules for Nagpur-Pune
- [ ] Search functionality working
- [ ] Seat selection working
- [ ] Booking form complete
- [ ] All styling matches Red Bus theme
- [ ] Responsive design tested

---

**Ready to use! Start with the Admin panel to create schedules, then test the search and booking flow.** 🎯
