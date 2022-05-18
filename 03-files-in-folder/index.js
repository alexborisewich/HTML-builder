const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');

(async function showFiles(folder) {
  try {
    const files = await readdir(folder, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        let fileName = path.basename(file.name, path.extname(file.name));
        let extension = path.extname(file.name).slice(1);
        fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
          if (!err) console.log(`${fileName} - ${extension} - ${stats.size}bytes`);
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
})(folder);