const express = require('express');
const phabricatorService = require('../Service/PhabricatorService');
const githubService = require('../Service/GitHubService');
const TaskDataValidationMiddleware = require('../Middleware/TaskDataValidationMiddleWare');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json({
  verify(req, res, buf) {
    req.rawBody = buf.toString();
  },
}));

router.use(TaskDataValidationMiddleware);

router.post('/issues', (req, res) => phabricatorService.getTaskDetails(res.locals.taskId)
  .then(result => githubService.publishIssueFromPhabricatorTask(result))
  .then(() => res.send({
    message: 'Task successfully published to GitHub.',
  }))
  .catch(exception => res.status(400).send(exception)));

module.exports = router;
