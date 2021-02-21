const uuid = require('uuid');
const { expect } = require('chai');

const fixtures = require('./fixtures');
const testUtils = require(`${ROOT_PATH}/tests/utils`);
const { buildSaga: buildSagaEntity } = require(`${ROOT_PATH}/domain/entities`);

const SAGA_ID = '6b699ba0-310a-480a-bf8a-80405cd501eb';
const MOVIE_ID = '3f54d840-6e65-4b9d-b98f-cd57bc7a524f';

async function createSaga(data, database) {
  const sagaEntity = await buildSagaEntity(data);
  const saga = await database.sagas.create(sagaEntity);

  return saga.toJSON();
}

async function updateSaga(data, database) {
  const sagaEntity = await buildSagaEntity(data);
  const saga = await database.sagas.update(sagaEntity);

  return saga.toJSON();
}

describe.skip('Interfaces - Database', () => {
  describe('Stores', () => {
    describe('Sagas Store', () => {
      let database;

      beforeEach(async () => {
        database = testUtils.getDatabase();

        await testUtils.resetDatabase();
        await testUtils.loadFixtures(fixtures);
      });

      describe('Create', () => {
        it('should return the saga created', async () => {
          const data = {
            name: 'Harry Potter',
            plot: 'This is a movie plot',
            watched: false,
            numberOfMovies: 8
          };

          const saga = await createSaga(data, database);

          expect(saga.id).to.exist;
          expect(saga.name).to.be.equal(data.name);
          expect(saga.plot).to.be.equal(data.plot);
          expect(saga.watched).to.be.false;
          expect(saga.numberOnSaga).to.be.equal(data.numberOnSaga);
          expect(saga.createdAt).to.be.equalDate(new Date());
          expect(saga.updatedAt).to.be.equalDate(new Date());
        });

        it('should return error on invalid data', () => {
          const data = {
            name: 'Harry Potter',
            plot: 'This is a movie plot',
            watched: 'invalid'
          };

          return createSaga(data, database)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => expect(error.name).to.be.equal('ENTITY_DATA_INVALID'));
        });
      });

      describe('Find By Id', () => {
        it('should return saga by its id', async () => {
          const saga = await database.sagas.findById(SAGA_ID);
          const sagaData = saga.toJSON();

          expect(sagaData.id).to.be.equal(SAGA_ID);
          expect(sagaData.numberOfMovies).to.be.equal(2);
          expect(sagaData.watched).to.be.false;
        });

        it('should return error when movie was not found', () => {
          const unexistentMovieId = uuid.v4();

          return database.sagas.findById(unexistentMovieId)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('ENTITY_NOT_FOUND');
              expect(error.message).to.be.equal(
                `Saga with query "{"id":"${unexistentMovieId}"}" was not found`
              );
            });
        });

        it('should return error when id is invalid', () => {
          const invalidId = 'invalid-id';

          return database.sagas.findById(invalidId)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('INVALID_ID');
              expect(error.message).to.be.equal(`Id "${invalidId}" is not a uuid`);
            });
        })
      });

      describe('Find Unwatched', () => {
        it('should return sagas not watched', async () => {
          const sagas = await database.sagas.findUnwatched();

          expect(sagas).to.have.lengthOf(2);
          sagas.forEach((saga) => {
            const sagaData = saga.toJSON();
            expect(sagaData.watched).to.be.false;
          });
        });
      });

      describe('Update', () => {
        it('should update the saga', async () => {
          const data = {
            id: SAGA_ID,
            name: 'Movie',
            watched: true,
            numberOfMovies: 8
          };

          const saga = await updateSaga(data, database);

          expect(saga.id).to.be.equal(SAGA_ID);
          expect(saga.name).to.be.equal(data.name);
          expect(saga.watched).to.be.true;
          expect(saga.numberOnSaga).to.be.equal(data.numberOnSaga);
          expect(saga.updatedAt).to.be.equalDate(new Date());
        });

        it('should return error when saga does not exist', async () => {
          const data = {
            id: uuid.v4(),
            name: 'Movie',
            plot: 'This is a saga plot',
            watched: false,
            numberOfMovies: 1
          };

          return updateSaga(data, database)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('ENTITY_NOT_FOUND');
              expect(error.message).to.be.equal(
                `Saga with query "{"id":"${data.id}"}" was not found`
              );
            });
        });

        it('should return error when data sent is not an entity', async () => {
          const data = {
            id: MOVIE_ID,
            name: 'Movie',
            plot: 'This is a movie plot',
            sagaId: SAGA_ID,
            watched: false,
            numberOnSaga: 'invalid-integer'
          };

          return database.sagas.update(data)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => expect(error.name).to.be.equal('INPUT_IS_NOT_AN_ENTITY'));
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

          return updateSaga(data, database)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => expect(error.name).to.be.equal('ENTITY_DATA_INVALID'));
        });
      });
    });
  });
});
