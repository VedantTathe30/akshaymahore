const app = require('../index'); // or './index' if index.js is in root
const serverless = require('serverless-http');

module.exports = serverless(app);
