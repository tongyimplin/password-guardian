const sqlite3 = require('sqlite3').verbose(),
  db = new sqlite3.Database('../db/password-guardian.db');

let SQL_createTables = [],
  SQL_preparedDatas = [];
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
  SQL_createTables.push(`DROP TABLE IF EXISTS "main"."t_account"`);
  SQL_createTables.push(`
  CREATE TABLE "main"."t_account" (
    "id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "appName"  TEXT DEFAULT 所属应用,
    "userName"  TEXT DEFAULT 用户账号,
    "userPass"  TEXT DEFAULT 用户密码,
    "typeId"  INTEGER DEFAULT 类别id,
    "createDate"  TEXT DEFAULT 创建时间,
    "modifyDate"  TEXT DEFAULT 最新的修改时间
    )
    ;`);
  SQL_preparedDatas.push(`
  INSERT INTO "main"."sqlite_sequence" (name, seq) VALUES ('t_account_type', 200);
  `);
  SQL_preparedDatas.push(`
  INSERT INTO "main"."sqlite_sequence" (name, seq) VALUES ('t_account', 1000);
  `);
  //账号所属类型
  ['个人', 'KM', 'BJ'].forEach(t => SQL_preparedDatas.push(`
  INSERT INTO "main"."t_account_type" (title) values("${t}");
  `));


  SQL_createTables.concat(SQL_preparedDatas).forEach(sql => db.run(sql));

});