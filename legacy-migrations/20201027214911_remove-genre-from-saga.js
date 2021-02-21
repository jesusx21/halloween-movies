exports.up = function (knex) {
  return knex.schema.alterTable('sagas', (table) => {
    table.dropColumn('genre');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('sagas', (table) => {
    table.text('genre');
  });
};
