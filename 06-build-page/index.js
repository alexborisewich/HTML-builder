const path = require('path');
const { readdir, readFile, copyFile, mkdir, writeFile, appendFile } = require('fs/promises');

(async function buildPage() {
  const assetsSrcDir = path.join(__dirname, 'assets');
  await mkdir(path.join(__dirname, 'project-dist/assets'), {recursive: true});

  const pageCompSrcDir = path.join(__dirname, 'components');
  const pageTemplateFile = path.join(__dirname, 'template.html');
  const pageDestFile = path.join(__dirname, 'project-dist', 'index.html');
  await writeFile(pageDestFile, '');

  const stylesSrcDir = path.join(__dirname, 'styles');
  const styleDestFile = path.join(__dirname, 'project-dist', 'style.css');
  await writeFile(styleDestFile, '');

  (async function copyAssets (srcDir) {
    const files = await readdir(srcDir, {withFileTypes: true});
    for await (const file of files) {
      const filePath = path.resolve(srcDir, file.name);
      if (file.isDirectory()) {
        mkdir(path.join(filePath.replace('assets', 'project-dist/assets')), {recursive: true});
        copyAssets(filePath);
      } else if (file.isFile()) {
        copyFile(path.join(filePath), path.join(filePath.replace('assets', 'project-dist/assets')));
      }
    }
  })(assetsSrcDir);

  (async function mergePage (srcDir, tempFile) {
    let tempData = await readFile(tempFile, 'utf8');
    const files = await readdir(srcDir, {withFileTypes: true});
    for await (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        if (tempData.includes(path.basename(file.name, path.extname(file.name)))) {
          const fileData = await readFile(path.resolve(srcDir, file.name), 'utf8');
          tempData = tempData.replace(`{{${path.basename(file.name, path.extname(file.name))}}}`, fileData);
        }
      }
    }
    appendFile(pageDestFile, tempData);
  })(pageCompSrcDir, pageTemplateFile);

  (async function mergeStyles (srcDir) {
    let stylesArr = [];
    const files = await readdir(srcDir, {withFileTypes: true});
    for await (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const fileData = await readFile(path.resolve(srcDir, file.name), 'utf-8');
        stylesArr.push(fileData);
      }
    }
    appendFile(styleDestFile, stylesArr.reverse().join('\n'));
  })(stylesSrcDir);
})();