exports.up = function (knex) {
  return knex.schema.createTable('imdb_data', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title')
    table.integer('year');
    table.string('rated');
    table.date('released_at');
    table.integer('runtime');
    table.string('genre');
    table.string('director');
    table.string('actors');
    table.string('plot');
    table.string('country');
    table.string('awards');
    table.string('poster')
    table.float('imdb_rating');
    table.string('rotten_tomatoes_rating');
    table.bigInteger('imdb_votes');
    table.string('platform_id').unique();
    table.string('production');
    table.string('website');

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('imdb_data');
};
