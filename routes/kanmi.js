var express = require('express');
const lighthouse = require('../services/lighthouse');
const writeJson = require('../services/writeJson');
var router = express.Router();

process.on('unhandledRejection', console.dir);

/* GET home page. */
router.get('/', async function(req, res, next) {
  const url = req.query.url;
  console.log(`url:${url}`);
  res.json({ url });

  const results = await lighthouse(url);
  console.log(results);
  const aaa = writeJson(url, results);
});

module.exports = router;
