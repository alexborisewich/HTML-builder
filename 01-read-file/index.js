const fs = require('fs');
const path = require('path');
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let text = '';

stream.on('data', chunk => text += chunk);
stream.on('end', () => console.log(text));
stream.on('error', error => console.log('Error', error.message));