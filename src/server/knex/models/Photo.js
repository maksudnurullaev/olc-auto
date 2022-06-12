const knex = require('../knex')
const { Model } = require('objection')
Model.knex(knex)

class Photo extends Model {
  static get tableName () {
    return 'photos'
  }

  static get relationMappings () {
    const IoInfo = require('./InOutInfo')

    return {
      info: {
        relation: Model.BelongsToOneRelation,
        modelClass: IoInfo,
        join: {
          to: 'in_out_infos.id',
          from: 'photos.in_out_infos_id'
        }
      }
    }
  }
}

module.exports = Photo
