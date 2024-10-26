const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const progressRoutes = require('./routes/progress');

app.use(cors());
app.use(express.json());
app.use('/progress', progressRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Graffiti Quiz API');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.post('/test', (req, res) => {
  console.log("Test Request Body:", req.body);
  res.send("Testing JSON Middleware");
});