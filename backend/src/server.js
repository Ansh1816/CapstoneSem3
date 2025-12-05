const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const gemRoutes = require('./routes/gemRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/gems', gemRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
    res.send('HiddenGems Backend is running');
});

// Routes will be imported here

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
