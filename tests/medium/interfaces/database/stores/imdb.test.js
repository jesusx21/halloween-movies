const uuid = require('uuid');
const { expect } = require('chai');

const fixtures = require('./fixtures');
const { buildIMDB: buildIMDBEntity } = require(`${ROOT_PATH}/domain/entities`);
const testUtils = require(`${ROOT_PATH}/tests/utils`);

const IMDB_ID = 'bf32afc2-f9e2-4f08-8812-feccb615f254';

async function createIMDBData(data, database) {
  const movieEntity = await buildIMDBEntity(data);
  const imdb = await database.imdb.create(movieEntity);

  return imdb.toJSON();
}

async function updateIMDBData(data, database) {
  const imdbEntity = await buildIMDBEntity(data);
  const imdb = await database.imdb.update(imdbEntity);

  return imdb.toJSON();
}

describe.skip('Interfaces - Database', () => {
  describe('Stores', () => {
    describe('IMDB Store', () => {
      let database;

      beforeEach(async () => {
        database = testUtils.getDatabase();

        await testUtils.resetDatabase();
        await testUtils.loadFixtures(fixtures);
      });

      describe('Create', () => {
        it('should return the imdb added', async () => {
          const data = {
            platformId: 'tt5481024',
            title: 'Mon frère bien-aimé',
            plot: 'Look, just because I don\'t be givin\' no man a foot massage don\'t make it right',
            year: 1994
          };

          const imdb = await createIMDBData(data, database);

          expect(imdb.id).to.exist;
          expect(imdb.imdbId).to.be.equal(data.imdbId);
          expect(imdb.title).to.be.equal(data.title);
          expect(imdb.plot).to.be.equal(data.plot);
          expect(imdb.year).to.be.equal(data.year);
          expect(imdb.createdAt).to.be.equalDate(new Date());
          expect(imdb.updatedAt).to.be.equalDate(new Date());
        });

        it('should return error on invalid data', () => {
          const data = {
            imdbId: 'tt5481024',
            title: 'Mon frère bien-aimé',
            plot: 'Look, just because I don\'t be givin\' no man a foot massage don\'t make it right',
            year: 194.58
          };

          return createIMDBData(data, database)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => expect(error.name).to.be.equal('ENTITY_DATA_INVALID'));
        });

        it('should return error when data sent is not an entity', () => {
          const data = {
            platformId: 'tt5481024',
            title: 'Mon frère bien-aimé',
            plot: 'Look, just because I don\'t be givin\' no man a foot massage don\'t make it right',
            year: 1994
          };

          return database.imdb.create(data)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => expect(error.name).to.be.equal('INPUT_IS_NOT_AN_ENTITY'));
        });
      });

      describe('Find By Id', () => {
        it('should return imdb data by its id', async () => {
          const imdb = await database.imdb.findById(IMDB_ID);
          const imdbData = imdb.toJSON();

          expect(imdbData.id).to.be.equal(IMDB_ID);
          expect(imdbData.platformId).to.be.equal('tt1396484');
        });

        it('should return error when imdb data was not found', () => {
          const unexistentMovieId = uuid.v4();

          return database.imdb.findById(unexistentMovieId)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('ENTITY_NOT_FOUND');
              expect(error.message).to.be.equal(
                `IMDB with query "{"id":"${unexistentMovieId}"}" was not found`
              );
            });
        });

        it('should return error when id is invalid', () => {
          const invalidId = 'invalid-id';

          return database.imdb.findById(invalidId)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('INVALID_ID');
              expect(error.message).to.be.equal(`Id "${invalidId}" is not a uuid`);
            });
        })
      });

      describe('Update', () => {
        it('should return not imeplemented error when tried to use update function', () => {
          return database.imdb.update({})
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('STORE_FUNCTION_NOT_IMPLEMENTED');
              expect(error.message).to.be.equal(
                'The function "update" called has not been implemented on IMDBStore'
              );
            });
        });
      });
    });
  });
});
