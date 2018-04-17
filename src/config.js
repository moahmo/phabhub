const _ = require('lodash');
const configStore = require('../config.json');

const defaultConfig = {};

const config = _.merge(defaultConfig, configStore.settings);

module.exports = config;
