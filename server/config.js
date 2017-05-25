const env = process.env;
const config = { node_env: env.NODE_ENV || 'development' };

if (!env.JWT_SECRET || !env.SMTP_SERVICE || !env.SMTP_USERNAME) {
  console.log('Please provide environment variables.'.red);
  process.exit();
}

config.mongo = "mongodb://localhost/test";

config.jwt_secret = env.JWT_SECRET;
config.auth = {
  facebook: { id: env.FACEBOOK_ID, secret: env.FACEBOOK_SECRET },
  google:   { id: env.GOOGLE_ID,   secret: env.GOOGLE_SECRET },
  github:   { id: env.GITHUB_ID,   secret: env.GITHUB_SECRET },
};

if (config.node_env === 'development') {
  config.url = "http://localhost:4200";
  config.port = 3000;
  config.email = {
    service: 'console',
    name: 'WhatDev',
    sender: 'WhatDev <whatdev@localhost>',
  };
}

if (config.node_env === 'test') {
  config.url = "http://localhost:4000";
  config.port = 4000;
  config.auth = { testauth: true };
  config.email = {
    service: 'queue',
    name: 'WhatTest',
    sender: 'WhatTest <whattest@localhost>',
  };
}

if (config.node_env === 'production') {
  config.url = "http://www.whatcode.net";
  config.port = 80;
  config.mongo = "mongodb://localhost/whatcode";
  config.email = {
    service:  env.SMTP_SERVICE,
    name: env.SMTP_DISPLAY,
    sender: env.SMTP_DISPLAY + ' <' + env.SMTP_USERNAME + '>',
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
  };
}

module.exports = config;
