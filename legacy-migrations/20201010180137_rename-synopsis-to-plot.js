exports.up = function (knex) {
  return knex.schema
    .alterTable('sagas', (table) => {
      table.renameColumn('synopsis', 'plot');
    })
    .alterTable('movies', (table) => {
      table.renameColumn('synopsis', 'plot');
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('sagas', (table) => {
      table.renameColumn('plot', 'synopsis');
    })
    .alterTable('movies', (table) => {
      table.renameColumn('plot', 'synopsis');
    });
};
