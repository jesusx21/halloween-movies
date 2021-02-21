const { OBJECT, UUID, STRING, BOOLEAN, INTEGER, DATE } = require('../types');

const MOVIE_SCHEMA = OBJECT({
  id: UUID,
  name: STRING({ allowEmpty: false }),
  plot: STRING(),
  watchOn: STRING(),
  releasedAt: DATE,
  createdAt: DATE,
  updatedAt: DATE
}, [
  'id', 'name', 'plot', 'watchOn', 'releasedAt', 'createdAt',  'updatedAt'
]);

module.exports = MOVIE_SCHEMA
