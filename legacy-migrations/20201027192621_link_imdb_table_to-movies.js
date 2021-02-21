exports.up = function (knex) {
  return knex.schema.alterTable('movies', (table) => {
    table.uuid('imdb_id').references('imdb_data.id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('movies', (table) => {
    table.dropColumn('imdb_id');
  });
};
