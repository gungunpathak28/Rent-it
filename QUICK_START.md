# 🚀 RentIt - Quick Start (Copy-Paste Ready)

## ⚡ Fastest Way to Run

### The app is ALREADY RUNNING in demo mode!

Just use the preview - it works with localStorage (no backend needed).

**Test it now:**
1. Click "Sign Up"
2. Create an account (choose Owner or Renter)
3. Browse items or add your own
4. Make bookings
5. Process payments

---

## 🔧 Full Stack Setup (5 Minutes)

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Install packages
npm install

# Create environment file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rentit
JWT_SECRET=rentit_super_secret_key_2026
NODE_ENV=development
EOF

# Start MongoDB (if you have it locally)
mongod

# OR use MongoDB Atlas (cloud - free tier)
# Visit: https://www.mongodb.com/cloud/atlas
# Get connection string and replace MONGODB_URI

# Start backend
npm run dev
```

**Backend ready at:** `http://localhost:5000`

---

### Step 2: Test Backend

```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Owner",
    "email": "owner@test.com",
    "password": "password123",
    "role": "owner"
  }'

# Test login (copy the token from response)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@test.com",
    "password": "password123"
  }'
```

---

## 📱 What's Already Built

### ✅ Complete Features

**Authentication:**
- JWT-based login/signup
- Role-based access (Owner/Renter)
- Protected routes
- Secure password hashing

**Owner Dashboard:**
- Add/Edit/Delete items
- View bookings received
- Earnings tracking
- Item management

**Renter Dashboard:**
- Browse items with search
- Filter by location, category, price
- Book items with dates
- Payment processing
- Booking history
- Write reviews

**Additional Features:**
- 5-star rating system
- Multiple payment methods
- Indian cities & currency (₹)
- Responsive design
- Real-time updates

---

## 🎯 User Flows

### Owner Flow:
1. Sign Up → Select "Owner"
2. Dashboard → Add Item
3. Fill item details (name, category, price, location)
4. View bookings received
5. Track earnings

### Renter Flow:
1. Sign Up → Select "Renter"
2. Browse items on home page
3. Filter by city/category/price
4. Click "View Details" → "Book Now"
5. Select dates → Proceed to payment
6. Complete payment
7. Write review after booking

---

## 🗂️ File Structure Reference

```
Frontend (React):
src/app/
├── components/
│   ├── Layout.tsx              # Navigation & footer
│   └── ProtectedRoute.tsx      # Route protection
├── context/
│   └── AuthContext.tsx         # Authentication state
├── pages/
│   ├── Home.tsx                # Browse items
│   ├── Login.tsx               # Login page
│   ├── Signup.tsx              # Registration
│   ├── ItemDetails.tsx         # Item detail view
│   ├── OwnerDashboard.tsx      # Owner dashboard
│   ├── RenterDashboard.tsx     # Renter dashboard
│   ├── AddItem.tsx             # Add item form
│   ├── EditItem.tsx            # Edit item form
│   ├── BookItem.tsx            # Booking form
│   ├── Payment.tsx             # Payment page
│   └── NotFound.tsx            # 404 page
├── utils/
│   └── mockData.ts             # Data utilities
├── App.tsx                     # Main app
└── routes.tsx                  # Route config

Backend (Node.js):
backend/
├── config/db.js                # MongoDB setup
├── controllers/                # Business logic
│   ├── authController.js
│   ├── itemController.js
│   ├── bookingController.js
│   └── reviewController.js
├── models/                     # MongoDB schemas
│   ├── User.js
│   ├── Item.js
│   ├── Booking.js
│   └── Review.js
├── routes/                     # API routes
│   ├── auth.js
│   ├── items.js
│   ├── bookings.js
│   └── reviews.js
├── middleware/auth.js          # JWT auth
└── server.js                   # Entry point
```

---

## 🔗 API Endpoints Cheat Sheet

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (auth required)

### Items
- `GET /api/items` - List all items
- `GET /api/items/:id` - Get item
- `POST /api/items` - Create (owner only)
- `PUT /api/items/:id` - Update (owner only)
- `DELETE /api/items/:id` - Delete (owner only)
- `GET /api/items/my-items` - Owner's items

### Bookings
- `POST /api/bookings` - Create booking (renter only)
- `GET /api/bookings/my-bookings` - Renter bookings
- `GET /api/bookings/owner-bookings` - Owner bookings
- `GET /api/bookings/:id` - Booking details
- `PUT /api/bookings/:id` - Update booking

### Reviews
- `POST /api/reviews` - Create review (renter only)
- `GET /api/reviews/item/:itemId` - Item reviews

---

## 🎨 Customization Quick Guide

### Change Brand Color
Frontend: Gradient is in `Layout.tsx` and `Home.tsx`
```tsx
background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
```

### Add New City
1. Frontend: `src/app/utils/mockData.ts` → `indianCities` array
2. Backend: No changes needed (cities are not validated)

### Add New Category
1. Frontend: `src/app/utils/mockData.ts` → `categories` array
2. Backend: `backend/models/Item.js` → `category` enum array

### Modify Pricing
Update `pricePerDay` fields in item forms

---

## 🚀 Deployment Commands

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy to Vercel
npm i -g vercel
vercel

# Deploy to Netlify
npm i -g netlify-cli
netlify deploy
```

### Backend (Render/Railway)
```bash
# Render: Connect GitHub repo
# Railway: railway up

# Environment variables to set:
# - MONGODB_URI
# - JWT_SECRET
# - NODE_ENV=production
```

---

## 💡 Pro Tips

1. **For demo**: Just use the app as-is with localStorage
2. **For development**: Run backend locally with MongoDB
3. **For production**: Use MongoDB Atlas + deploy backend
4. **Testing**: Use different browsers for owner/renter accounts
5. **Data**: Frontend includes 4 mock items to start with

---

## 📞 Troubleshooting

**Frontend won't preview?**
- Refresh the page
- Check browser console for errors

**Backend won't start?**
- Ensure MongoDB is running: `mongod`
- Check if port 5000 is free: `lsof -i :5000`
- Verify .env file exists

**Can't login?**
- Check email/password
- Ensure account was created
- Check browser console

**Items not showing?**
- In demo mode: localStorage might be cleared
- With backend: Check MongoDB connection

---

## ✨ What's Next?

1. ✅ Test the working demo
2. ✅ Explore all features
3. 🔄 Set up backend (optional)
4. 🎨 Customize branding
5. 🚀 Deploy to production
6. 💳 Add real payment gateway (Razorpay)
7. 📧 Add email notifications
8. 💬 Add chat feature

---

**Everything is ready! Start exploring the app now! 🎉**
