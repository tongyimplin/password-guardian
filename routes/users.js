var express = require('express');
var router = express.Router();
var baseService = require('../service/base.service');
var moment = require('moment');

/*router.use((req, res, next) => {
  if(!req.session.isLogined) {
    res.redirect('/login')
  }else {
    next();
  }
});*/

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/main', (req, res) => {
  baseService.query(`select * from v_account_list where deleteFlag=0 order by id desc`)
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
    baseService.query(`select * from t_password where accountId="${accountId}" and deleteFlag=0`)
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

router.get('/delaccount', (req, res, next) => {
  let id = req.query.id;
  if(!id) {
    res.redirect('/error');
  }else {
    baseService.update(`delete from t_password where accountId=${id}`)
      .then(updates => {
        baseService.update(`delete from t_account where id=${id}`)
          .then(up => res.redirect('main'));
      });
  }
});

router.get('/addpass', (req, res, next) => {
  baseService.unique(`select * from v_account_list where id=${req.query.accountId} limit 1`)
    .then(obj => {
      console.log(obj)
      res.render('users/addpass', {
        title: '添加密码',
        account: obj
      });
    });
});
router.post('/addpass', (req, res, next) => {
  let {accountId, passName, password, passMemo, passType} = req.body,
    modifyDate = moment().format('YYYY-MM-DD HH:mm:ss')
  ;
  if(!passMemo) passMemo = '';
  baseService.update(`
  insert into t_password(accountId, passName, password, passMemo, passType, modifyDate, createDate)
  values("${accountId}", "${passName}", "${password}", "${passMemo}", "${passType}", "${modifyDate}", "${modifyDate}")
  `)
    .then(({changes}) => res.redirect('main'))
    .catch(err => res.redirect('/error'));
});

module.exports = router;
