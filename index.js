#!/usr/bin/env node
const parseOxford = require('./src/dictionaries/oxford');
const parseCambridge = require('./src/dictionaries/cambridge');
const downloadPromise = require('./src/downloadFile');
const { addGap } = require('./src/audio');

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
  .option(
    '-p, --path [value]',
    'Path for downloaded files',
    path.resolve(__dirname)
  )
  .option(
    '-d, --dictionary [value]',
    'Dictionary [oxford, cambridge]',
    /^(oxford|cambridge)$/i,
    'cambridge'
  )
  .option('-g', '--gap [value]', 'Add gap [value] sec to the end of file', 0)
  .parse(process.argv);

const destination = path.normalize(program.path);
const words = program.args;
const parser = program.dictionary === 'oxford' ? parseOxford : parseCambridge;
const gap = program.gap;
console.log(`Save to path: ${destination}`);
if (!destination) return;
const constructFilePath = (
  destination,
  { word, transcription, main_transcription, mp3, main_mp3, title }
) => {
  return path.join(
    destination,
    `${transcription ? word : title} | ${transcription ||
      main_transcription} |.mp3`
  );
};
bluebird
  .mapSeries(words, parser)
  .then((data) => {
    return bluebird.mapSeries(
      data.filter((item) => item.main_mp3 || item.mp3),
      (result) =>
        downloadPromise(
          result.mp3 || result.main_mp3,
          constructFilePath(destination, result)
        ).then((file) => (gap > 0 ? addGap(file) : file))
    );
  })
  .then((result) => console.log('Finish'))
  .catch((error) => console.log('Error', error));
