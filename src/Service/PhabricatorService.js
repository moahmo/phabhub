const _ = require('lodash');
const request = require('request');
const queryString = require('query-string');
const phabricatorConfig = require('../config').phabricator;

function stringifyParams(params) {
    return queryString.stringify(params)
}

module.exports = {
    validateTaskEvent(eventData) {
        if (_.isObject(eventData) && eventData.object && eventData.object.type === 'TASK') {
            return {
                phid: eventData.object.phid
            };
        }
    },

    getTaskDetails(taskPhid) {
        return request.postAsync(`${phabricatorConfig.endpoint}/maniphest.search`, {
            form: stringifyParams({
                'api.token': phabricatorConfig.apiToken,
                'constraints[phids][]': [taskPhid]
            })
        }).then((response) => {
            if (response.statusCode === 200) {
                const responseBody = JSON.parse(response.body);

                return responseBody.result.data[0];
            }

            throw new Error({
                message: 'Something went wrong.'
            });
        });
    }
};
