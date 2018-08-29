#!/usr/bin/env node
const parseOxford = require('./src/dictionaries/oxford');
const parseCambridge = require('./src/dictionaries/cambridge');
const downloadPromise = require('./src/downloadFile');

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
  .option(
    '-d, --dictionary [value]',
    'Dictionary [oxford, cambridge]',
    /^(oxford|cambridge)$/i,
    'cambridge'
  )
  .parse(process.argv);

const filesPath = path.normalize(program.path);
const words = program.args;
const parser = program.dictionary === 'oxford' ? parseOxford : parseCambridge;

console.log(`Save to path: ${filesPath}`);
if (!filesPath) return;
bluebird
  .mapSeries(words, parser)
  .then((data) => {
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
