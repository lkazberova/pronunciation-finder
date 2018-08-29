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
        const title = $('h2.h').text();
        const main_transcription = $(
          'div.top-g > div.pron-gs.ei-g span.pron-g[geo="n_am"] > span.phon'
        )
          .text()
          .replace('NAmE', '')
          .replace(/\//g, '');
        const main_mp3 = $(
          'div.top-g > div.pron-gs.ei-g div.sound.audio_play_button.pron-us.icon-audio'
        ).data('src-mp3');

        let additional = {};
        if (title !== word) {
          const filtered = $('div.top-container .collapse span.vp')
            .children()
            .filter((i, item) => item.next.data.indexOf(word) !== -1);
          if (filtered.length > 0) {
            const parentId = $('div.top-container .collapse span.vp')
              .children()
              .filter((i, item) => item.next.data.indexOf(word) !== -1)[0]
              .parent.parent.attribs.id;
            const transcription = $(
              `span#${parentId} div.pron-gs.ei-g span.pron-g[geo="n_am"] > span.phon`
            )
              .text()
              .replace('NAmE', '')
              .replace(/\//g, '');
            const mp3 = $(
              `span#${parentId} div.sound.audio_play_button.pron-us.icon-audio`
            ).data('src-mp3');
            if (transcription && mp3) additional = { transcription, mp3 };
          }
        }
        console.log(`Parsed ${word}`);

        resolve({ word, title, main_transcription, main_mp3, ...additional });
      })
      .catch((error) => {
        console.log(`Request error ${word}`, error);
        reject(error);
      });
  });
