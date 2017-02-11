const env = process.env;
const config = { node_env: env.NODE_ENV || 'development' };

config.mongo = "mongodb://localhost/test";

config.jwt_secret = env.JWT_SECRET;
config.auth = {
  facebook: { id: env.FACEBOOK_ID, secret: env.FACEBOOK_SECRET },
  google: {   id: env.GOOGLE_ID,   secret: env.GOOGLE_SECRET },
  github: {   id: env.GITHUB_ID,   secret: env.GITHUB_SECRET },
}

if (config.node_env === 'development') {
  config.port = 3000;
}

if (config.node_env === 'test') {
  config.port = 4000;
  config.auth = { testauth: true };
}

if (config.node_env === 'production') {
  config.port = 80;
  config.mongo = "mongodb://localhost/whatcode";
}

module.exports = config;
