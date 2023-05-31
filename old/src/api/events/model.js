const { inspect } = require('util');

const BaseModel = require('../base.model');
const logger = require('../../lib/logger');

class Event extends BaseModel {
  static get tableName() {
    return 'events';
  }
  static async track(event = {}) {
    try {
      const { key, data } = event;
      if (!key) {
        throw new Error('`key` not specified');
      }

      return await this.query().insert({
        key,
        data,
      });
    } catch (e) {
      return logger.error(`Could not track event: ${inspect(e)}`);
    }
  }
}

module.exports = Event;
