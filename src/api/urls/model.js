const BaseModel = require('../base.model');
const { generateKey } = require('../../lib/url');

const TABLE_NAME = 'urls';

class Url extends BaseModel {
  static get tableName() {
    return TABLE_NAME;
  }

  static async createShortUrl({ url }) {
    let exists = true;
    let key;
    while (exists) {
      key = await generateKey();
      exists = await this.query().findOne({
        key,
      });
    }

    return this.query().insertAndFetch({
      key,
      url,
    });
  }
}

module.exports = Url;
