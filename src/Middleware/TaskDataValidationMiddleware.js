const crypto = require('crypto');
const _ = require('lodash');
const config = require('../config');

const phabricatorConfig = config.phabricator;
const environmentConfig = config.environment;

module.exports = (req, res, next) => {
  const eventData = req.body;
  const requestSignature = req.headers['x-phabricator-webhook-signature'];

  if (!_.isObject(eventData) || !eventData.object || eventData.object.type !== 'TASK') {
    return res.status(400).send({
      message: 'Phabricator data not valid.',
    });
  }

  // Check if it's a test action and test mode is enabled
  if (eventData.action && eventData.action.test && !environmentConfig.testMode) {
    return res.status(400).send({
      message: 'Test mode is not enabled.',
    });
  }

  const encodedExpectedSignature = crypto.createHmac('sha256', phabricatorConfig.hmacKey).update(req.rawBody).digest();
  const expectedSignature = Buffer.from(encodedExpectedSignature).toString('hex');

  if (requestSignature !== expectedSignature) {
    return res.status(400).send({
      message: 'Phabricator event source not valid.',
    });
  }

  res.locals.taskId = eventData.object.phid;

  return next();
};
