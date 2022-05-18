const fs = require('fs');
const { readdir, readFile } = require('fs/promises');
const path = require('path');
const folder = path.join(__dirname, 'styles');

(async function mergeStyles() {
  const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
  fs.open(bundle, 'w', (err) => {
    if(err) throw err;
  });
  let styles = [];
  const files = await readdir(folder, {withFileTypes: true});
  for await (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      let fileData = await readFile(path.join(__dirname, 'styles', file.name),
        'utf-8');
      styles.push(fileData);
    }
  }
  fs.appendFile(bundle, styles.join('\n'), (err) => {
    if(err) throw err;
  });
})(folder);