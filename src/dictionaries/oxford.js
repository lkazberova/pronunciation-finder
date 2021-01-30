const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = (word) =>
  new Promise((resolve, reject) => {
    const options = {
      // uri: `https://www.oxfordlearnersdictionaries.com/definition/english/${word}_1`,
      uri: `https://www.oxfordlearnersdictionaries.com/search/english/direct/?q=${word}`,
      transform: (body) => cheerio.load(body)
    };
    console.log(`Start to parse ${word}`);
    rp(options)
      .then(($) => {
        const title = $('h1.headword').text();
        const main_transcription = $(
          'span.phonetics > div.phons_n_am > span.phon'
        )
          .text()
          .replace(/\//g, '');
        const main_mp3 = $('span.phonetics > div.phons_n_am > div.sound').data(
          'src-mp3'
        );

        console.log(`Parsed ${word}`);

        resolve({ word, title, main_transcription, main_mp3 });
      })
      .catch((error) => {
        console.log(`Request error ${word}`, error);
        reject(error);
      });
  });
