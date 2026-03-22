const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const db = require('./config/database');
const authMiddleware = require('./middlewares/auth');

const app = express();
app.db = db;

// Security + body parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
    skip: () => process.env.NODE_ENV === 'test',
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many attempts, please try again later.' },
    skip: () => process.env.NODE_ENV === 'test',
});

app.use(globalLimiter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.get('/', (req, res) => res.json({ message: 'Portaria API is running' }));

// Auth (public, stricter limit)
app.use('/auth', authLimiter, require('./routes/auth')(app));

// Protected routes
app.use('/users', authMiddleware, require('./routes/users')(app));
app.use('/events', authMiddleware, require('./routes/events')(app));
app.use('/events/:eventId/rooms', authMiddleware, require('./routes/rooms')(app));
app.use('/events/:eventId/participants', authMiddleware, require('./routes/participants')(app));

// Error handler (must be last)
app.use(require('./middlewares/errorHandler'));

module.exports = app;
