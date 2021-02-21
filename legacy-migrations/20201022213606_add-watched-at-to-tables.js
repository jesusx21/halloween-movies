exports.up = function (knex) {
  return knex.schema
    .alterTable('movies', (table) => {
      table.timestamp('watched_at');
    })
    .alterTable('sagas', (table) => {
      table.timestamp('watched_at');
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('movies', (table) => {
      table.dropColumn('watched_at');
    })
    .alterTable('sagas', (table) => {
      table.dropColumn('watched_at');
    });
};
