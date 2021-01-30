const cambridge = require('./cambridge');
const oxford = require('./oxford');
const macmillan = require('./macmillan');

const dictionaries = {
  cambridge,
  oxford,
  macmillan,
};

module.exports.getParserByName = (name) => {
  if (!dictionaries[name])
    throw new Error(`Dictionary "${name}" doesn't exist`);
  return dictionaries[name];
};
