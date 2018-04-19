const querystring = require('querystring');
const request = require('request');
const phabricatorConfig = require('../config').phabricator;
const Exception = require('../Common/Exception');

function stringifyQueryParams(params) {
  return querystring.stringify(params);
}

module.exports = {
  getTaskDetails(taskPhid) {
    return request.postAsync(`${phabricatorConfig.endpoint}/api/maniphest.search`, {
      form: stringifyQueryParams(({
        'api.token': phabricatorConfig.apiToken,
        'constraints[phids][]': [taskPhid],
      })),
    }).then((response) => {
      if (response.statusCode === 200) {
        const responseBody = JSON.parse(response.body);
        const resultData = responseBody.result.data[0];

        return {
          id: resultData.id,
          fields: resultData.fields,
          phabInstance: phabricatorConfig.endpoint,
        };
      }

      throw new Exception({
        message: 'Could not get task details from Phabricator.',
        details: response.body,
      });
    });
  },
};
