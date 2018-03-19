var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/main', (req, res) => {
  res.render('users/main', {
    title: '主页'
  });
});

module.exports = router;
