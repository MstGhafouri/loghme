const axios = require('axios').default;

module.exports = axios.create({
  baseURL: 'http://138.197.181.131:8080'
});
