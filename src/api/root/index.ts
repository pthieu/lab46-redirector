import Router from 'express-promise-router';

import Controller from './controller';

const router = Router();

router.get('/ping', Controller.ping);
router.get('/serverinfo', Controller.getServerInfo);

export default router;
