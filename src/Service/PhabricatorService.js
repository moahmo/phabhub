const request = require('request');
const phabricatorConfig = require('../config').phabricator;
const Exception = require('../Common/Exception');
const parseHelper = require('../Common/ParseHelper');

module.exports = {
  getTaskDetails(taskPhid) {
    return request.postAsync(`${phabricatorConfig.endpoint}/api/maniphest.search`, {
      form: parseHelper.stringifyQueryParams(({
        'api.token': phabricatorConfig.apiToken,
        'constraints[phids][]': [taskPhid],
      })),
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
