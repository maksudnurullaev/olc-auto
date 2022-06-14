const knex = require('../knex')
const { Model } = require('objection')
Model.knex(knex)

class InOutInfo extends Model {
  static get tableName() {
    return 'in_out_infos'
  }

  static get relationMappings() {
    const Photos = require('./Photo')
    const Car = require('./Car')
    
    return {
      photos: {
        relation: Model.HasManyRelation,
        modelClass: Photos,
        join: {
          from: 'in_out_infos.id',
          to: 'photos.in_out_infos_id'
        }
      },
      car: {
        relation: Model.BelongsToOneRelation,
        modelClass: Car,
        join: {
          from: 'in_out_infos.car_number',
          to: 'car.number'
        }
      }
    }
  }
}

module.exports = InOutInfo
