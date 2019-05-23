exports.up = (knex) => {
  return knex.schema.createTable('urls', (table) => {
    table.increments('id').primary();
    table.string('key').index();
    table.text('url').notNullable();
    table.timestamps(null, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('urls');
};
