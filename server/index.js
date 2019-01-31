const express = require('express');
const path = require('path');
const parseCSV = require('./model.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

app.use('/', express.static(path.join(__dirname, '../public')));

app.get('/pointsData', async (req, res) => {
  try {
    const data = await parseCSV();
    res.send(data);
  } catch (err) {
    res.send(err);
  }
});
