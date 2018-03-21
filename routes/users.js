var express = require('express');
var router = express.Router();
var baseService = require('../service/base.service');
var moment = require('moment');
var randUtil = require('../utils/rand-util');

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

//主页
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
//查询某个账号的所有密码
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

// 添加账户
router.get('/addaccount', (req, res, next) => {
  let pGetTypes = baseService.query('select * from t_account_type'),
    pGetApps = baseService.query('select * from t_app')
  ;
  Promise.all([pGetApps, pGetTypes])
    .then(([apps, types]) => {
      res.render('users/addacount', {
        title: '添加账户',
        apps, types
      })
    })
    .catch(err => console.log(err));
});
router.post('/addacount', (req, res, next) => {
  let {appId, appName, typeId, typeName, userName, loginPass} = req.body,
    pGetAppId = new Promise((resolve, reject) => {
      if(appId != -1) {
        resolve(appId);
      }else {
        baseService.update(`insert into t_app(name, memo) values("${appName}", "")`)
          .then(({lastID}) => resolve(lastID));
      }
    }),
    pGetTypeId = new Promise((resolve, reject) => {
      if(typeId != -1) {
        resolve(typeId);
      }else {
        baseService.update(`insert into t_account_type(title) values("${typeName}")`)
          .then(({lastID}) => resolve(lastID));
      }
    }),
    modifyDate = moment().format('YYYY-MM-DD HH:mm:ss')
  ;
  Promise.all([pGetAppId, pGetTypeId]).then(([newAppId, newTypeId]) => {
    baseService.update(`insert into t_account(appId, typeId, userName) 
      values(${newAppId},${newTypeId}, "${userName}")`)
      .then(({lastID}) => Promise.resolve(lastID))
      .then(newAccountId => {
        if(!loginPass) {
          loginPass = randUtil.randStr(12);
        }
        return baseService.update(`
        insert into t_password(accountId, passName, password, passMemo, createDate, modifyDate, passType)
        values(${newAccountId}, "登录密码", "${loginPass}", "", "${modifyDate}", "${modifyDate}", "0")`)
      })
      .then(() => res.redirect('main'));
  });

});

// 删除账号
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

// 删除密码
router.get('/delpass', (req, res, next) => {
  let id = req.query.id;
  if(!id) {
    res.redirect('main');
  }else {
    baseService.update(`delete from t_password where id=${id}`)
      .then(updates => res.redirect('main'));
  }
});

//给账号添加密码
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

// 更新密码
router.get('/updatepass', (req, res, next) => {
  let {id} = req.query;
  if(!id) {
    res.redirect('main');
  }else {
    baseService.update(`delete from t_password where id=${id}`)
      .then(updates => res.redirect('main'));
  }
});

module.exports = router;
