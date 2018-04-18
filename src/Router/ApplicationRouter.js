const express = require('express');
const phabricatorService = require('../Service/PhabricatorService');
const githubService = require('../Service/GitHubService');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());

router.post('/issues', (req, res) => phabricatorService.validateTaskEvent(req.body, req.headers['x-phabricator-webhook-signature'])
  .then((validatedTaskData) => {
    const taskId = validatedTaskData.phid;

    return phabricatorService.getTaskDetails(taskId);
  })
  .then(result => githubService.publishIssueFromPhabricatorTask(result))
  .then(() => res.send({
    message: 'Task successfully published to GitHub.',
  }))
  .catch(exception => res.status(400).send(exception)));

module.exports = router;
