// index.js
const express = require('express');
const app = express();
const progressRoutes = require('./routes/progress');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use('/progress', progressRoutes); // Load routes
app.use(errorHandler); // Error handling middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
