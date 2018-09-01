const fs = require('fs');
const Audio = require('audio');
// const encode = require('audio-encode/mp3')
const lame = require('lame');
const pcm = require('pcm-util');
const toStream = require('buffer-to-stream');

module.exports.addGap = (file, gap) => {
  return new Promise((resolve, reject) =>
    Audio.load(file).then((audio) => {
      audio.pad(gap);
      console.log(`${file} gap size ${gap}`);
      const format = pcm.format(audio.buffer.join());
      // create the Encoder instance
      const encoder = new lame.Encoder({
        ...format,
        // bitRate: 63,
        outSampleRate: 44100,
        mode: lame.MONO
      });

      const data = pcm.toArrayBuffer(
        audio.read({ format: 'audiobuffer' }),
        format
      );
      let buffer = Buffer.from(data);
      toStream(buffer)
        .pipe(encoder)
        .pipe(fs.createWriteStream(file))
        .on('close', function() {
          resolve();
        });
    })
  );
};
