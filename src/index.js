const Promise = require('bluebird');
const httpServer = require('./Infrastructure/HttpServer')({});

httpServer.start();

Promise.promisifyAll(require('request'));
