import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import isUrl from 'is-url';

// import { Url } from '~/db/schema/schema';
import { createDb } from '~/db';
import { UrlTable } from '~/db/schema/schema';
import { track } from '~/lib/event';
import { createShortUrl } from '~/lib/url';
import { EventKey } from '~/types';

// const Url = require('./model');
// const { EVENT_KEYS } = require('../../constants');
// const Event = require('../events/model');
// const { error, redirect: redirectRes, success } = require('../responses');

const db = await createDb();

const redirectLanding = async (req: Request, res: Response) => {
  const { headers } = req;
  track({
    key: EventKey.REDIRECT_HOME,
    data: {
      headers,
    },
  });
  return res.redirect('https://www.labfortysix.com');
};

const redirect = async (req: Request, res: Response) => {
  const { headers } = req;
  const { key } = req.params;
  const rows = await db
    .select()
    .from(UrlTable)
    .where(eq(UrlTable.key, key))
    .limit(1);
  const row = rows[0];

  if (!row) {
    return res
      .status(404)
      .json({ success: false, message: 'Url does not exist' });
  }

  const { url } = row;
  track({
    key: EventKey.REDIRECT,
    data: {
      key,
      url,
      headers,
    },
  });

  return res.redirect(url);
};

interface IUrlCreateBody {
  url?: string;
}
const create = async (req: Request<IUrlCreateBody>, res: Response) => {
  const { url } = req.body satisfies IUrlCreateBody as IUrlCreateBody;
  if (!url) {
    return res
      .status(500)
      .json({ success: false, message: 'Missing `url` field' });
  }

  if (!isUrl(url)) {
    return res
      .status(500)
      .json({ success: false, message: '`url` needs to be a valid url' });
  }

  const data = await createShortUrl(url);

  // XXX(Phong): strip out id so people can't infer our schema or what tech
  // we're using
  const { key, url: newUrl } = data; // eslint-disable-line

  return res.status(200).json({ success: true, data: { key, url: newUrl } });
};

export default {
  create,
  redirect,
  redirectLanding,
};
