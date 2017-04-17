import server from '../server.js';

async function bearerToken(id) {
  const query = {
    provider: 'testauth',
    authCode: 'testauth-code-' + id,
    redirectUri: 'http://localhost:3000'
  }
  const token = await server.genToken(query);
  return 'Bearer ' + token;
}

module.exports = bearerToken;
