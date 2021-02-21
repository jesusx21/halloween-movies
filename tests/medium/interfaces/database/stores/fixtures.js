const testUtils = require(`${ROOT_PATH}/tests/utils`);

const IMDB_RECIPE = [{
  id: 'bf32afc2-f9e2-4f08-8812-feccb615f254',
  platformId: 'tt1396484'
}, {
  id: 'fc150ea3-6cf6-4650-9068-53dc8d154f75',
  platformId: 'tt5735280'
}];

const MOVIE_RECIPE = [{
  id: '3f54d840-6e65-4b9d-b98f-cd57bc7a524f',
  name: 'Just a movie',
  plot: 'This is a funny movie',
  watchOn: 'netflix'
}, {
  id: 'f9467cd6-9a1c-4ad2-923b-41905fd2a779',
  name: 'Just another movie',
  plot: 'This is a scary movie',
  watchOn: 'prime'
}];

module.exports = {
  imdb: testUtils.generateFixtures('imdb', IMDB_RECIPE),
  movies: testUtils.generateFixtures('movie', MOVIE_RECIPE)
};
