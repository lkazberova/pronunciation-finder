const cambridge = require('./cambridge');
const oxford = require('./oxford');

const dictionaries = {
  cambridge,
  oxford,
};

module.exports.getParserByName = (name) => {
  if (!dictionaries[name])
    throw new Error(`Dictionary "${name}" doesn't exist`);
  return dictionaries[name];
};
