const crypto = require('crypto');
const _ = require('lodash');
const request = require('request');
const queryString = require('query-string');
const phabricatorConfig = require('../config').phabricator;
const Exception = require('../Shared/Exception');

function stringifyParams(params) {
  return queryString.stringify(params);
}

module.exports = {
  validateTaskEvent(eventData, receivedSignature) {
    if (!_.isObject(eventData) || !eventData.object || eventData.object.type !== 'TASK') {
      throw new Exception({
        message: 'Phabricator data not valid.',
      });
    }

    const expectedSignature = crypto.createHmac('sha256', phabricatorConfig.hmacKey).update(stringifyParams(eventData)).digest();
    const encodedExpectedSignature = Buffer.from(expectedSignature).toString('hex');

    if (encodedExpectedSignature !== receivedSignature) {
      throw new Exception({
        message: 'Phabricator event source not valid.',
      });
    }

    return new Promise(resolve => resolve({
      phid: eventData.object.phid,
    }));
  },

  getTaskDetails(taskPhid) {
    return request.postAsync(`${phabricatorConfig.endpoint}/api/maniphest.search`, {
      form: stringifyParams({
        'api.token': phabricatorConfig.apiToken,
        'constraints[phids][]': [taskPhid],
      }),
    }).then((response) => {
      if (response.statusCode === 200) {
        const responseBody = JSON.parse(response.body);

        return responseBody.result.data[0];
      }

      throw new Exception({
        message: 'Could not get task details from Phabricator.',
        details: response.body,
      });
    });
  },
};
