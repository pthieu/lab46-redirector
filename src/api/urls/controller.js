const isUrl = require('is-url');

const Url = require('./model');
const { error, redirect: redirectRes, success } = require('../responses');

const redirectLanding = async (req, res) => {
  return redirectRes(res, 'https://www.labfortysix.com');
};

const redirect = async (req, res) => {
  const { key } = req.params;
  const data = await Url.query().findOne({ key });
  if (!data) {
    return error(res, 'Url does not exist', 404);
  }

  const { url } = data;
  return redirectRes(res, url);
};

const create = async (req, res) => {
  const { url } = req.body || {};
  if (!url) {
    return error(res, 'Missing `url` field');
  }

  if (!isUrl(url)) {
    return error(res, '`url` needs to be a valid url');
  }

  const data = await Url.createShortUrl({ url });

  // XXX(Phong): strip out id so people can't infer our schema or what tech
  // we're using
  const { id, ...payload } = data; // eslint-disable-line

  success(res, payload);
};

// XXX(Phong): commented out because we don't need these for the time being
// const list = async (req, res) => {
//   const data = await Url.query();
//   success(res, data);
// };

// const update = async (req, res) => {
//   const data = await Url.query().updateAndFetchById(req.params.id, req.body);
//   success(res, data);
// };

// const destroy = async (req, res) => {
//   const data = await Url.query().findById(req.params.id);
//   await Url.query().deleteById(req.params.id);
//   success(res, data);
// };

module.exports = {
  create,
  redirect,
  redirectLanding,
};
