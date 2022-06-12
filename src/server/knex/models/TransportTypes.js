const knex = require('../knex')
const { Model } = require('objection')
Model.knex(knex)

class TranportTypes extends Model {
  static get tableName () {
    return 'transports_types'
  }
}

module.exports = TranportTypes
