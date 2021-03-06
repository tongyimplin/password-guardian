var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
const env = app.get('env');
global.env = env;
const config = require('./config').getConfig(env);
console.log(`
载入环境：${env}
载入配置: ${JSON.stringify(config)}
`);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// session initialization
var sess = config.session;
sess.store = new RedisStore(config.redis);
console.log('初始化redis store')
if (env === 'production') {
  app.set('trust proxy', 1);
}
console.log('初始化session')
app.use(session(sess));
console.log('初始化session成功!')
// session count
// app.get('/', (req, res, next) => {
//
//   if(req.session.views) {
//     req.session.views++;
//     res.setHeader('Content-Type', 'text/html');
//     res.write(`<p>views: ${req.session.views}</p>`);
//     res.write(`<p>expires in: ${req.session.cookie.maxAge}</p>`);
//     res.end();
//   }else {
//     req.session.views = 1;
//     res.end('welcome to the session demo. refresh!')
//   }
// });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.contextPath = '/';
  next();
});

app.use('/', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log('初始化app.js成功!')
module.exports = app;
