const express = require('express');
const cors = require('cors');

const ApplicationRouter = require('../Router/ApplicationRouter');

class HttpServer {
  constructor() {
    this.server = express();
    this.port = 7010;
  }

  start() {
    this.server.listen(this.port);

    this.server.disable('x-powered-by');
    this.server.use(cors({ origin: true, credentials: true }));
    this.server.use('/', ApplicationRouter);
  }
}

module.exports = options => new HttpServer(options);
