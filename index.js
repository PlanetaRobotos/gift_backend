const express = require('express');
const cors = require('cors'); // Import CORS package
const app = express();
const progressRoutes = require('./routes/progress');
const errorHandler = require('./middlewares/errorHandler');

// List of allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://git-app-alpha.vercel.app'
];

// Configure CORS options dynamically
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Apply CORS with updated options

app.use(express.json()); // for parsing application/json
app.use('/progress', progressRoutes); // Load routes
app.use(errorHandler); // Error handling middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
