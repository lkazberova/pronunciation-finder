const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = (word) =>
  new Promise((resolve, reject) => {
    const options = {
      uri: `https://www.macmillandictionary.com/us/dictionary/american/${word}`,
      transform: (body) => cheerio.load(body),
    };
    console.log(`\n${word}`);
    rp(options)
      .then(($) => {
        const title = $('h1 span.BASE').first().text();
        const main_transcription = $('div.PRONS span.PRON')
          .text()
          .trim()
          .replace(/\//g, '');
        const main_mp3 = $('div.PRONS span.sound').data('src-mp3');

        if (!main_mp3) {
          console.log(`${word}\t\tnot found\t\t!!!`);
          resolve({});
          return;
        }
        console.log(`${word}\t\t${main_transcription}`);
        resolve({
          word,
          title,
          main_transcription,
          main_mp3,
        });
      })
      .catch((error) => {
        console.log(`Request error ${word}`, error);
        reject(error);
      });
  });
