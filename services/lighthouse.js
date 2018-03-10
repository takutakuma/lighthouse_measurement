const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const perfConfig = require('lighthouse/lighthouse-core/config/perf.json');

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then(chrome => {
      opts.port = chrome.port;
      return lighthouse(url, opts, config).then(results => {
        // The gathered artifacts are typically removed as they can be quite large (~50MB+)
        delete results.artifacts;
        return chrome.kill().then(() => {
          const scoreMap = Object.entries(results.audits).reduce(
            (acc, [key, a]) => {
              if (typeof a.score === 'number') {
                return Object.assign({}, acc, { [key]: a.score });
              }
              return acc;
            },
            {}
          );

          const scoreCategories = Object.entries(
            results.reportCategories
          ).reduce((acc, [key, a]) => {
            return Object.assign({}, acc, { [a.name]: a.score });
            return acc;
          }, {});

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
