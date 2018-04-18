const request = require('request');
const githubConfig = require('../config').github;
const Exception = require('../Shared/Exception');
const commonService = require('./CommonService');

module.exports = {
  publishIssueFromPhabricatorTask(taskData) {
    return request.postAsync(`${githubConfig.endpoint}/repos/${githubConfig.user}/${githubConfig.repo}/issues`, {
      auth: {
        user: githubConfig.user,
        password: githubConfig.apiToken,
      },
      headers: {
        'User-Agent': githubConfig.user,
      },
      json: commonService.parseTaskToIssue(taskData),
    }).then((response) => {
      if (response.statusCode !== 201) {
        throw new Exception({
          message: 'Could not publish to GitHub.',
          details: response.body,
        });
      }

      return true;
    });
  },
};
