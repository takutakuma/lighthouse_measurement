const fs = require('fs');
const makeDir = require('make-dir');

module.exports = (name, json) => {
  makeDir('tmp/').then(path => {
    const filename = name.replace(/\//g, '%');
    fs.appendFileSync(path + '/' + filename + '.json', JSON.stringify(json));
    console.log(`outputfile:${filename}.json`);
    return true;
  });
};
