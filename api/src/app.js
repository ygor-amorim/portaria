const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const authMiddleware = require('./middlewares/auth');

const app = express();
app.db = db;

// Security + body parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.get('/', (req, res) => res.json({ message: 'Portaria API is running' }));

// Auth (public)
app.use('/auth', require('./routes/auth')(app));

// Protected routes
app.use('/events', authMiddleware, require('./routes/events')(app));
app.use('/events/:eventId/rooms', authMiddleware, require('./routes/rooms')(app));
app.use('/events/:eventId/participants', authMiddleware, require('./routes/participants')(app));

// Error handler (must be last)
app.use(require('./middlewares/errorHandler'));

module.exports = app;
