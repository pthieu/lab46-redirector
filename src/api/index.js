const express = require('express');

const Controller = require('./controller');

const router = express.Router();

router.get('/ping', Controller.ping);

module.exports = router;
