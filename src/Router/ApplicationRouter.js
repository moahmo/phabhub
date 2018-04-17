const express = require('express');
const phabricatorService = require('../Service/PhabricatorService');
const githubService = require('../Service/GitHubService');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());

router.post('/issues', (req, res) => {
    const validatedTaskData = phabricatorService.validateTaskEvent(req.body);
    const taskId = validatedTaskData.phid;

    return phabricatorService.getTaskDetails(taskId).then((result) => {
        return githubService.publishIssueFromPhabricatorTask(result).then(() => {
            return res.send(result);
        });
    })
});

module.exports = router;
