const player = require('play-sound')((opts = {}));

module.exports = (file, options) =>
  new Promise((resolve, reject) => {
    console.log(`Playing ${file}`);
    player.play(file, options, (error) => {
      if (error) reject(error);
      resolve(file);
    });
  });
