const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'text.txt');

fs.readFile(file, 'utf8', (error, data) => {
  if (error) throw error;
  console.log(data);
});
