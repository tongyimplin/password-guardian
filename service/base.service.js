const sqlite3 = require('sqlite3').verbose(),
  db = new sqlite3.Database('./db/password-guardian.db');


class SqliteDao {

  // selectDB(dbName='main') {
  //   this.db = new sqlite3.Database(dbName);
  // }
  //非查询
  update(sql) {
    return new Promise((resolve, reject) => {
      db.run(sql, function(err) {
        if(err) {
          reject(err);
        }else {
          //{changes, lastID, sql}
          resolve(this)
        }
      });
    });
  }

  // 查询
  query(sql) {
    return new Promise((resolve, reject) => {
      db.all(sql, (err, results) => {
        if(err) {
          reject(err);
        }else {
          resolve(results);
        }
      })
    });
  }

  //处理待编译的SQL
  prepareSQL(sql, params) {
    let allMatches = sql.match(/#\{[\w\d]+\}/g),
      finalSQL = sql,
      finalParams = []
    ;
    allMatches.forEach((p, pIdx) => {
      finalSQL = finalSQL.replace(p, '?');
      let key = p.substr(2, p.length-3),
        value = params[key];
      if(params instanceof Array) {
        params.forEach((p1, p1Idx) => finalParams[p1Idx][pIdx] = value);
      }else {
        finalParams[pIdx] = value;
      }
    });
    return {_sql: finalSQL, _params: finalParams}
  }

  // 参数查询，可批量还行
  prepareQuery(sql, params) {
    if(params instanceof Object && !(params instanceof Array)) {
      //合法
      let {_sql, _params} = this.prepareSQL(sql, params),
        stmt = db.prepare(_sql);
      if(params instanceof Array) {
        stmt.run(..._params);
      }else {
        _params.forEach((p, idx) => stmt.run(...p));
      }
      return new Promise((resolve, reject) => stmt.finalize(
        (err, results) => resolve(err, results)
      ));
    }else {
      throw new Error('传入的params参数必须是map结构的对象!');
    }
  }

  closeDB() {
    db.close();
  }
}

module.exports = new SqliteDao();