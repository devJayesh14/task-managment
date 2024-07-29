const express = require('express');
const connectDB = require('./config/db');
const app = express();
const authRoutes = require('./routes/auth');
const verify = require('./middleware/authMiddleware');
const cors = require('cors');
require('dotenv').config();

// Cors Config
const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type','auth-token'
    ],
}

// Database
connectDB();

//  Middleware
app.use(cors(corsOpts));
app.use(express.json());

// Routing
app.use('/api/auth', verify, authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));