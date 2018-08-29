const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = (word) =>
  new Promise((resolve, reject) => {
    const options = {
      uri: `https://dictionary.cambridge.org/us/dictionary/english/${word}`,
      transform: (body) => cheerio.load(body)
    };
    console.log(`Cambridge ${word}`);
    rp(options)
      .then(($) => {
        const title = $('div.di-title span.hw')
          .first()
          .text();
        const main_transcription = $('span.ipa')
          .first()
          .text();
        const main_mp3 =
          'https://dictionary.cambridge.org/' +
          $('span.audio_play_button')
            .first()
            .data('src-mp3');

        console.log(`Cambridge ${word} ${main_transcription}`);

        resolve({ word, title, main_transcription, main_mp3 });
      })
      .catch((error) => {
        console.log(`Request error ${word}`, error);
        reject(error);
      });
  });
