#!/usr/bin/env node
const getParserByName = require('./src/dictionaries').getParserByName;
const downloadPromise = require('./src/downloadFile');
const autoplayFile = require('./src/autoplay');
const { addGap } = require('./src/audio');

const program = require('commander');

const bluebird = require('bluebird');
const path = require('path');

program
  .version('0.6.0', '-v, --version')
  .description(
    'An application for getting transcription and audio from Oxford Advanced Learner’s Dictionary, Cambridge Dictionary'
  )
  .usage('[options] <words>')
  .option('-p, --path [value]', 'Path for downloaded files', path.resolve('./'))
  .option(
    '-d, --dictionary [value]',
    'Dictionary [oxford, cambridge]',
    /^(oxford|cambridge)$/i,
    'cambridge'
  )
  .option('-g, --gap [value]', 'Add gap [value] sec to the end of file', 0)
  .option('--play', 'Auto play files after downloading', false)
  .option(
    '-c, --concurrency [value]',
    'Indicate how much process will start',
    5
  )
  .parse(process.argv);

const destination = path.normalize(program.path);
const words = program.args;
const parser = getParserByName(program.dictionary);
const gap = program.gap;
const concurrency = program.concurrency;
const autoplay = program.play;
console.log(`Save to path: ${destination}, concurrency: ${concurrency}`);
if (!destination) return;
const constructFilePath = (
  destination,
  { word, transcription, main_transcription, mp3, main_mp3, title }
) => {
  const name = word === title ? word : title;
  if (process.platform === 'win32')
    return path.join(
      destination,
      `${name} ${transcription || main_transcription}.mp3`
    );
  return path.join(
    destination,
    `${name} | ${transcription || main_transcription} |.mp3`
  );
};
bluebird
  .map(words, parser, { concurrency: +concurrency })
  .then((data) =>
    bluebird.map(
      data.filter((item) => item.main_mp3 || item.mp3),
      (result) =>
        downloadPromise(
          result.mp3 || result.main_mp3,
          constructFilePath(destination, result)
        ).then((file) => (gap > 0 && file ? addGap(file, +gap) : file)),
      { concurrency: +concurrency }
    )
  )
  .then((files) =>
    autoplay
      ? bluebird.mapSeries(
          files.filter((file) => !!file),
          autoplayFile
        )
      : files
  )
  .then((result) => console.log('Finish'))
  .catch((error) => console.log('Error', error));
