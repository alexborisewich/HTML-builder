const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const file = path.join(__dirname, 'text.txt');

fs.open(file, 'w', (err) => {
  if(err) throw err;
});

(function addText () {
  readline.question('Enter text here: ', (text) => {
    if (text !== 'exit') {
      fs.appendFile(file, text, (err) => {
        if(err) throw err;
        else addText();
      });
    } else {
      readline.close();
      process.exit();
    }
  });
})();

process.on('exit', () => console.log('Goodbye!'));
process.on('SIGINT', () => {
  console.log('Goodbye!');
});