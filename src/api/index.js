const express = require('express');

const Controller = require('./controller');
const UrlsRoute = require('./urls');

const router = express.Router();

router.get('/ping', Controller.ping);

router.use('/', UrlsRoute);

module.exports = router;
