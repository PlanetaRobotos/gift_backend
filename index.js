// index.js
const express = require('express');
const cors = require('cors'); // Import CORS package
const app = express();
const progressRoutes = require('./routes/progress');
const errorHandler = require('./middlewares/errorHandler');

// Configure CORS to allow requests from http://localhost:3000
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json()); // for parsing application/json
app.use('/progress', progressRoutes); // Load routes
app.use(errorHandler); // Error handling middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
