const fs = require('fs');
const Audio = require('audio-2.0.0');
// const encode = require('audio-encode/mp3')
const lamejs = require('lamejs');
function encodeMono(channels, sampleRate, samples) {
  var buffers = [];
  var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128 / 2);
  var remaining = samples.length;
  var maxSamples = 1152;
  var length = 0;
  for (var i = 0; remaining >= maxSamples; i += maxSamples) {
    var mono = samples.subarray(i, i + maxSamples);
    var mp3buf = mp3enc.encodeBuffer(mono);
    if (mp3buf.length > 0) {
      length += mp3buf.length;
      buffers.push(Buffer.from(mp3buf));
    }
    remaining -= maxSamples;
  }
  var d = mp3enc.flush();
  if (d.length > 0) {
    length += d.length;
    buffers.push(Buffer.from(d));
  }
  var mp3data = Buffer.concat(buffers, length);
  return mp3data;
}
module.exports.addGap = (file, gap) => {
  return new Promise((resolve, reject) =>
    Audio.load(file).then((audio) => {
      audio.pad(gap);
      console.log(`${file} gap size ${gap}`);
      const samples = audio.read({ format: 'int16' });
      const mp3Data = encodeMono(audio.channels, audio.sampleRate, samples);
      fs.writeFile(file, mp3Data, (err) => resolve(file));
    })
  );
};
