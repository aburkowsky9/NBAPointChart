const fs = require('fs');
const csv = require('csv-parser');

module.exports = function parseCSV() {
  return new Promise((resolve, reject) => {
    const parsedData = {
      NBAStats: [],
      teamsAvailable: [],
    };
    fs.createReadStream('sample_data/nba.csv')
      .pipe(csv())
      .on('data', (data) => {
        parsedData.NBAStats.push(data);
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        const teams = new Set();
        parsedData.NBAStats.forEach((row) => {
          teams.add(row['Visitor/Neutral']);
          teams.add(row['Home/Neutral']);
        });
        parsedData.teamsAvailable = [...teams.values()].sort();
        resolve(parsedData);
      });
  }).then(data => data)
    .catch(err => err);
};
