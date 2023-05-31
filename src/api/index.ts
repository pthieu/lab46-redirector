import express from 'express';

import RootController from '~/api/root/controller';
import UrlsRoute from '~/api/urls';

const router = express.Router();

router.get('/ping', RootController.ping);
router.get('/serverinfo', RootController.serverInfo);
router.use('/', UrlsRoute);

export default router;
