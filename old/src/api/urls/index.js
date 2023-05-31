const Router = require('express-promise-router');

const Controller = require('./controller');

const router = Router();

router
  .get('/', Controller.redirectLanding)
  .get('/:key', Controller.redirect)
  .post('/', Controller.create);
// .get('/', Controller.index)
// .put('/:id', Controller.update)
// .delete('/:id', Controller.destroy);

module.exports = router;
