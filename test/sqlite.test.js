const sqlite3 = require('sqlite3').verbose(),
  moment = require('moment'),
  randUtil = require('../utils/rand-util'),
  db = new sqlite3.Database('../db/password-guardian.db');

let SQL_createTables = [],
  SQL_preparedDatas = [];

//创建表
SQL_createTables.push(`
  DROP TABLE IF EXISTS "main"."t_account_type"
  `);
SQL_createTables.push(`
  CREATE TABLE "main"."t_account_type" (
  "id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title"  TEXT DEFAULT 标题
  )
  ;
  `);
SQL_createTables.push(`
  DROP TABLE IF EXISTS "main"."t_app"
`);
SQL_createTables.push(`
CREATE TABLE "main"."t_app" (
"id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
"name"  TEXT DEFAULT 应用名称,
"memo" TEXT DEFAULT 备注
)
;
`);
SQL_createTables.push(`DROP TABLE IF EXISTS "main"."t_password"`);
SQL_createTables.push(`
CREATE TABLE "main"."t_password" (
"id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
"accountId"  INTEGER DEFAULT 账户id,
"passName"  TEXT DEFAULT 普通名词,
"password"  TEXT DEFAULT 密码,
"passMemo"  TEXT DEFAULT 密码备注
)
;
`);
SQL_createTables.push(`DROP TABLE IF EXISTS "main"."t_account"`);
SQL_createTables.push(`
  CREATE TABLE "main"."t_account" (
    "id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "appId"  TEXT DEFAULT 所属应用id,
    "userName"  TEXT DEFAULT 用户账号,
    "typeId"  INTEGER DEFAULT 类别id,
    "createDate"  TEXT DEFAULT 创建时间,
    "modifyDate"  TEXT DEFAULT 最新的修改时间
    )
    ;`);
SQL_createTables.push(`DROP VIEW IF EXISTS v_account_list`);
SQL_createTables.push(`
CREATE VIEW v_account_list AS
SELECT
	ta.*, tat.title AS typeName,
	tp.name AS appName,
	tp.memo AS appMemo
FROM
	t_account ta
LEFT JOIN t_account_type tat ON ta.typeId = tat.id
LEFT JOIN t_app tp ON ta.appId = tp.id
`);

SQL_preparedDatas.push(`
  INSERT INTO "main"."sqlite_sequence" (name, seq) VALUES ('t_account_type', 200);
  `);
SQL_preparedDatas.push(`
  INSERT INTO "main"."sqlite_sequence" (name, seq) VALUES ('t_app', 100);
`);
SQL_preparedDatas.push(`
  INSERT INTO "main"."sqlite_sequence" (name, seq) VALUES ('t_account', 1000);
  `);
SQL_preparedDatas.push(`
INSERT INTO "main"."sqlite_sequence" (name, seq) VALUES ('t_password', 1000);
`);
//账号所属类型
[
  {id: 201, title: '个人'},
  {id: 202, title: 'KM'},
  {id: 203, title: 'BJ'},
].forEach(t => SQL_preparedDatas.push(`
  INSERT INTO "main"."t_account_type" (id, title) values("${t.id}", "${t.title}");
  `));
//应用
[
  {id: 101, name: 'QQ', memo: 'Tecent QQ'},
  {id: 102, name: '微信', memo: 'Tecent Wechat'},
  {id: 103, name: 'RTX', memo: 'Tecent RTX'},
  {id: 104, name: '中国银行APP', memo: 'China Bank APP'},
].forEach(t => SQL_preparedDatas.push(`
INSERT INTO "main"."t_app" (id, name, memo) values("${t.id}", "${t.name}", "${t.memo}")
`));
//账号
let modifyDate = createDate = moment().format('YYYY-MM-DD HH:mm:ss');
[
  {id: 1001, appId: 101, userName:'461415520', typeId: 201, createDate, modifyDate},
  {id: 1002, appId: 104, userName:'62284804623554', typeId: 201, createDate, modifyDate},
].forEach(({id, appId, userName, typeId, createDate, modifyDate}) => SQL_preparedDatas.push(`
INSERT INTO "main"."t_account" (id, appId, userName, typeId, createDate, modifyDate)
values("${id}","${appId}","${userName}","${typeId}","${createDate}","${modifyDate}");
`));
//账号密码
[
  {id:1001, accountId:1001, passName:"登录密码", passMemo:"", password:randUtil.randStr(12)},
  {id:1002, accountId:1002, passName:"登录密码", passMemo:"", password:randUtil.randStr(12)},
  {id:1003, accountId:1002, passName:"支付密码", passMemo:"", password:randUtil.randomBankPass(6)},
].forEach(({id, accountId, passName, passMemo, password}) => SQL_preparedDatas.push(`
INSERT INTO "main"."t_password" (id, accountId, passName, passMemo, password) 
VALUES("${id}","${accountId}","${passName}","${passMemo}","${password}");
`));


db.serialize(() => {
  // db.run('create table lorem (info TEXT)');

  // let stmt = db.prepare('INSERT INTO lorem VALUES(?)');
  // for (let i=0; i<10; i++) {
  //   stmt.run("Ipsum "+i);
  // }
  // stmt.finalize();
  //
  // db.each("select rowid as id, info from lorem", (err, row) => {
  //   console.log(row.id + ": "+row.info);
  // });

  //
  SQL_createTables.concat(SQL_preparedDatas).forEach(sql => db.run(sql, function(err){
    if(err) {
      console.log(sql, err)
    }
  }));

});