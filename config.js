const ALL_CONFIG = {
  development: {
    session: {
      // store: new RedisStore(),
      secret: 'keyboard cat',
      cookie: {
        maxAge: 10*60*1000
      },
      resave: false,
      saveUninitialized: true
    },
    redis: {
      host: '192.168.162.53',
      port: '6379',
      db: 5,
      // pass: ''
    }
  },
  production: {
    session: {
      // store: new RedisStore(),
      secret: 'keyboard cat',
      cookie: {
        maxAge: 10*60*1000,
        // secure: 1
      },
      resave: false,
      saveUninitialized: true
    },
    redis: {
      host: '127.0.0.1',
      port: '6379',
      db: 5,
      // pass: ''
    }
  }
};

module.exports = {
  getConfig: (env='development') => ALL_CONFIG[env] || {}
};