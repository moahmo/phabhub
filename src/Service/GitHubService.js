const _ = require('lodash');
const request = require('request');
const githubConfig = require('../config').github;

function parseTaskToIssue(taskData) {
    return {
        title: taskData.fields.name,
        body: taskData.fields.description.raw,
        assignee: 'moahmo',
        labels: [
            'bug'
        ]
    }
}

module.exports = {
    publishIssueFromPhabricatorTask(taskData) {
        return request.postAsync(`${githubConfig.endpoint}/repos/${githubConfig.user}/${githubConfig.repo}/issues`, {
            auth: {
                user: githubConfig.user,
                password: githubConfig.apiToken
            },
            headers: {
                'User-Agent': 'moahmo'
            },
            json: parseTaskToIssue(taskData)
        }).then((response) => {
            if (response.statusCode === 201) {
                const responseBody = JSON.parse(response.body);

                return responseBody.result.data[0];
            }

            throw new Error({
                message: 'Something went wrong.'
            });
        });
    }
};
