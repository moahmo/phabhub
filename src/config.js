const _ = require('lodash');
const configStore = require('../config.json');

const defaultConfig = {
  environment: {
    testMode: false,
  },
  server: {
    port: 7070,
  },
};

const config = _.merge(defaultConfig, configStore.settings);

module.exports = config;
