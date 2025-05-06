# Hoarding Booking Management System

A full-stack web application for managing outdoor hoarding (billboard) bookings. This system allows users to browse available hoardings, make bookings, and manage their booking history.

## Features

- User Authentication
  - Sign up and login functionality
  - JWT-based authentication
- Hoarding Management
  - Browse available hoardings
  - Filter hoardings by city
  - Add new hoarding listings
  - View hoarding details
- Booking System
  - Request bookings for available hoardings
  - View booking history
  - Manage booking status (confirm/cancel)

## Tech Stack

- Frontend:
  - React.js
  - Material-UI
  - React Router
  - React Hook Form
  - Yup (form validation)
- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bms-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API services
  ├── utils/         # Utility functions
  ├── App.jsx        # Main application component
  └── main.jsx       # Application entry point
```

## API Endpoints

The following API endpoints are available:

- Authentication:
  - POST /api/auth/register
  - POST /api/auth/login
- Hoardings:
  - GET /api/hoardings
  - POST /api/hoardings
  - GET /api/hoardings/:id
- Bookings:
  - GET /api/bookings
  - POST /api/bookings
  - PUT /api/bookings/:id
  - DELETE /api/bookings/:id

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- React Hook Form for form handling
- Yup for form validation
