import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import customerRoutes from './routes/customer.routes.js';
import reservationRoutes from './routes/reservation.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const MySQLStore = MySQLStoreFactory(session);

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'swift_wheels',
  createDatabaseTable: true
});

const defaultClientOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const envClient = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(s => s.trim()) : [];
const allowedOrigins = [...new Set([...defaultClientOrigins, ...envClient])];

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      if (!incomingOrigin) return callback(null, true);
      if (allowedOrigins.includes(incomingOrigin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.use(express.json());

app.use(
  session({
    name: 'swift_wheels_session',
    secret: process.env.SESSION_SECRET || 'development_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 2
    }
  })
);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Swift Wheels API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reservations', reservationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
