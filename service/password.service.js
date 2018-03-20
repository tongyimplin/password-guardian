const baseService = require('./base.service');

// baseService.update('insert into t_account_type(title) values("测试")')
//   .then(results => console.log(results))
baseService.update('update t_account_type set title="航海" where id=208')
  .then(({sql, lastID, changes}) => console.log(sql, lastID, changes))

baseService.query('select * from t_account_type')
  .then((results) => console.log(results))
  .catch(err => {
    console.log(err)
  })
;

