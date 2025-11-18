const express = require('express');
const authRouter = require('./auth/route');
const connectDB = require('./db');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('./passport.js');
const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

connectDB();
const ensureConnection = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  next();
};
app.use(express.json());

app.use('/api/auth', ensureConnection, authRouter);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});