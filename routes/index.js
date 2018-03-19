var express = require('express');
var router = express.Router();
// var contextPath = router.app.get('contextPath');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', (req, res) => {
  res.render('index/login', {
    title: '登录'
  });
});

router.post('/login', (req, res) => {
  let {userName, userPass} = req.body;
  console.log(userName, userPass)
  if(userName === "admin" && userPass === "123") {
    req.session.isLogined = true;
    res.redirect('users/main');
  }else {
    res.render('index/login', {
      title: '登录',
      message: '用户名或密码有误!'
    });
  }

});

module.exports = router;
