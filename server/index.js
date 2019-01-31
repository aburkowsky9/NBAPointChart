const express = require('express');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const NBAData = [];

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

app.use('/', express.static(path.join(__dirname, '../public')));

fs.createReadStream('sample_data/nba.csv')
  .pipe(csv())
  .on('data', (data) => {
    NBAData.push(data);
  })
  .on('end', () => {
    console.log(NBAData.filter((row) => row['Visitor/Neutral'] === 'Portland Trail Blazers').length);
  });
