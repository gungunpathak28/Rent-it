# RentIt Backend API

Complete Node.js + Express + MongoDB backend for the RentIt platform.

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file with your settings:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rentit
   JWT_SECRET=your_secure_secret_key_here
   NODE_ENV=development
   ```

5. **Start MongoDB**
   - **Local MongoDB**: 
     ```bash
     mongod
     ```
   - **MongoDB Atlas**: Use the connection string from your cluster

6. **Run the server**
   - Development mode (with auto-restart):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

7. **Server will start at**: `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── itemController.js  # Item CRUD operations
│   ├── bookingController.js # Booking management
│   └── reviewController.js # Review system
├── middleware/
│   └── auth.js            # JWT authentication & authorization
├── models/
│   ├── User.js            # User schema
│   ├── Item.js            # Item schema
│   ├── Booking.js         # Booking schema
│   └── Review.js          # Review schema
├── routes/
│   ├── auth.js            # Auth routes
│   ├── items.js           # Item routes
│   ├── bookings.js        # Booking routes
│   └── reviews.js         # Review routes
├── .env.example           # Environment template
├── package.json
├── README.md
└── server.js              # Main entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create item (owner only)
- `PUT /api/items/:id` - Update item (owner only)
- `DELETE /api/items/:id` - Delete item (owner only)
- `GET /api/items/my-items` - Get owner's items (owner only)

### Bookings
- `POST /api/bookings` - Create booking (renter only)
- `GET /api/bookings/my-bookings` - Get renter's bookings (renter only)
- `GET /api/bookings/owner-bookings` - Get owner's bookings (owner only)
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking status

### Reviews
- `POST /api/reviews` - Create review (renter only)
- `GET /api/reviews/item/:itemId` - Get item reviews

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How to use:

1. **Sign up or login** to get a token
2. **Include token** in requests:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

## 📝 Example API Requests

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "renter"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Items (with filters)
```bash
curl "http://localhost:5000/api/items?location=Mumbai&category=Electronics"
```

### Create Item (Owner)
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "DSLR Camera",
    "category": "Cameras & Photography",
    "condition": "Like New",
    "pricePerDay": 800,
    "location": "Mumbai",
    "description": "Professional camera for rent",
    "image": "https://example.com/image.jpg"
  }'
```

### Create Booking (Renter)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "itemId": "ITEM_ID",
    "startDate": "2026-04-15",
    "endDate": "2026-04-20",
    "totalAmount": 4000
  }'
```

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based authorization (Owner/Renter)
- Protected routes
- Input validation

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/rentit |
| JWT_SECRET | Secret for JWT signing | your_secret_key |
| NODE_ENV | Environment | development/production |

## 📊 Database Models

### User
- name, email, password (hashed), role (owner/renter)

### Item
- ownerId, name, category, condition, pricePerDay, location, image, description, rating, reviewCount

### Booking
- itemId, renterId, ownerId, startDate, endDate, totalAmount, status, paymentStatus

### Review
- bookingId, itemId, renterId, rating, comment

## 🚀 Deployment

### Deploy to Production

1. **Set environment to production**
   ```
   NODE_ENV=production
   ```

2. **Use MongoDB Atlas** for cloud database

3. **Deploy to platforms**:
   - Render
   - Heroku
   - Railway
   - DigitalOcean
   - AWS EC2

4. **Update frontend API URL** to point to deployed backend

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For Atlas, whitelist your IP address

### Port Already in Use
```bash
# Change PORT in .env or kill the process
lsof -ti:5000 | xargs kill
```

### JWT Errors
- Ensure JWT_SECRET is set in .env
- Check token format in Authorization header

## 📞 Support

For issues or questions, check the code comments or create an issue in the repository.

---

**RentIt Backend** - Built with Node.js, Express, and MongoDB
