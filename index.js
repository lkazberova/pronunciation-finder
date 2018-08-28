const rp = require('request-promise');
const fs = require('fs');
const cheerio = require('cheerio');
const program = require('commander');

const bluebird = require('bluebird');
const path = require('path');

program
  .version('0.1.0', '-v, --version')
  .description(
    'An application for getting transcription and audio from Oxford Advanced Learner’s Dictionary'
  )
  .usage('[options] <words>')
  .option('-p, --path [value]', 'Path for downloaded files', path.resolve('./'))
  .parse(process.argv);

const filesPath = path.normalize(program.path);
const words = program.args;

console.log(`Save to path: ${filesPath}`);
if (!filesPath) return;
const parseOxford = (word) =>
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
const downloadPromise = (url, filePath) =>
  new Promise((resolve, reject) => {
    const options = {
      uri: url,
      encoding: null
    };
    console.log(`Start download ${url}`);
    rp.get(options)
      .then((res) => {
        const buffer = Buffer.from(res, 'utf8');
        fs.writeFileSync(filePath, buffer);
        console.log(`\nDownloaded ${url} to ${path.basename(filePath)}`);
        resolve(filePath);
      })
      .catch((error) => reject(error));
  });
bluebird
  .mapSeries(words, parseOxford)
  .then((data) => {
    console.log(`result`, data);

    return bluebird.mapSeries(
      data.filter((item) => item.main_mp3 || item.mp3),
      ({ word, transcription, main_transcription, mp3, main_mp3, title }) =>
        downloadPromise(
          mp3 || main_mp3,
          `${filesPath}/${transcription ? word : title} | ${transcription ||
            main_transcription} |.mp3`
        )
    );
  })
  .then((result) => console.log('Finish'))
  .catch((error) => console.log('Error', error));
