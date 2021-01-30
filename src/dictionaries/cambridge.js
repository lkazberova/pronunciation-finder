const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = (word) =>
  new Promise((resolve, reject) => {
    const options = {
      uri: `https://dictionary.cambridge.org/us/dictionary/english/${word}`,
      transform: (body) => cheerio.load(body)
    };
    console.log(`\n${word}`);
    rp(options)
      .then(($) => {
        const title = $('div.di-title span.hw')
          .first()
          .text();
        const main_transcription = $('span.us span.ipa')
          .first()
          .text();
        const main_mp3 = $('span.us source')
          .first()
          .attr('src');

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
          main_mp3: 'https://dictionary.cambridge.org/' + main_mp3
        });
      })
      .catch((error) => {
        console.log(`Request error ${word}`, error);
        reject(error);
      });
  });
