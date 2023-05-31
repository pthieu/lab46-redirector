import Router from 'express-promise-router';

import Controller from './controller';

const router = Router();

router.get('/', Controller.redirectLanding);
router.get('/:key', Controller.redirect);
router.post('/', Controller.create);

export default router;
