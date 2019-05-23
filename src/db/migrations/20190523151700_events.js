exports.up = (knex) => {
  return knex.schema.createTable('events', (table) => {
    table.increments('id').primary();
    table.string('key').notNullable();
    table.jsonb('data');
    table.timestamps(null, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('events');
};
