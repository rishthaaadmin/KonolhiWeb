const path = require('path');
const express = require('express');
const apiRoutes = require('./src/routes/api.routes');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4380;

app.disable('x-powered-by');
app.use(express.json({ limit: '50kb' }));

// API
app.use('/api', apiRoutes);

// Static frontend
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir, { extensions: ['html'] }));

// Errors
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Faru Digital running at http://localhost:${PORT}`);
});
