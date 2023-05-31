import Router from 'express-promise-router';

import Controller from './controller';

const router = Router();

router.get('/ping', Controller.ping);
router.get('/serverinfo', Controller.serverInfo);

export default router;
