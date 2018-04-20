const _ = require('lodash');
const request = require('request');
const githubConfig = require('../config').github;
const Exception = require('../Common/Exception');

function startsWithRuleIsMatched(stringToMatch, possibleMatches) {
  const string = _.lowerCase(stringToMatch);
  const matches = _.filter(possibleMatches, possibleMatch => _.startsWith(string, _.lowerCase(possibleMatch)));

  return !!(matches.length);
}

function parseTaskToIssue({ taskId, taskFields, phabInstance }) {
  const issueTitle = taskFields.name;
  const issueDescription = taskFields.description.raw;
  const { repositoryNameRules, labelNameRules } = githubConfig;

  let repositoryName = null;
  let issueLabels = [];

  // Get repository name based on task title rules
  if (repositoryNameRules && repositoryNameRules.length) {
    [repositoryName] = _.filter(_.map(repositoryNameRules, (rule) => {
      if (rule.type === 'startsWith') {
        if (startsWithRuleIsMatched(issueTitle, rule.match)) {
          return rule.repositoryName;
        }
      }

      return false;
    }));
  }

  // Get label name based on task title rules
  if (labelNameRules && labelNameRules.length) {
    issueLabels = _.filter(_.map(labelNameRules, (rule) => {
      if (rule.type === 'startsWith') {
        if (startsWithRuleIsMatched(issueTitle, rule.match)) {
          return rule.labelName;
        }
      }

      return false;
    }));
  }

  return {
    data: {
      title: issueTitle,
      body: `${issueDescription}
             \n-----------
             \n<i>Automatically created from ${phabInstance}/T${taskId}</i>`,
      assignee: githubConfig.repoUserName,
      labels: issueLabels,
    },
    repository: repositoryName || githubConfig.repositoryName,
  };
}

module.exports = {
  publishIssueFromPhabricatorTask(taskData) {
    const issue = parseTaskToIssue({
      taskId: taskData.id,
      taskFields: taskData.fields,
      phabInstance: taskData.phabInstance,
    });

    const apiUser = githubConfig.apiUserName || githubConfig.repoUserName;

    return request.postAsync(`${githubConfig.endpoint}/repos/${githubConfig.repoUserName}/${issue.repository}/issues`, {
      auth: {
        user: apiUser,
        password: githubConfig.apiToken,
      },
      headers: {
        'User-Agent': apiUser,
      },
      json: issue.data,
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
