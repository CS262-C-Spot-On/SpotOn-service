const { Client } = require('pg');
const fs = require('fs');

const sql = fs.readFileSync('sql/SpotOn.sql').toString();

const client = new Client({
  connectionString:
  'postgres://asujfwrs:Rqa9fVu2WFPXhaMeIKKTvsqR-eqKGqlq@otto.db.elephantsql.com/asujfwrs',
});
console.log('Connecting to database...');
client.connect((err) => {
  if (err) throw err;
  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Database created');
  });
  console.log('Connected!');
});

module.exports = client;
