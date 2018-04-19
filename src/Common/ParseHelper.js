const queryString = require('query-string');
const githubConfig = require('../config').github;
const phabricatorConfig = require('../config').phabricator;

module.exports = {
  parseTaskToIssue(taskData) {
    const issueTitle = taskData.fields.name;
    const issueDescription = taskData.fields.description.raw;
    const issueLabels = [];

    if (issueTitle.includes('[BUG]')) {
      issueLabels.push('bug');
    } else if (issueTitle.includes('[FEATURE]')) {
      issueLabels.push('enhancement');
    }

    return {
      title: issueTitle,
      body: `${issueDescription}
             \n-----------
             \n<i>Automatically created from ${phabricatorConfig.endpoint}/T${taskData.id}</i>`,
      assignee: githubConfig.user,
      labels: issueLabels,
    };
  },

  stringifyQueryParams(params) {
    return queryString.stringify(params);
  },
};
