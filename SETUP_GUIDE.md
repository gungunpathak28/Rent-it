# RentIt - Complete Setup Guide

This is the complete guide to run the **RentIt** platform locally.

## 📦 What You Have

This project contains:
1. **Frontend** - React.js application (already in this directory)
2. **Backend** - Node.js + Express API (in `/backend` folder)

## 🚀 Quick Start Guide

### Option 1: Frontend Only (Demo Mode)

The frontend is **already configured** to work with localStorage (no backend needed for demo).

**Just view the preview** - The app will work with mock data!

Features available:
- ✅ User signup/login
- ✅ Browse items
- ✅ Owner dashboard
- ✅ Renter dashboard
- ✅ Booking system
- ✅ Payment flow
- ✅ Reviews

**Note**: Data is stored in browser localStorage and will be lost on refresh.

---

### Option 2: Full Stack (Frontend + Backend)

For a complete production setup with database persistence:

#### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb://localhost:27017/rentit
# JWT_SECRET=your_secret_key_here

# Start MongoDB (if local)
mongod

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

#### Step 2: Connect Frontend to Backend

Update the frontend to use the backend API instead of localStorage:

1. Create `/src/app/services/api.ts`:

```typescript
const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

export const api = {
  // Auth
  signup: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  
  login: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  
  // Items
  getItems: async (filters?: any) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_URL}/items?${query}`);
    return res.json();
  },
  
  // Add more API methods as needed...
};
```

2. Update `AuthContext.tsx` to use the API instead of localStorage

3. Update other components to fetch from API

#### Step 3: Run Both Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (this directory)
# The preview is already running
```

---

## 📁 Project Structure

```
rentit/
├── src/                    # Frontend React app
│   ├── app/
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Mock data & utilities
│   │   ├── App.tsx        # Main app
│   │   └── routes.tsx     # Routing config
│   └── styles/            # CSS styles
│
├── backend/               # Backend API
│   ├── config/           # Database config
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── .env.example      # Environment template
│   ├── server.js         # Entry point
│   └── README.md         # Backend docs
│
└── SETUP_GUIDE.md        # This file
```

---

## 🎯 Features Implemented

### ✅ Authentication
- JWT-based login/signup
- Role-based access (Owner/Renter)
- Protected routes
- Password hashing

### ✅ Owner Features
- Add/Edit/Delete items
- View bookings received
- Earnings dashboard
- Item management

### ✅ Renter Features
- Browse and search items
- Filter by location, category, price
- Book items with date selection
- Payment flow
- Booking history
- Write reviews

### ✅ Booking System
- Date range selection
- Availability checking
- Total amount calculation
- Booking confirmation
- Status tracking

### ✅ Payment System
- Multiple payment methods (UPI, Card, NetBanking, Wallet)
- Dummy payment integration
- Payment confirmation
- Transaction history

### ✅ Reviews & Ratings
- 5-star rating system
- Review comments
- Average rating calculation
- Review display on items

### ✅ UI/UX
- Modern Material-UI design
- Responsive layout
- Indian theme (₹, Indian cities)
- Gradient backgrounds
- Smooth transitions
- Loading states

---

## 🌐 Indian Features

- ✅ Currency: Indian Rupee (₹)
- ✅ Cities: 20 major Indian cities
- ✅ Payment methods: UPI, Cards, NetBanking, Wallets
- ✅ Categories: Relevant for Indian market

---

## 🔐 Default Test Accounts

When using localStorage mode, you can create accounts via signup.

When using backend, create accounts via API or signup form.

Example:
- Email: `owner@test.com` / Password: `password123` (Owner)
- Email: `renter@test.com` / Password: `password123` (Renter)

---

## 📝 API Documentation

See `backend/README.md` for complete API documentation including:
- All endpoints
- Request/Response formats
- Authentication headers
- Example curl commands

---

## 🚀 Deployment

### Frontend Deployment
- **Vercel**: Connect GitHub repo, auto-deploy
- **Netlify**: Drag and drop build folder
- **GitHub Pages**: Build and push to gh-pages

### Backend Deployment
- **Render**: Connect repo, set environment variables
- **Railway**: One-click deploy
- **Heroku**: Git push deployment
- **DigitalOcean**: Deploy on droplet

### Database
- **MongoDB Atlas**: Free cloud MongoDB
- **Local MongoDB**: For development

---

## 🐛 Common Issues

### Frontend won't start
- Check if port 3000 is free
- Run `npm install` again
- Clear browser cache

### Backend connection error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify port 5000 is free

### CORS errors
- Backend already has CORS enabled
- Check API_URL in frontend matches backend URL

---

## 📚 Technologies Used

**Frontend:**
- React 18
- React Router
- Material-UI
- TypeScript
- Vite

**Backend:**
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs

---

## 🎨 Customization

### Change Colors
Edit `src/styles/theme.css` for Tailwind theme tokens

### Add Categories
Update `backend/models/Item.js` and `frontend/utils/mockData.ts`

### Add Cities
Update `backend` and `frontend` city lists

### Modify Pricing
Update item price fields in forms

---

## 📞 Support

- Frontend code: Check component files in `/src/app`
- Backend code: Check `/backend/README.md`
- API issues: Check server logs
- Database issues: Check MongoDB connection

---

## ✨ Next Steps

1. **Test the demo version** (already running)
2. **Set up backend** if you need persistence
3. **Add payment gateway** (Razorpay integration)
4. **Deploy to production**
5. **Add email notifications**
6. **Implement real-time chat**

---

**Happy Renting! 🎉**

Built with ❤️ for the Indian rental market
