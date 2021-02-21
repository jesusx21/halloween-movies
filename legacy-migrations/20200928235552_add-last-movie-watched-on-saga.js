exports.up = function (knex) {
  return knex.schema.alterTable('sagas', (table) => {
    table.uuid('last_movie_watched_id').references('movies.id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('sagas', (table) => {
    table.dropColumn('last_movie_watched_id');
  });
};
