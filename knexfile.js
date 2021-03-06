// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const path = require('path')

module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'dist', 'db', 'dev.sqlite3')
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'server', 'knex', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'server', 'knex', 'seeds', 'prod')
    },
    useNullAsDefault: true
  },
  test: {
    client: 'better-sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'dist', 'db', 'test.sqlite3')
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'server', 'knex', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'server', 'knex', 'seeds')
    },
    pool: {
      min: 2,
      max: 10
    },
    useNullAsDefault: true
  },
  production: {
    client: 'better-sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'dist', 'db', 'prod.sqlite3')
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'server', 'knex', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'server', 'knex', 'seeds', 'prod')
    },
    pool: {
      min: 2,
      max: 10
    },
    useNullAsDefault: true
  }
}
