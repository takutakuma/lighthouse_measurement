var express = require('express');
const lighthouse = require('../services/lighthouse');
var router = express.Router();

process.on('unhandledRejection', console.dir);

/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log(`url:${req.query.url}`);
  const results = await lighthouse(req.query.url);
  res.json(results);
});

module.exports = router;
