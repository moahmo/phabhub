const express = require('express');
const cors = require('cors');
const config = require('../config');

const ApplicationRouter = require('../Router/ApplicationRouter');

const { PORT = config.server.port } = process.env;

class HttpServer {
  constructor() {
    this.server = express();
    this.port = PORT;
  }

  start() {
    this.server.listen(this.port);

    this.server.disable('x-powered-by');
    this.server.use(cors({ origin: true, credentials: true }));
    this.server.use('/', ApplicationRouter);
  }
}

module.exports = options => new HttpServer(options);
