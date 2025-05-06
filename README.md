# Booking Management System (BMS)

A full-stack web application for managing hoarding bookings, built with React, Node.js, and MongoDB.

## Live Demo

- Frontend: [https://bms-nine-gamma.vercel.app](https://bms-nine-gamma.vercel.app)
- Backend: [https://bms-backend-ohgi.onrender.com/api](https://bms-backend-ohgi.onrender.com/api)

## Features

### User Features
- User registration and authentication
- View available hoardings with details
- Book hoardings with date selection
- View booking history
- Update booking status
- Cancel bookings

### Admin Features
- Manage hoardings (CRUD operations)
- View all bookings
- Approve/reject bookings

## Tech Stack

### Frontend
- React.js
- Material-UI (MUI)
- Axios for API calls
- React Router for navigation
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Rate limiting for API protection

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Clone the repository
```bash
git clone <repository-url>
cd bms-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development server
```bash
npm run dev
```

### Frontend Setup
1. Navigate to the frontend directory
```bash
cd bms-ui
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Hoardings
- GET `/api/hoardings` - Get all hoardings
- GET `/api/hoardings/:id` - Get specific hoarding
- POST `/api/hoardings` - Create hoarding (admin)
- PUT `/api/hoardings/:id` - Update hoarding (admin)
- DELETE `/api/hoardings/:id` - Delete hoarding (admin)

### Bookings
- GET `/api/bookings` - Get all bookings (admin)
- GET `/api/bookings/my-bookings` - Get user's bookings
- POST `/api/bookings` - Create booking
- PUT `/api/bookings/:id/status` - Update booking status
- PUT `/api/bookings/:id/payment` - Update payment status
- DELETE `/api/bookings/:id` - Cancel booking

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS protection
- Input validation
- Error handling middleware

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

