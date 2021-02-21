exports.up = function (knex) {
  return knex.schema
    .alterTable('movies', (table) => {
      table.dropForeign('saga_id');
    })
    .alterTable('movies', (table) => {
      table.uuid('saga_id')
        .references('sagas.id')
        .notNull()
        .onDelete('CASCADE')
        .alter();
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('movies', (table) => {
      table.dropForeign('saga_id');
    })
    .alterTable('movies', (table) => {
      table.uuid('saga_id')
        .references('sagas.id')
        .notNull()
        .alter();
    });
};
