const RootPath = require('app-root-path');
const ROOT_PATH = require('app-root-path');
const dotenv = require('dotenv');

const knexfile = require(`${RootPath}/knexfile`);

function buildConfig() {
  const env = process.env.NODE_ENV;
  const path = `${ROOT_PATH}/infrastructure/.env/${env}.env`
  const { parsed: envObject = {} } =  dotenv.config({ path });

  const databaseData = knexfile[env];

  return {
    database: {
      driver: databaseData.client,
      name: databaseData.connection.database
    },
    imdb: {
      host: envObject.IMDB_HOST,
      apiKey: envObject.IMDB_API_KEY
    },
    server: {
      host: envObject.SERVER_HOST,
      port: Number(envObject.SERVER_PORT)
    }
  };
}

module.exports = buildConfig();
