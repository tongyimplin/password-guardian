var express = require('express');
var router = express.Router();
var baseService = require('../service/base.service')

router.use((req, res, next) => {
  if(!req.session.isLogined) {
    res.redirect('/login')
  }else {
    next();
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/main', (req, res) => {
  baseService.query(`select * from v_account_list order by id desc`)
    .then((results) => {
      res.render('users/main', {
        title: '主页',
        lists: results
      });
    })
    .catch(function(err) {
      res.render('users/main', {
        title: '发生了错误',
      });
    });
});

router.get('/getAllPasswords', (req, res) => {
  let {accountId} = req.query;
  if(!accountId) {
    res.json({
      status: -1,
      message: '您传入的accountId为空'
    });
  }else {
    baseService.query(`select * from t_password where accountId="${accountId}"`)
      .then(results => {
        res.json({
          status: 1,
          list: results
        });
      })
      .catch(err => res.json({
        status: -1,
        message: "发生了错误",
        error: err
      }));
  }
});

module.exports = router;
