# WorkDiary Backend API

A complete production-ready backend for the WorkDiary application built with Node.js, Express.js, and MongoDB.

## Features

- **Authentication**: JWT-based auth with password hashing
- **Vehicle Management**: CRUD operations for vehicles
- **Labour Management**: CRUD operations for labour with different rate types
- **Trip Management**: Create, edit, delete, and list trips with advanced calculations
- **Reports**: Comprehensive reporting with CSV export
- **Validation**: Joi-based input validation
- **Security**: Helmet, CORS, rate limiting
- **Error Handling**: Centralized error handling

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- bcryptjs (password hashing)
- JWT (authentication)
- Joi (validation)
- fast-csv (CSV export)
- dotenv (environment variables)
- helmet (security)
- cors (cross-origin)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB Atlas connection string and other settings

5. Run the seed script to create initial data:
   ```bash
   npm run seed
   ```

6. Start the server:
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Vehicles
- `POST /api/vehicles` - Create vehicle
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get single vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Labours
- `POST /api/labours` - Create labour
- `GET /api/labours` - Get all labours
- `GET /api/labours/:id` - Get single labour
- `PUT /api/labours/:id` - Update labour
- `DELETE /api/labours/:id` - Delete labour

### Trips
- `POST /api/trips` - Create trip
- `GET /api/trips` - Get trips (with filters)
- `GET /api/trips/summary` - Get trip summary statistics
- `GET /api/trips/:id` - Get single trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Reports
- `GET /api/reports/trips` - Get trip reports (supports CSV export)
- `GET /api/reports/payments` - Get payment reports (supports CSV export)
- `GET /api/reports/dashboard` - Get dashboard statistics
- `GET /api/reports/labour-earnings` - Get labour earnings report

## Default Admin Credentials

After running the seed script:
- Email: `admin@example.com`
- Password: `Admin@123`

## Environment Variables

```env
MONGO_URI=YOUR_ATLAS_CONNECTION_STRING
JWT_SECRET=change_me
PORT=4000

DEFAULT_PER_LOAD_RATE=100
DEFAULT_PER_MEMBER_RATE=50
DEFAULT_PER_UNIT_RATE=10
CURRENCY=INR
```

## Calculation Logic

The system supports multiple calculation modes:
- **per_load**: Fixed rate per load
- **per_member**: Rate multiplied by number of members
- **per_unit**: Rate multiplied by quantity
- **mixed**: Automatically uses per_unit if quantity > 0, else per_member if members > 0, else per_load

## CSV Export

Add `?format=csv` to any report endpoint to download data as CSV:
- `/api/reports/trips?format=csv&from=2023-01-01&to=2023-12-31`
- `/api/reports/payments?format=csv&from=2023-01-01&to=2023-12-31`

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── vehicles.controller.js
│   │   ├── labours.controller.js
│   │   ├── trips.controller.js
│   │   └── reports.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   ├── Labour.js
│   │   ├── Trip.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── vehicles.js
│   │   ├── labours.js
│   │   ├── trips.js
│   │   └── reports.js
│   ├── seed/
│   │   └── seed.js            # Database seeding
│   ├── utils/
│   │   ├── calc.utils.js      # Calculation utilities
│   │   └── csv.utils.js       # CSV export utilities
│   ├── validation/
│   │   ├── trip.validation.js
│   │   └── user.validation.js
│   ├── app.js                  # Express app configuration
│   └── server.js               # Server entry point
├── .env.example                # Environment variables template
├── package.json
└── README.md
```

## License

ISC
