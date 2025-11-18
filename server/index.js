const express = require('express');
const authRouter = require('./auth/route');
const connectDB = require('./db');
const cors = require('cors');
require('dotenv').config();
const passport = require('./passport.js');
const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

connectDB();

app.use(express.json());

app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});