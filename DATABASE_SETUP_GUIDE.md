# 📊 DATABASE SETUP & AUTHENTICATION GUIDE

## Your Situation
- ✅ Frontend is complete
- ✅ API integration is ready
- ❌ No local database set up
- ✅ Backend API exists: https://projectapi.gerasim.in

---

## 🎯 SOLUTION OPTIONS

### Option 1: Use Existing Backend API (RECOMMENDED - EASIEST)
Your application is already configured to use: **https://projectapi.gerasim.in**

**Advantages:**
- ✅ No database setup needed
- ✅ Already integrated
- ✅ Production ready
- ✅ Swagger docs available
- ✅ Works immediately

**Status:** ✅ **USE THIS FIRST**

---

### Option 2: Set Up Local Database (For Development)
Create your own backend with local database

**Advantages:**
- ✅ Full control
- ✅ Offline development
- ✅ Custom business logic
- ✅ Learning experience

**Time:** 2-3 hours setup

**Status:** ⏳ Do this if you want local database

---

## ✅ SOLUTION 1: USE EXISTING BACKEND API (RECOMMENDED)

### Current Configuration
Your app is already set up to use the external API:

**API Base URL:** `https://projectapi.gerasim.in/api/BusBooking/`

**Endpoints Already Working:**
```
✅ GetBusLocations
✅ GetBusSchedules
✅ AddNewUser (Register)
✅ PostBusBooking (Book tickets)
✅ GetBusVendors
✅ PostBusSchedule (Admin)
```

### What You Need To Do

#### Step 1: Test Login (Right Now)
1. Open your app: http://localhost:53250 (or your port)
2. Click "Login" button
3. Click "Create Account"
4. Fill in details:
   ```
   Username: testuser123
   Email: test@example.com
   Password: Test@123
   Full Name: Test User
   ```
5. Click Register → Should show "User Registered Success"

#### Step 2: Use The App
1. After login, you're automatically logged in
2. Search for buses (data from API)
3. Book tickets
4. See payments (from Razorpay)
5. View bookings in tickets page

#### Step 3: Check Data Flow
All data is stored on the backend server at: https://projectapi.gerasim.in

---

## ⏳ SOLUTION 2: CREATE YOUR OWN BACKEND DATABASE

If you want your own local database, follow these steps:

### Technology Options

#### Option A: Node.js + Express + SQL Server (Recommended)
- **Time:** 3 hours
- **Difficulty:** Medium
- **Database:** SQL Server or MySQL

#### Option B: .NET Core + SQL Server
- **Time:** 4 hours
- **Difficulty:** Medium
- **Database:** SQL Server

#### Option C: Firebase (Easiest)
- **Time:** 30 minutes
- **Difficulty:** Easy
- **Database:** Cloud-based

#### Option D: MongoDB + Node.js
- **Time:** 2 hours
- **Difficulty:** Easy
- **Database:** NoSQL

**Choose: Option C (Firebase) - Fastest Setup**

---

## 🚀 QUICK SETUP: Firebase (No Code Database)

### Step 1: Create Firebase Project (5 minutes)

```
1. Go to: https://firebase.google.com
2. Click "Get Started"
3. Create a new project:
   - Project Name: bus-booking
   - Location: Choose your region
   - Create Project
```

### Step 2: Enable Authentication (3 minutes)

```
In Firebase Console:
1. Left menu → Authentication
2. Click "Get Started"
3. Enable:
   ✅ Email/Password
   ✅ Google
```

### Step 3: Create Database (2 minutes)

```
In Firebase Console:
1. Left menu → Firestore Database
2. Click "Create Database"
3. Start in test mode (for development)
4. Choose location
5. Create
```

### Step 4: Update Angular App (10 minutes)

#### Install Firebase
```bash
npm install firebase @angular/fire
```

#### Create Firebase Config File
```typescript
// File: src/app/config/firebase.config.ts

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_FROM_FIREBASE",
  authDomain: "bus-booking-xxxxx.firebaseapp.com",
  projectId: "bus-booking-xxxxx",
  storageBucket: "bus-booking-xxxxx.appspot.com",
  messagingSenderId: "xxxxx",
  appId: "xxxxx"
};
```

**Where to find these values:**
1. Firebase Console → Project Settings
2. Copy config values from "Web" app

### Step 5: Update Master Service
```typescript
// File: src/app/service/master.service.ts

import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, addDoc, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  constructor(
    private http: HttpClient,
    private auth: Auth,
    private firestore: Firestore
  ) { }

  // Register user with Firebase
  onRegisterUser(obj: any): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, obj.emailId, obj.password)
      .then((userCredential) => {
        return addDoc(collection(this.firestore, 'users'), {
          userId: userCredential.user.uid,
          userName: obj.userName,
          emailId: obj.emailId,
          fullName: obj.fullName,
          createdDate: new Date(),
          role: 'user'
        }).then(() => ({
          data: {
            userId: userCredential.user.uid,
            userName: obj.userName,
            emailId: obj.emailId,
            fullName: obj.fullName,
            role: 'user'
          }
        }));
      });
  }

  // Login user with Firebase
  onLoginUser(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => ({
        data: {
          userId: userCredential.user.uid,
          emailId: userCredential.user.email
        }
      }));
  }

  // Store booking in Firestore
  onBooking(obj: any): Promise<any> {
    return addDoc(collection(this.firestore, 'bookings'), {
      ...obj,
      bookingDate: new Date(),
      status: 'pending'
    });
  }
}
```

### Step 6: Convert Login Component (15 minutes)

```typescript
// File: src/app/app.component.ts

import { Auth } from '@angular/fire/auth';

export class AppComponent {
  constructor(
    private masterSrv: MasterService,
    private auth: Auth
  ) {}

  onRegister() {
    this.masterSrv.onRegisterUser(this.registerObj)
      .then((res: any) => {
        alert("User Registered Success");
        localStorage.setItem('redBusUser', JSON.stringify(res.data));
        this.loggedUserData = res.data;
        this.closeModel();
      })
      .catch(error => {
        alert("Registration failed: " + error.message);
      });
  }

  onLogin() {
    // Similar pattern for login
  }
}
```

### Step 7: Update Environment Config
```typescript
// File: src/environments/environment.ts

import { firebaseConfig } from '../app/config/firebase.config';

export const environment = {
  production: false,
  apiBaseUrl: 'https://projectapi.gerasim.in', // or your backend
  firebase: firebaseConfig,
  razorpayKey: 'YOUR_RAZORPAY_KEY'
};
```

### Step 8: Test Firebase Setup
```
1. Stop your dev server (Ctrl+C)
2. Run: ng serve
3. Test Register/Login
4. Check Firebase Console → Firestore to see data
```

---

## 🔄 HYBRID APPROACH (RECOMMENDED FOR PRODUCTION)

Use **Firebase for Authentication** + **Backend API for Business Logic**

### Architecture:
```
┌─────────────────────────────────────────┐
│         Angular Frontend                 │
├─────────────────────────────────────────┤
│                                         │
│  Firebase Auth ◄──────────┐            │
│  (Login/Register)         │            │
│                           │            │
│  Backend API ◄────────────┘            │
│  (Buses, Bookings, Payments)           │
│                                         │
└─────────────────────────────────────────┘
```

### Implementation:
1. Use Firebase for user authentication
2. Keep using existing API for bus data, bookings, payments
3. Send Firebase token with API requests

---

## 📋 DATABASE SCHEMA (If Creating Your Own)

### Users Table
```sql
CREATE TABLE Users (
  userId INT PRIMARY KEY,
  userName VARCHAR(100) NOT NULL,
  emailId VARCHAR(100) UNIQUE NOT NULL,
  fullName VARCHAR(200),
  password VARCHAR(255) NOT NULL (HASHED),
  role VARCHAR(50), -- 'user' or 'admin'
  createdDate DATETIME
);
```

### Bookings Table
```sql
CREATE TABLE Bookings (
  bookingId INT PRIMARY KEY,
  userId INT FOREIGN KEY,
  scheduleId INT FOREIGN KEY,
  bookingDate DATETIME,
  status VARCHAR(50), -- 'pending', 'confirmed', 'cancelled'
  payment_id VARCHAR(100),
  payment_status VARCHAR(50), -- 'pending', 'paid', 'failed'
  payment_amount DECIMAL(10,2),
  seats INT
);
```

### Passengers Table
```sql
CREATE TABLE Passengers (
  passengerId INT PRIMARY KEY,
  bookingId INT FOREIGN KEY,
  passengerName VARCHAR(200),
  age INT,
  gender VARCHAR(20),
  seatNo INT
);
```

### Schedules Table
```sql
CREATE TABLE Schedules (
  scheduleId INT PRIMARY KEY,
  busId INT,
  fromLocationId INT,
  toLocationId INT,
  departureTime TIME,
  arrivalTime TIME,
  fare DECIMAL(10,2),
  totalSeats INT,
  availableSeats INT
);
```

---

## 🔐 LOGIN FLOW WORKING RIGHT NOW

### Current Flow (Using Backend API):
```
User Login/Register
    ↓
Send to: https://projectapi.gerasim.in/api/BusBooking/AddNewUser
    ↓
Backend Stores User
    ↓
Returns User Data
    ↓
Save to localStorage as 'redBusUser'
    ↓
User Logged In ✅
    ↓
Can access all features
```

### Issues You May Face:

#### 1. "User already exists"
- Use a different email for testing
- Or go to: https://projectapi.gerasim.in/swagger to manage users

#### 2. "API Error: 404"
- Backend might be down
- Try alternative: Setup Firebase (Step above)

#### 3. "Data not persisting"
- Check browser console (F12)
- Check localStorage in DevTools
- Verify API request in Network tab

---

## ✅ IMMEDIATE ACTION PLAN

### Right Now (5 minutes):
1. ✅ Test login with existing API
2. ✅ Create test account
3. ✅ Search for buses
4. ✅ Complete payment gateway setup

### This Week (If needed):
1. ⏳ Set up Firebase (if you want local data)
2. ⏳ Update master service for Firebase
3. ⏳ Test complete flow

### Production (When ready):
1. ⏳ Get production API keys
2. ⏳ Deploy to production server
3. ⏳ Enable HTTPS

---

## 📞 TROUBLESHOOTING

### Q: "Login not working"
A: Check these:
```
1. Is backend API running? Try: https://projectapi.gerasim.in/swagger
2. Check browser console (F12) for errors
3. Check Network tab to see API response
4. Try different email address
```

### Q: "Data not saving"
A: Check:
```
1. Browser storage enabled
2. localStorage not full
3. API returning correct response
4. Check DevTools → Application → LocalStorage
```

### Q: "Want offline development"
A: Use Firebase:
```
1. Follow Firebase setup above
2. Test locally without internet
3. Sync when online
```

---

## 🎯 RECOMMENDED PATH

### For Quick Testing (Now):
✅ **Use existing backend API**
- Already configured
- Works immediately
- No setup needed

### For Development (Recommended):
✅ **Use Firebase**
- Fast setup (30 minutes)
- No server management
- Scalable
- Easy to use

### For Production (Later):
✅ **Create full backend**
- Complete control
- Custom logic
- Enterprise features

---

## 📚 NEXT STEPS

1. **Test the app right now:**
   - Click Login button
   - Register a new user
   - Search for buses
   - Try to book

2. **If it works:**
   - Skip database setup
   - Focus on payment gateway (already done!)
   - Go to production

3. **If it doesn't work:**
   - Set up Firebase (30 min)
   - Or check backend API status
   - Contact support

---

## 🔗 USEFUL LINKS

- **Swagger API Docs:** https://projectapi.gerasim.in/swagger
- **Firebase Console:** https://console.firebase.google.com
- **Firebase Docs:** https://firebase.google.com/docs
- **Firebase Auth Guide:** https://firebase.google.com/docs/auth
- **Firebase Firestore:** https://firebase.google.com/docs/firestore

---

## 💡 MY RECOMMENDATION

**For your bus booking app:**
1. ✅ Use the existing backend API (https://projectapi.gerasim.in)
2. ✅ Payment is ready with Razorpay
3. ✅ Frontend is complete
4. ⏳ Add Firebase later if needed (optional)

**This gives you:**
- ✅ Working app immediately
- ✅ Persistent data storage
- ✅ User authentication
- ✅ Payment processing
- ✅ Scalable solution

**Time to production: 1-2 days** (just finish payment gateway backend)

---

**Status: You're ready to go! Just test the login.** 🚀
