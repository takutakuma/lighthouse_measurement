var express = require('express');
const fs = require('fs');
var router = express.Router();

process.on('unhandledRejection', console.dir);

/* GET home page. */
router.get('/', function(req, res, next) {
  const url = req.query.url;
  console.log(`url:${url}`);
  const filename = url.replace(/\//g, '%');
  fs.readFile(`tmp/${filename}.json`, 'utf8', (error, data) => {
    if (error) {
      res.json(error);
      return;
    }
    res.json(JSON.parse(data));
    //ファイル削除
    fs.unlink(`tmp/${filename}.json`, function(err) {
      if (err) {
        throw err;
      }
    });
  });
});

module.exports = router;
