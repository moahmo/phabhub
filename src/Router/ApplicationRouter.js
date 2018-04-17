const express = require('express');

const router = express.Router();

router.post('/issues', (req, res) => {
    ticketController.createTicket(req, res);
});

module.exports = router;
