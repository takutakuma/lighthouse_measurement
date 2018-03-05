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
        return chrome.kill().then(() =>
          results.reportCategories.map(data => ({
            name: data.name,
            score: data.score
          }))
        );
      });
    });
}

const opts = {
  port: 0,
  autoSelectChrome: true, // False to manually select which Chrome install.
  chromeFlags: [
    '--show-paint-rects',
    '--headless',
    '--disable-device-emulation',
    '--disable-gpu',
    '--enable-logging',
    '--no-sandbox'
  ]
};

// Usage:
module.exports = url => {
  return launchChromeAndRunLighthouse('https://' + url, opts);
};
