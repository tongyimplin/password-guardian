var express = require('express');
var router = express.Router();

router.use((req, res, next) => {
  if(!req.session.isLogined) {
    res.render('error', {
      message: '请先登陆后再试!',
      error: {
        stack: '',
          status: 500
    }})
  }else {
    next();
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/main', (req, res) => {
  res.render('users/main', {
    title: '主页',
  });
});

module.exports = router;
