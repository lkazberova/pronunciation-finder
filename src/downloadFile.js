const rp = require('request-promise');
const fs = require('fs');
const path = require('path');

module.exports = (url, filePath) =>
  new Promise((resolve, reject) => {
    const options = {
      uri: url,
      encoding: null
    };
    console.log(`Start download ${url}`);
    if (!url) {
      return;
    }
    rp.get(options)
      .then((res) => {
        const buffer = Buffer.from(res, 'utf8');
        fs.writeFileSync(filePath, buffer);
        console.log(`\nDownloaded ${url} to ${path.basename(filePath)}`);
        resolve(filePath);
      })
      .catch((error) => {
        console.log(`${url} has a problem`);
        resolve();
      });
  });
