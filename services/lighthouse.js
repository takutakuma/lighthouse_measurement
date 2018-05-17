const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then(chrome => {
      opts.port = chrome.port;
      return lighthouse(url, opts, config).then(results => {
        delete results.artifacts;
        delete results.report;
        return chrome.kill().then(() => {
          const scoreMap = Object.entries(results.lhr.audits).reduce(
            (acc, [key, a]) => {
              if (a.scoreDisplayMode === 'numeric') {
                return Object.assign({}, acc, { [key]: a.score });
              }
              return acc;
            },
            {}
          );

          const scoreCategories = Object.entries(results.lhr.categories).reduce(
            (acc, [key, a]) => {
              return Object.assign({}, acc, { [a.title]: a.score });
              return acc;
            },
            {}
          );

          return Object.assign(scoreCategories, scoreMap);
        });
      });
    });
}

const opts = {
  port: 0,
  autoSelectChrome: true, // False to manually select which Chrome install.
  chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
};

// Usage:
module.exports = url => {
  return launchChromeAndRunLighthouse('https://' + url, opts);
};
