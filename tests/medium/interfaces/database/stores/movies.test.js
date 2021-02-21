const uuid = require('uuid');
const { expect } = require('chai');

const { movies } = require('./fixtures');
const { buildMovie: buildMovieEntity } = require(`${ROOT_PATH}/domain/entities`);
const testUtils = require(`${ROOT_PATH}/tests/utils`);

const SAGA_ID = '6b699ba0-310a-480a-bf8a-80405cd501eb';
const MOVIE_ID = '3f54d840-6e65-4b9d-b98f-cd57bc7a524f';

async function createMovie(data, database) {
  const movieEntity = await buildMovieEntity(data);
  const movie = await database.movies.create(movieEntity);

  return movie.toJSON();
}

async function updateMovie(data, database) {
  const movieEntity = await buildMovieEntity(data);
  const movie = await database.movies.update(movieEntity);

  return movie.toJSON();
}

describe('Interfaces - Database', () => {
  describe('Stores', () => {
    describe('Movies Store', () => {
      let database;

      beforeEach(async () => {
        database = testUtils.getDatabase();

        await testUtils.resetDatabase();
        await testUtils.loadFixtures({ movies });
      });

      describe('Create', () => {
        it('should return the movie created', async () => {
          const data = {
            name: 'Just a holliwood movie',
            plot: 'This is a average movie',
            watchOn: 'netflix'
          };

          const movie = await createMovie(data, database);

          expect(movie.id).to.exist;
          expect(movie.name).to.be.equal(data.name);
          expect(movie.plot).to.be.equal(data.plot);
          expect(movie.watchOn).to.be.equal(data.watchOn);
          expect(movie.createdAt).to.be.equalDate(new Date());
          expect(movie.updatedAt).to.be.equalDate(new Date());
        });

        it('should return error on invalid data', () => {
          const data = {
            name: 'Just a holliwood movie',
            plot: 'This is a average movie',
            watchOn: 'netflix',
            releasedAt: 'Many years ago'
          };

          return createMovie(data, database)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => expect(error.name).to.be.equal('ENTITY_DATA_INVALID'));
        });

        it('should return error when data sent is not an entity', () => {
          const data = {
            name: 'Just a holliwood movie',
            plot: 'This is a average movie',
            watchOn: 'netflix'
          };

          return database.movies.create(data)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => expect(error.name).to.be.equal('INPUT_IS_NOT_AN_ENTITY'));
        });
      });

      describe.skip('Find By Id', () => {
        it('should return movie by its id', async () => {
          const movie = await database.movies.findById(MOVIE_ID);
          const movieData = movie.toJSON();

          expect(movieData.id).to.be.equal(MOVIE_ID);
          expect(movieData.name).to.be.equal('Just a movie');
          expect(movieData.sagaId).to.be.equal(SAGA_ID);
          expect(movieData.watched).to.be.true;
          expect(movieData.numberOnSaga).to.be.equal(1);
        });

        it('should return error when movie was not found', () => {
          const unexistentMovieId = uuid.v4();

          return database.movies.findById(unexistentMovieId)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('ENTITY_NOT_FOUND');
              expect(error.message).to.be.equal(
                `Movie with query "{"id":"${unexistentMovieId}"}" was not found`
              );
            });
        });

        it('should return error when id is invalid', () => {
          const invalidId = 'invalid-id';

          return database.movies.findById(invalidId)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('INVALID_ID');
              expect(error.message).to.be.equal(`Id "${invalidId}" is not a uuid`);
            });
        })
      });

      describe.skip('Update', () => {
        it('should update the movie', async () => {
          const data = {
            id: MOVIE_ID,
            name: 'Movie',
            plot: 'This is a movie plot',
            sagaId: SAGA_ID,
            watched: false,
            numberOnSaga: 1
          };

          const movie = await updateMovie(data, database);

          expect(movie.id).to.exist;
          expect(movie.name).to.be.equal(data.name);
          expect(movie.plot).to.be.equal(data.plot);
          expect(movie.sagaId).to.be.equal(SAGA_ID);
          expect(movie.watched).to.be.false;
          expect(movie.numberOnSaga).to.be.equal(data.numberOnSaga);
          expect(movie.updatedAt).to.be.equalDate(new Date());
        });

        it('should return error when input data is not an entity', async () => {
          const data = {
            id: MOVIE_ID,
            name: 'Movie',
            plot: 'This is a movie plot',
            sagaId: SAGA_ID,
            watched: false,
            numberOnSaga: 3
          };

          return database.movies.update(data, database)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => expect(error.name).to.be.equal('INPUT_IS_NOT_AN_ENTITY'));
        });

        it('should return error when movie does not exist', async () => {
          const data = {
            id: uuid.v4(),
            name: 'Movie',
            plot: 'This is a movie plot',
            sagaId: SAGA_ID,
            watched: false,
            numberOnSaga: 1
          };

          return updateMovie(data, database)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('ENTITY_NOT_FOUND');
              expect(error.message).to.be.equal(
                `Movie with query "{"id":"${data.id}"}" was not found`
              );
            });
        });

        it('should return error on invalid data', async () => {
          const data = {
            id: MOVIE_ID,
            name: 'Movie',
            plot: 'This is a movie plot',
            sagaId: SAGA_ID,
            watched: false,
            numberOnSaga: 'invalid-integer'
          };

          return updateMovie(data, database)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => expect(error.name).to.be.equal('ENTITY_DATA_INVALID'));
        });
      });
    });
  });
});
