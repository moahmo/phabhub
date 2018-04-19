const crypto = require('crypto');
const _ = require('lodash');
const phabricatorConfig = require('../config').phabricator;

module.exports = (req, res, next) => {
  const eventData = req.body;
  const requestSignature = req.headers['x-phabricator-webhook-signature'];

  if (!_.isObject(eventData) || !eventData.object || eventData.object.type !== 'TASK') {
    return res.status(400).send({
      message: 'Phabricator data not valid.',
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
