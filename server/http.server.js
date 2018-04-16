const express = require('express');

class HttpServer {
    constructor(options) {
        this.server = express();
        this.port = 7010;
    }

    start() {
        this.server.listen(this.port);

    }
}

module.exports = options => new HttpServer(options);
