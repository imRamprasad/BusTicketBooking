# Payment Gateway Integration - Quick Reference

## 🚀 What's Been Added

### Payment Service
- **File:** `src/app/service/payment.service.ts`
- **Methods:**
  - `loadRazorpayScript()` - Load Razorpay library
  - `createOrder()` - Create payment order
  - `initiatePayment()` - Open Razorpay checkout
  - `verifyPayment()` - Verify payment signature
  - `getPaymentStatus()` - Check order status
  - `cancelPayment()` - Process refunds

### Payment Component
- **File:** `src/app/pages/payment/`
- **Features:**
  - Beautiful payment form UI
  - Real-time amount calculation
  - Payment success/failure handling
  - Secure checkout
  - Responsive design

### Booking Integration
- **Updated:** `src/app/pages/booking/`
- **Features:**
  - Calculate ₹500 per seat
  - Payment modal overlay
  - Order creation before payment
  - Auto-redirect on success

## 📝 Setup Checklist

- [ ] Get Razorpay account at https://razorpay.com
- [ ] Copy Key ID from Settings → API Keys
- [ ] Update `payment.service.ts` line 15:
  ```typescript
  private razorpayKey = 'YOUR_KEY_HERE';
  ```
- [ ] Implement backend payment endpoints (see setup guide)
- [ ] Test with test cards
- [ ] Deploy to production

## 🎯 Key Files

```
src/app/
├── service/
│   ├── payment.service.ts (NEW) ✅
│   └── master.service.ts (UPDATED) ✅
└── pages/
    ├── payment/
    │   ├── payment.component.ts (NEW) ✅
    │   ├── payment.component.html (NEW) ✅
    │   └── payment.component.css (NEW) ✅
    └── booking/
        ├── booking.component.ts (UPDATED) ✅
        ├── booking.component.html (UPDATED) ✅
        └── booking.component.css (UPDATED) ✅
```

## 🔧 Configuration

### Amount per Seat
File: `booking.component.ts` line ~108
```typescript
const pricePerSeat = 500; // Change this value
```

### Razorpay Key
File: `payment.service.ts` line 15
```typescript
private razorpayKey = 'rzp_test_1234567890'; // Replace with your key
```

### Theme Color
File: `payment.service.ts` line ~67
```typescript
theme: {
  color: '#dc3545' // Change color here
}
```

## 🧪 Test Cards

| Type | Card Number | Expiry | CVV |
|------|-------------|--------|-----|
| Success | 4111 1111 1111 1111 | 12/25 | 123 |
| Failure | 4222 2222 2222 2222 | 12/25 | 123 |

## 📊 Payment Flow

```
User Selects Seats
    ↓
Fills Passenger Details
    ↓
Clicks "Confirm Booking & Pay"
    ↓
Booking Created (Backend)
    ↓
Payment Modal Opens
    ↓
User Clicks "Pay" Button
    ↓
Razorpay Checkout Opens
    ↓
Payment Processing
    ↓
Backend Verifies Signature
    ↓
✅ Redirect to Tickets / ❌ Show Error
```

## 🔐 Security

✅ Keys handled securely
✅ Signature verification required
✅ HTTPS recommended
✅ No payment data stored in frontend

## 📞 Support

**Full Setup Guide:** See `PAYMENT_GATEWAY_SETUP.md`

**Backend Implementation Sample:** See `PAYMENT_GATEWAY_SETUP.md` → Step 5

**Razorpay Docs:** https://razorpay.com/docs/

---

**Status:** ✅ Ready for implementation
