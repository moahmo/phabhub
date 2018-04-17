const _ = require('lodash');
const configStore = require('../config.json');

const defaultConfig = {
  server: {
    port: 7070,
  },
};

const config = _.merge(defaultConfig, configStore.settings);

module.exports = config;
